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

### "No editor open" — graceful behaviour

For **most actions**, no live editor → HTTP 200 with `status: "unavailable"`:

```jsonc
{
  "object":   "scene_inspector_result",
  "status":   "unavailable",
  "code":     "no_live_editor",    // or "no_active_editor"
  "fallback": { "available": true, "suggested": "Use /v1/video_data + /v1/scene_geometry" }
}
```

| `code` | Meaning |
|---|---|
| `no_live_editor` | No editor tab is currently open for this video (no presence at all). |
| `no_active_editor` | At least one tab is registered but none responded to the probe in time. |

For **`screenshot_scene_280x498` specifically**, the server composes a fallback screenshot from scene thumbnails + the static `{voice_file}_overlay_poster.png` (the overlay poster refreshed by spec-changing [`/v1/modify_scene`](modify-scene.md) edits) and returns `code: "server_fallback"`. Treat fallback screenshots as **approximate composites, not real renders** — use a renderer / headless-browser pass for pixel-perfect verification.

Agents should fall back to [`/v1/video_data`](video-data.md) + [`/v1/scene_geometry`](scene-geometry.md), and when needed fetch the per-scene `remotion_spec_url`.

---

## Actions

| Action | What it returns | Notes |
|---|---|---|
| `list_live_editors` | Presence list of open editor tabs (`browser`, `os`, `last_seen`). | No election — purely a discovery call. |
| `list_instances` | Preview instance ids mounted in the elected tab. | Diagnostic. |
| `get_preview_state` | `{playing, paused, scene, time}` for the preview player. | |
| `get_scene_dom_snapshot` | DOM subtree for the scene (scoped via optional `selector`). | Keep `selector` narrow — broad selectors blow up the payload. |
| `get_computed_boxes` | `getBoundingClientRect()` for elements in the scene. | **Prefer [`/v1/scene_geometry`](scene-geometry.md) for structural audits** — geometry is cheaper, always-available (no browser needed), and returns the same boxes plus collision violations and safe zones in pure JSON. |
| `screenshot_scene_280x498` | Small browser-side capture for aesthetic / visual judgment. | Best-effort; use a renderer / headless-browser fallback for pixel-perfect verification. |
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

### `200 OK` — `unavailable`

See "No editor open" above.

> For `screenshot_scene_280x498`, the body is still `status: "completed"` but `code: "server_fallback"` and `result` is a composite assembled from scene thumbnails + `{voice_file}_overlay_poster.png`. Treat as approximate.

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

---

## SDK examples

### Python — screenshot with graceful server-fallback

```python
from widecast import Widecast

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
    print("live screenshot:", resp["result"])
elif resp.get("code") == "server_fallback":
    print("server-composed fallback (thumbnails + overlay poster):", resp["result"])
else:
    # No live editor at all — fall back to scene_geometry
    geom = client.scene_geometry(data["id"], voice_file=target["voice_file"])
    print("falling back to scene_geometry:", geom["summary"])
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
| See exactly what DOM the editor mounted | `get_scene_dom_snapshot` (narrow `selector`) |
| Pause / step the preview to inspect a frame | `pause_preview` then `seek_preview` |
| Confirm the user actually has the editor open | `list_live_editors` |

> For structural audits, prefer [`/v1/scene_geometry`](scene-geometry.md) over `get_computed_boxes` — geometry is cheaper, always-available (no browser needed), and returns the same boxes plus collision violations and safe zones in pure JSON.
