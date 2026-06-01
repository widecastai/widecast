# Publish to social platforms — `POST /v1/publish`

Distribute content to the social platforms connected to your account. This is the *distribution* half of WideCast's output model (create → review → **publish**).

Provide **exactly one** content mode:

- **`topic_id`** — publish a WideCast **video** OR **blog/social post** you already created (via `/v1/create_video` or `/v1/create_content`). WideCast auto-detects article vs video. A video must be **rendered first** (`/v1/export_video`, wait for `completed`) else `publish_not_ready` (409).
- **`text`** — post arbitrary text (optionally with `photo_urls`).
- **`video_url`** — a **direct video FILE url** (`.mp4`/`.mov`/…) to download + publish. Requires `title`.

`platforms` defaults to **all connected** platforms. Charges **1 credit** and posts **publicly**.

Publishing is asynchronous on the platform side: this returns the upstream `request_ids` **immediately** (`202`). Poll `GET /v1/status/{request_id}` for per-platform post URLs in `result.posts`. An article spanning text + photo platforms may return **up to two** `request_ids`.

<!-- widecast-playground:publish -->

### Request fields

| Field | Type | Required | Description |
|---|---|---|---|
| `topic_id` | string | one-of | Publish an existing WideCast video/blog (article vs video auto-detected). |
| `text` | string | one-of | Arbitrary text to post. |
| `video_url` | string (url) | one-of | A direct video file URL to download + publish. Requires `title`. |
| `title` | string | conditional | Caption/title. **Required** with `video_url`; optional override for `topic_id`. |
| `description` | string | no | Optional body/description text. |
| `photo_urls` | array[string] | no | Image URLs to attach (with `text`). |
| `platforms` | array[string] | no | Target platforms. Defaults to **all connected**. SDK constant `PUBLISH_PLATFORMS`: `youtube`, `tiktok`, `instagram`, `facebook`, `linkedin`, `x`, `threads`, `pinterest`, `reddit`, `bluesky`, `google_business`. |
| `scheduled_date` | string | no | ISO date/time to schedule the post (with `timezone`). |
| `timezone` | string | no | Timezone for `scheduled_date` (default `UTC`). |
| `metadata` | object | no | Echoed back on the response. |

### Response — `202 Accepted` → poll `/v1/status`

```json
{
  "object": "publish",
  "id": "abc123",
  "request_ids": ["abc123"],
  "status": "processing",
  "platforms": ["youtube", "x"],
  "skipped": []
}
```

Poll `GET /v1/status/{request_id}` (cadence 5s). For a publish id, `type` is `"publish"` and `result.posts[]` carries `{platform, success, post_url, post_id, error}`:
- `status == "completed"` → all platforms reported back; check each `result.posts[].success`.
- `status == "failed"` → the publish job failed upstream.

### SDK

```python
from widecast import Widecast
c = Widecast(api_key="wc_live_…")
pub = c.publish(topic_id="widecast7c0d4f8a9b1e2d3f", platforms=["youtube", "x"])
status = c.get_status(pub["id"])      # poll for per-platform post URLs
```
```typescript
const pub = await client.publish({ text: "We just shipped v2 — try it free today!" });
const status = await client.get_status(pub.id);
```

### Errors

| `error.code` | HTTP | When |
|---|---|---|
| `invalid_publish_input` | 400 | Not exactly one of `topic_id` / `text` / `video_url`. |
| `missing_field` | 400 | `title` missing with `video_url`. |
| `invalid_platforms` | 400 | `platforms` not a list, or an unknown platform name. |
| `no_platforms_connected` | 400 | No connected platforms (or none of the requested are connected). |
| `video_not_found` | 404 | `topic_id` doesn't exist for your account. |
| `publish_not_ready` | 409 | The topic's video isn't rendered yet — export it first. |
| `download_failed` | 400 | The external `video_url` could not be downloaded. |
| `publish_failed` | 400/500 | The publish backend rejected the request. |
| `missing_api_key` / `invalid_api_key` | 401 | API-key auth. |
| `account_expired` / `credit_exhausted` | 402 | Account expired or out of credits. |
