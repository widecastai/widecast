# Create AI image — `POST /v1/create_image`

**Synchronous.** Generates 1-4 AI images from a text prompt. **Charges 1 credit per image generated** (`count=4` → 4 credits). Same engine the dashboard's Gen-AI tab uses (broll.js).

> **Scope — modify_scene workflow ONLY, NOT for new-video creation.** Use this to swap or replace ONE scene's media on an **existing** video (the picked image feeds into [`/v1/modify_scene`](modify-scene.md) `field_name="mediaUrl"`). When you author a NEW script for [`/v1/create_video`](create-video.md), do your own research and embed real verified URLs inline as `![alt](url)` per the writing-skill 7-step method — **do not** pre-generate images here just to splice them into a fresh script (wastes credits + defeats the inline-URL discipline). Natural sequence: `/v1/create_video` → user reviews scenes → user asks to swap scene N → `/v1/create_image` → user picks → `/v1/modify_scene`.

> **Agent pre-call etiquette.** This is the only synchronous paid call in the toolset — the user must know the cost before you spend it. Surface a one-line notice in the user's language before calling: `"Heads up: this will use 1 credit (each image = 1 credit)."` for `count=1`, or `"Heads up: this will use N credits — N images at 1 credit each."` for `count>=2`. For `count>=2`, require an explicit confirmation (`"Generate N variations for N credits — confirm?"`) before calling. Never silently spend credits.

> **Agent post-call rendering — pick the path by `count`. ⚠ Most AI-agent runtimes (Claude included) CANNOT render an external `https://…` URL inline in chat** — pasting raw URLs ≠ showing pictures. Two safe patterns + one ban-risk anti-pattern:
>
> **(A) `count=1` → download locally + attach inline.** Fetch the single `images[0].url` via your built-in download/save tool, then attach it to your reply so the user actually sees it. 1 fetch = 0 rate-limit risk.
>
> **(B) `count>=2` → HTML artifact gallery, URL-only.** Open an HTML artifact with a grid of `<img src='https://…'>` thumbnails ([template below](#html-artifact-template)). The artifact iframe is loaded by the **user's browser** once per session — no quota burn on the AI host or our S3. Splice URLs into the artifact, ask the user to pick by number.
>
> **(C) After the user picks ONE** → 1 fetch is safe. Download `images[N-1].url` for a high-res preview, or feed it directly into [`/v1/modify_scene`](modify-scene.md) (`field_name="mediaUrl"`), or paste as inline `![alt](url)` in a future [`/v1/create_video`](create-video.md) script.
>
> **⚠ NEVER**: with `count>=2`, call view_image / download-and-attach on each thumbnail. That fires N requests in seconds — Pexels / Google / our S3 all rate-limit aggressively, and **the account may be banned within a single call**. The pattern is: **N thumbs shown via artifact (0 fetches), pick 1, fetch 1**.

<!-- widecast-playground:create-image -->

---

## Request

```bash
curl -sS -X POST "https://widecast.ai/app/dashboard/v1/create_image" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -H "Content-Type: application/json" \
  -d '{
        "prompt": "a wooden ladder leaning against a red brick wall, morning light",
        "ratio":  "portrait",
        "count":  4
      }'
```

### Field reference

| Field | Type | Required | Description |
|---|---|---|---|
| `prompt` | string | yes | Image description (≤ 2000 chars). Concrete visual nouns work better than abstract concepts. |
| `ratio` | string | no | `"portrait"` (default, 768×1344 — Reels/TikTok/Shorts), `"landscape"` (1344×768 — YouTube/blog hero), or `"square"` (768×768 — IG feed). |
| `count` | integer | no | 1-4 (default 1). Each variation = **1 credit**. Use `count=3..4` when the user wants options to pick from. |
| `topic_id` | string | no | Link the generated image to an existing video's asset folder so the scene editor can reuse it. Omit for freeform/standalone generation. |

---

## Response — `200 OK`

```json
{
  "object":     "image_set",
  "status":     "completed",
  "count":      4,
  "ratio":      "portrait",
  "prompt":     "a wooden ladder leaning against a red brick wall, morning light",
  "images": [
    {"number": 1, "url": "https://widecast.ai/downloads/.../a1_768x1344.jpg?v=...", "thumbnail_url": "...", "ratio": "portrait"},
    {"number": 2, "url": "https://widecast.ai/downloads/.../a2_768x1344.jpg?v=...", "thumbnail_url": "...", "ratio": "portrait"},
    {"number": 3, "url": "https://widecast.ai/downloads/.../a3_768x1344.jpg?v=...", "thumbnail_url": "...", "ratio": "portrait"},
    {"number": 4, "url": "https://widecast.ai/downloads/.../a4_768x1344.jpg?v=...", "thumbnail_url": "...", "ratio": "portrait"}
  ],
  "request_id": "req_abcd…"
}
```

### Partial success — `502`

If a later variant fails after earlier ones succeeded (paid + delivered), the response shape is preserved, `status: "partial"`, the `images` list contains only the survivors, and `error` carries the failure marker:

```json
{
  "object": "image_set",
  "status": "partial",
  "count":  2,
  "images": [{"number": 1, ...}, {"number": 2, ...}],
  "error":  {"code": "image_generation_failed", "message": "...", "failed_at_number": 3},
  "request_id": "..."
}
```

### Error codes

| `error.code` | HTTP | When |
|---|---|---|
| `missing_field` | 400 | `prompt` is empty. |
| `prompt_too_long` | 400 | `prompt` > 2000 chars. |
| `invalid_ratio` | 400 | `ratio` not in `["portrait","landscape","square"]`. |
| `invalid_count` | 400 | `count` outside 1-4. |
| `credit_exhausted` / `account_expired` | 402 | Out of credits (see `error.details` for upgrade/wait info). |
| `image_generation_failed` | 502 | Underlying engine failed on a variant. `status: "partial"` carries survivors. |
| `missing_api_key` / `invalid_api_key` | 401 | Auth. |

---

## SDK examples

### Python

```python
from widecast import Widecast

client = Widecast()
result = client.create_image(
    prompt="a wooden ladder leaning against a red brick wall, morning light",
    ratio="portrait",
    count=4,
)

# Show the user a numbered thumbnail list:
for img in result["images"]:
    print(f"{img['number']}. {img['thumbnail_url']}")
# After they pick number N:
picked = result["images"][n - 1]["url"]
```

### TypeScript

```typescript
import Widecast from "@widecast/sdk";

const client = new Widecast();
const result = await client.create_image({
  prompt: "a wooden ladder leaning against a red brick wall, morning light",
  ratio: "portrait",
  count: 4,
});

for (const img of result.images) console.log(`${img.number}. ${img.thumbnail_url}`);
const pickedUrl = result.images[n - 1].url;
```

### MCP

```jsonc
{
  "name": "widecast_create_image",
  "arguments": {
    "prompt": "a wooden ladder leaning against a red brick wall, morning light",
    "ratio":  "portrait",
    "count":  4
  }
}
// → render each image's thumbnail as a numbered HTML-artifact gallery,
//   ask the user to pick by number, then feed `images[N-1].url` into
//   widecast_modify_scene (field_name="mediaUrl") or use it inline in a
//   future widecast_create_video.
```

### HTML artifact template

Drop this verbatim into a Claude HTML artifact (or any iframe-capable sandbox) and splice in `thumbnail_url` per image. The dark-background grid matches WideCast's visual style; numbers are pinned under each thumbnail so the user can refer to them by number in chat.

```html
<style>
body{font-family:system-ui;margin:0;padding:16px;background:#0f172a;color:#e2e8f0}
.g{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px}
.c{background:#1e293b;border-radius:8px;overflow:hidden;padding-bottom:8px;text-align:center}
.c img{width:100%;height:220px;object-fit:cover;display:block;background:#0b1220}
.n{font-weight:700;font-size:18px;color:#a78bfa;padding:8px 0 2px}
</style>
<div class="g">
  <div class="c"><img src="THUMB_URL_1"><div class="n">1</div></div>
  <div class="c"><img src="THUMB_URL_2"><div class="n">2</div></div>
  <div class="c"><img src="THUMB_URL_3"><div class="n">3</div></div>
  <div class="c"><img src="THUMB_URL_4"><div class="n">4</div></div>
</div>
```

After rendering, ask the user inline: `"Which one — 1, 2, 3, or 4?"`. Their pick → `images[N-1].url`.
