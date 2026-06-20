# Create a video — `POST /v1/create_video` + `GET /v1/status/{id}`

Turn a **plain-text script**, a **short idea**, a **blog/article**, or an **existing video/audio** (by URL or upload) into AI-generated scenes + audio. The pilot exposes three endpoints that work together:

1. **`POST /v1/create_video`** — submit `script_text` (source=text, default), `idea_text` (source=idea), `blog_text` (source=blog), **or** a media URL / file (`source=video_url|video_file|audio_url|audio_file`). Returns a `widecast*` id and initial `status: "processing"`. For files attached in chat by AI agents, upload them first via [`POST /v1/upload_asset`](upload-asset.md) and pass the returned URL here.
2. **`GET /v1/status/{id}`** — poll until `status` is `completed` (or `failed`).
3. **`POST /v1/export_video`** — for `output_type=scene` videos, kick the final-MP4 renderer after review. See [export-video.md](export-video.md).

### Pick a `source` — what kind of input?

| `source` | What you provide | When |
|---|---|---|
| `text` (default — backward-compat) | `script_text` (80-500 words, used **verbatim** by the narrator) | You've already written the script |
| `idea` | `idea_text` (5-1000 words, longer auto-truncated) + optional `language` / `video_length` / `research_enabled` | You want the AI to write the script from a brief |
| `blog` | `blog_text` (30-3000 words, longer auto-truncated) + optional `language` / `video_length` / `research_enabled` | You have a blog post / article and want it turned into a video script |
| `video_url` | `video_url` — any public http(s) URL (direct file link OR YouTube / TikTok / Facebook), ≤2 min | **Auto-Edit** — the footage itself becomes the B-roll |
| `video_file` | a video file (multipart upload) | Auto-Edit, but you upload the file instead of linking it |
| `audio_url` | `audio_url` — any public http(s) URL (direct file link OR YouTube / TikTok / Facebook), ≤2 min | **Audio-to-Video** — the audio becomes the narration, the AI builds matching scenes. **The natural path for an AI agent forwarding a chat-attached voice memo:** drop it on a public host (transfer.sh, file.io, S3 / R2, your CDN, …) and pass that URL. |
| `audio_file` | an audio file (multipart upload) | Audio-to-Video, but you upload the file |

For files the AI agent received in chat (audio voice memos / short video clips / reference images), upload via [`POST /v1/upload_asset`](upload-asset.md) (or the MCP `widecast_upload_asset` tool) first — the response carries a 24-hour S3 URL. Pass that URL here as `audio_url` / `video_url`, or use it as an inline `![](url)` in `script_text`.

`idea` and `blog` are **generative** sources: the server runs `ai_enhance_script` (input → narration) and then continues into the same scene-sourcing pipeline as `source=text`.

`video_*` and `audio_*` are **media-ingest** sources (the script already lives inside the media): the server downloads (URL) or saves (upload) the file under `/mnt/efs/transcoder`, then runs the existing footage / audio pipeline. For these, `output_type="text"` = **Remake** (extract the spoken transcript only → editable script); `scene`/`video` build the full video. `language` / `video_length` / `research_enabled` do **not** apply (the media dictates the script).

### Pick an `output_type` — how far down the pipeline (pipeline depth)

| `output_type` | Pipeline stops at… | Completion gate | `result` fields | Valid for |
|---|---|---|---|---|
| `text` | script text ready | `generated_video_script` has segments (Phase 1 done) | `review_url` | generative sources + media sources (`source != text`); for media = **Remake** (transcript only) |
| `scene` (default) | scenes-ready-for-review | topic/footage row step=5 + script segments | `review_url` | all sources |
| `video` | final MP4 rendered | queue_row.video_url populated | `review_url` + `video_url` | all sources |

The two axes combine — every valid `source` × `output_type` pair works, **except `source=text` + `output_type=text`** (rejected — you already supplied the script).

When `status == "completed"`:
- `result.review_url` is the URL where the user reviews the result. The UI auto-detects the data state: for `output_type=text` it opens the **Script Editor** (narration only, no scenes yet); for `output_type=scene` it opens the **Scene Editor** (scenes + audio). Append **`&readonly=true`** for a public, sign-in-free, **iframe-embeddable** read-only player (e.g. `…?topic_id=<id>&readonly=true`) — embed that variant to show the result inline (in a chat/artifact); the plain URL opens the editor for a signed-in user.
- `result.video_url` is the direct MP4 URL — present only for `output_type=video` (or after a successful `/v1/export_video`).

> **Why `text` is invalid only for `source=text`**: `output_type` is pipeline depth. `text` means "stop after the source→script-text phase". That phase exists for every source EXCEPT `text` — generative sources (idea/blog) generate the script, media sources (video/audio) extract it. For `source=text` the caller already provided the script, so `text` output would just echo the input.

### `faceless` — all-B-roll (no narrator)

By default scenes mix **A-roll** (narrator) and **B-roll** (stock video / AI image). Set **`faceless: true`** to make **every scene B-roll with no narrator anywhere** — a "faceless" video. It's orthogonal to `output_type` (controls A/B-roll, not pipeline depth) and valid with `output_type` `scene`/`video` for the script-based sources (`text`/`idea`/`blog`) AND for `source=audio_url` — the script lives in the user's audio but the visuals must still be generated, so the same toggle applies. Combining it with `output_type=text` (no scenes) or a video source (`video_url`/`video_file` — the footage IS the visuals) returns `invalid_faceless` (400). Default `false` leaves the normal A/B mix unchanged.

### Field bounds (LOCKED — A38 parity)

Used VERBATIM by the narrator (source=text) or interpreted by the AI (source=idea / blog). All bounds are LOCKED — the SDKs export them as named constants you should refer to programmatically.

| Field | When required | Min | Max | Over-max behavior | SDK constant |
|---|---|---|---|---|---|
| `script_text` | `source=text` | 80 words (~20s) | 500 words (~2 min) | Reject `script_too_long` | `SCRIPT_MIN_WORDS` / `SCRIPT_MAX_WORDS` |
| `idea_text` | `source=idea` | 5 words | 1000 words | **Auto-truncate** at whitespace, surfaced in `details.input_truncated_from` | `IDEA_MIN_WORDS` / `IDEA_MAX_WORDS` |
| `blog_text` | `source=blog` | 30 words | 3000 words | **Auto-truncate** at whitespace, surfaced in `details.input_truncated_from` | `BLOG_MIN_WORDS` / `BLOG_MAX_WORDS` |
| `video_url` / `audio_url` / `video_file` / `audio_file` | the matching media source | — | **5 minutes** (all media) + **100 MB** (uploads only) | Reject `media_too_long` / `file_too_large` | `MEDIA_MAX_DURATION_SECONDS` / `MEDIA_MAX_FILE_BYTES` |

Word count = whitespace split (`len(text.split())`) — works for English + Vietnamese. Media sources have no word bound — instead a **5-minute duration cap** (`media_too_long`, all media incl. URLs) and, for **uploaded files only**, a **100 MB size cap** (`file_too_large`). SDKs export `MEDIA_MAX_DURATION_SECONDS` (300) / `MEDIA_MAX_FILE_BYTES` (100 MB); file size is pre-validated client-side, duration is server-enforced.

### Inline images & video in your script (`source=text`)

Want a specific shot to appear at a specific moment? Drop a **direct image or video URL** straight into `script_text`, right after (or before) the sentence it should illustrate, in either of two equivalent forms. WideCast:

1. **strips both forms from the spoken narration** (the narrator never reads them aloud), and
2. **uses that image/video as the visual for the matching scene**, instead of the auto-sourced B-roll it would otherwise pick.

**Recommended — markdown image syntax `![alt](url)`** (chat hosts like Claude / ChatGPT / Grok / Gemini render the picture inline next to the narration, so the end-user can visually approve each scene before the script is submitted; the alt text doubles as the strongest scene anchor):

```json
{
  "source": "text",
  "script_text": "Our new espresso machine pulls a perfect shot every time. ![Stainless-steel espresso machine](https://cdn.example.com/machine.jpg) The secret is precise temperature control, which you can see in action here. ![Slow extraction in close-up](https://cdn.example.com/brewing.mp4) Order yours today at example.com."
}
```

**Backward-compat — raw URL on its own line** (still works, no chat preview):

```json
{
  "source": "text",
  "script_text": "Our new espresso machine pulls a perfect shot every time. https://cdn.example.com/machine.jpg The secret is precise temperature control, which you can see in action here. https://cdn.example.com/brewing.mp4 Order yours today at example.com."
}
```

You can mix forms freely in the same script.

- **Supported** — *direct file links* ending in an image extension (`.png` `.jpg` `.jpeg` `.gif` `.webp` `.bmp` `.avif` `.svg`) or a video extension (`.mp4` `.webm` `.mov` `.m4v` `.avi`), optionally with a `?query` string.
- **Not supported as inline assets** — page links such as `https://youtube.com/watch?v=…` or a TikTok URL (they have no media extension). To turn a *whole* clip into a video, use `source=video_url` / `audio_url` instead. For files the AI agent received in chat, upload them via [`POST /v1/upload_asset`](upload-asset.md) and reuse the returned URL.
- **Matching** — for markdown form, the alt text IS the anchor (model-provided scene description). For raw URLs, WideCast uses the ~6 words on either side. Type (image vs video) is auto-detected from the extension.
- Multiple URLs are fine; scenes without a URL still get automatic B-roll.

This only applies to `source=text` (your verbatim script). For `idea`/`blog` the script is AI-written, and for media sources the visuals come from the clip itself.

### Enums (LOCKED v0.1.0)

| Field | Values | Default | SDK constant |
|---|---|---|---|
| `source` | `text`, `idea`, `blog`, `video_url`, `video_file`, `audio_url`, `audio_file` | `text` | `SOURCES` |
| `output_type` | `text` (any source except `text`), `scene`, `video` | `scene` | `OUTPUT_TYPES` |
| `language` (idea / blog) | `English`, `Vietnamese` | `English` | `LANGUAGES` |
| `video_length` (idea / blog) | `short` (~90s), `normal` (~3 min cap) | `short` | `VIDEO_LENGTHS` |

> **Convention (A38)**: every field constraint surfaces in **5 places** — this docs page, the OpenAPI spec, SDK constants/types, the playground UI, and server enforcement (with a LOCKED `error.code`). See HANDOFF §6 (A38) before adding a new field.

---

## POST `/v1/create_video`

**source=text** (default — backward-compat):

```http
POST /v1/create_video
Authorization: Bearer wc_live_REPLACE_ME   # required when key enforcement is on (401 otherwise)
Content-Type: application/json
Idempotency-Key: <uuid>                    # optional; read but not enforced in pilot

{
  "source":          "text",                      // optional, default "text"
  "script_text":     "Paste your script here (80–500 words).",
  "output_type":     "scene",                     // optional, "scene" (default) or "video"
  "wait_for_render": false,                       // optional, default false
  "callback_url":    "https://...",               // optional (HMAC-SHA256-signed webhook)
  "metadata":        { "external_id": "..." }     // optional, echoed back
}
```

**source=idea**:

```http
POST /v1/create_video
{
  "source":           "idea",
  "idea_text":        "Describe what the video should be about (5–1000 words; longer auto-truncated).",
  "language":         "English",                   // optional, default "English"; English|Vietnamese
  "video_length":     "short",                     // optional, default "short"; short|normal
  "research_enabled": true,                        // optional, default true
  "output_type":      "scene",                     // optional, default "scene"
  "wait_for_render":  false,
  "callback_url":     "https://...",
  "metadata":         {}
}
```

**source=blog**:

```http
POST /v1/create_video
{
  "source":           "blog",
  "blog_text":        "Paste your blog post or article here (30–3000 words; longer auto-truncated).",
  "language":         "English",                   // optional, default "English"; English|Vietnamese
  "video_length":     "short",                     // optional, default "short"; short|normal
  "research_enabled": true,                        // optional, default true
  "output_type":      "text",                      // optional, default "scene"; "text" stops at the editable script
  "wait_for_render":  false,
  "callback_url":     "https://...",
  "metadata":         {}
}
```

**source=video_url / audio_url** (media by URL — pure JSON):

```http
POST /v1/create_video
{
  "source":      "video_url",                   // or "audio_url"
  "video_url":   "https://www.youtube.com/watch?v=...",   // or "audio_url": "..."
  "output_type": "scene",                        // "text" = Remake (transcript only) | "scene" | "video"
  "callback_url":"https://...",
  "metadata":    {}
}
```

**source=video_file / audio_file** (upload — `multipart/form-data`, mirrors the UI):

```bash
curl -X POST ".../v1/create_video" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -F "source=video_file" \
  -F "output_type=scene" \
  -F "video_file=@/path/to/clip.mp4"        # or -F "audio_file=@ep.mp3" with source=audio_file
```

The SDKs wrap this: `client.create_video(source="video_file", video_file=open("clip.mp4","rb"))` (Python) / `client.create_video({ source: "video_file", video_file: blob })` (TS).

**AI agents — uploading a file attached in chat:** call [`POST /v1/upload_asset`](upload-asset.md) (or the MCP `widecast_upload_asset` tool) first. The response carries a public S3 URL (24-hour TTL); pass that URL here as `audio_url` / `video_url`, or use it as an inline `![](url)` in `script_text`. The widecast-assets bucket is the canonical upload path — no need to base64 anything or shop for a third-party host.

### Field reference

| Field | Type | Required | Description |
|---|---|---|---|
| `source` | string | no | `"text"` (default), `"idea"`, `"blog"`, `"video_url"`, `"video_file"`, `"audio_url"`, `"audio_file"`. Discriminates the input flow. See SDK constant `SOURCES`. |
| `script_text` | string | when `source=text` | Plain narration — used **verbatim**. Must be **80–500 words** (~20s–2 min). SDK constants: `SCRIPT_MIN_WORDS` / `SCRIPT_MAX_WORDS`. May include **inline image/video URLs** (direct file links) to override B-roll for a scene — see [Inline images & video in your script](#inline-images--video-in-your-script-sourcetext). |
| `idea_text` | string | when `source=idea` | Short brief — AI writes the narration. **5–1000 words**; over-max is auto-truncated at whitespace, NOT rejected. Original word count surfaces in `details.input_truncated_from`. SDK constants: `IDEA_MIN_WORDS` / `IDEA_MAX_WORDS`. |
| `blog_text` | string | when `source=blog` | Blog post / article — AI condenses it into the narration. **30–3000 words**; over-max is auto-truncated at whitespace, NOT rejected. Original word count surfaces in `details.input_truncated_from`. SDK constants: `BLOG_MIN_WORDS` / `BLOG_MAX_WORDS`. |
| `video_url` / `audio_url` | string (url) | when `source=video_url` / `audio_url` | **Any public http(s) URL** (≤2 min): a direct file link (S3, Cloudflare R2, transfer.sh, file.io, your CDN, …) OR a YouTube / TikTok / Facebook page URL. `video_url` → footage becomes B-roll (Auto-Edit); `audio_url` → audio becomes narration (Audio-to-Video). Over the cap → `media_too_long`. Loopback / private-network / link-local hosts (`localhost`, `10.x`, `192.168.x`, `169.254.x`, `.local`, …) are rejected as `unsupported_media_url`. |
| `video_file` / `audio_file` | file | when `source=video_file` / `audio_file` | The media file, sent as **multipart/form-data** (the request must be multipart). Caps: **≤100 MB** (`file_too_large`, pre-validated client-side) and **≤2 min** (`media_too_long`). |
| `language` | string | no (idea / blog) | Narration language. Default `"English"`. v0.1.0 enum: `English`, `Vietnamese`. SDK constant `LANGUAGES`. Ignored when `source=text`. |
| `video_length` | string | no (idea / blog) | `"short"` (~90s, content_type 9, default) or `"normal"` (~3 min cap, content_type 10). SDK constant `VIDEO_LENGTHS`. Ignored when `source=text`. |
| `research_enabled` | bool | no (idea / blog) | Default `true`. Disable only if your input is self-contained and doesn't need AI fact-checking. Ignored when `source=text`. |
| `output_type` | string | no | Pipeline depth. `"text"` stops after the source→script phase (any source except `text` — review_url opens Script Editor; for media = Remake/transcript). `"scene"` (default) stops at scenes-ready-for-review. `"video"` auto-chains into the renderer so the final MP4 is produced — no manual `/v1/export_video` call needed. |
| `faceless` | bool | no | Default `false`. When `true`, **every scene is B-roll** (stock video / AI image) with **no narrator A-roll** anywhere — a "faceless" video. Orthogonal to `output_type`. Valid with `output_type` `scene`/`video` for `text`/`idea`/`blog` AND for `source=audio_url` — same A/B-roll toggle since the audio is the narration but the visuals are generated. Rejected with 400 `invalid_faceless` when `output_type=text` (no scenes) or for video sources (footage IS the visuals). SDK constant `FACELESS_SOURCES`. |
| `media_pool` | array[string] | no | Direct image/video file URLs **not** placed inline. WideCast downloads each (+thumbnail) and adds them to the **first scene's** media library, so the scene editor lists them and the user can drop any into any scene. Use for images you can't confidently match to a beat (inline the ones you can). Best-effort: applies on the scene-producing path (`text`/`idea`/`blog`, `output_type` `scene`/`video`); ignored for `output_type=text` / media sources. Direct file links only. |
| `wait_for_render` | bool | no | If `true`, block up to **60s** waiting for completion. If exceeded, return in-flight state and poll. |
| `callback_url` | string (url) | no | HTTPS URL for completion webhook (HMAC-SHA256 signed). Fires `video.processing` immediately and one terminal event (`video.completed` or `video.failed`). For `output_type=video`, `video.completed` fires only when the final MP4 is ready. |
| `metadata` | object | no | Up to 16 keys, 500 chars each. Echoed back on `/v1/status`. |

### Response — `202 Accepted` (default async path)

```json
{
  "object":   "status",
  "id":       "widecast7c0d4f8a9b1e2d3f",
  "type":     "video",
  "status":   "processing",
  "stage":    "queued",
  "progress":  0.05,
  "result":    null,
  "error":     null,
  "callback_url": null,
  "metadata":  { "external_id": "..." },
  "usage":     null,
  "links":    { "self": "/v1/status/widecast7c0d4f8a9b1e2d3f" },
  "meta":     { "request_id": "req_...", "widecast_version": "0.1.0" }
}
```

---

## GET `/v1/status/{id}`

Universal status poll. v0.1.0 supports only the `widecast*` ids returned by `/v1/create_video`.

```http
GET /v1/status/widecast7c0d4f8a9b1e2d3f
Authorization: Bearer wc_live_REPLACE_ME
```

### Response (`completed` — `output_type: scene`)

```json
{
  "object":   "status",
  "id":       "widecast7c0d4f8a9b1e2d3f",
  "topic_id": "widecast7c0d4f8a9b1e2d3f",
  "type":     "video",
  "status":   "completed",
  "stage":    "scenes_ready_for_review",
  "progress": 1.0,
  "details": {
    "step":       5,
    "status":     "Completed",
    "notes":      "",
    "updated_at": "2026-05-20T12:34:56Z"
  },
  "result": {
    "review_url": "https://widecast.ai/#scene_editor?topic_id=widecast7c0d4f8a9b1e2d3f"
  },
  "error":         null,
  "metadata":      {},
  "usage":         null,
  "links":        { "self": "/v1/status/widecast7c0d4f8a9b1e2d3f" },
  "meta":         { "request_id": "req_...", "widecast_version": "0.1.0" }
}
```

### Response (`completed` — `output_type: video`)

```json
{
  "object":   "status",
  "id":       "widecast7c0d4f8a9b1e2d3f",
  "type":     "video",
  "status":   "completed",
  "stage":    "video_rendered",
  "progress": 1.0,
  "result": {
    "review_url": "https://widecast.ai/#scene_editor?topic_id=widecast7c0d4f8a9b1e2d3f",
    "video_url":  "https://widecast.ai/exports/huubinhnguyen/widecast7c0d4f8a9b1e2d3f/final.mp4"
  },
  ...
}
```

For `output_type=video`, the completion gate moves from "scenes ready" to
"final MP4 rendered" — clients see `stage` cycle through `step_0` →
`scenes_ready_for_review` → `rendering_video` → `video_rendered`. The
terminal `video.completed` webhook fires only when the MP4 is ready.

`result` is intentionally minimal — only the user-facing `review_url` (+ `video_url` when applicable). The rendered video script (with `segments[]`) is NOT inlined to keep status responses cheap. A future `GET /v1/videos/{id}/script` endpoint will serve it explicitly when needed.

### `details` — raw worker state (⚠ name clash inside)

For fine-grained progress visibility, every status response (except `pending` race window) includes a `details` sub-object surfacing the raw legacy worker fields:

| Field | Type | Notes |
|---|---|---|
| `details.step` | integer | Legacy `step` (0 throughout abroll; 0→2→5 during render pipeline) |
| `details.status` | string | ⚠ Free-form legacy status string. **Distinct from the top-level `status` enum** — `details.status` can be `"Completed"`, `"Avatar videos downloaded"`, `"Gen widecast media"`, `""`, etc. Branch logic on the top-level value; treat `details.status` as a human/debug hint. |
| `details.notes` | string | Free-form note (error message, transcoder assignment, etc.) |
| `details.updated_at` | ISO 8601 | When the worker last touched the row |

During the `pending` race window (no topic row yet), `details` is `null`.

### Response (`failed`)

```json
{
  "status":  "failed",
  "stage":   "step_3",
  "progress": 0.84,
  "result":   null,
  "error": {
    "code":    "credit_exhausted",
    "message": "You don't have enough credits to use this feature. Please consider upgrading your package."
  },
  ...
}
```

### Status enum (LOCKED)

| `status` | Meaning |
|---|---|
| `pending`    | id was just issued (last 5s), worker still spinning up. **No 404 during this window** — the server tracks issued ids in memory. |
| `processing` | The worker is running. Triggered by **any** signal of activity: any row in `topics_table` / `video_queue_table`, OR the id was issued >5s ago (abroll worker writes silently to ES, so we treat "spawned by us + still within grace" as processing). |
| `completed`  | Gate depends on `output_type`. **text:** `generated_video_script` has segments (Phase 1 done) → `stage=script_ready_for_review`, `result.review_url`. **scene:** topic_row step=5 + `status_note="Completed"` + script segments → `stage=scenes_ready_for_review`, `result.review_url`. **video:** queue_row `video_url` non-empty → `stage=video_rendered`, `result.review_url` + `result.video_url`. |
| `failed`     | Detected via multi-layer: `status==="Error"` / contains "fail"/"error", or `notes` matches error patterns. `error.code` + `error.message` populated. |

The server mirrors the legacy `/checkProgress` logic — it queries **both** `video_queue_table` (which has progressive step/status updates from the render pipeline) and `topics_table` (which holds the final scenes-ready state). The richer of the two drives `details`; the topic-row state drives completion gating.

### Progress mapping

| Stage | `progress` | Source |
|---|---|---|
| pending (no row, age <5s)   | 0.05 | issued-ids cache |
| processing (silent worker)  | 0.30 | issued-ids cache, age 5s–10min |
| processing (row, default)   | 0.30 | row exists, no signals |
| processing (status non-empty) | 0.50 | worker touched the row |
| processing (script ready)   | 0.80 | rendered script with segments present |
| processing (step=2)         | 0.70 | queue-row mid-pipeline |
| processing (step=5 not done) | 0.95 | queue-row final, awaiting Completed flag |
| completed                   | 1.00 | scenes ready for review |

### Error codes (LOCKED, v0.1.0)

#### Worker-detected (surface in `result.error.code` when `status === "failed"`)

| `error.code` | Trigger pattern in `notes`/legacy `status` |
|---|---|
| `account_expired` | "your account expired", "account has expired", "please renew or upgrade", "subscription expired" |
| `credit_exhausted` | "don't have enough credits", "upgrade your package", "credit depleted", "quota exceeded", "no_credit" |
| `render_failed` | Generic — `status` contains "Fail"/"Error" but no pattern matched |
| `unknown_error` | Error detected but unclassifiable |

#### Request-validation + auth (surface as HTTP 400 / 401 / 409 error envelope)

| `error.code` | HTTP | When |
|---|---|---|
| `script_too_short` | 400 | `script_text` is under 80 words (source=text). |
| `script_too_long` | 400 | `script_text` is over 500 words (source=text). |
| `idea_too_short` | 400 | `idea_text` is under 5 words (source=idea). NOTE: no `idea_too_long` — over-max is auto-truncated, not rejected. |
| `missing_idea_text` | 400 | `source=idea` but `idea_text` is missing/empty. |
| `blog_too_short` | 400 | `blog_text` is under 30 words (source=blog). NOTE: no `blog_too_long` — over-max is auto-truncated, not rejected. |
| `missing_blog_text` | 400 | `source=blog` but `blog_text` is missing/empty. |
| `missing_video_url` | 400 | `source=video_url` but `video_url` is missing/empty. |
| `missing_audio_url` | 400 | `source=audio_url` but `audio_url` is missing/empty. |
| `missing_media_file` | 400 | `source=video_file`/`audio_file` but no file part was sent (must be multipart/form-data). |
| `unsupported_media_url` | 400 | The media URL isn't an http(s) URL, OR the host is loopback / private / link-local (`localhost`, `10.x`, `172.16-31.x`, `192.168.x`, `169.254.x`, `.local`, `.internal`, IPv6 link-local, …), OR the underlying downloader failed to fetch it. Upload to a public location and pass that URL. |
| `media_too_long` | 400 | The media exceeds the 2-minute duration cap (all media — URL, upload, or base64). |
| `file_too_large` | 400 | An uploaded `video_file` / `audio_file` exceeds 100 MB (uploads only; pre-validated client-side by the SDKs too). |
| `invalid_source` | 400 | `source` is not one of `text`, `idea`, `blog`, `video_url`, `video_file`, `audio_url`, `audio_file`. |
| `invalid_output_type` | 400 | `output_type` not in `text`/`scene`/`video`, OR `output_type=text` combined with `source=text` (text output needs a generative source). |
| `invalid_language` | 400 | `language` not in `LANGUAGES` (source=idea). |
| `invalid_video_length` | 400 | `video_length` not in `VIDEO_LENGTHS` (source=idea). |
| `invalid_research_enabled` | 400 | `research_enabled` is not a boolean (source=idea). |
| `invalid_faceless` | 400 | `faceless` is not a boolean, OR `faceless=true` combined with `output_type=text` (no scenes) or a video source (`video_url`/`video_file` — the footage already supplies the visuals). `source=audio_url` accepts `faceless` — the script comes from the user's audio but the visuals are generated. |
| `missing_api_key` | 401 | API-key enforcement is on but no `Authorization: Bearer wc_live_...` header was sent. `error.type = authentication_error`. |
| `invalid_api_key` | 401 | The API key is malformed, unknown, or revoked. `error.type = authentication_error`. |
| `scenes_not_ready` | 409 | `/v1/export_video` called before scenes are ready. |
| `export_failed` | 500 | Renderer enqueue failed (server-side). |

`error.message` echoes the legacy notes verbatim so users see the same wording across surfaces.

### Polling cadence (recommended)

**Fixed 5 seconds.** The SDKs' `video.wait()` defaults to a constant 5s interval (no exponential backoff). If you want backoff for very long polls, override `max_interval` / `backoff_multiplier` on `wait()`.

---

## Try it

<!-- widecast-playground:create-video -->

The playground submits your script text, then **auto-polls** `/v1/status/{id}` until the video is `completed` (or `failed`), then renders the review URL.

---

## SDK examples

Four canonical flows, one method per language. The matrix is `source` × `output_type` — each combination is a valid call.

### Python

```python
from widecast import Widecast

client = Widecast()  # reads WIDECAST_API_KEY env var

# (1) Script → scenes (review-first)  — default
video = client.create_video(
    script_text=open("my_script.txt").read(),   # 80–500 words
).wait()
print("Review at:", video.review_url)

# (2) Script → full MP4
video = client.create_video(
    script_text=open("my_script.txt").read(),
    output_type="video",
).wait(timeout=900)
print("MP4:", video.video_url)

# (3) Idea → scenes (AI writes the script first)
video = client.create_video(
    source="idea",
    idea_text="Why teens should get their driver's license at 16, not 18.",
    language="English",                  # default
    video_length="short",                # default ~90s
).wait(timeout=900)
print("Review at:", video.review_url)

# (4) Idea → full MP4 (Spanish narration, longer) — language="Spanish"
# tells WideCast to write the narration in Spanish even if the brief is in English.
video = client.create_video(
    source="idea",
    idea_text="Why parents should let their teen learn to drive at 16.",
    language="Spanish",
    video_length="normal",               # cap ~3 min
    research_enabled=True,               # default — explicit for clarity
    output_type="video",
).wait(timeout=900)
print("MP4:", video.video_url)
```

### TypeScript

```typescript
import Widecast from "@widecast/sdk";

const client = new Widecast();

// (1) Script → scenes
let v = await client.create_video({ script_text: scriptText }).then(v => v.wait());
console.log("Review:", v.review_url);

// (2) Script → MP4
v = await client.create_video({
  script_text: scriptText,
  output_type: "video",
}).then(v => v.wait({ timeoutMs: 900_000 }));
console.log("MP4:", v.video_url);

// (3) Idea → scenes
v = await client.create_video({
  source: "idea",
  idea_text: "Why teens should get their license at 16, not 18.",
}).then(v => v.wait({ timeoutMs: 900_000 }));
console.log("Review:", v.review_url);

// (4) Idea → MP4 (Spanish narration, normal length)
v = await client.create_video({
  source: "idea",
  idea_text: "Why parents should let their teen learn to drive at 16.",
  language: "Spanish",
  video_length: "normal",
  output_type: "video",
}).then(v => v.wait({ timeoutMs: 900_000 }));
console.log("MP4:", v.video_url);
```

### Detecting auto-truncation (generative sources over their ceiling)

If you submit an over-long generative input (`idea_text` > 1000 words, or `blog_text` > 3000 words), the server trims it at the ceiling. The original count surfaces on `/v1/status` under one shared key, `details.input_truncated_from` (regardless of source):

```python
status = client.get_status(video_id)
if status.details and status.details.get("input_truncated_from"):
    print(f"Server trimmed your {status.details['input_truncated_from']}-word input.")
```

### Manual polling (curl)

```bash
VID=$(curl -sS -X POST ".../v1/create_video" \
  -H "Content-Type: application/json" \
  -d '{"script_text":"You should let your teen get a driver'"'"'s license at 16."}' \
  | jq -r .id)

INTERVAL=5
until [ "$STATE" = "completed" ] || [ "$STATE" = "failed" ]; do
  sleep $INTERVAL
  RESP=$(curl -sS ".../v1/status/$VID")
  STATE=$(echo "$RESP" | jq -r .status)
  INTERVAL=$(( INTERVAL * 3 / 2 < 60 ? INTERVAL * 3 / 2 : 60 ))
done
echo "Review: $(echo "$RESP" | jq -r .result.review_url)"
```

---

## Top-level errors (request-level)

| `code` | HTTP | Reason |
|---|---|---|
| `invalid_json` | 400 | Body is not valid JSON. |
| `missing_field` | 400 | `script_text` field is missing or empty. |
| `spawn_failed` | 500 | Failed to start the background worker. |
| `invalid_id` (status) | 400 | id doesn't match `widecast<alphanumeric>` pattern. |
| `video_not_found` (status) | 404 | No video with this id exists. |
| `openapi_load_failed` (spec) | 500 | Server couldn't read its own OpenAPI spec on disk. |

Every error response includes `error.request_id` — include it in any support ticket.
