# Send a Telegram notification — `POST /v1/telegram/send`

**Synchronous, no credit charged.** Push a notification to the **user's own** connected Telegram chat. Lets an AI agent surface "your video is ready", "scenes need review", "rendering finished" out-of-band — the user gets the ping in Telegram even when they closed the dashboard.

> **Self-notify only.** There is no `chat_id` / `to` field by design. The recipient is the user who owns this API key (chat_id is resolved server-side from their company doc, never accepted as input). This prevents using WideCast as a Telegram spam relay.

**Prerequisite.** The user must have connected Telegram once at [`https://widecast.ai/#setup`](https://widecast.ai/#setup). If they haven't, the call returns `400 telegram_not_connected` + `details.setup_url` — point them there and they can complete the connect in under a minute.

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

```json
{
  "object":              "telegram_message",
  "status":              "sent",
  "media_kind":          "text",
  "chat_id_masked":      "…1234",
  "telegram_message_id": 81023,
  "request_id":          "req_abcd…"
}
```

`chat_id_masked` is `…` plus the last 4 digits of the user's chat_id — the unmasked id is never returned (the caller already has access in Telegram itself). `telegram_message_id` is Telegram's own id for the delivered message, surfaced when present so the caller can later edit or delete via Telegram's API.

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
