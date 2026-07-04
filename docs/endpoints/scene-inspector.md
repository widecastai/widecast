# Live browser inspector — `POST /v1/scene_inspector`

**Synchronous, free.** Returns BROWSER TRUTH for a video that has an open scene editor: mounted DOM, computed bounding boxes, current preview play state, a small 280×498 screenshot. **More expensive than [`/v1/scene_geometry`](scene-geometry.md) — use it only when data + geometry are not enough**: typically when the agent needs DOM/computed-box truth or a live visual screenshot. Do NOT call this as the first step if `/v1/scene_geometry` already gives you the boxes you need.

> **Recommended chain**: [`/v1/video_data`](video-data.md) → [`/v1/scene_geometry`](scene-geometry.md) → [`/v1/modify_scene`](modify-scene.md). Only reach for `/v1/scene_inspector` when you specifically need browser truth or a live screenshot — e.g. you suspect a CSS / load race after a `modify_scene` edit, or you want a quick aesthetic gut-check before suggesting another move.

<!-- widecast-playground:scene-inspector -->

---

## How it works

1. The server publishes a tiny MQTT probe to every open editor tab for this video.
2. Tabs that are alive respond within a ~800ms window. The server elects ONE healthy foreground/active browser.
3. The real inspector command is sent only to that tab.
4. The tab runs the action against its mounted preview root and returns the result.

`/v1/modify_scene` broadcasts MQTT realtime to every open editor independently — this tool's election only affects which tab returns the live inspection.

> **Presence ≠ usability.** A tab on the workflow page, on a different video, or any page without a mounted scene preview is ignored for scene-bound commands.

### 🖼 `screenshot_scene_280x498` — temporary public URL (15-minute TTL)

The response is a regular JSON `SceneInspectorResponse` whose `result.screenshot` carries a **temporary public URL** — not bytes, not base64. The agent downloads the JPEG with a plain `curl <url>` (no auth header required — the path is served publicly by nginx). Every call publishes a *fresh* unique file (16-hex token), so the URL is never reused across calls — this matches the realtime semantics of inspector data.

```jsonc
// request
{
  "id":         "widecast7c0d4f8a9b1e2d3f",
  "action":     "screenshot_scene_280x498",
  "voice_file": "XcR0k"
}

// response (HTTP 200, Content-Type: application/json)
{
  "object":     "scene_inspector_result",
  "status":     "completed",
  "code":       "ok",
  "action":     "screenshot_scene_280x498",
  "topic_id":   "widecast7c0d4f8a9b1e2d3f",
  "company_id": "<company_id>",
  "request_id": "req_…",
  "result": {
    "action":      "screenshot_scene_280x498",
    "scene_id":    3,
    "voice_file":  "XcR0k",
    "scene_index": 2,
    "screenshot": {
      "url":         "https://origin.widecast.ai/downloads/<co>/<topic>/inspector/XcR0k_5f10e9cc0a384e97.jpg?v=1782700000",
      "mime_type":   "image/jpeg",
      "width":       280,
      "height":      498,
      "bytes":       20498,
      "expires_at":  "2026-06-29T13:30:00Z",
      "ttl_seconds": 900
    }
  }
}
```

**Key invariants**

| Property | Value |
|---|---|
| Authentication | **None** — the URL is served publicly by nginx (same pattern as Remotion specs and `_overlay_poster.png` assets). |
| Host | **`origin.widecast.ai`** (not `widecast.ai`) — bypasses Cloudflare entirely. CF caches `/downloads/*.jpg` by extension; routing through the origin keeps these 15-min ephemeral assets out of edge cache so a stale URL never gets pinned in CF for ~24h after the file is gone. |
| Cache | The `?v=<mtime>` suffix is belt-and-suspenders cache-busting; the origin host already skips CDN. |
| TTL | `ttl_seconds: 900` (15 min). `expires_at` is when the file is no longer guaranteed readable. |
| Freshness | Every call publishes a NEW file under a fresh 16-hex token — never cached across calls. Inspector data is realtime; reusing a stale screenshot would lie about the current state. |
| Atomicity | Server writes to `<filename>.tmp`, `fsync`s, then atomic-renames to the final path before responding. The agent's `curl` will NEVER read a half-written file. |
| Storage path | `/mnt/html/lcw/downloads/<company_id>/<topic_id>/inspector/<voice_file>_<token16>.jpg` (served at the URL above). |

**Lookup / publish failures return JSON error envelopes:**

| HTTP | `error.code` | When |
|---|---|---|
| 404 | `video_not_found` | Topic id doesn't exist on the account. |
| 404 | `scene_not_found` | `scene_id` / `voice_file` didn't match any scene. |
| 409 | `script_not_ready` | Video still processing or never had a script. |
| 502 | `script_parse_failed` | Stored video_script is malformed. |
| 500 | `screenshot_publish_failed` | Compositor produced bytes but the disk write / rename failed. |

The compositor is opaque to clients — internal diagnostics (which layers ran, which warnings the renderer emitted) used to leak through `result.warnings[]`, `result.layers_used`, `result.used_assets`, `result.narrator_on_top`, `result.narrator_area_ratio`, and a top-level `fallback` block. Those have all been removed in 2026-06 — agents read the screenshot URL, not the renderer's working notes.

**Client snippets**

```bash
# 1) request the screenshot — server publishes a fresh URL
URL=$(curl -sS -X POST ".../v1/scene_inspector" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -H "Content-Type: application/json" \
  -d '{ "id": "widecast7c0d4f8a9b1e2d3f",
        "action": "screenshot_scene_280x498",
        "voice_file": "XcR0k" }' \
  | jq -r .result.screenshot.url)

# 2) fetch the JPEG — no auth header needed, public URL
curl -sS -o scene.jpg "$URL"
```

```python
# Python SDK
from widecast import Widecast
import requests

client = Widecast()
resp = client.scene_inspector(
    "widecast7c0d4f8a9b1e2d3f",
    "screenshot_scene_280x498",
    voice_file="XcR0k",
)
url = resp["result"]["screenshot"]["url"]
open("scene.jpg", "wb").write(requests.get(url, timeout=10).content)
```

```typescript
// JS SDK
import Widecast from "@widecast/sdk";

const client = new Widecast();
const resp = await client.scene_inspector(
  "widecast7c0d4f8a9b1e2d3f",
  "screenshot_scene_280x498",
  { voice_file: "XcR0k" },
);
const url = resp.result?.screenshot?.url as string;
const blob = await (await fetch(url)).blob();
```

> **MCP transport.** The remote `/mcp/<token>` connector and local `@widecast/mcp-server` both pass the JSON through unchanged — the URL appears in the regular `TextContent` block. A Claude / GPT host then either fetches the URL itself or asks the user / shell to do so. No `ImageContent` block is emitted today.

> **Historical note.** Prior contracts of this action returned raw `image/jpeg` bytes (or, briefly, an opt-in JSON `result.screenshot.{data_url, base64}` via `return_base64: true`). Both contracts were retired in favour of the URL-publishing path above. The `return_base64` flag is parsed but ignored — old callers don't 400, they just get the new URL contract.


### 🎨 `overlay_poster` — audit the overlay in isolation

Companion action to `screenshot_scene_280x498`. The server composites **ONLY** the Remotion overlay poster on a solid **black 280×498** canvas — no background image, no narrator, no caption. Purpose: catch text-quality issues the composite screenshot hides. A busy photo background can visually camouflage a missing Vietnamese tone mark, a `□` tofu glyph where a special character failed to render, a typo, a wrong currency symbol, or a semantic drift between the narration and the overlay.

The response mirrors the screenshot shape but uses `result.overlay_poster.*` and adds a `result.review_checklist` — a English reminder walking the agent through the 8 audit dimensions.

```jsonc
// request
{
  "id":         "widecast7c0d4f8a9b1e2d3f",
  "action":     "overlay_poster",
  "voice_file": "XcR0k"
}

// response (HTTP 200, Content-Type: application/json)
{
  "object":     "scene_inspector_result",
  "status":     "completed",
  "code":       "ok",
  "action":     "overlay_poster",
  "topic_id":   "widecast7c0d4f8a9b1e2d3f",
  "company_id": "<company_id>",
  "request_id": "req_…",
  "result": {
    "action":      "overlay_poster",
    "scene_id":    3,
    "voice_file":  "XcR0k",
    "scene_index": 2,
    "overlay_poster": {
      "url":         "https://origin.widecast.ai/downloads/<co>/<topic>/inspector/XcR0k_poster.jpg?v=1782700123",
      "mime_type":   "image/jpeg",
      "width":       280,
      "height":      498,
      "bytes":       18234,
      "expires_at":  "2026-06-29T13:32:03Z",
      "ttl_seconds": 900
    },
    "review_checklist": "This is the overlay in isolation on solid black — the background image was stripped so you audit the overlay ONLY. Walk all 8 dimensions: 1) Readability … 2) Typos … 3) Grammar … 4) Semantic … 5) Diacritics … 6) Glyph rendering … 7) Numbers/units/symbols … 8) Punctuation …"
  }
}
```

**Key invariants (in addition to the screenshot ones):**

| Property | Value |
|---|---|
| Filename | `<voice_file>_poster.jpg` (STABLE — overwritten each call). The user asked for exactly this name. |
| Freshness | `?v=<mtime>` bumps on every write, so the URL string is always new even though the filename doesn't rotate. |
| Storage path | `/mnt/html/lcw/downloads/<company_id>/<topic_id>/inspector/<voice_file>_poster.jpg` |
| Atomicity | Same tmp + fsync + rename dance as the screenshot publisher — the response only returns after rename succeeds. |
| Requires | An enabled Remotion overlay for this scene. If `segment.remotion_spec == "none"` OR the spec has not been built, the server returns **HTTP 409 `overlay_not_available`** — upload an overlay first (see [`/v1/modify_scene`](modify-scene.md) Upload Overlay branch) and retry. |

**Error responses specific to `overlay_poster`:**

| HTTP | `error.code` | When |
|---|---|---|
| 409 | `overlay_not_available` | Scene has no poster (`remotion_spec="none"` or spec not built). |
| 500 | `overlay_publish_failed` | Composed JPEG could not be persisted (disk write / rename failed). |

The generic screenshot errors (`404 video_not_found`, `404 scene_not_found`, `409 script_not_ready`, `502 script_parse_failed`) apply here too.


### "No editor open" — graceful behaviour

For **non-screenshot actions**, no live editor → HTTP 200 with `status: "unavailable"`:

```jsonc
{
  "object":   "scene_inspector_result",
  "status":   "unavailable",
  "code":     "no_live_editor"     // or "no_active_editor"
}
```

| `code` | Meaning |
|---|---|
| `no_live_editor` | No editor tab is currently open for this video (no presence at all). |
| `no_active_editor` | At least one tab is registered but none responded to the probe in time. |

For **`screenshot_scene_280x498`** and **`overlay_poster`**, the server always uses its compositor and **publishes the JPEG to the same 15-minute URL contract** regardless of whether a live editor was present — there is no separate `unavailable` envelope for these two actions. Both are pure server-side compositors, so live-editor absence never blocks them. Treat screenshots taken without a live editor as **approximate composites, not real renders** — use a renderer / headless-browser pass for pixel-perfect verification.

For non-screenshot / non-overlay-poster actions, agents should fall back to [`/v1/video_data`](video-data.md) + [`/v1/scene_geometry`](scene-geometry.md), and when needed fetch the per-scene `remotion_spec_url`.

---

## Actions

| Action | What it returns | Notes |
|---|---|---|
| `list_live_editors` | Presence list of open editor tabs (`browser`, `os`, `last_seen`). | No election — purely a discovery call. |
| `list_instances` | Preview instance ids mounted in the elected tab. | Diagnostic. |
| `get_preview_state` | `{playing, paused, scene, time}` for the preview player. | |
| `get_scene_dom_snapshot` | DOM subtree for the scene (scoped via optional `selector`). | Keep `selector` narrow — broad selectors blow up the payload. |
| `get_computed_boxes` | `getBoundingClientRect()` for elements in the scene. | **Prefer [`/v1/scene_geometry`](scene-geometry.md) for structural audits** — geometry is cheaper, always-available (no browser needed), and returns the same boxes plus collision violations and safe zones in pure JSON. |
| `screenshot_scene_280x498` | Small ~280×498 capture — **full composite** (background + Remotion overlay poster + narrator + caption). | **Response carries a 15-min public URL** in `result.screenshot.url` — see the section above. Best-effort live capture or server compositor; use a renderer / headless-browser fallback for pixel-perfect verification. |
| `overlay_poster` | Small ~280×498 image showing **ONLY the Remotion overlay poster on solid black**. | **Response carries a 15-min public URL** in `result.overlay_poster.url` + `result.review_checklist` reminder — see the section above. Use to catch typos / diacritic loss / glyph tofu / grammar / semantic issues the composite screenshot would mask. Filename stable, `?v=<mtime>` for freshness. Errors: 409 `overlay_not_available`, 500 `overlay_publish_failed`. |
| `activate_scene` | Brings the elected tab to the requested scene. May visibly switch the open editor for that user. | Use sparingly. |
| `reload_preview` / `pause_preview` / `play_preview` / `seek_preview` | Preview transport controls. | `seek_preview` accepts `seek_seconds`. |

> **No arbitrary JavaScript eval is exposed.** Screenshots are intentionally small (280×498) — they are for aesthetic gut-checks, not pixel-perfect verification. Use `voice_file` as the scene selector wherever possible.

---

## Request

```http
POST /v1/scene_inspector
Authorization: Bearer wc_live_REPLACE_ME
Content-Type: application/json

{
  "id":         "widecast7c0d4f8a9b1e2d3f",
  "action":     "get_computed_boxes",
  "voice_file": "XcR0k",
  "activate":   true,
  "timeout_ms": 7000
}
```

### Field reference

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Topic id (from [`/v1/video_data`](video-data.md) / scene editor). Accepts `widecast...`, `gubo...`, or current ids. |
| `action` | string enum | yes | One of the actions listed above. |
| `scene_id` | string \| number | no | Current display/order scene id. Prefer `voice_file` when available. |
| `voice_file` | string | no | Stable per-scene UID from `/v1/video_data` — preferred selector. |
| `selector` | string | no | DOM selector scoped to the target preview root (`get_scene_dom_snapshot`, `get_computed_boxes`). |
| `activate` | boolean | no | Allow the elected browser to switch scenes before inspecting. May visibly switch the open editor scene for that user. |
| `seek_seconds` | number | no | Seek time for `seek_preview` / screenshot. |
| `timeout_ms` | integer | no | Command timeout. Default ~7000ms (server clamps 1000–15000ms). |
| `probe_timeout_ms` | integer | no | Foreground election window. Default ~800ms (server clamps 150–2000ms). |
| `options` | object | no | Advanced action-specific options. |

---

## Responses

### `200 OK` — `completed`

```jsonc
{
  "object":   "scene_inspector_result",
  "status":   "completed",
  "code":     "ok",
  "request_id": "req_…",
  "action":   "get_computed_boxes",
  "topic_id": "widecast7c0d4f8a9b1e2d3f",
  "company_id": "<company_id>",
  "selected_browser": { "browser": "chrome", "os": "macOS", "last_seen": "…", "instance_id": "…" },
  "result": {
    "scene_uid": "XcR0k",
    "boxes": [
      { "selector": "[data-scene-id='XcR0k'] .narrator", "x": 80, "y": 300, "w": 120, "h": 180 },
      { "selector": "[data-scene-id='XcR0k'] .caption",  "x": 20, "y": 360, "w": 240, "h": 96 }
    ]
  }
}
```

### `200 OK` — `screenshot_scene_280x498` (URL response)

Response is JSON `SceneInspectorResponse` whose `result.screenshot` carries `{url, mime_type, width, height, bytes, expires_at, ttl_seconds}`. See the full sample + invariants in the section above. There's no flag to distinguish a live capture from a server composite; assume "approximate" when reading `screenshot_scene_280x498` output.

### `200 OK` — `overlay_poster` (URL response + review checklist)

Response is JSON `SceneInspectorResponse` whose `result.overlay_poster` carries `{url, mime_type, width, height, bytes, expires_at, ttl_seconds}` PLUS `result.review_checklist` — a English reminder covering the 8 audit dimensions (readability / typos / grammar / semantic / diacritic / glyph rendering / numbers / punctuation). See the full sample + invariants in the section above.

### `200 OK` — `unavailable`

See "No editor open" above. **Note**: `screenshot_scene_280x498` and `overlay_poster` never return this envelope — both are pure server-side compositors that always try to publish a URL, or return a 500 JSON error if they cannot.

### `200 OK` — `error` (browser-side failure)

```jsonc
{
  "object": "scene_inspector_result",
  "status": "error",
  "code":   "browser_error",
  "result": { "message": "…" }
}
```

### `400 Bad Request`

| `error.code` | Meaning |
|---|---|
| `unsupported_action` | `action` is not in the allowed set. |
| `publisher_missing` | Server's MQTT publisher is unavailable. |

### `401 Unauthorized`

| `error.code` | Meaning |
|---|---|
| `missing_api_key` / `invalid_api_key` | Auth. |

### `404 Not Found`

| `error.code` | Meaning |
|---|---|
| `video_not_found` | No video with this id on the account. |

### `409 Precondition Failed` (overlay_poster-only)

| `error.code` | Meaning |
|---|---|
| `overlay_not_available` | The scene has no Remotion overlay poster — either `segment.remotion_spec == "none"` (user disabled it) or the spec has not been built. Upload an overlay first via [`/v1/modify_scene`](modify-scene.md) Upload Overlay branch and retry. |

### `500 Internal Server Error` (compositor-only)

JSON envelope returned when the compositor cannot persist its output:

| `error.code` | Meaning |
|---|---|
| `screenshot_publish_failed` | `screenshot_scene_280x498` — compositor produced bytes but disk write / atomic rename failed. |
| `overlay_publish_failed` | `overlay_poster` — compositor produced bytes but disk write / atomic rename failed. |

---

## SDK examples

### Python — screenshot with graceful server-fallback

```python
from widecast import Widecast
import requests

client = Widecast()
data = client.video_data("widecast7c0d4f8a9b1e2d3f")
target = data["segments"][2]

resp = client.scene_inspector(
    video_id=data["id"],
    action="screenshot_scene_280x498",
    voice_file=target["voice_file"],
    activate=True,
    timeout_ms=7000,
)

if resp["status"] == "completed" and resp.get("code") == "ok":
    # Success — compositor is the sole screenshot path, so `code: "ok"`
    # covers both "live editor was present" and "server composed from
    # thumbnails + overlay poster". Agent just reads the URL.
    url = resp["result"]["screenshot"]["url"]
    open("scene.jpg", "wb").write(requests.get(url, timeout=10).content)
    print("saved screenshot to scene.jpg")
else:
    # Composition itself failed (rare) — fall back to scene_geometry data
    geom = client.scene_geometry(data["id"], voice_file=target["voice_file"])
    print("falling back to scene_geometry:", geom["summary"])
```

### Python — overlay-only audit (typos / diacritics / glyph rendering)

```python
from widecast import Widecast
import requests

client = Widecast()
resp = client.scene_inspector(
    video_id="widecast7c0d4f8a9b1e2d3f",
    action="overlay_poster",
    voice_file="XcR0k",
)

if resp["status"] == "completed" and resp.get("code") == "ok":
    poster = resp["result"]["overlay_poster"]
    open("overlay.jpg", "wb").write(requests.get(poster["url"], timeout=10).content)
    # Print the reminder so the agent reads it before judging
    print(resp["result"]["review_checklist"])
    # → walks the 8 dimensions: readability / typos / grammar / semantic /
    #   diacritics / glyph rendering / numbers / punctuation
elif resp.get("code") == "overlay_not_available":
    print("Scene has no overlay to audit — upload one first.")
```

### TypeScript — structural audit (prefer scene_geometry)

```typescript
import Widecast from "@widecast/sdk";

const client = new Widecast();
const data = await client.video_data("widecast7c0d4f8a9b1e2d3f");
const target = data.segments[2];

// For structural boxes, prefer scene_geometry — no browser needed.
const geom = await client.scene_geometry(data.id, { voice_file: target.voice_file });
console.log("narrator face:", geom.boxes.narrator.face);
console.log("violations:", geom.violations);

// Use scene_inspector only when you need browser truth.
const resp = await client.scene_inspector(data.id, "get_preview_state", {
  voice_file: target.voice_file,
});
if (resp.status === "completed") console.log("preview state:", resp.result);
```

### MCP

```jsonc
{
  "name": "widecast_scene_inspector",
  "arguments": {
    "video_id":   "widecast7c0d4f8a9b1e2d3f",
    "action":     "list_live_editors"
  }
}
```

---

## When to use which action

| Goal | Tool / action |
|---|---|
| Pick coordinates / audit collisions before a layout edit | **[`/v1/scene_geometry`](scene-geometry.md)** (not this endpoint) |
| Verify a layout move worked in the live preview after the edit | `get_computed_boxes` (or refetch `/v1/scene_geometry`) |
| Aesthetic gut-check whether text + image collide / wrap | `screenshot_scene_280x498` |
| Audit overlay text quality (typos / diacritics / glyph tofu / grammar / semantic) without background noise | `overlay_poster` |
| See exactly what DOM the editor mounted | `get_scene_dom_snapshot` (narrow `selector`) |
| Pause / step the preview to inspect a frame | `pause_preview` then `seek_preview` |
| Confirm the user actually has the editor open | `list_live_editors` |

> For structural audits, prefer [`/v1/scene_geometry`](scene-geometry.md) over `get_computed_boxes` — geometry is cheaper, always-available (no browser needed), and returns the same boxes plus collision violations and safe zones in pure JSON.
