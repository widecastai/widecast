# Publish to social platforms — `POST /v1/publish`

Distribute content to the social platforms connected to your account. This is the *distribution* half of WideCast's output model (create → review → **publish**).

Provide **exactly one** content mode:

- **`topic_id`** — publish a WideCast **video** OR **blog/social post** you already created (via `/v1/create_video` or `/v1/create_content`). WideCast auto-detects article vs video. A video must be **rendered first** (`/v1/export_video`, wait for `completed`) else `publish_not_ready` (409).
- **`text`** — post arbitrary text (optionally with `photo_urls`).
- **`video_url`** — a **direct video FILE url** (`.mp4`/`.mov`/…) to download + publish. Requires `title`.

`platforms` defaults to **all connected** platforms of the chosen channel group. `channel_group` (integer, default `0` = primary) picks which **channel group** — a separate set of connected accounts, e.g. *Vietnamese channels* vs *English channels* — the post goes through; one call publishes through **one** group (list them with `GET /v1/channel_groups`). Charges **1 credit** and posts **publicly**.

Publishing is asynchronous on the platform side: this returns the upstream `request_ids` **immediately** (`202`). Poll `GET /v1/status/{request_id}` for per-platform post URLs in `result.posts`. An article spanning text + photo platforms may return **up to two** `request_ids`.

<!-- widecast-playground:publish -->

### Request fields

| Field | Type | Required | Description |
|---|---|---|---|
| `topic_id` | string | one-of | Publish an existing WideCast video/blog (article vs video auto-detected). |
| `text` | string | one-of | Arbitrary text to post. |
| `video_url` | string (url) | one-of | A direct video file URL to download + publish. Requires `title`. |
| `title` | string | conditional | Caption/title. **Required** with `video_url`; optional override for `topic_id`. |
| `description` | string | no | Post body, hashtags included. YouTube, Facebook, LinkedIn and Pinterest show it as the description. TikTok, Instagram, Threads, X and Bluesky have no description field, so for video and photo posts WideCast posts `title` + blank line + `description` (or the description alone when it already starts with the title) as their caption, trimmed at a sentence or word boundary to each platform's limit with the trailing hashtags kept: TikTok 2,200 (UTF-16 units; photo: title 90, description 4,000), Instagram 2,200, Threads 500 UTF-8 bytes, X 280, Bluesky 300. A trim is listed in `warnings` (`caption_trimmed`). Your own `platform_settings.<platform>.<platform>_title` always wins. Text posts are unchanged. |
| `thumbnail_url` | string (url) | no | Video only: http(s) image URL for the cover (e.g. the `get_url` from `/v1/upload_asset`). Used by YouTube, LinkedIn, X and Facebook (`facebook_media_type: VIDEO`). Instagram, TikTok and Pinterest covers go in `platform_settings`: `instagram.cover_url` or `instagram.thumb_offset` (ms); `tiktok.cover_timestamp` (ms) or `tiktok.tiktok_cover_image_url` (only if the TikTok account allows custom covers); `pinterest.pinterest_cover_image_url`. Threads and Bluesky take no cover. |
| `photo_urls` | array[string] | no | Image URLs to attach (with `text`). |
| `platforms` | array[string] | no | Target platforms. Defaults to **all connected** in the chosen channel group. SDK constant `PUBLISH_PLATFORMS`: `youtube`, `tiktok`, `instagram`, `facebook`, `linkedin`, `x`, `threads`, `pinterest`, `reddit`, `bluesky`, `google_business`. |
| `channel_group` | integer | no | Channel group to publish through (`0` = primary, default). One call = one group. See `GET /v1/channel_groups`. |
| `scheduled_date` | string | no | ISO date/time to schedule the post (with `timezone`). |
| `timezone` | string | no | Timezone for `scheduled_date` (default `UTC`). |
| `metadata` | object | no | Echoed back on the response. |
| `platform_settings` | object | no | Per-call overrides `{platform: {key: value}}` merged over the saved settings of the chosen group for **this post only** (saved settings unchanged). Each block applies to its own platform only: that platform's Upload-Post options, or any `<platform>_` key (e.g. `tiktok_title`, `x_title`, `youtube_description`). A bare `title` / `description` inside a block becomes `<platform>_title` / `<platform>_description`. Whole-post fields (`user`, `platform[]`, `video`, `photos[]`, `scheduled_date`, `thumbnail_url`, …) and unknown keys are not sent and are listed in `warnings` (`setting_ignored`). Facebook keys: `facebook_media_type` = `REELS` (default; Facebook trims long videos to ~90 s), `VIDEO` (long-form video post) or `STORIES`; `facebook_page_id`; `facebook_video_state` = `Published` or `Draft`. Instagram `media_type` = `REELS` or `STORIES`; YouTube `privacyStatus` = `public`, `unlisted` or `private`. Example: `{"facebook": {"facebook_media_type": "VIDEO"}}` for a video longer than 90 s. |

### Response — `202 Accepted` → poll `/v1/status`

```json
{
  "object": "publish",
  "id": "abc123",
  "request_ids": ["abc123"],
  "status": "processing",
  "platforms": ["youtube", "x"],
  "skipped": [],
  "topic_id": "widecast7c0d4f8a9b1e2d3f",
  "content_kind": "video",
  "agent_note": "Recording step, do not skip: ..."
}
```

`topic_id` is present only when you published a WideCast video or article. `content_kind` says what went out: `video`, `article`, `text` or `photo`. `agent_note` is a short, generic instruction for agents that keep a local dashboard library: poll the status id, then record the post (see [Recording what you publish](#recording-what-you-publish)); ignore it if you keep none.

`warnings` appears only when something was changed or left out: `caption_trimmed` `{platform, field, limit, unit}` (a caption was cut to fit), `setting_ignored` `{platform, key, reason}` (a `platform_settings` key was not sent), `thumbnail_ignored` (`thumbnail_url` on a non-video post).

Poll `GET /v1/status/{request_id}` (cadence 5s). For a publish id, `type` is `"publish"` and `result.posts[]` carries `{platform, success, post_url, post_id, error}`:
- `status == "completed"` → all platforms reported back; check each `result.posts[].success`.
- `status == "failed"` → the publish job failed upstream.

### Recording what you publish

Once a publish-type status is `completed` or `failed`, the response also carries `agent_note` and `result.library_record`, a ready-to-file record (`{kind, status, source: "widecast", title, urls, external}`) for a local dashboard library: `urls` has one key per platform that went live (`facebook`, or `facebook@2` for channel group 2), `status` is `published` only when at least one platform succeeded (a fully failed publish is `draft`), and `external` carries `topic_id`, `request_id` and `channel_group`. Pass it to `<bridge> tool content import --json`, or let `<bridge> tool provider call --operation getStatus --path id=<request_id>` file it. A post that is never recorded does not show up in that dashboard. If you keep no local library, ignore both fields.

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
| `invalid_channel_group` | 400 / 404 | `channel_group` not an integer ≥ 0 (400) or the group does not exist (404). |
| `no_platforms_connected` | 400 | No connected platforms in the chosen channel group (or none of the requested are connected). |
| `video_not_found` | 404 | `topic_id` doesn't exist for your account. |
| `publish_not_ready` | 409 | The topic's video isn't rendered yet — export it first. |
| `download_failed` | 400 | The external `video_url` could not be downloaded. |
| `publish_failed` | 400/500 | The publish backend rejected the request. |
| `missing_api_key` / `invalid_api_key` | 401 | API-key auth. |
| `account_expired` / `credit_exhausted` | 402 | Account expired or out of credits. |
