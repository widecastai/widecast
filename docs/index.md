# WideCast Documentation

The complete reference for the WideCast.ai public API, SDKs, and integrations.

> Looking for a 30-second pitch? Head to the [WideCast homepage](widecast.html).

## Quickstart

```bash
# 1. Create from plain-text script
RESP=$(curl -sS -X POST "https://widecast.ai/app/dashboard2/v1/create_video" \
  -H "Content-Type: application/json" \
  -d '{
    "script_text": "You should let your teen get a driver's license at 16."
  }')
VID=$(echo "$RESP" | jq -r .id)

# 2. Poll until completed
INTERVAL=5
until [ "$STATE" = "completed" ] || [ "$STATE" = "failed" ]; do
  sleep $INTERVAL
  STATUS=$(curl -sS "https://widecast.ai/app/dashboard2/v1/status/$VID")
  STATE=$(echo "$STATUS" | jq -r .status)
  INTERVAL=$(( INTERVAL * 3 / 2 < 60 ? INTERVAL * 3 / 2 : 60 ))
done
echo "Review at: $(echo "$STATUS" | jq -r .result.review_url)"
```

```python
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME")
video = client.create_video(
    script_text="You should let your teen get a driver's license at 16."
).wait()                                      # auto-polls /v1/status with 5s→60s exp backoff
print(video.status, video.review_url)
```

```typescript
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME" });
const v = await client.create_video({
  script_text: "You should let your teen get a driver's license at 16.",
}).then(v => v.wait());
console.log(v.status, v.review_url);
```

## v0.1.0 endpoints

| Endpoint | Method | Purpose |
|---|---|---|
| [`/v1/create_video`](endpoints/create-video.html) | POST | Submit a finished script (`source=text`), an idea brief (`source=idea`), a blog/article (`source=blog`), or an existing video/audio by URL or upload (`source=video_url`/`video_file`/`audio_url`/`audio_file`) for AI sourcing |
| [`/v1/export_video`](endpoints/export-video.html) | POST | For `output_type=scene` videos, kick the final-MP4 renderer after review |
| [`/v1/edit_session`](endpoints/edit-session.html) | POST | (sync, free) Open/close the per-video edit session — `start`/`commit`/`abort`/`status`. Caches the video in memory so parallel `modify_scene` writes are conflict-free + reads are instant |
| [`/v1/modify_scene`](endpoints/modify-scene.html) | POST | (sync/async, free) Edit ONE scene — 12 branches: background media, Upload Overlay, Remotion object-layer rect (preferred), group rect, narrator/caption layout, `layout.batch`, Upload Voice/Narrator Video (async), A/B-roll switch, text, metadata |
| [`/v1/scene_geometry`](endpoints/scene-geometry.html) | POST | (sync, free) Data-only scene layout geometry — narrator/caption/Remotion object boxes in 280×498 preview coords, plus collisions + safe zones. Cheap; no screenshot |
| [`/v1/scene_inspector`](endpoints/scene-inspector.html) | POST | (sync, free) **Expensive last-resort** browser inspector — use AFTER `/v1/scene_geometry`. `screenshot_scene_280x498` has a server-fallback composite from thumbnails + overlay poster when no live browser |
| [`/v1/upload_asset`](endpoints/upload-asset.html) | POST | (sync, free) Upload an audio / video / image to WideCast's S3 bucket and get back a 24-hour public URL — use as `audio_url` / `video_url` on `/v1/create_video` |
| [`/v1/create_content`](endpoints/create-content.html) | POST | Generate written content — a blog or social post (Facebook/X/LinkedIn) from a URL, idea, or text |
| [`/v1/create_image`](endpoints/create-image.html) | POST | Generate 1-4 AI images from a text prompt — returns a numbered thumbnail set for the user to pick (1 credit/image) |
| [`/v1/search_broll`](endpoints/search-broll.html) | POST | (sync, free) Search stock B-roll — `kind=video` (Pexels/Pixabay/Shutterstock clips) or `kind=image` (Google real photos) — returns a numbered thumbnail list |
| [`/v1/collect_ideas`](endpoints/collect-ideas.html) | POST | (sync) Video ideas from a product/service description |
| [`/v1/publish`](endpoints/publish.html) | POST | Publish a video / blog / text to connected social platforms (returns request_ids → poll status) |
| [`/v1/notification/send`](endpoints/notification-send.html) | POST | (sync, free) Push a self-notify notification — email default + Telegram if connected. `subject` + `message` (+ optional photo/video URL) |
| [`/v1/client_link/send`](endpoints/client-link-send.html) | POST | (sync, free) Mint a no-login client "magic link" (`record` / `content_plan` / `setup` / `social_dashboard` / `publish_schedule`) and optionally notify the client via the account's Telegram/SMS/email channels — recipients resolved server-side, never supplied by the caller |
| [`/v1/videos`](endpoints/library.html) | GET | (read, free) List the account's recent videos |
| [`/v1/video_data`](endpoints/video-data.html) | POST | (sync, free) Read structured scene data (annotated segments, narrator, Remotion spec metadata) — **first step for data-first scene audit/edit**. Chain: video_data → scene_geometry → modify_scene |
| [`/v1/account`](endpoints/library.html) | GET | (read, free) Account profile + remaining credits |
| [`/v1/analytics`](endpoints/library.html) | GET | (read, free) Social analytics dashboard |
| [`/v1/roadmap`](endpoints/library.html) | GET | (read, free) Content roadmap |
| [`/v1/production_plan`](endpoints/library.html) | GET | (read, free) Weekly production plan |
| [`/v1/production_plan/add`](endpoints/production-plan-add.html) | POST | (sync, free) Queue a new idea/topic into the production plan |
| [`/v1/foundation_videos`](endpoints/library.html) | GET | (read, free) Browse the curated foundation-video template library |
| [`/v1/accounts`](endpoints/connections.html) | GET | (free) List connected social platforms |
| [`/v1/platform_settings`](endpoints/connections.html) | GET/POST | (free) Load / save per-platform publish settings |
| [`/v1/status/{id}`](endpoints/create-video.html) | GET | Universal poll endpoint for any async task |
| [Webhooks](endpoints/webhooks.html) | (out-of-band) | Pass `callback_url` in create_video — WideCast POSTs events to your URL instead of you polling |
| `/openapi.json` / `/openapi.yaml` | GET | This spec served from the host |

## Reference

- **Per-platform setup guides:** [Claude Web &amp; Desktop](claude.html) · [ChatGPT &amp; Codex](chatgpt.html) · [Gemini &amp; Antigravity](gemini.html) · [Grok](grok.html) — connect WideCast, then "make a video about [a real event]". The writing method (video / blog / social) ships as an MCP/Action tool (`getWritingSkill`) the model auto-fetches, so no file upload is required on platforms with tool support.
- **Writing skills (single source of truth):** MCP/Action surfaces fetch the same `SKILL.md` content on demand; plain HTTP agents can call `https://widecast.ai/app/dashboard2/v1/skills/writing?format=video|blog|social`; file-only/tool-less surfaces can download [`skills/video-script-writing.zip`](https://origin.widecast.ai/skills/video-script-writing.zip), [`skills/blog-writing.zip`](https://origin.widecast.ai/skills/blog-writing.zip), or [`skills/social-post-writing.zip`](https://origin.widecast.ai/skills/social-post-writing.zip).
- **Live playground:** [`playground.html`](playground.html) — submit + auto-poll + review-URL link in one click
- **OpenAPI 3.1 spec:** [`openapi.yaml`](openapi.yaml) (also at `https://widecast.ai/app/dashboard2/openapi.yaml`)
- **Python SDK:** [`widecast` on PyPI](https://pypi.org/project/widecast/)
- **JS/TS SDK:** [`@widecast/sdk` on npm](https://www.npmjs.com/package/@widecast/sdk)
- **MCP server (Claude / Cursor / Windsurf):** [`@widecast/mcp-server`](https://github.com/widecast) — tools `create_video` / `get_status` / `export_video` / `modify_scene`.
- **Authoring Skills:** `widecast/skills/` — `video-script-writing`, `blog-writing`, `social-post-writing` (best-practice guides the AI loads on demand).
- **LLM-friendly docs index:** [`llms.txt`](llms.txt)

## Conventions

- **ID format**: `widecast<alphanumeric>` (~20 chars). The internal server's new-script detection checks for the literal `"widecast"` substring — SDKs/clients must not strip it.
- API key prefixes: `wc_live_*`
- **Authentication**: send your key as `Authorization: Bearer wc_live_...`. When key enforcement is on, a missing/malformed/revoked key → **HTTP 401** with `error.type = "authentication_error"` and `error.code` = `missing_api_key` or `invalid_api_key`. (Enforcement is server-toggled; while it's off, the pilot accepts unauthenticated calls.)
- Object marker on every resource: `"object": "status"`, `"object": "list"`, etc.
- Status enum (locked): `pending | processing | completed | failed`
- Error codes (locked, v0.1.0): `account_expired | credit_exhausted | render_failed | unknown_error | scenes_not_ready | export_failed | script_too_short | script_too_long | invalid_output_type | invalid_source | idea_too_short | missing_idea_text | blog_too_short | missing_blog_text | missing_video_url | missing_audio_url | missing_media_file | unsupported_media_url | media_too_long | file_too_large | missing_api_key | invalid_api_key | invalid_language | invalid_video_length | invalid_research_enabled | free_tier_limit_exceeded | telegram_not_connected | telegram_send_failed | invalid_parse_mode | conflicting_media | message_too_long | rate_limited`
- Input bounds (locked): `script_text` (source=text) is **80–500 words** (~20s–2 min, used verbatim). `idea_text` (source=idea) is **5–1000 words** and `blog_text` (source=blog) is **30–3000 words** (both interpretive — over-max auto-truncated, not rejected). Media sources (`video_*`/`audio_*`) have a **5-minute duration cap** (`media_too_long`, all media) and uploads a **100 MB size cap** (`file_too_large`). SDKs export `SCRIPT_MIN_WORDS` / `SCRIPT_MAX_WORDS` / `IDEA_MIN_WORDS` / `IDEA_MAX_WORDS` / `BLOG_MIN_WORDS` / `BLOG_MAX_WORDS` / `MEDIA_MAX_DURATION_SECONDS` / `MEDIA_MAX_FILE_BYTES` constants.
- **Inline media in `script_text`** (source=text): embed a direct image/video file URL (`.png/.jpg/…` or `.mp4/.mov/…`) next to the line it should illustrate — WideCast strips it from the narration and uses it as that scene's visual instead of auto-sourced B-roll. Page links (YouTube/TikTok watch URLs) aren't inlined — use `source=video_url` for a whole clip. See [Create-video → Inline images & video](endpoints/create-video.html).
- Enums (locked v0.1.0): `SOURCES` (`text`, `idea`, `blog`, `video_url`, `video_file`, `audio_url`, `audio_file`), `OUTPUT_TYPES` (`text`, `scene`, `video`), `LANGUAGES` (`English`, `Vietnamese`), `VIDEO_LENGTHS` (`short`, `normal`). For media sources `output_type="text"` = Remake (transcript only).
- **Field-requirement parity (A38)**: every field constraint surfaces in 5 places — OpenAPI spec, SDK constants/types, this docs site's endpoint page, the playground UI (YAML + JS), and server enforcement (with a locked `error.code`). Adding an endpoint without all five = drift. `build.py` validates the YAML↔JS half automatically.
- All timestamps are ISO 8601 UTC strings (e.g. `2026-05-19T17:30:00Z`)
- Every response carries `X-Request-Id` — include it in any support ticket
