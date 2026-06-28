# Data-only scene layout geometry — `POST /v1/scene_geometry`

**Synchronous, free, read-only.** Use this **after** [`/v1/video_data`](video-data.md) and **before** any screenshot / vision step when an agent needs to audit layout cheaply or pick coordinates for [`/v1/modify_scene`](modify-scene.md).

`/v1/scene_geometry` resolves one scene by its stable `voice_file`, loads `{voice_file}_spec.json` if available, and returns narrator / caption / Remotion Storyboard display boxes in one **280×498 editor-preview** coordinate space — plus dead zones, collision violations, and warnings. It never broadcasts MQTT, never renders screenshots, never exposes base64 assets, and never modifies the video.

It is designed for **LLM-only agents that cannot see images**: reason over JSON, then call [`/v1/modify_scene`](modify-scene.md) — typically with a `layout.batch` containing `overlay.narrator.rect`, `overlay.caption.y`, and `remotion.object.rect`.

<!-- widecast-playground:scene-geometry -->

> **Recommended chain**: [`/v1/video_data`](video-data.md) → **`/v1/scene_geometry`** → [`/v1/modify_scene`](modify-scene.md). Use [`/v1/scene_inspector`](scene-inspector.md) only as an expensive last resort when you specifically need browser truth or a live screenshot.

---

## Request

```http
POST /v1/scene_geometry
Authorization: Bearer wc_live_REPLACE_ME
Content-Type: application/json

{
  "id":         "widecast7c0d4f8a9b1e2d3f",
  "voice_file": "XcR0k"
}
```

### Field reference

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Topic id from [`/v1/video_data`](video-data.md) / [`/v1/create_video`](create-video.md). Accepts `widecast...`, `gubo...`, or current ids. |
| `voice_file` | string | one of | Stable per-scene UID — **preferred shortcut** (server folds into `by="voice_file"`). |
| `scene_id` | string \| number | one of | Current display/order id — fallback only. |
| `by` | string enum | one of | `"voice_file"` (preferred), `"id"`, or `"text"`. Required if neither `voice_file` nor `scene_id` is set. |
| `value` | string \| number | one of | Match value for `by`. Required when `by` is set. |
| `min_score` | number | no | Only for `by="text"`. Fuzzy-match threshold 0..1 (default `0.5`). |

You must provide exactly one of: `voice_file`, `scene_id`, or `by`+`value`.

---

## Response — `200 OK`

```jsonc
{
  "object":          "scene_geometry",
  "id":              "widecast7c0d4f8a9b1e2d3f",
  "topic_id":        "widecast7c0d4f8a9b1e2d3f",
  "company_id":      "<company_id>",
  "scene_id":        3,
  "voice_file":      "XcR0k",
  "score":           1.0,
  "coordinate_space": {
    "width":  280,
    "height": 498,
    "unit":   "editor_preview_px"
  },
  "safe_zones": {
    "dead_top":    { "x": 0, "y": 0,    "w": 280, "h": 49.8,  "coordinate_space": "preview", "reason": "top_10_percent_reserved" },
    "dead_bottom": { "x": 0, "y": 373.5,"w": 280, "h": 124.5, "coordinate_space": "preview", "reason": "bottom_25_percent_reserved" },
    "safe_rect":   { "x": 0, "y": 49.8, "w": 280, "h": 323.7, "coordinate_space": "preview" }
  },
  "scene": {
    "text":           "Meta đã chi 14.3 tỷ đô để mua Scale AI…",
    "talking_point":  "AI training data is the new oil.",
    "type":           "STAT",
    "pattern":        "single_metric",
    "keyword":        "Scale AI",
    "visual":         "Chart of training data spend.",
    "quote":          "$14.3B",
    "show_narrator":  true,
    "active_roll":    "A"
  },
  "boxes": {
    "narrator": {
      "rect":      { "x": 35, "y": 124, "w": 210, "h": 374, "coordinate_space": "preview" },
      "visible":   true,
      "face_source": { "x": 30, "y": 60, "w": 100, "h": 100, "coordinate_space": "narrator_media_280x498" },
      "face":      { "x": 95, "y": 195, "w": 80,  "h": 80,  "coordinate_space": "preview" },
      "face_center": { "x": 135, "y": 235 },
      "face_source_coordinate_space": "narrator_media_280x498",
      "face_coordinate_space_note": "face is converted from face_source through the current overlay.narrator rect"
    },
    "caption": {
      "container_rect":     { "x": 0, "y": 360, "w": 280, "h": 96, "coordinate_space": "preview" },
      "text_rect_estimate": { "x": 10, "y": 370, "w": 260, "h": 60, "coordinate_space": "preview" },
      "visible":            true
    },
    "remotion": {
      "groups": [
        { "id": "main", "rect": { "x": 0, "y": 0, "w": 280, "h": 498 }, "temporal_policy": "simultaneous_static" }
      ],
      "objects": [
        { "id": "obj_01", "rect": { "x": 24, "y": 60,  "w": 232, "h": 42 } },
        { "id": "obj_02", "rect": { "x": 24, "y": 110, "w": 232, "h": 42 } }
      ],
      "object_layer": {
        "objects": [
          {
            "layout_id":       "main.one_by_one",
            "rect":            { "x": 24, "y": 140, "w": 232, "h": 42 },
            "rect_canvas":     { "x": 61.7, "y": 360.5, "w": 596.6, "h": 108.1 },
            "temporal_policy": "one_by_one",
            "update_field":    "remotion.object.rect"
          }
        ]
      },
      "sequence_objects": [
        { "id": "seq_03_text", "start": 0.0, "end": 2.5, "rect": { "x": 24, "y": 140, "w": 232, "h": 42 } }
      ]
    }
  },
  "remotion_spec": {
    "remotion_spec_file":    "XcR0k_spec.json",
    "remotion_spec_url":     "https://widecast.ai/downloads/<company_id>/<topic_id>/XcR0k_spec.json?v=1748293012",
    "remotion_spec_version": "1748293012",
    "remotion_spec_exists":  true,
    "remotion_spec_state":   "ready"
  },
  "violations": [
    {
      "code":     "remotion_object_in_top_dead_zone",
      "severity": "warning",
      "a":        "remotion.object_layer:main.one_by_one",
      "b":        "dead_zone.top",
      "overlap":  0.18
    }
  ],
  "warnings": [
    {
      "code":     "remotion_object_too_small_for_mobile",
      "severity": "warning",
      "object":   "remotion.object_layer:main.obj_03_text",
      "rect":     { "x": 24, "y": 140, "w": 22, "h": 14 },
      "message":  "Object may be too small to read on mobile."
    }
  ],
  "summary": {
    "error_count":                       0,
    "warning_count":                     2,
    "remotion_object_count":             2,
    "remotion_object_layer_count":       1,
    "remotion_sequence_object_count":    1,
    "remotion_group_count":              1,
    "remotion_temporal_policies":        ["simultaneous_static"],
    "remotion_geometry_basis":           "static_poster_objects_with_sequence_metadata"
  },
  "request_id": "req_abcd…"
}
```

### Field reference

| Path | Description |
|---|---|
| `coordinate_space` | `{width: 280, height: 498, unit: "editor_preview_px"}`. All `rect` values use this space unless suffixed `_canvas`. |
| `safe_zones.dead_top` | Top 10% reserved (status bar / notch). |
| `safe_zones.dead_bottom` | Bottom 25% reserved (system gesture area). |
| `safe_zones.safe_rect` | Between the two dead zones. |
| `scene.*` | Narration + planning context: `text`, `talking_point`, `type`, `pattern`, `keyword`, `visual`, `quote`, `show_narrator`, `active_roll`. |
| `boxes.narrator.rect` | Current `overlay.narrator.rect` in preview coords. |
| `boxes.narrator.visible` | Narrator visibility flag. |
| `boxes.narrator.face_source` | Source-space face box from `segment.narrator_face` (narrator media coord system). **Do NOT mutate `segment.narrator_face` for layout edits.** |
| `boxes.narrator.face` | **Displayed** face box — converted from `face_source` through the current narrator rect. |
| `boxes.narrator.face_center` | Center point of the displayed face box. |
| `boxes.caption.container_rect` | Current `overlay.caption` rect in preview coords. **Read-only for layout decisions** — only `overlay.caption.y` is mutable. |
| `boxes.caption.text_rect_estimate` | Tight box around the rendered caption text (estimate). Use this to check collisions with the narrator face. |
| `boxes.remotion.groups[]` | Storyboard groups — `{id, rect, temporal_policy}`. Lower-level debug data. |
| `boxes.remotion.objects[]` | STATIC/POSTER display boxes resolved with the same Storyboard math used by `{voice_file}_overlay_poster.png`. Lower-level debug. |
| `boxes.remotion.object_layer.objects[]` | **Agent-facing layer.** Each item: `layout_id`, `rect` (preview), `rect_canvas` (Remotion 720×1280), `temporal_policy`, `update_field: "remotion.object.rect"`. |
| `boxes.remotion.sequence_objects[]` | All temporal objects (every timed instance). Lower-level debug. |
| `remotion_spec` | Loaded `{voice_file}_spec.json` metadata: `remotion_spec_file`, cache-busted `remotion_spec_url`, `remotion_spec_version`, `remotion_spec_exists`, `remotion_spec_state`. |
| `violations[]` | Collision codes with `severity: error|warning|info`, `a_label` / `b_label` for the colliding rects, `overlap` ratio. |
| `warnings[]` | Soft signals (e.g. mobile-readability, missing narrator_face). |
| `summary` | Top-level counts + policy summary. |

### Violation codes

| Code | Severity | Meaning |
|---|---|---|
| `remotion_object_overlaps_narrator_face` | error | Overlay object covers the narrator's face — agents must move it. |
| `remotion_object_overlaps_narrator_body` | info | Overlay object covers the narrator body (often desired). |
| `remotion_object_in_top_dead_zone` | warning | Overlay object intrudes into the top safe area. |
| `remotion_object_in_bottom_dead_zone` | warning | Overlay object intrudes into the bottom safe area. |
| `remotion_group_in_top_dead_zone` | warning / info | Whole Storyboard group intrudes top zone (info when group is the canvas wrapper). |
| `remotion_group_in_bottom_dead_zone` | warning / info | Whole Storyboard group intrudes bottom zone. |
| `caption_text_overlaps_narrator_face` | warning | Caption text estimate covers the narrator face. |

### Warning codes

| Code | Meaning |
|---|---|
| `remotion_object_too_small_for_mobile` | Object width or height below mobile-readability minimum. |
| `narrator_face_outside_narrator` | Converted face center falls outside `overlay.narrator.rect` — narrator_face source data or rect may be stale. |
| `missing_narrator_face` | Scene has no `narrator_face`; face collision can only be approximated from the narrator body. |

### Error responses

| `error.code` | HTTP | When |
|---|---|---|
| `missing_field` | 400 | `id` is empty, or neither `voice_file` / `scene_id` / `by`+`value` is provided. |
| `invalid_id` | 400 | `id` doesn't match an accepted topic id. |
| `invalid_by` | 400 | `by` is not one of `voice_file` / `id` / `text`. |
| `video_not_found` | 404 | No video with this id on the account. |
| `script_not_ready` | 409 | Video is still processing — poll `/v1/status/{id}` first. |
| `script_parse_failed` | 502 | Stored video_script is malformed. |
| `scene_not_found` | 404 | The id / voice_file / text didn't match any scene. |
| `scene_geometry_failed` | 500 | Internal error building the geometry — surface `request_id` and retry. |
| `missing_api_key` / `invalid_api_key` | 401 | Auth. |

On ambiguous `by="text"` match the response is a 200 `ClarificationResponse` (no geometry) — same shape as [`/v1/modify_scene`](modify-scene.md).

---

## SDK examples

### Python — audit + plan a `layout.batch`

```python
from widecast import Widecast

client = Widecast()
geom = client.scene_geometry("widecast7c0d4f8a9b1e2d3f", voice_file="XcR0k")

face = geom["boxes"]["narrator"]["face"]
caption = geom["boxes"]["caption"]["text_rect_estimate"]
print("narrator face:", face)
print("caption text rect:", caption)

# Pick the agent-facing object-layer rect to move
target_obj = next(
    o for o in geom["boxes"]["remotion"]["object_layer"]["objects"]
    if o["layout_id"].endswith(".one_by_one")
)
print("layout_id:", target_obj["layout_id"], "rect:", target_obj["rect"])

# Push the overlay below the face center
new_y = max(int(face["y"]) + int(face["h"]) + 8, 200)
result = client.modify_scene(
    "widecast7c0d4f8a9b1e2d3f",
    by="voice_file", value="XcR0k",
    fields=[
        {"field_name": "remotion.object.rect",
         "value": {"layout_id": target_obj["layout_id"], "y": new_y,
                   "coordinate_space": "preview"}},
    ],
)
print("new spec:", result["remotion_spec_url"])
```

### TypeScript — collision audit

```typescript
import Widecast from "@widecast/sdk";

const client = new Widecast();
const geom = await client.scene_geometry("widecast7c0d4f8a9b1e2d3f", {
  voice_file: "XcR0k",
});

const errors = geom.violations.filter((v: any) => v.severity === "error");
if (errors.length > 0) {
  console.log("Layout problems:");
  for (const v of errors) console.log("  ", v.code, "→", v.a, "vs", v.b);
}
```

### Manual (curl)

```bash
curl -sS -X POST ".../v1/scene_geometry" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -H "Content-Type: application/json" \
  -d '{ "id": "widecast7c0d4f8a9b1e2d3f", "voice_file": "XcR0k" }' | jq
```

---

## When to use which surface

| Question | Tool |
|---|---|
| What scenes are in this video? What's the `voice_file` of scene 3? | [`/v1/video_data`](video-data.md) |
| Where is the narrator face / caption / overlay object on this scene? | **`/v1/scene_geometry`** |
| What does the editor actually look like right now in the user's browser? | [`/v1/scene_inspector`](scene-inspector.md) (expensive) |
| Move / resize an overlay object | [`/v1/modify_scene`](modify-scene.md) `remotion.object.rect` |
| Move the narrator + caption + overlay in one shot | [`/v1/modify_scene`](modify-scene.md) `layout.batch` |
