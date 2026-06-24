# Upload an asset — `POST /v1/upload_asset`

**Synchronous, no credit charged.** Get an audio / video / image / document asset into WideCast's S3 bucket and back out as a **public URL** the AI agent can feed into [`/v1/create_video`](create-video.md) (as `audio_url` / `video_url`), paste into `script_text` as inline `![alt](url)` (for images), OR `curl <get_url>` to fetch a document body before passing it as `blog_text` / `script_text` (for HTML / PDF / Markdown attachments).

This is the **canonical upload path** for AI agents handling files the user attached in chat. It removes the need to shop for third-party file hosts (transfer.sh / catbox / S3 of your own) or to inline-base64 binary content into `create_video`.

> **Lifecycle: the bucket prefix `assets/` auto-deletes after 24 hours.** Call `/v1/create_video` with the returned URL within that window — after expiry the S3 object is gone and the URL returns `NoSuchKey`.

<!-- widecast-playground:upload-asset -->

---

## Three supported request shapes

| Shape | Best for | Bytes through API? |
|---|---|---|
| **(1) `multipart/form-data`** | SDKs (Python / JS), `curl`, Postman, ChatGPT Custom GPT Action | Yes — server proxies to S3 |
| **(2) JSON with `mode: "presign"`** | **MCP agents** (Claude Code / Claude Desktop / Cursor) — the bytes ride directly to S3 via shell `curl`. Also useful from serverless / edge SDK callers that don't want to hold large bodies | No — the API only mints a pre-signed URL |
| **(3) JSON with `file_data: <base64>`** | Legacy / small-file callers that already have base64 and don't want a second request | Yes — server decodes + proxies to S3 |

Two-step presign flow (the agent / MCP path):

```bash
# (1) Mint the URLs (no bytes ride through this call)
RESP=$(curl -sS -X POST "https://widecast.ai/app/dashboard/v1/upload_asset" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -H "Content-Type: application/json" \
  -d '{
        "mode":         "presign",
        "filename":     "voice_memo.mp3",
        "content_type": "audio/mpeg"
      }')
PUT_URL=$(echo "$RESP" | jq -r .put_url)
GET_URL=$(echo "$RESP" | jq -r .get_url)

# (2) Upload the bytes straight to S3 (NOT the WideCast API).
# No extra headers required — the signature only binds the host.
curl -sS -X PUT --upload-file /path/to/voice_memo.mp3 "$PUT_URL"

# (3) Use the public URL on create_video
curl -sS -X POST "https://widecast.ai/app/dashboard/v1/create_video" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -H "Content-Type: application/json" \
  -d "{
        \"source\":         \"audio_url\",
        \"audio_url\":      \"$GET_URL\",
        \"script_approved\": true,
        \"production_mode\": \"faceless\",
        \"output_type\":     \"scene\"
      }"
```

Multipart (the simplest path for any caller that can send a multipart body):

```bash
curl -sS -X POST "https://widecast.ai/app/dashboard/v1/upload_asset" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -F "file=@/path/to/voice_memo.mp3"
```

### Field reference

**Multipart**

| Field | Type | Required | Description |
|---|---|---|---|
| `file` | file | yes | The audio / video / image / document (HTML / PDF / Markdown) file. Standard multipart `file=@...`. Server cap **500 MB**. |

**JSON — `mode: "presign"`** (no bytes through API)

| Field | Type | Required | Description |
|---|---|---|---|
| `mode` | string | yes | Must be `"presign"`. |
| `filename` | string | yes | Original filename — used to pick the S3 extension. Basename only; any path is stripped. |
| `content_type` | string | no | Optional MIME type. Used by the downstream pipeline only (informational); **NOT bound to the S3 signature**, so the caller does NOT need to echo it back on the PUT. |

**JSON — base64 (legacy / small files)**

| Field | Type | Required | Description |
|---|---|---|---|
| `file_data` | string (base64) | yes | Raw asset bytes, base64-encoded. No `data:...;base64,` prefix needed (silently stripped). |
| `filename` | string | yes | Original filename — used to pick the on-disk extension. |
| `content_type` | string | no | Optional MIME type. Falls back to detection from the filename extension. |

### Allowed types

Media (prefix-matched): `audio/*` + `video/*` + `image/*`. Document (explicit MIME): `text/html`, `application/xhtml+xml`, `application/pdf`, `text/markdown`, `text/x-markdown`. Common extensions:

- **Audio**: `.mp3` `.wav` `.m4a` `.aac` `.ogg` `.opus` `.flac`
- **Video**: `.mp4` `.mov` `.m4v` `.webm` `.mkv` `.avi`
- **Image**: `.jpg` `.jpeg` `.png` `.webp` `.gif` `.bmp` `.avif` `.svg`
- **Document**: `.html` `.htm` `.pdf` `.md` `.markdown`

Anything else returns `400 unsupported_asset_type`.

---

## Response — `200 OK`

### Multipart / base64 → `AssetResponse`

```json
{
  "object":       "asset",
  "url":          "https://widecast-assets.s3.us-west-1.amazonaws.com/assets/huubinhnguyen/4f1a3b9c8d2…e7.mp3",
  "content_type": "audio/mpeg",
  "size_bytes":   404123,
  "filename":     "voice_memo.mp3",
  "expires_at":   "2026-06-16T12:36:39Z",
  "ttl_hours":    24
}
```

### Presign → `AssetPresignResponse`

```json
{
  "object":           "asset_presign",
  "put_url":          "https://widecast-assets.s3.us-west-1.amazonaws.com/assets/huubinhnguyen/4f1a3b9c…e7.mp3?X-Amz-Algorithm=…&X-Amz-Signature=…",
  "get_url":          "https://widecast-assets.s3.us-west-1.amazonaws.com/assets/huubinhnguyen/4f1a3b9c…e7.mp3",
  "url":              "https://widecast-assets.s3.us-west-1.amazonaws.com/assets/huubinhnguyen/4f1a3b9c…e7.mp3",
  "key":              "assets/huubinhnguyen/4f1a3b9c…e7.mp3",
  "content_type":     "audio/mpeg",
  "filename":         "voice_memo.mp3",
  "headers_required": {},
  "max_bytes":        524288000,
  "put_expires_at":   "2026-06-16T13:36:39Z",
  "expires_at":       "2026-06-17T12:36:39Z",
  "ttl_hours":        24
}
```

Then PUT the bytes — no extra headers needed:

```bash
curl -sS -X PUT --upload-file ./voice_memo.mp3 \
  "https://widecast-assets.s3.us-west-1.amazonaws.com/assets/.../4f1a3b9c…e7.mp3?X-Amz-Algorithm=…"
```

Then call create_video with the `get_url`:

```bash
curl -sS -X POST "https://widecast.ai/app/dashboard/v1/create_video" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -H "Content-Type: application/json" \
  -d '{
        "source":            "audio_url",
        "audio_url":         "https://widecast-assets.s3.us-west-1.amazonaws.com/assets/.../4f1a3b9c…e7.mp3",
        "script_approved":   true,
        "production_mode":   "faceless",
        "output_type":       "scene"
      }'
```

### Error responses

| `error.code` | HTTP | When |
|---|---|---|
| `missing_field` | 400 | `file` (multipart), `filename` (any JSON), or `file_data` (base64 mode) is missing. |
| `invalid_content_type` | 400 | Request is neither `multipart/form-data` nor `application/json`. |
| `invalid_file_data` | 400 | `file_data` isn't valid base64 OR decodes to 0 bytes. |
| `asset_too_large` | 400 | File exceeds the **500 MB** server cap. |
| `unsupported_asset_type` | 400 | Content-Type isn't in the allow-list (`audio/*` / `video/*` / `image/*` / `text/html` / `application/pdf` / `text/markdown`) AND the filename extension is unknown. |
| `upload_failed` | 500 | The S3 upload (multipart / base64 path) failed. |
| `presign_failed` | 500 | Pre-signing the PUT URL (presign path) failed. |
| `missing_api_key` / `invalid_api_key` | 401 | Auth. |

---

## SDK examples

### Python

```python
from widecast import Widecast
import requests

client = Widecast()

# (a) Simple path — multipart, the SDK streams bytes through WideCast.
asset = client.upload_asset("/path/to/voice_memo.mp3", content_type="audio/mpeg")
print(asset["url"], "expires", asset["expires_at"])

# (b) Two-step path — pre-signed PUT (avoids proxying bytes; useful from
#     serverless / Lambda where you don't want to hold the body). No
#     extra headers needed — the signature only binds the host.
out = client.presign_asset("voice_memo.mp3", content_type="audio/mpeg")
with open("/path/to/voice_memo.mp3", "rb") as f:
    requests.put(out["put_url"], data=f).raise_for_status()

# Then create the video:
video = client.create_video(
    source="audio_url",
    audio_url=out["get_url"],
    faceless=True,
).wait()
print(video.review_url)
```

### TypeScript

```typescript
import Widecast from "@widecast/sdk";

const client = new Widecast();

// (a) Multipart upload
const asset = await client.upload_asset(fileBlob, {
  filename:     "voice_memo.mp3",
  content_type: "audio/mpeg",
});
console.log(asset.url);

// (b) Presign — bytes go to S3 directly. No extra headers needed.
const a = await client.presign_asset("voice_memo.mp3", { content_type: "audio/mpeg" });
await fetch(a.put_url, { method: "PUT", body: fileBlob });

const video = await client
  .create_video({ source: "audio_url", audio_url: a.get_url, faceless: true })
  .then(v => v.wait());
console.log(video.review_url);
```

### MCP

```jsonc
// Step 1 — mint URLs via the MCP tool. No bytes ride here.
{
  "name": "widecast_upload_asset",
  "arguments": {
    "filename":     "voice_memo.mp3",
    "content_type": "audio/mpeg"
  }
}
// → { object: "asset_presign", put_url, get_url, headers_required: {}, ... }

// Step 2 — shell out, push bytes straight to S3 (no extra headers needed)
// curl -X PUT --upload-file ./voice_memo.mp3 "<put_url>"

// Step 3 — call create_video with the get_url
{
  "name": "widecast_create_video",
  "arguments": {
    "source":            "audio_url",
    "audio_url":         "<get_url>",
    "script_approved":   true,
    "production_mode":   "faceless"
  }
}
```

---

## When to use which shape

| Caller | Use shape |
|---|---|
| SDK (Python / JS / TS) | **multipart** — bytes streamed straight through, no base64 inflation |
| `curl` / Postman / shell | **multipart** — `curl -F file=@...` |
| ChatGPT Custom GPT Action | **multipart** — Actions support `multipart/form-data` natively |
| MCP tool (Claude Desktop / Claude Code / Claude Cowork / any MCP client) | **JSON `mode:"presign"`** — bytes never ride through the JSON-RPC tool args; agent uses shell `curl --upload-file` after the mint |
| Serverless / edge SDK caller that shouldn't hold the body | **JSON `mode:"presign"`** + `PUT` from the user agent |
| Legacy caller with bytes already in base64 | **JSON `file_data`** — small files only (≤ ~25 MB practical) |

The server accepts all three and serves the matching response shape (`asset` vs `asset_presign`); pick whichever your runtime can do.
