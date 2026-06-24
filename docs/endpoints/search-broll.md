# Search stock B-roll — `POST /v1/search_broll`

**Synchronous, free.** Search stock B-roll for a keyword.

> **Scope — modify_scene workflow ONLY, NOT for new-video creation.** Use this to find replacement media for ONE scene on an **existing** video (the picked clip/photo feeds into [`/v1/modify_scene`](modify-scene.md) `field_name="mediaUrl"`). When you author a NEW script for [`/v1/create_video`](create-video.md), do your own URL research inside the writing-skill 7-step method and embed real verified URLs inline as `![alt](url)` — **do not** call `/v1/search_broll` first to pre-pick visuals for a brand-new video (defeats the inline-URL discipline). Natural sequence: `/v1/create_video` → user reviews scenes → user asks to swap scene N → `/v1/search_broll` → user picks → `/v1/modify_scene`.

Two modes:

| `kind` | What it searches | Engine | Use when |
|---|---|---|---|
| `"video"` | Stock video CLIPS from Pexels + Pixabay + Shutterstock | broll.js Stock tab | The scene wants motion / atmosphere (a city at night, waves on a beach, hands typing on a keyboard) |
| `"image"` | Real PHOTOS from Google image search | broll.js Photos tab | The scene wants a specific real-world object / person / place (the Eiffel Tower at morning, a Tesla Model 3 dashboard, the iPhone 16 home screen) |

**Prefer this over [`/v1/create_image`](create-image.md)** when the asset the user wants is something that **actually exists** — real footage/photos beat AI generations for credibility.

The response is shaped for the **AI-agent flow**: each result carries a 1-based `number` so the agent can render a NUMBERED THUMBNAIL GALLERY and ask the user to pick by number. The chosen `results[N-1].url` is the canonical asset URL — feed it into [`/v1/modify_scene`](modify-scene.md) (`field_name="mediaUrl"`) to swap a scene's background, or use as inline `![](url)` in a future [`/v1/create_video`](create-video.md) script.

> **Agent rendering rule — MANDATORY HTML artifact, NO per-thumbnail fetch. ⚠ Most AI-agent runtimes (Claude included) CANNOT render an external `https://…` URL inline in chat.** Open an HTML artifact with a grid of `<img src='https://…'>` thumbnails ([template below](#html-artifact-template)). The artifact is loaded by the **user's browser** once per session — no quota burn on the AI host or the source.
>
> **⚠ NEVER** call view_image / download-and-attach on each thumbnail. That fires N requests in seconds — Pexels / Pixabay / Google / Shutterstock all rate-limit aggressively, and **the account may be banned within a single search**. The pattern is: **N thumbs shown via artifact (0 fetches), pick 1, fetch 1 (only when the user picks)**.

<!-- widecast-playground:search-broll -->

---

## Request

Search stock video clips:

```bash
curl -sS -X POST "https://widecast.ai/app/dashboard/v1/search_broll" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -H "Content-Type: application/json" \
  -d '{
        "keyword": "umbrella rain",
        "kind":    "video",
        "ratio":   "portrait",
        "limit":   10
      }'
```

Search real photos:

```bash
curl -sS -X POST "https://widecast.ai/app/dashboard/v1/search_broll" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -H "Content-Type: application/json" \
  -d '{
        "keyword": "Eiffel Tower morning",
        "kind":    "image",
        "limit":   8
      }'
```

### Field reference

| Field | Type | Required | Description |
|---|---|---|---|
| `keyword` | string | yes | Search keyword. **1-3 words work best** — Pexels/Pixabay token-match poorly with sentence-long queries. |
| `kind` | string | yes | `"video"` = stock CLIPS, `"image"` = real PHOTOS. |
| `ratio` | string | no | `"portrait"` (default), `"landscape"`, `"square"`. **Only filters when `kind="video"`** — image search ignores it (crop client-side if needed). |
| `limit` | integer | no | 1-20 (default 10). Keep tight (6-10) for fast picks. |

---

## Response — `200 OK`

```json
{
  "object":  "list",
  "kind":    "video",
  "keyword": "umbrella rain",
  "ratio":   "portrait",
  "total":   10,
  "results": [
    {
      "number":         1,
      "type":           "video",
      "url":            "https://...pexels.../video.mp4",
      "thumbnail_url":  "https://...pexels.../thumb.jpg",
      "title":          "Person walking with umbrella in rain",
      "source":         "pexels",
      "duration":       18.5,
      "width":          1080,
      "height":         1920,
      "author":         "Jane Doe"
    },
    {"number": 2, "type": "video", "url": "...", "thumbnail_url": "...", "source": "pixabay", "duration": 11.2, ...}
  ],
  "request_id": "req_abcd…"
}
```

Image results add `context_url` (web page the image was crawled from) and have `duration: 0`:

```json
{
  "number":        1,
  "type":          "image",
  "url":           "https://example.com/eiffel-tower.jpg",
  "thumbnail_url": "https://example.com/eiffel-tower-thumb.jpg",
  "title":         "Eiffel Tower at sunrise",
  "source":        "google_image",
  "duration":      0, "width": 0, "height": 0,
  "context_url":   "https://travelblog.example.com/paris-mornings"
}
```

### Error codes

| `error.code` | HTTP | When |
|---|---|---|
| `missing_field` | 400 | `keyword` is empty. |
| `invalid_kind` | 400 | `kind` not in `["video","image"]`. |
| `invalid_ratio` | 400 | `ratio` not in `["portrait","landscape","square"]`. |
| `invalid_limit` | 400 | `limit` outside 1-20. |
| `search_failed` | 502 | Upstream stock provider failed. |
| `missing_api_key` / `invalid_api_key` | 401 | Auth. |

---

## SDK examples

### Python

```python
from widecast import Widecast

client = Widecast()

# Stock video search
out = client.search_broll(keyword="umbrella rain", kind="video", limit=10)
for r in out["results"]:
    print(f"{r['number']}. {r['title']} — {r['thumbnail_url']}")
picked_url = out["results"][n - 1]["url"]

# Real-photo search
photos = client.search_broll(keyword="Eiffel Tower morning", kind="image", limit=8)
```

### TypeScript

```typescript
import Widecast from "@widecast/sdk";

const client = new Widecast();
const out = await client.search_broll({ keyword: "umbrella rain", kind: "video", limit: 10 });
for (const r of out.results) console.log(`${r.number}. ${r.title}`);
const pickedUrl = out.results[n - 1].url;
```

### MCP

```jsonc
{
  "name": "widecast_search_broll",
  "arguments": {
    "keyword": "umbrella rain",
    "kind":    "video",
    "ratio":   "portrait",
    "limit":   10
  }
}
// → render each result as a numbered HTML-artifact gallery, ask the user
//   to pick by number, then feed `results[N-1].url` into widecast_modify_scene
//   (field_name="mediaUrl") or use it inline in a future widecast_create_video.
```

### HTML artifact template

Splice in `thumbnail_url` + `title` per result. For videos, wrap the `<img>` in `<a href="VIDEO_URL" target="_blank">` so click → opens the clip in a new tab.

```html
<style>
body{font-family:system-ui;margin:0;padding:16px;background:#0f172a;color:#e2e8f0}
.g{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px}
.c{background:#1e293b;border-radius:8px;overflow:hidden;padding-bottom:8px;text-align:center}
.c img{width:100%;height:220px;object-fit:cover;display:block;background:#0b1220}
.n{font-weight:700;font-size:18px;color:#a78bfa;padding:8px 0 2px}
.t{font-size:11px;color:#94a3b8;padding:0 6px;line-height:1.3;height:28px;overflow:hidden}
</style>
<div class="g">
  <!-- video example: <a> wraps <img> -->
  <div class="c">
    <a href="VIDEO_URL_1" target="_blank"><img src="THUMB_URL_1"></a>
    <div class="n">1</div>
    <div class="t">TITLE_1</div>
  </div>
  <!-- image example: no <a> needed (thumb IS the asset) -->
  <div class="c">
    <img src="THUMB_URL_2">
    <div class="n">2</div>
    <div class="t">TITLE_2</div>
  </div>
  <!-- … repeat per result … -->
</div>
```

After rendering, ask the user inline: `"Pick one — 1 through N?"`. Their pick → `results[N-1].url`.
