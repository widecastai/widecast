# Send a self-notify message — `POST /v1/telegram/send`

**Synchronous, no credit charged.** Push a notification to the **user's own** account — preferring Telegram, falling back to email. Lets an AI agent surface "your video is ready", "scenes need review", "rendering finished" out-of-band so the user sees it even when they closed the dashboard.

> **Self-notify only.** There is no `chat_id` / `to` / `email` field by design. The delivery target is resolved server-side from the API key's company doc, never accepted as input. This prevents using WideCast as a spam relay.

## Delivery channel — auto-chosen

| Condition | `delivery` returned | What happens |
|---|---|---|
| User has completed [`Connect Telegram`](https://widecast.ai/#setup) | `"telegram"` | Message lands in their Telegram chat with the WideCast bot. Response carries `chat_id_masked` + `telegram_message_id`. |
| Telegram NOT connected but account has email on file | `"email"` | The same message is delivered to the account's email **with an in-mail banner explaining why** (Telegram not connected) and a CTA to connect. Response carries `recipient_email_masked`, `fallback_reason: "telegram_not_connected"`, `setup_url`, and `note`. |
| Telegram NOT connected AND no email on file | — (400) | `400 telegram_not_connected` + `details.setup_url`. |

The endpoint **only fails when there is literally no way to reach the user** — for any account with email, the message is guaranteed to arrive.

<!-- widecast-playground:telegram-send -->

---

## Request

```bash
curl -sS -X POST "https://widecast.ai/app/dashboard/v1/telegram/send" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -H "Content-Type: application/json" \
  -d '{
        "message":   "Your video is ready to review!",
        "parse_mode": "HTML"
      }'
```

With an image attached (the message becomes the caption):

```bash
curl -sS -X POST "https://widecast.ai/app/dashboard/v1/telegram/send" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -H "Content-Type: application/json" \
  -d '{
        "message":   "Preview of scene 3 — pick this background?",
        "photo_url": "https://example.com/scene3-preview.jpg"
      }'
```

With a video attached:

```bash
curl -sS -X POST "https://widecast.ai/app/dashboard/v1/telegram/send" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -H "Content-Type: application/json" \
  -d '{
        "message":   "Render finished — final cut",
        "video_url": "https://example.com/final.mp4"
      }'
```

### Field reference

| Field | Type | Required | Description |
|---|---|---|---|
| `message` | string | yes | Text body in plain-text mode, OR the caption when `photo_url` / `video_url` is set. Capped at **4000 bytes** plain-text / **1024 bytes** as caption (Telegram's hard limit). |
| `parse_mode` | string | no | One of `Markdown`, `MarkdownV2`, `HTML`. Omit for plain text. `HTML` supports a small tag subset (`b`, `i`, `u`, `s`, `code`, `pre`, `a`); the server strips other tags before delivery. |
| `photo_url` | string (uri) | no | Public http(s) URL Telegram downloads server-side. Mutually exclusive with `video_url`. |
| `video_url` | string (uri) | no | Public http(s) URL Telegram downloads server-side. Mutually exclusive with `photo_url`. |

**Rate limit**: 60 messages/hour/account.

---

## Response — `200 OK`

### Telegram path (`delivery: "telegram"`)

```json
{
  "object":              "telegram_message",
  "status":              "sent",
  "delivery":            "telegram",
  "media_kind":          "text",
  "chat_id_masked":      "…1234",
  "telegram_message_id": 81023,
  "request_id":          "req_abcd…"
}
```

`chat_id_masked` is `…` plus the last 4 digits of the user's chat_id. `telegram_message_id` is Telegram's own id for the delivered message, surfaced so the caller can later edit/delete via Telegram's API.

### Email fallback path (`delivery: "email"`)

```json
{
  "object":                 "telegram_message",
  "status":                 "sent",
  "delivery":               "email",
  "media_kind":             "text",
  "recipient_email_masked": "u***n@example.com",
  "fallback_reason":        "telegram_not_connected",
  "setup_url":              "https://widecast.ai/#setup",
  "note":                   "Telegram was not connected for this account, so the notification was delivered to the account's email instead. The user can complete Connect Telegram at https://widecast.ai/#setup for future deliveries to land in Telegram.",
  "request_id":             "req_abcd…"
}
```

The email body itself includes a yellow callout banner explaining the same thing to the user — so they're not confused why they're suddenly receiving emails from WideCast. The agent should **relay `note` to the user** so they know future notifications can move to Telegram with one Connect step.

### Error responses

| `error.code` | HTTP | When |
|---|---|---|
| `missing_field` | 400 | `message` is empty. |
| `telegram_not_connected` | 400 | User has not completed `Connect Telegram` at `#setup`. `error.details.setup_url` carries the URL. |
| `invalid_parse_mode` | 400 | `parse_mode` is not one of `Markdown` / `MarkdownV2` / `HTML`. |
| `conflicting_media` | 400 | Both `photo_url` and `video_url` were set. Provide at most one. |
| `invalid_photo_url` / `invalid_video_url` | 400 | The URL is not a public http(s) URL. |
| `message_too_long` | 400 | Plain-text body > 4000 bytes, or caption (with media) > 1024 bytes. |
| `missing_api_key` / `invalid_api_key` | 401 | Auth. |
| `rate_limited` | 429 | More than 60 sends in the last hour for this account. `error.details.{rate_limit_max, rate_limit_count, retry_after_seconds}` + standard `Retry-After` header. |
| `telegram_send_failed` | 502 | Telegram itself rejected the message (rare). `error.details.telegram_response` carries Telegram's body. |

---

## SDK examples

### Python

```python
from widecast import Widecast

client = Widecast()

# Plain text
client.send_telegram_message("Your video is ready to review!")

# With formatting
client.send_telegram_message(
    "<b>Your video is ready</b>\nReview at <a href='https://widecast.ai/...'>this link</a>",
    parse_mode="HTML",
)

# With a photo
client.send_telegram_message(
    "Preview of scene 3 — pick this background?",
    photo_url="https://example.com/scene3-preview.jpg",
)
```

### TypeScript

```typescript
import Widecast from "@widecast/sdk";

const client = new Widecast();

await client.send_telegram_message("Your video is ready to review!");

await client.send_telegram_message(
  "Preview of scene 3 — pick this background?",
  { photo_url: "https://example.com/scene3-preview.jpg" },
);
```

### MCP

```jsonc
{
  "name": "widecast_send_telegram_message",
  "arguments": {
    "message":   "🎬 Your video is ready — open the dashboard to review!",
    "parse_mode": "HTML"
  }
}
```
