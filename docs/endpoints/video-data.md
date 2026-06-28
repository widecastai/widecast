# Read a video's structured scene data — `POST /v1/video_data`

**Synchronous, free. First step for data-first scene audit/edit** — call this **before** [`/v1/scene_geometry`](scene-geometry.md) / [`/v1/modify_scene`](modify-scene.md) / [`/v1/scene_inspector`](scene-inspector.md). Returns full annotated segment dicts (current `mediaUrl`, narrator config, Remotion spec metadata) for a `topic_id`.

> **Recommended chain**: `video_data` → [`/v1/scene_geometry`](scene-geometry.md) (cheap layout audit) → [`/v1/modify_scene`](modify-scene.md). Use [`/v1/scene_inspector`](scene-inspector.md) only as an expensive last resort when you need browser truth or a live screenshot.

> **Internal poster diagnostics are stripped by default.** Per-segment `remotion_poster_file` / `remotion_poster_url` / `remotion_poster_version` / `remotion_poster_state` / `remotion_poster_exists` / `remotion_poster_warnings` (and their copies inside `agent_meta.remotion_spec`) describe the server-side `{voice_file}_overlay_poster.png` used by [`/v1/scene_inspector`](scene-inspector.md) fallback — agents don't act on them. Pass `include_diagnostics: true` to surface them for server / debug audits.

The endpoint mirrors the same engine the dashboard's scene editor uses on open — A/B-roll rebalance + ensure background music + persist if changed — so the data matches what the user sees in `https://widecast.ai/#scene_editor?topic_id=…` exactly.

To keep MCP payloads usable, the API trims per-segment `words` timing arrays, top-level `captions`, plus internal preview-cache fields (`savedVideos`, `savedImages`, `_previewInstanceId`, `_remotionSpecFetching`, `_forceNarratorRefit`). UI routes still get full data; this is the agent-safe slim view.

<!-- widecast-playground:video-data -->

---

## Scene identity rule

The response includes a machine-readable `scene_identity` block. Agents must follow it:

| Field | Stable? | Use for |
|---|---|---|
| `voice_file` (`scene_uid`) | **Yes** | Selecting a scene in `/v1/modify_scene` and `/v1/scene_inspector`. Also the base of the Remotion spec filename `{voice_file}_spec.json`. |
| `id` / `order_id` / `scene_index` | **No** | Display / current ordering only. May change after reorder/add/delete. |

> When in doubt, use `voice_file`. Don't persist `segment.id` between calls.

---

## Coordinate spaces

Two coordinate spaces appear in segment data — they are **not** interchangeable:

| Space | Width × Height | Where it appears |
|---|---|---|
| Remotion canvas | **720 × 1280** | All `remotion_spec` content + `remotion.*` modify_scene fields |
| Legacy editor preview | **280 × 498** | `overlay.caption.rect`, `overlay.narrator.rect`, legacy overlay layout |

Pass `coordinate_space: "canvas"` or `"preview"` to `/v1/modify_scene` when sending `remotion.group.rect`.

The same map is bundled into `agent_meta.coordinate_spaces` on every segment for quick consumption.

---

## Request

```http
POST /v1/video_data
Authorization: Bearer wc_live_REPLACE_ME
Content-Type: application/json

{ "video_id": "widecastABCDEFGHIJKL" }
```

### Field reference

| Field | Type | Required | Description |
|---|---|---|---|
| `video_id` | string | yes | Topic id from [`/v1/create_video`](create-video.md) / scene editor. Accepts `widecast...`, `gubo...`, or current ids. Same id used by `/v1/status`, `/v1/export_video`, `/v1/modify_scene`, `/v1/scene_inspector`. |
| `include_diagnostics` | boolean | no | Default `false`. When `true`, per-segment `remotion_poster_*` diagnostic keys (and their copies inside `agent_meta.remotion_spec`) are returned. For server / debug audits only. |

---

## Response — `200 OK`

```jsonc
{
  "object":         "video_data",
  "id":             "widecastABCDEFGHIJKL",
  "topic_id":       "widecastABCDEFGHIJKL",
  "aspect_ratio":   "portrait",
  "title":          "Why your teen should get a driver's license at 16",
  "language":       "English",
  "total_segments": 6,
  "total_duration": 92.4,
  "scene_identity": {
    "stable_scene_id_field": "voice_file",
    "order_field":           "id",
    "notes": [
      "voice_file is the stable per-scene UID.",
      "segment.id is current display/order and may change after reorder/add/delete.",
      "The Remotion spec for a scene is {voice_file}_spec.json."
    ]
  },
  "segments": [
    {
      "id":                       "0",
      "order_id":                 "0",
      "scene_index":              0,
      "voice_file":               "XcR0k",
      "scene_uid":                "XcR0k",
      "type":                     "A-roll",
      "text":                     "You should let your teen get a driver's license at 16.",
      "talking_point":            "Independence is a foundation skill.",
      "visual":                   "Teen holding car keys, soft daylight.",
      "quote":                    "",
      "keyword":                  "license",
      "duration":                 8.2,
      "mediaUrl":                 "https://widecast-assets.s3.us-west-1.amazonaws.com/.../scene01.jpg",
      "mediaType":                "image",
      "thumbnailUrl":             "https://widecast.ai/downloads/.../thumb_01.jpg",
      "videoTrim":                {},
      "overlay": {
        "caption":  { "rect": { "x": 20, "y": 360, "w": 240, "h": 96 } },
        "narrator": { "rect": { "x": 80, "y": 300, "w": 120, "h": 180 } }
      },
      "narrator": {
        "name": "Sarah", "voice_id": "v_clone_42", "face_id": "f_clone_42",
        "audio_url": "...", "video_url": ""
      },
      "remotion_spec":           "XcR0k_spec.json",
      "remotion_spec_file":      "XcR0k_spec.json",
      "remotion_spec_url":       "https://widecast.ai/downloads/<company_id>/widecastABCDEFGHIJKL/XcR0k_spec.json?v=1748293012",
      "remotion_spec_version":   "1748293012",
      "remotion_spec_exists":    true,
      "remotion_spec_state":     "ready",
      "agent_meta": {
        "stable_scene_id_field": "voice_file",
        "stable_scene_id":       "XcR0k",
        "order_field":           "id",
        "order_value":           "0",
        "scene_index":           0,
        "remotion_spec": {
          "file":     "XcR0k_spec.json",
          "url":      "https://widecast.ai/downloads/<company_id>/widecastABCDEFGHIJKL/XcR0k_spec.json?v=1748293012",
          "state":    "ready",
          "exists":   true,
          "version":  "1748293012"
        },
        "coordinate_spaces": {
          "canvas":  { "width": 720, "height": 1280, "used_by": "remotion_spec.*, modify_scene remotion.* fields" },
          "preview": { "width": 280, "height": 498,  "used_by": "overlay.caption, overlay.narrator (legacy)" }
        }
      }
    },
    {
      "id":                       "1",
      "order_id":                 "1",
      "scene_index":              1,
      "voice_file":               "Z9p2m",
      "scene_uid":                "Z9p2m",
      "type":                     "B-roll",
      "text":                     "Here's why responsibility starts behind the wheel.",
      "duration":                 12.7,
      "mediaUrl":                 "https://pexels.com/.../teen_driving.mp4",
      "mediaType":                "video",
      "brollUrl":                 "https://pexels.com/.../teen_driving.mp4",
      "thumbnailUrl":             "https://pexels.com/.../teen_driving_thumb.jpg",
      "remotion_spec":            "none",
      "remotion_spec_file":       "Z9p2m_spec.json",
      "remotion_spec_url":        "",
      "remotion_spec_exists":     false,
      "remotion_spec_state":      "disabled",
      "narrator": {}
    }
  ],
  "global_settings": {
    "aspectRatio":       "portrait",
    "voice_type":        "clone",
    "avatar_type":       "clone",
    "last_voice_type":   "clone",
    "last_avatar_type":  "clone"
  },
  "review_url": "https://widecast.ai/#scene_editor?topic_id=widecastABCDEFGHIJKL",
  "request_id": "req_abcd…"
}
```

### Per-segment field reference

| Field | Description |
|---|---|
| `voice_file` / `scene_uid` | Stable per-scene UID. Pass to `/v1/modify_scene` and `/v1/scene_inspector`. Base of `{voice_file}_spec.json`. |
| `id` / `order_id` / `scene_index` | Current display/order only — UNSTABLE. |
| `type` | `A-roll` (narrator on screen), `B-roll` (background only), `thumbnail`, or empty. |
| `text`, `talking_point`, `visual`, `quote`, `keyword` | Narration + creative direction signals — useful to ground a generated overlay image. |
| `duration` | Seconds. |
| `mediaUrl`, `mediaType`, `thumbnailUrl`, `videoTrim` | Currently-shown asset on the scene. |
| `overlay.caption`, `overlay.narrator` | Legacy 280×498 editor preview coords. |
| `narrator` | `{name, voice_id, face_id, audio_url, video_url}` when set. |
| `remotion_spec` | Per-scene Remotion spec token. `"none"` means **the user intentionally disabled the overlay** — agents must NOT auto-edit or re-enable unless asked. |
| `remotion_spec_file` | Canonical `{voice_file}_spec.json`. |
| `remotion_spec_url` | Cache-busted `https://widecast.ai/downloads/{company_id}/{topic_id}/{voice_file}_spec.json?v={mtime}`. Empty when state is `missing` or `disabled`. |
| `remotion_spec_version` | mtime token used for cache-busting (matches `?v=`). |
| `remotion_spec_exists` | Boolean — file present on disk. |
| `remotion_spec_state` | `ready` (file exists), `missing` (expected but not built), `disabled` (user turned the overlay off). |
| `agent_meta` | Same metadata bundled for quick consumption — `stable_scene_id`, `order_value`, `scene_index`, `remotion_spec` block, `coordinate_spaces`. |

> **The Remotion spec content is NOT inlined in this response.** It can carry large base64 images that blow MCP payload budgets. Fetch `remotion_spec_url` only when `remotion_spec_state == "ready"` and you actually need object-level overlay boxes.

### Error responses

| `error.code` | HTTP | When |
|---|---|---|
| `missing_field` | 400 | `video_id` is empty. |
| `video_not_found` | 404 | No video with this id on the account. |
| `script_not_ready` | 409 | Video is still processing or never had a script generated. Poll [`/v1/status`](create-video.md) until `status=="completed"`. |
| `script_parse_failed` | 502 | Stored video_script is malformed. Contact support with `request_id`. |
| `missing_api_key` / `invalid_api_key` | 401 | Auth. |

---

## SDK examples

### Python — data-first audit then edit

```python
from widecast import Widecast

client = Widecast()
data = client.video_data("widecastABCDEFGHIJKL")

for seg in data["segments"]:
    print(f"Scene {seg['scene_index']} ({seg['type']}, {seg['duration']:.1f}s)")
    print(f"  voice_file: {seg['voice_file']}")
    print(f"  spec state: {seg['remotion_spec_state']}")
    print(f"  text:       {seg['text'][:80]}")

target = next(s for s in data["segments"] if "license" in (s.get("keyword") or ""))
client.modify_scene(
    data["id"],
    by="voice_file",
    value=target["voice_file"],
    fields=[{"field_name": "mediaUrl", "value": "https://example.com/new.jpg"}],
)
```

### TypeScript

```typescript
import Widecast from "@widecast/sdk";

const client = new Widecast();
const data = await client.video_data("widecastABCDEFGHIJKL");
for (const seg of data.segments) {
  console.log(`Scene ${seg.scene_index} ${seg.type} ${seg.duration?.toFixed(1)}s voice_file=${seg.voice_file}`);
}
```

### MCP

```jsonc
{ "name": "widecast_video_data", "arguments": { "video_id": "widecastABCDEFGHIJKL" } }
// → inspect segments; pick voice_file; then call widecast_modify_scene with by="voice_file".
```
