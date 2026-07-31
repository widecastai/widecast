# Send a client link — `POST /v1/client_link/send`

**Synchronous, no credit charged.** Mint a **no-login client link** ("magic link") and **optionally** send it through the account's notification channels. Built for autonomous AI agents operating an account: after finishing a video, send the client a `record` link; after queueing an idea, send a `content_plan` link so the client can review.

> **No recipient field, by design.** Recipients are **always** resolved server-side from the account's [Setup &gt; Notification settings](https://widecast.ai/#setup) — the caller can **never** supply a phone number or email address. This prevents using WideCast as a spam relay.

Notification content is composed **server-side** per `link_type` (a `record` link includes the video's title/hook; `content_plan` says "Your content plan is ready for review"; etc.) across Telegram message, SMS (Twilio) and email with a CTA button.

## Link types

| `link_type` | Opens |
|---|---|
| `record` | One specific project's recording workspace. **Requires `topic_id`.** |
| `content_plan` | The Saved Ideas / content-plan screen. |
| `setup` | The account Setup Center. |
| `social_dashboard` | The Social Dashboard (statistics). |
| `publish_schedule` | The Publish Schedule screen. |

<!-- widecast-playground:client-link-send -->

---

## Request

Record link + notify via Telegram and email:

```bash
curl -sS -X POST "https://widecast.ai/app/dashboard/v1/client_link/send" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -H "Content-Type: application/json" \
  -d '{
        "link_type": "record",
        "topic_id":  "widecastab12",
        "ttl_days":  7,
        "channels":  { "telegram": true, "email": true }
      }'
```

Mint-only `content_plan` link (no notification is sent — you get `magic_url` back and decide later):

```bash
curl -sS -X POST "https://widecast.ai/app/dashboard/v1/client_link/send" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -H "Content-Type: application/json" \
  -d '{ "link_type": "content_plan" }'
```

### Field reference

| Field | Type | Required | Description |
|---|---|---|---|
| `link_type` | string | **yes** | One of `record`, `content_plan`, `setup`, `social_dashboard`, `publish_schedule` (SDK constant `CLIENT_LINK_TYPES`). See the [link-types table](#link-types). |
| `topic_id` | string | iff `link_type=record` | The project whose recording workspace the link opens. Pattern `^[A-Za-z0-9_-]{1,64}$`. Required when `link_type=record`, ignored otherwise. |
| `ttl_days` | integer | no | Link lifetime in days. Default **7** (SDK constant `CLIENT_LINK_TTL_DEFAULT`), clamped to **1..30** (`CLIENT_LINK_TTL_MIN` / `CLIENT_LINK_TTL_MAX`). |
| `channels` | object | no | `{ telegram?: boolean, sms?: boolean, email?: boolean }`. Omitted, empty, or all-false ⇒ **mint-only** (no notification is sent; the caller gets `magic_url` and decides later). Recipients are always resolved server-side from the account's Setup &gt; Notification settings. |
| `page` | string | no | One of `record.html`, `record2.html` (default `record.html`) — which app page hosts the link. |

**SDK constants** (values locked, mirrored from the server): `CLIENT_LINK_TYPES = ("record", "content_plan", "setup", "social_dashboard", "publish_schedule")`, `CLIENT_LINK_TTL_MIN = 1`, `CLIENT_LINK_TTL_MAX = 30`, `CLIENT_LINK_TTL_DEFAULT = 7`.

---

## Response — `200 OK`

### Mint-only (`channels` omitted / empty / all-false)

```json
{
  "object":          "client_link",
  "link_type":       "content_plan",
  "magic_url":       "https://widecast.ai/record.html#workspace?token=...&redirect=...",
  "expires_in_days": 7,
  "notified":        false,
  "request_id":      "req_abcd…"
}
```

### `record` link with channels requested

```json
{
  "object":          "client_link",
  "link_type":       "record",
  "topic_id":        "widecastab12",
  "magic_url":       "https://widecast.ai/record.html#workspace?token=...&redirect=...",
  "expires_in_days": 7,
  "notified":        true,
  "results": {
    "telegram": { "status": "sent" },
    "sms":      { "status": "skipped", "reason": "sms_not_configured" },
    "email":    { "status": "sent" }
  },
  "request_id":      "req_abcd…"
}
```

- `topic_id` is present **only** for `link_type=record`.
- `results` is present **only when channels were requested** — per-channel `status` is `sent` | `skipped` | `failed`, with `reason` / `error` on the non-sent ones.

### Error responses

| `error.code` | HTTP | When |
|---|---|---|
| `invalid_json` | 400 | The request body is not valid JSON. |
| `invalid_link_type` | 400 | `link_type` is missing or not one of the five values (`error.param = "link_type"`). |
| `missing_field` | 400 | `link_type=record` without `topic_id` (`error.param = "topic_id"`). |
| `invalid_topic_id` | 400 | `topic_id` does not match `^[A-Za-z0-9_-]{1,64}$` (`error.param = "topic_id"`). |
| `invalid_channels` | 400 | `channels` is not an object of boolean flags (`error.param = "channels"`). |
| `missing_api_key` / `invalid_api_key` | 401 | Auth. |
| `client_link_failed` | 500 | The API key has no account email. |
| `client_link_failed` | 502 | Minting the link failed upstream. |
