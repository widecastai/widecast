# Webhooks

WideCast can POST status updates to a URL of your choice while a job is being processed — so you don't have to poll.

Webhooks fire for the **async** endpoints that accept a `callback_url`: `POST /v1/create_video`, `POST /v1/create_content`, and `POST /v1/enhance_script`. (`/v1/publish` is sync — it returns the upstream `request_id`s immediately, so there's no webhook; poll `GET /v1/status/{request_id}` instead.)

## How it works

When you submit one of those endpoints with a `callback_url` field, WideCast:

1. **Immediately** fires a `video.processing` webhook to that URL (right after the worker is spawned).
2. **Once** the job reaches `completed`, fires a `video.completed` webhook with the `result.review_url`.
3. **Once** the job reaches `failed`, fires a `video.failed` webhook with the `error` object.

Each event delivers a self-contained JSON payload — a snapshot of the same status object you'd get from `GET /v1/status/{id}`, wrapped in an envelope. (The event names stay `video.*` for all job kinds; check `data.type` — `"video"` / `"content"` — to tell them apart. For `create_content`, `data.details.status` carries the writer stage and `completed` only fires when the article is fully written, not after the outline.)

> **v0.1.0 pilot only ships per-request `callback_url`.** Pre-configured webhook endpoints (subscribe-once for all videos) land in Phase 1 with auth.

## Submitting a callback URL

```http
POST /v1/create_video
Content-Type: application/json

{
  "script_text":   "Paste your script here.",
  "callback_url":  "https://my-app.com/widecast-hook"
}
```

The URL must be HTTPS in production. During pilot dev, `http://` is allowed (e.g. an ngrok tunnel or RequestBin URL).

## Event payload

```json
POST https://my-app.com/widecast-hook
Content-Type: application/json
User-Agent: WideCast-Webhook/0.1.0
X-WideCast-Event:        evt_8d4f9c8a9b714c5a93b37c8e
X-WideCast-Event-Type:   video.completed
X-WideCast-Signature:    t=1747680000,v1=abc123...
X-WideCast-Delivery:     12ab34cd56ef78901234567890abcdef
X-WideCast-Attempt:      1

{
  "event_id":   "evt_8d4f9c8a9b714c5a93b37c8e",
  "event_type": "video.completed",
  "created_at": "2026-05-20T12:34:56Z",
  "api_version": "0.1.0",
  "data": {
    "object":   "status",
    "id":       "widecast7c0d4f8a9b1e2d3f",
    "topic_id": "widecast7c0d4f8a9b1e2d3f",
    "type":     "video",
    "status":   "completed",
    "stage":    "scenes_ready_for_review",
    "progress": 1.0,
    "details":  { "step": 5, "status": "Completed", "notes": "" },
    "result": {
      "review_url": "https://widecast.ai/#scene_editor?topic_id=widecast7c0d4f8a9b1e2d3f"
    },
    "error":    null,
    "metadata": { "external_id": "..." },
    ...
  }
}
```

## Events (LOCKED for v0.1.0)

| `event_type`         | Fires when |
|---|---|
| `video.processing`   | Once, immediately after the server spawns the worker (fires from `POST /v1/create_video`) |
| `video.completed`    | Once, when `status` first reaches `completed`. `data.result.review_url` is populated |
| `video.failed`       | Once, when `status` first reaches `failed`. `data.error.{code,message}` is populated |

Each video fires **at most one** `video.processing` event and **at most one** terminal event (`completed` OR `failed`, never both).

## Signature verification

Every delivery is signed with HMAC-SHA256 using your `WIDECAST_WEBHOOK_SECRET`.

**Signature format:**
```
signed_payload = f"{timestamp}.{request_body_raw}"
signature      = HMAC_SHA256(secret, signed_payload).hexdigest()
header         = "t=<timestamp>,v1=<sig_hex>"
```

**Verify in Python (SDK helper):**
```python
from widecast import verify_webhook, WebhookVerificationError

@app.post("/widecast-hook")
def handle():
    try:
        event = verify_webhook(
            request.get_data(as_text=True),
            request.headers.get("X-WideCast-Signature", ""),
            secret=os.environ["WIDECAST_WEBHOOK_SECRET"],
        )
    except WebhookVerificationError as e:
        return "", 400
    # event = {"event_id": "...", "event_type": "video.completed", "data": {...}}
    return "", 204   # ALWAYS reply 2xx to acknowledge — non-2xx triggers retry
```

**Verify in TypeScript (SDK helper):**
```typescript
import { verifyWebhook, WebhookVerificationError } from "@widecast/sdk";

app.post("/widecast-hook", async (req, res) => {
  const body = await readRawBody(req);   // raw bytes / text, NOT re-stringified JSON
  try {
    const event = await verifyWebhook({
      body,
      signatureHeader: req.headers["x-widecast-signature"] as string,
      secret: process.env.WIDECAST_WEBHOOK_SECRET!,
    });
  } catch (e) {
    return res.status(400).end();
  }
  res.status(204).end();
});
```

**Verify manually** (any language):
1. Read the `X-WideCast-Signature` header → split on `,` → extract `t=` and `v1=`.
2. Reject if `t` is older than 5 minutes (replay protection).
3. Compute `expected = HMAC_SHA256(secret, f"{t}.{raw_body}").hex()`.
4. Compare `expected` with the `v1` value using a **constant-time** comparison.
5. Parse the JSON body and dispatch on `event_type`.

> ⚠ **Use the RAW request body**, not a re-encoded JSON. Any whitespace change breaks the signature.

## Retry policy

WideCast retries on transient errors with this schedule (10 attempts, total 24h):

| Attempt | Offset from create | Cumulative time |
|---|---|---|
| 1  | 0s    | 0s |
| 2  | 1m    | 1m |
| 3  | 5m    | 6m |
| 4  | 15m   | 21m |
| 5  | 30m   | 51m |
| 6  | 1h    | 1h 51m |
| 7  | 3h    | 4h 51m |
| 8  | 6h    | 10h 51m |
| 9  | 12h   | 16h 51m |
| 10 | 24h   | 24h (final) |

**Retry on:** 5xx, 408 Request Timeout, 429 Too Many Requests, network errors, timeouts (30s).

**Abandon on:** any other 4xx (your endpoint said "bad request — don't bother") — the record is deleted immediately.

**Drop on:** 10 attempts exhausted OR 24 hours elapsed since the record was created (whichever comes first). The record is deleted; no further attempts.

## Acknowledging

**Respond with HTTP 2xx within 30 seconds** to acknowledge. Anything else triggers a retry.

If your handler is slow, return 2xx immediately and process in a background queue — don't make WideCast wait.

## Idempotency

Network retries can cause the same event to be delivered more than once. Always dedupe on `event_id` (a unique 24-char hex per event). Common pattern:

```python
seen = set()
def handle(event):
    if event["event_id"] in seen:
        return  # already processed
    seen.add(event["event_id"])
    # ... real work
```

In production, persist `event_id` to a database with a unique constraint.

## Testing — zero infrastructure (recommended)

You don't need to run any server to see webhooks. WideCast hosts a **throwaway webhook inbox**:

1. Open **[https://widecast.ai/webhook-test.html](https://widecast.ai/webhook-test.html)** — it generates a unique inbox and shows a ready-to-use `callback_url` (e.g. `https://widecast.ai/app/dashboard2/webhook_test/wht_ab12cd34…`).
2. Copy that URL into `callback_url` on `POST /v1/create_video` (or `/v1/create_content`, `/v1/enhance_script`) — the playground card has a `callback_url` field.
3. Run it. The page **shows every delivery live** — the full event payload, all headers, and a ✓/✗ **signature-valid** badge — polling every 3s.

```bash
curl -X POST https://widecast.ai/app/dashboard2/v1/create_video \
  -H "Content-Type: application/json" -H "Authorization: Bearer wc_live_…" \
  -d '{ "script_text": "Test webhook flow.",
        "callback_url": "https://widecast.ai/app/dashboard2/webhook_test/wht_PASTE_YOURS" }'
```

The inbox is **ephemeral** — kept ~1 hour, holds your last 50 deliveries, lost on server restart. The unguessable inbox id is the only access token, so **don't send real/sensitive data** to it. Programmatic read: `GET /webhook_test/{inbox}` returns `{ object:"webhook_test_inbox", callback_url, count, deliveries:[…] }` (newest first).

## Testing — your own endpoint

Prefer your own receiver? Use `ngrok` or [requestbin.com](https://requestbin.com):

```bash
ngrok http 3000
curl -X POST https://widecast.ai/app/dashboard2/v1/create_video \
  -H "Content-Type: application/json" -H "Authorization: Bearer wc_live_…" \
  -d '{ "script_text": "Test webhook flow.", "callback_url": "https://abc123.ngrok.io/widecast-hook" }'
```

Either way you'll see 2 events:
- `video.processing` within ~5 seconds
- `video.completed` (or `video.failed`) when the worker finishes

## Server-side env

The signing secret is `WIDECAST_WEBHOOK_SECRET` — set on the server side. v0.1.0 uses one shared secret for the whole pilot; Phase 1 will issue per-API-key secrets when auth lands.
