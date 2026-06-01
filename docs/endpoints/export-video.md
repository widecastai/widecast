# Export to final MP4 — `POST /v1/export_video`

Pairs with `output_type: "scene"` on [`POST /v1/create_video`](create-video.md). After scenes are ready (you reviewed `result.review_url` and you're happy), call this to kick the final renderer.

The endpoint is **idempotent** — calling it a second time for the same `id` is a no-op that returns the current status.

> **Skip this endpoint** when you create the video with `output_type: "video"`. The server's auto-export watcher will chain into the renderer for you, and `result.video_url` will appear on `/v1/status` directly.

---

## Request

```http
POST /v1/export_video
Authorization: Bearer wc_live_REPLACE_ME   # optional in pilot
Content-Type: application/json

{
  "id": "widecast7c0d4f8a9b1e2d3f"
}
```

### Field reference

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | `topic_id` returned by `/v1/create_video`. Must match `widecast<alphanumeric>`. |

---

## Responses

### `202 Accepted` — render queued

Returned the first time `/v1/export_video` is called for an id (and scenes are ready). The body is a fresh `/v1/status` snapshot — typically `status: "processing"`, `stage: "rendering_video"`, `progress >= 0.85`.

```json
{
  "object":   "status",
  "id":       "widecast7c0d4f8a9b1e2d3f",
  "status":   "processing",
  "stage":    "rendering_video",
  "progress":  0.85,
  ...
}
```

### `200 OK` — idempotent no-op

If a queue row already exists (export was previously kicked), the server returns the current status snapshot without re-enqueueing.

### `409 Precondition Failed` — `scenes_not_ready`

The video exists but hasn't reached `scenes_ready_for_review` yet. Poll `/v1/status/{id}` until `status === "completed"` (with `stage === "scenes_ready_for_review"`), then retry.

```json
{
  "error": {
    "type":    "precondition_failed",
    "code":    "scenes_not_ready",
    "message": "Scenes are not ready yet. Poll GET /v1/status/{id} until status=completed with stage=scenes_ready_for_review, then retry.",
    "param":   "id",
    ...
  }
}
```

### `404 Not Found` — `video_not_found`

No video with this id exists in your account.

### `400 Bad Request` — `invalid_json`, `missing_field`, `invalid_id`

Standard request-validation errors.

---

## Lifecycle effects

Calling `/v1/export_video` has two persistent effects on the video:

1. **`output_type` is promoted to `"video"`** in the server's state — even if the original `/v1/create_video` call used `output_type: "scene"`. This changes the `/v1/status` completion gate from "scenes ready" to "final MP4 rendered".
2. **The `video.completed` webhook marker is reset** if a `video.completed` event already fired (it would have fired at scenes-ready). This lets the webhook fire a second time when the MP4 is ready — your handler may receive **two** `video.completed` events for the same id: once with `result.review_url` only, then again with `result.video_url` populated. Dedupe on `event_id` if you care.

---

## SDK examples

### Python

```python
from widecast import Widecast

client = Widecast()
video = client.create_video(script_text=script).wait()
print(f"Scenes ready — review at: {video.review_url}")

# ... user reviews scenes ...

exported = client.export_video(video.id).wait(timeout=900)
print(f"MP4: {exported.video_url}")
```

### TypeScript

```typescript
import Widecast from "@widecast/sdk";

const client = new Widecast();
const v = await client.create_video({ script_text: script }).then(v => v.wait());
console.log(`Review: ${v.review_url}`);

// ... user reviews scenes ...

const final = await client.export_video(v.id).then(v => v.wait({ timeoutMs: 900_000 }));
console.log(`MP4: ${final.video_url}`);
```

### Manual (curl)

```bash
curl -sS -X POST ".../v1/export_video" \
  -H "Content-Type: application/json" \
  -d '{"id":"widecast7c0d4f8a9b1e2d3f"}' | jq
```

Then poll `/v1/status/{id}` until `status === "completed"` with `result.video_url` set.

---

## When to call this vs `output_type: "video"`

| You want… | Use |
|---|---|
| Always produce the final MP4, no human review | `POST /v1/create_video` with `output_type: "video"` — one call. |
| Review scenes first, decide whether to render | `POST /v1/create_video` with `output_type: "scene"`, review `review_url`, then `POST /v1/export_video` when ready. |
| Programmatic batch jobs | Either works — `output_type: "video"` is one fewer API call. |
| Interactive UI ("preview → render" button) | `scene` + `export_video` — explicit confirmation step. |
