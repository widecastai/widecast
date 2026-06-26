# Edit one scene — `POST /v1/modify_scene`

**Synchronous, no credit charged** until [`/v1/export_video`](export-video.md) re-renders the final MP4. After the user reviews scenes (via `result.review_url` from [`/v1/create_video`](create-video.md)) and asks to edit a specific scene, call this endpoint to apply the change in place. Successful edits publish MQTT realtime to every open scene editor, so the user sees the change live.

> **Agent rule — data-first.** Call [`/v1/video_data`](video-data.md) **first** and use `voice_file` (the stable per-scene UID, also the base of `{voice_file}_spec.json`) as the selector. `segment.id` is only current display/order metadata and may change after reorder/add/delete.

The endpoint supports **three edit branches**. Pick exactly one family per call — do not mix.

| Branch | Use it when | Field family |
|---|---|---|
| **(A) Background media swap** | Replace the background image/video on a scene. | `mediaUrl` (+ optional `mediaType`) |
| **(B) Upload Overlay** | Drop in an agent-supplied image and recompute the Remotion overlay spec. NOT Regenerate Overlay (which is paid). | `remotion.upload_overlay` |
| **(C) Storyboard group rect** | Move / resize the entire Storyboard group in the Remotion spec. | `remotion.group.rect` |

<!-- widecast-playground:modify-scene -->

> **`remotion.object.rect` is disabled for agents.** Child-object edits break the computed group layout — the server returns `400 object_level_edit_disabled`. Use group rect instead.

> **`segment.remotion_spec == "none"`** means the user intentionally disabled the overlay on that scene. Layout edits (branch C) return `remotion_spec_disabled`. **Do not auto-enable** — restore the overlay only with Upload Overlay if the user explicitly asks.

> **Planned**: `overlay.narrator` / `overlay.caption` rect/config in the legacy 280×498 editor coordinate space (not in this release).

---

## Common request envelope

```http
POST /v1/modify_scene
Authorization: Bearer wc_live_REPLACE_ME
Content-Type: application/json

{
  "id":    "widecast7c0d4f8a9b1e2d3f",
  "by":    "voice_file",
  "value": "XcR0k",
  "fields": [ /* one family — see branches below */ ]
}
```

### Common field reference

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | `topic_id` from [`/v1/create_video`](create-video.md) / [`/v1/video_data`](video-data.md). Accepts `widecast...`, `gubo...`, or current ids. Same id used by `/v1/status` and `/v1/export_video`. The video must have reached `scenes_ready_for_review` (HTTP 409 otherwise). |
| `by` | string enum | yes | How to pick the scene. **Prefer `"voice_file"`** — the stable per-scene UID. `"id"` matches the current `segment.id` order/display (UNSTABLE). `"text"` fuzzy-matches `segment.text`; multi-match returns a clarification. |
| `value` | string \| number | yes | The `voice_file` / `id` / narration snippet to match. |
| `fields` | array | yes | Non-empty list of `{ field_name, value }` edits — one family only. See branch sections below. |
| `op` | string | no | Reserved for future generic ops. Defaults to `"set"`. |
| `min_score` | number | no | Only for `by="text"`. Fuzzy threshold 0..1 (default `0.5`). Lower cautiously for paraphrases; raising past `0.9` usually causes false negatives. |

---

## Branch (A) — Background media swap

Roll-aware: B-roll scenes get the asset as the background; A-roll scenes register it as the overlay without touching the narrator.

```jsonc
{
  "id":    "widecast7c0d4f8a9b1e2d3f",
  "by":    "voice_file",
  "value": "XcR0k",
  "fields": [
    { "field_name": "mediaUrl",  "value": "https://cdn.example.com/coast-sunset.jpg" },
    { "field_name": "mediaType", "value": "image" }
  ]
}
```

| `field_name` | Value | Notes |
|---|---|---|
| `mediaUrl` | http(s) URL | The image OR video to use. |
| `mediaType` | `"image"` \| `"video"` | Optional; auto-detected from the URL extension. |

| Scene roll | Behaviour |
|---|---|
| **B-roll** | Asset IS the background. `mediaUrl`, `thumbnailUrl`, `brollUrl`, `brollThumbnailUrl` are synced (`brollUrl === mediaUrl`). |
| **A-roll** | Narrator + grid untouched. Asset becomes `brollUrl` / `user_asset_url`; the next scene-spec gen turns it into the overlay (image → chest-card; video → `brollUrl` backdrop). |

Success response includes `applied`, `media_type`, `media_url`, and the full updated `segment`.

---

## Branch (B) — Upload Overlay

Free, agent-supplied image → Remotion overlay spec. This is **not** Regenerate Overlay (which is paid because WideCast calls image generation). The pipeline classifies the image (graphic vs realistic), decomposes it into objects, and applies a strict no-AI fallback when decomposition fails.

```jsonc
{
  "id":    "widecast7c0d4f8a9b1e2d3f",
  "by":    "voice_file",
  "value": "XcR0k",
  "fields": [
    { "field_name": "remotion.upload_overlay", "value": "https://cdn.example.com/overlay-720x1280.png" }
  ]
}
```

You can also pass `value: { "url": "https://..." }` if you need to attach future options.

**Grounding rule.** If the agent creates the image first, it MUST be grounded in scene context (`text`, `talking_point`, `visual`, `quote`, `keyword`, `type`) — do not invent unrelated visuals.

**Image guidance for best decomposition**:

- Portrait 9:16, preferably **720×1280 transparent PNG**.
- Flat-background graphic with large, separated foreground objects/text.
- Strong contrast, readable typography.
- Avoid photo-realistic backgrounds, heavy gradients, vignettes, and tiny dense text — those get classified `realistic` and are kept as ONE full-frame image (not decomposed).

Upload Overlay is an **explicit opt-in to recreate an overlay** even if the scene previously had `remotion_spec="none"`.

The success response includes `remotion_spec_updated: true`, `remotion_spec_file`, a cache-busted `remotion_spec_url`, `remotion_spec_version`, `remotion_spec_state: "ready"`, plus the agent-supplied `uploaded_overlay_url` and `cost: 0`.

---

## Branch (C) — Remotion Storyboard group rect

Free layout edit. Moves or resizes the entire Storyboard group in the per-scene Remotion spec without touching child objects (default) or with a wrapper-only change (advanced).

```jsonc
{
  "id":    "widecast7c0d4f8a9b1e2d3f",
  "by":    "voice_file",
  "value": "XcR0k",
  "fields": [
    {
      "field_name": "remotion.group.rect",
      "value": {
        "element_id": "main",
        "x": 111,
        "y": -120,
        "w": 498,
        "h": 174,
        "coordinate_space": "canvas",
        "resize_mode": "scale_children"
      }
    }
  ]
}
```

| Key | Description |
|---|---|
| `element_id` | Optional. Group id. Omit when the spec has a single Storyboard group or a group with `id="main"`. |
| `x`, `y` | Wrapper top-left position. **Move-only when w/h omitted.** Canvas coords are **not clamped** — `y: -120` legitimately translates a full-canvas group upward. |
| `w`, `h` | Wrapper width/height. Triggers resize. |
| `coordinate_space` | `"canvas"` (720×1280) or `"preview"` (280×498 editor coords — server converts). |
| `resize_mode` | `"scale_children"` (default) — wrapper + every child object + root `background.bbox` scale together. `"wrapper_only"` is advanced and rarely correct for agents. |

**Coordinate spaces** (also embedded in `agent_meta.coordinate_spaces` returned by `/v1/video_data`):

| Space | Width × Height | Used by |
|---|---|---|
| Remotion canvas | 720 × 1280 | `remotion.*` fields, the per-scene spec file |
| Legacy editor preview | 280 × 498 | `overlay.caption`, `overlay.narrator` |

The success response includes `remotion_spec_updated: true`, `remotion_spec_file`, a cache-busted `remotion_spec_url`, `remotion_spec_version`, `remotion_spec_state: "ready"`, plus an `applied` object describing the group rect change.

---

## Responses

### `200 OK` — `scene_modified`

```jsonc
{
  "object":     "scene_modified",
  "id":         "widecast7c0d4f8a9b1e2d3f",
  "scene_id":   3,
  "voice_file": "XcR0k",
  "score":      1.0,
  "applied":    { "cost": 0, "uploaded_overlay_url": "https://..." },
  "segment":    { /* full updated segment */ },
  "remotion_spec_updated":   true,
  "remotion_spec_file":      "XcR0k_spec.json",
  "remotion_spec_url":       "https://widecast.ai/downloads/<company_id>/<topic_id>/XcR0k_spec.json?v=1748293012",
  "remotion_spec_version":   "1748293012",
  "remotion_spec_state":     "ready",
  "remotion_spec_exists":    true
}
```

- `scene_id` — current `segment.id` (display/order). For tracking the same scene across edits use `voice_file`.
- `score` — `1.0` for `by="id"`/`by="voice_file"`; the fuzzy score for `by="text"`.
- `applied` — older media-only responses carried a string (`"media"`); current responses carry an object describing the family-specific change.
- `media_type`, `media_url` — set only on the background-media branch.
- `remotion_spec_*` — set on Upload Overlay and group rect branches.

Successful edits publish MQTT realtime to every open editor; the change is visible immediately. Call [`/v1/export_video`](export-video.md) again only when the user wants a fresh final MP4.

### `200 OK` — `clarification` (ambiguous `by="text"`)

When two or more scenes match the supplied text closely enough that picking one would be a guess, the server returns a clarification — **no edit is applied**.

```jsonc
{
  "object":      "clarification",
  "needs_input": "value",
  "message":     "More than one scene matches that text closely. Pick one and call again with by='voice_file' and value set to the chosen scene's voice_file.",
  "candidates":  [
    { "segment_id": 3, "voice_file": "XcR0k", "score": 0.92, "text": "Meta đã chi 14.3 tỷ đô để mua Scale AI…" },
    { "segment_id": 7, "voice_file": "Z9p2m", "score": 0.88, "text": "Meta chi 14.3 tỷ USD đầu tư vào AI training data…" }
  ]
}
```

Show the `text` previews to the user, get a pick, retry with `by="voice_file"`.

### `404 Not Found`

- `video_not_found` — no video with this id on the account.
- `scene_not_found` — the id / voice_file / text didn't match any scene (with the configured `min_score` floor).

### `409 Precondition Failed`

- `scenes_not_ready` — the video hasn't reached `scenes_ready_for_review`. Poll `/v1/status/{id}` first.
- `invalid_script` — the stored scene script is malformed; the video cannot be edited via this endpoint.

### `400 Bad Request`

- `invalid_json` — request body is not valid JSON.
- `missing_field` — required field missing (`id`, `by`, `value`, `fields`).
- `invalid_id` — `id` doesn't match an accepted topic id.
- `invalid_by` — `by` is not one of `voice_file` / `id` / `text`.
- `invalid_field_entry` — an entry in `fields` is not `{ field_name, value }`.
- `unsupported_field` — `field_name` not in the supported set (`mediaUrl`, `mediaType`, `remotion.upload_overlay`, `remotion.group.rect`).
- `invalid_media_url` — `mediaUrl` / `remotion.upload_overlay` value is not an http(s) URL the server can reach.
- `object_level_edit_disabled` — `remotion.object.rect` requested; child-object edits break the computed layout. Use `remotion.group.rect` instead.
- `remotion_spec_disabled` — the scene has `remotion_spec="none"`; do not auto-enable. Use Upload Overlay only if the user explicitly asks.

---

## SDK examples

### Python — Upload Overlay

```python
from widecast import Widecast

client = Widecast()

# 1) Data-first audit.
data = client.video_data("widecast7c0d4f8a9b1e2d3f")
target = next(s for s in data["segments"] if "Scale AI" in s.get("text", ""))

# 2) Drop in a portrait 720x1280 transparent PNG.
result = client.modify_scene(
    "widecast7c0d4f8a9b1e2d3f",
    by="voice_file", value=target["voice_file"],
    fields=[{"field_name": "remotion.upload_overlay",
             "value": "https://cdn.example.com/overlay-720x1280.png"}],
)
print("new spec:", result["remotion_spec_url"])
```

### TypeScript — group rect move

```typescript
import Widecast from "@widecast/sdk";

const client = new Widecast();
const data = await client.video_data("widecast7c0d4f8a9b1e2d3f");
const target = data.segments.find(s => /Scale AI/i.test(s.text ?? "")) ?? data.segments[0];

const result = await client.modify_scene({
  id:    "widecast7c0d4f8a9b1e2d3f",
  by:    "voice_file",
  value: target.voice_file,
  fields: [
    {
      field_name: "remotion.group.rect",
      value: {
        element_id: "main",
        y: -120,                 // canvas coords; negative is allowed
        coordinate_space: "canvas",
      },
    },
  ],
});

if (result.object === "scene_modified") {
  console.log("spec ready:", result.remotion_spec_url);
}
```

### Manual (curl) — Background media swap

```bash
curl -sS -X POST ".../v1/modify_scene" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -H "Content-Type: application/json" \
  -d '{
        "id":    "widecast7c0d4f8a9b1e2d3f",
        "by":    "voice_file",
        "value": "XcR0k",
        "fields": [
          { "field_name": "mediaUrl",  "value": "https://cdn.example.com/coast-sunset.jpg" }
        ]
      }' | jq
```

---

## Cost & ordering

- **Free** — `/v1/modify_scene` does not consume credits. The expensive work (re-rendering the final MP4) only runs when you call [`/v1/export_video`](export-video.md) again.
- **Order matters when re-rendering**: apply all edits first, then call `/v1/export_video` once. Edits made after `/v1/export_video` won't appear in the already-queued render.

---

## When to use `by="text"`

Prefer `by="voice_file"` whenever you have it from a previous `/v1/video_data` / `/v1/status` call — exact matches never fail. Use `by="text"` only when the user names a scene by what's said in it ("change the picture on the scene about Meta and Scale AI"). The endpoint is ambiguity-safe — it returns a clarification rather than guess — but the round-trip costs a call. When the user paraphrases, lower `min_score` cautiously to `0.4`–`0.45`; do not raise past `0.9`.
