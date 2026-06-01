# Create written content — `POST /v1/create_content`

Turn a **URL**, an **idea/topic**, or **pasted text** into a **blog post** or a **social post** (Facebook / X / LinkedIn). This is the *written* half of WideCast's output model (video + blog + social).

Async: returns a `widecast*` id, `status: "processing"`, AND `result.review_url` (the public content viewer) in the create response itself — safe to hand the user immediately; the viewer shows a spinner while content generates. Poll `GET /v1/status/{id}` until `completed` for the final state. Consumes credits.

<!-- widecast-playground:create-content -->

### Request fields

| Field | Type | Required | Description |
|---|---|---|---|
| `content` | string | yes | What to create from: a URL, an idea/topic description, or pasted text. |
| `content_type` | string | no | `blog` (default, long-form), `facebook`, `x` (Twitter/X), or `linkedin`. SDK constant `CONTENT_TYPES`. |
| `language` | string | no | Output language (e.g. `English`, `Vietnamese`). Default `English`. |
| `callback_url` | string (url) | no | HTTPS webhook for completion events (HMAC-signed). |
| `metadata` | object | no | Up to 16 keys, echoed back on `/v1/status`. |

### Response — `202 Accepted` → poll `/v1/status`

Returns the unified `/v1/status` envelope (with `type: "content"`) and `status: "processing"`. `result.review_url` is already populated in this response — the content viewer (`https://widecast.ai/viewer.html?topic_id=…&company_id=…`) — share with the user now. Then poll `GET /v1/status/{id}` (cadence 5s):
- `status == "completed"` → content is ready in the viewer.
- `status == "failed"` → `result.error` explains why.

While processing, `details.status` surfaces the writer's own stage (the content pipeline has its own progression, **not** a numeric step machine): `Queued → Processing → Researching → Deep research completed → Checking media → Completed`. Branch your logic on the top-level `status` enum, not on `details.status` / `details.step`.

### SDK

```python
from widecast import Widecast
c = Widecast(api_key="wc_live_…")
v = c.create_content(content="https://example.com/article", content_type="blog", language="English").wait()
print(v.review_url)
```
```typescript
const v = await client.create_content({ content: "An idea for a LinkedIn post", content_type: "linkedin" }).then(v => v.wait());
```

### Errors

| `error.code` | HTTP | When |
|---|---|---|
| `missing_field` | 400 | `content` or `language` is missing/empty. |
| `invalid_content_type` | 400 | `content_type` not in `blog` / `facebook` / `x` / `linkedin`. |
| `missing_api_key` / `invalid_api_key` | 401 | API-key auth. |
| `account_expired` / `credit_exhausted` | 402 | Account expired or out of credits. |
