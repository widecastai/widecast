# Send a self-notify notification — `POST /v1/notification/send`

**Synchronous, no credit charged.** Push a notification to the **user's own** account. **Email is the default channel** (always sent when the account has an email on file); **Telegram is an additional channel** when the user has connected it. Lets an AI agent surface "your video is ready", "scenes need review", "rendering finished" out-of-band so the user sees it even when they closed the dashboard.

> **Self-notify only.** There is no `chat_id` / `to` / `email` field by design. The recipient (email address + Telegram chat) is resolved server-side from the API key's account, never accepted as input. This prevents using WideCast as a spam relay.

> **Renamed from `POST /v1/telegram/send` (2026-07-13).** Email became the default channel and a required `subject` field was added. The old path is gone.

## Delivery — email default, Telegram additional

| Account state | Channels | Result |
|---|---|---|
| Email on file + [Telegram connected](https://widecast.ai/#setup) | **email + telegram** | Notification is sent to **both**. `delivery: ["email","telegram"]`. |
| Email on file, Telegram NOT connected | **email** | Email only. `delivery: ["email"]`. |
| No email, Telegram connected | **telegram** | Telegram only. `delivery: ["telegram"]` + a `note` + `setup_url`. |
| No email AND no Telegram | — (400) | `400 no_delivery_channel` + `details.setup_url`. |

`subject` is the **email subject line**, and on Telegram it is **prepended in bold** before the body. `status` is `"sent"` when every attempted channel succeeded, `"partial"` when at least one but not all succeeded.

<!-- widecast-playground:notification-send -->

---

## Request

```bash
curl -sS -X POST "https://widecast.ai/app/dashboard/v1/notification/send" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -H "Content-Type: application/json" \
  -d '{
        "subject": "Your video is ready",
        "message": "All 8 scenes finished rendering — open the editor to review.",
        "parse_mode": "HTML"
      }'
```

With an image attached (the message becomes the caption):

```bash
curl -sS -X POST "https://widecast.ai/app/dashboard/v1/notification/send" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -H "Content-Type: application/json" \
  -d '{
        "subject":  "Scene 3 preview",
        "message":  "Pick this background?",
        "photo_url": "https://example.com/scene3-preview.jpg"
      }'
```

### Field reference

| Field | Type | Required | Description |
|---|---|---|---|
| `subject` | string | **yes** | The email subject line; also prepended in **bold** before the Telegram body. Keep it short — capped at **200 bytes** (`subject_too_long` beyond that). |
| `message` | string | **yes** | The notification body (email body / Telegram text), OR the caption when `photo_url` / `video_url` is set. Capped at **4000 bytes** text / **1024 bytes** as caption. |
| `parse_mode` | string | no | One of `Markdown`, `MarkdownV2`, `HTML`. Formats the **body**. Omit for plain text. `HTML` supports a small tag subset (`b`, `i`, `u`, `s`, `code`, `pre`, `a`). The subject is always bolded automatically. |
| `photo_url` | string (uri) | no | Public http(s) URL — Telegram downloads it; email embeds it inline. Mutually exclusive with `video_url`. |
| `video_url` | string (uri) | no | Public http(s) URL — Telegram downloads it; email shows a clickable link. Mutually exclusive with `photo_url`. |

**Rate limit**: 60 notifications/hour/account.

---

## Response — `200 OK`

### Both channels (email + Telegram connected)

```json
{
  "object":     "notification",
  "status":     "sent",
  "subject":    "Your video is ready",
  "media_kind": "text",
  "delivery":   ["email", "telegram"],
  "email":      { "status": "sent", "recipient_email_masked": "u***n@example.com" },
  "telegram":   { "status": "sent", "chat_id_masked": "…1234", "telegram_message_id": 81023 },
  "request_id": "req_abcd…"
}
```

### Email only (Telegram not connected)

```json
{
  "object":     "notification",
  "status":     "sent",
  "subject":    "Your video is ready",
  "media_kind": "text",
  "delivery":   ["email"],
  "email":      { "status": "sent", "recipient_email_masked": "u***n@example.com" },
  "request_id": "req_abcd…"
}
```

### Telegram only (no email on file)

```json
{
  "object":     "notification",
  "status":     "sent",
  "subject":    "Your video is ready",
  "media_kind": "text",
  "delivery":   ["telegram"],
  "telegram":   { "status": "sent", "chat_id_masked": "…1234", "telegram_message_id": 81023 },
  "note":       "No email on file — delivered via Telegram only. Add an email to the account to also receive email notifications.",
  "setup_url":  "https://widecast.ai/#setup",
  "request_id": "req_abcd…"
}
```

> **`status: "partial"`** — if one channel succeeds and another fails (e.g. email sent but Telegram rejected the message), `status` is `"partial"` and the failing channel's object carries `status: "failed"` + `error`. A channel that is skipped because `subject + body` exceeds Telegram's byte limit carries `telegram.status: "skipped"` + `reason` (the email still goes out).

### Error responses

| `error.code` | HTTP | When |
|---|---|---|
| `missing_field` | 400 | `subject` or `message` is empty. |
| `subject_too_long` | 400 | `subject` > 200 bytes. |
| `invalid_parse_mode` | 400 | `parse_mode` not one of `Markdown` / `MarkdownV2` / `HTML`. |
| `conflicting_media` | 400 | Both `photo_url` and `video_url` were set. |
| `invalid_photo_url` / `invalid_video_url` | 400 | The URL is not a public http(s) URL. |
| `message_too_long` | 400 | Body > 4000 bytes, or caption (with media) > 1024 bytes. |
| `no_delivery_channel` | 400 | Account has NO email AND NO connected Telegram. `error.details.setup_url` carries the URL. |
| `missing_api_key` / `invalid_api_key` | 401 | Auth. |
| `rate_limited` | 429 | More than 60 sends in the last hour. `error.details.{rate_limit_max, rate_limit_count, retry_after_seconds}` + standard `Retry-After` header. |
| `notification_send_failed` | 502 | Every attempted channel failed. `error.details.{email, telegram}` carries per-channel errors. |

---

## SDK examples

### Python

```python
from widecast import Widecast

client = Widecast()

# Email (always) + Telegram (if connected)
client.send_notification("Your video is ready",
                         "All 8 scenes finished rendering — open the editor to review.")

# With formatting on the body
client.send_notification(
    "Render finished",
    "<b>Final cut</b> is ready — <a href='https://widecast.ai/...'>review it</a>.",
    parse_mode="HTML",
)

# With a photo
client.send_notification(
    "Scene 3 preview",
    "Pick this background?",
    photo_url="https://example.com/scene3-preview.jpg",
)
```

### TypeScript

```typescript
import Widecast from "@widecast/sdk";

const client = new Widecast();

await client.send_notification("Your video is ready",
  "All 8 scenes finished rendering — open the editor to review.");

await client.send_notification("Scene 3 preview", "Pick this background?",
  { photo_url: "https://example.com/scene3-preview.jpg" });
```

### MCP

```jsonc
{
  "name": "widecast_send_notification",
  "arguments": {
    "subject":  "🎬 Your video is ready",
    "message":  "Open the dashboard to review the scenes.",
    "parse_mode": "HTML"
  }
}
```
