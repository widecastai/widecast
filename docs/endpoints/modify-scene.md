# Edit one scene — `POST /v1/modify_scene`

**Synchronous** for most branches (some upload branches are async — see below), **no credit charged** until [`/v1/export_video`](export-video.md) re-renders the final MP4. After the user reviews scenes (via `result.review_url` from [`/v1/create_video`](create-video.md)) and asks to edit a specific scene, call this endpoint to apply the change in place. Successful edits publish MQTT realtime to every open scene editor, so the user sees the change live.

> **Agent rule — data-first.** Call [`/v1/video_data`](video-data.md) **first** and use `voice_file` (the stable per-scene UID, also the base of `{voice_file}_spec.json`) as the selector. For **layout edits**, also call [`/v1/scene_geometry`](scene-geometry.md) to read narrator / caption / Remotion object boxes in 280×498 editor-preview coords without rendering anything. `segment.id` is only current display/order metadata and may change after reorder/add/delete.

The endpoint supports **thirteen edit branches**, grouped by family. Pick exactly one family per call — the only intentional multi-family call is **`layout.batch`** (G), which composes layout-only children.

| Branch | Use it when | Field family |
|---|---|---|
| **(A) Background media swap** | Replace the background image/video on a scene. | `mediaUrl` (+ optional `mediaType`) |
| **(B) Upload Overlay** | Drop in an agent-supplied asset (raster image **or** SVG) and recompute the Remotion overlay spec. SVG with `<g data-wc-object>` groups = pixel-perfect deterministic decomposition. NOT Regenerate Overlay (paid). | `remotion.upload_overlay` |
| **(C) Object-layer rect** *(preferred overlay layout)* | Move / resize a Remotion overlay object — read `boxes.remotion.object_layer.objects` from `/v1/scene_geometry` first. | `remotion.object.rect` |
| **(D) Storyboard group rect** *(low-level wrapper edit)* | Move / resize the entire Storyboard group; prefer (C) for visible overlay layout. | `remotion.group.rect` |
| **(E) Narrator rect** | Move / resize the narrator box in legacy 280×498 editor coords. | `overlay.narrator.rect` / `overlay.narrator.x|y|w|h` |
| **(F) Caption Y** | Vertical-only caption placement in 280×498 coords. | `overlay.caption.y` |
| **(G) Layout batch** | Atomic narrator + caption + Remotion layout changes (one persist + one MQTT). | `layout.batch` (or multiple layout fields directly) |
| **(H) Upload Voice** *(async)* | User-supplied narration audio (transcribed + retimed). | `voice.upload` |
| **(I) Upload Narrator Video** *(async)* | User-supplied A-roll narrator video. | `narrator.upload_video` |
| **(J) A/B-roll switch** | Toggle the active roll without uploading anything. | `roll.active` / `roll.switch` |
| **(K) Segment text** | Correct narration/caption text while keeping audio timing. | `segment.text` |
| **(L) Scene metadata** | Update scene planning metadata (`pattern`, `type`, …). | metadata fields |
| **(M) Remotion add element** *(add-only)* | Append a new text / stat / label / callout / image object to the overlay; follow up with (C) `layout.batch` for placement. | `remotion.add_element` |
| **(N) Disable overlay** | Hide the Remotion overlay on one scene by setting `remotion_spec="none"` (spec/poster files preserved). | `disable_overlay` (aliases: `remotion.disable_overlay` / `overlay.disable` / `remotion_spec.none`) |

<!-- widecast-playground:modify-scene -->

> **`segment.remotion_spec == "none"`** means the user intentionally disabled the overlay on that scene (via Branch **(N)** or UI). Layout edits return `remotion_spec_disabled`. **Do not auto-enable** — restore the overlay only with **Upload Overlay** (B) if the user explicitly asks.

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
| `id` | string | yes | `topic_id` from [`/v1/create_video`](create-video.md) / [`/v1/video_data`](video-data.md). Accepts `widecast...`, `gubo...`, or current ids. The video must have reached `scenes_ready_for_review` (HTTP 409 otherwise). |
| `by` | string enum | yes | How to pick the scene. **Prefer `"voice_file"`** — the stable per-scene UID. `"id"` matches the current `segment.id` order/display (UNSTABLE). `"text"` fuzzy-matches `segment.text`; multi-match returns a clarification. |
| `value` | string \| number | yes | The `voice_file` / `id` / narration snippet to match. |
| `fields` | array | yes | Non-empty list of `{ field_name, value }` edits — one family per call. See branch sections below. |
| `op` | string | no | Reserved for future generic ops. Defaults to `"set"`. |
| `min_score` | number | no | Only for `by="text"`. Fuzzy threshold 0..1 (default `0.5`). Lower cautiously for paraphrases; raising past `0.9` usually causes false negatives. |

---

## Coordinate spaces

Two spaces appear in `modify_scene` — they are **not** interchangeable:

| Space | Width × Height | Used by |
|---|---|---|
| Remotion canvas | **720 × 1280** | `remotion.group.rect` (default), spec content |
| Legacy editor preview | **280 × 498** | `overlay.narrator.*`, `overlay.caption.y`, `remotion.object.rect`, `remotion.group.rect` with `coordinate_space:"preview"` |

When in doubt, ask [`/v1/scene_geometry`](scene-geometry.md) for the box you want to move — it returns everything in 280×498 preview coords plus a `rect_canvas` mirror for the object layer.

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
| `mediaUrl` | http(s) URL | Image OR video. |
| `mediaType` | `"image"` \| `"video"` | Optional; auto-detected from URL extension. |

| Scene roll | Behaviour |
|---|---|
| **B-roll** | Asset IS the background. `mediaUrl`, `thumbnailUrl`, `brollUrl`, `brollThumbnailUrl` synced (`brollUrl === mediaUrl`). |
| **A-roll** | Narrator + grid untouched. Asset becomes `brollUrl` / `user_asset_url`; next scene-spec gen turns it into the overlay (image → chest-card; video → `brollUrl` backdrop). |

Response includes `applied`, `media_type`, `media_url`, and the full updated `segment`.

---

## Branch (B) — Upload Overlay

Free, agent-supplied **asset** → Remotion overlay spec. This is **not** Regenerate Overlay (which is paid because WideCast calls image generation).

Two upload formats are supported, **chosen by the URL extension**:

| Format | Trigger | Pipeline | Decomposition | When to use |
|---|---|---|---|---|
| **SVG** | URL ends `.svg` | `svg2spec` (each `<g data-wc-object>` group → one object) | **Deterministic, pixel-perfect** (NO auto-fit; max diff 2/255 vs original) | Agent authors the overlay programmatically and wants guaranteed decomposition + animation hints in one file. |
| **Raster** | PNG / JPG / WebP / GIF / etc | `detect.py` classifier → graphic decomposition OR full-frame realistic fallback | Classifier-driven (heuristic) | Existing image file, scanned graphics, designer-provided assets. |

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

**Grounding rule.** Whichever format you choose, the asset MUST be grounded in scene context (`text`, `talking_point`, `visual`, `quote`, `keyword`, `type`) — do not invent unrelated visuals.

### 📐 SVG path (PREFERRED for agent-authored overlays)

When the URL ends `.svg` (case-insensitive), WideCast routes through `svg2spec`:

1. Parses the SVG.
2. Finds every `<g data-wc-object="name">` group (document order).
3. Rasterizes **each group alone** on a transparent 720×1280 canvas.
4. Crops to the alpha bbox → base64 PNG → one Storyboard object per group.
5. Each object is placed at its authored bbox with **NO auto-fit** (pixel-perfect; verified max diff 2/255 vs the original SVG).

**Required**: `viewBox="0 0 720 1280"` (portrait — matches the Remotion canvas).

**Per-group attributes**:

| Attribute | Required? | Description |
|---|---|---|
| `data-wc-object="name"` | **yes** | Stable id/name. Groups WITHOUT this are rasterized into the background instead of becoming separate objects. |
| `data-wc-kind` | no | `"object"` \| `"text"` \| `"bar"` \| `"mark"` \| `"callout"` — inferred from content if missing. |
| `data-wc-anim` | no | Entry animation: `"slide-up"` \| `"slide-down"` \| `"slide-left"` \| `"slide-right"` \| `"pop"` \| `"grow-x"` \| `"grow-y"` \| `"fade"` (default `"fade"`; bar shapes get `growRight` / `growUp` automatically). |
| `data-wc-z` | no | Paint/stack order (default = document order). |

**Authoring example** (a stat callout next to an icon):

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 1280">
  <g data-wc-object="bg-card" data-wc-kind="object" data-wc-anim="fade">
    <rect x="60" y="380" width="600" height="240" rx="32" fill="#1e293b"/>
  </g>
  <g data-wc-object="icon" data-wc-kind="mark" data-wc-anim="pop" data-wc-z="2">
    <circle cx="160" cy="500" r="60" fill="#a78bfa"/>
    <path d="M130 500 l25 25 l45 -50" stroke="#fff" stroke-width="8" fill="none"/>
  </g>
  <g data-wc-object="stat-number" data-wc-kind="text" data-wc-anim="slide-up" data-wc-z="3">
    <text x="260" y="490" font-family="Inter" font-size="64" font-weight="800" fill="#fff">$14.3B</text>
  </g>
  <g data-wc-object="stat-label" data-wc-kind="text" data-wc-anim="slide-up" data-wc-z="4">
    <text x="260" y="560" font-family="Inter" font-size="28" fill="#cbd5e1">Meta → Scale AI</text>
  </g>
</svg>
```

```jsonc
{
  "id":    "widecast7c0d4f8a9b1e2d3f",
  "by":    "voice_file",
  "value": "XcR0k",
  "fields": [
    { "field_name": "remotion.upload_overlay", "value": "https://cdn.example.com/scene-overlay.svg" }
  ]
}
```

**SVG-specific errors**:

| HTTP | `error.code` | When |
|---|---|---|
| 422 | `svg2spec_failed` | Parse error / missing viewBox / no `data-wc-object` groups / structural issue (the message carries the underlying svg2spec reason). |
| 502 | (network) | SVG URL couldn't be downloaded. |

> The SVG path is **strict**: a bad authored file produces a clean 422 with a structural reason, not a silent fallback into another pipeline.

### 🖼 Raster path (default for non-SVG URLs)

Image guidance for best object decomposition:

- Portrait 9:16, preferably **720×1280 transparent PNG**.
- Flat-background graphic with large, separated foreground objects/text.
- Strong contrast, readable typography.
- Avoid photo-realistic backgrounds, heavy gradients, vignettes, and tiny dense text — those get classified `realistic` and are kept as ONE full-frame image (not decomposed).

> When in doubt, author SVG — the SVG path has no classifier in the loop, so you get the exact decomposition you authored.

Upload Overlay (either format) is an **explicit opt-in to recreate an overlay** even if the scene previously had `remotion_spec="none"`.

The success response includes `remotion_spec_updated: true`, `remotion_spec_file`, a cache-busted `remotion_spec_url`, `remotion_spec_version`, `remotion_spec_state: "ready"`, plus the agent-supplied `uploaded_overlay_url`, `cost: 0`, and `remotion_poster_url` (a static fallback poster used by `/v1/scene_inspector` when no live browser is available).

---

## Branch (C) — Remotion Storyboard object-layer rect (preferred overlay layout)

Free layout edit. **This is the API you want for visible overlay layout.** First call [`/v1/scene_geometry`](scene-geometry.md) and read `boxes.remotion.object_layer.objects` — each item carries:

| Field | Meaning |
|---|---|
| `layout_id` | Stable id, e.g. `main.one_by_one`, `main.obj_03_text`. Pass this back as the selector. |
| `rect` | Box in 280×498 editor-preview coords. |
| `rect_canvas` | Same box in 720×1280 Remotion canvas coords. |
| `temporal_policy` | `simultaneous_static` / `one_by_one`. |
| `update_field` | `"remotion.object.rect"` — the modify_scene field name. |

Then send:

```jsonc
{
  "id":    "widecast7c0d4f8a9b1e2d3f",
  "by":    "voice_file",
  "value": "XcR0k",
  "fields": [
    {
      "field_name": "remotion.object.rect",
      "value": {
        "layout_id": "main.one_by_one",
        "x": 24,
        "y": 140,
        "w": 232,
        "h": 42,
        "coordinate_space": "preview"
      }
    }
  ]
}
```

- The agent edits **simple visible object boxes**; WideCast maps the rect back onto raw Storyboard object offsets/sizes and **keeps the group wrapper unchanged**.
- For `one_by_one`, scene_geometry exposes **ONE logical `*.one_by_one` rect** — editing it transforms all timed sequence items together so the agent never reasons about timing.
- Multiple `remotion.object.rect` entries in one call are allowed (still one family).
- Object-layer x/y may produce negative raw offsets relative to the group; that is allowed and matches Remotion rendering.

Response includes `remotion_object_updated: true`, `remotion_spec_updated: true`, a cache-busted `remotion_spec_url`, `remotion_poster_url` (refreshed), and the updated `segment`.

---

## Branch (D) — Remotion Storyboard group rect (low-level wrapper edit)

Free layout edit. **Prefer (C)** for visible overlay layout — this branch is the low-level wrapper edit used when you want to translate or resize the whole group without re-laying out the children.

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

---

## Branch (E) — Narrator layout rect

Free layout edit in legacy **280×498 editor preview** coords. Send the whole rect, or field-by-field.

```jsonc
{
  "id":    "widecast7c0d4f8a9b1e2d3f",
  "by":    "voice_file",
  "value": "XcR0k",
  "fields": [
    {
      "field_name": "overlay.narrator.rect",
      "value": {
        "x": 35,
        "y": 124,
        "w": 210,
        "h": 374,
        "visible": true
      }
    }
  ]
}
```

You can also send `overlay.narrator.x`, `overlay.narrator.y`, `overlay.narrator.w`, `overlay.narrator.h` individually.

**Important**:

- The server preserves existing narrator metadata and the source-space `segment.narrator_face` — do NOT mutate `narrator_face` for layout edits. It's the source-space face box for the narrator media and only refreshes when narrator media is generated / recorded / uploaded.
- `overlay.narrator.touched=true` is set by default so auto-fit doesn't overwrite the intentional placement.
- [`/v1/scene_geometry`](scene-geometry.md) returns the **displayed** face box converted through the current narrator rect (`boxes.narrator.face`) for layout collision checks.
- No media / audio / timeline / Remotion spec changes.

Response: `narrator_layout_updated: true`, `message: "Narrator layout updated."`, plus the updated `segment`.

---

## Branch (F) — Caption Y layout

Vertical-only caption placement in 280×498 editor preview coords. Caption participates in scene layout as a vertical knob — nothing else.

```jsonc
{
  "id":    "widecast7c0d4f8a9b1e2d3f",
  "by":    "voice_file",
  "value": "XcR0k",
  "fields": [
    { "field_name": "overlay.caption.y", "value": 408 }
  ]
}
```

This edit updates ONLY `overlay.caption.y` plus `touched=true`. It does **not** change `x` / `w` / `h`, visibility, config / style, `segment.text`, `segment.words`, audio, duration, or Remotion specs. For combined layout changes, prefer `layout.batch` (G).

Response: `caption_layout_updated: true`, `message: "Caption layout updated."`, plus the updated `segment`.

---

## Branch (G) — Layout batch (one persist, one MQTT)

Compose narrator + caption + Remotion object/group layout in a single atomic call. Either send the layout fields directly (the server detects 2+ layout families and routes through the batch path) **or** wrap them in `layout.batch`:

```jsonc
{
  "id":    "widecast7c0d4f8a9b1e2d3f",
  "by":    "voice_file",
  "value": "XcR0k",
  "fields": [
    { "field_name": "overlay.narrator.rect", "value": { "x": 35, "y": 124, "w": 210, "h": 374, "visible": true } },
    { "field_name": "overlay.caption.y", "value": 408 },
    {
      "field_name": "remotion.object.rect",
      "value": { "layout_id": "main.one_by_one", "x": 24, "y": 200, "coordinate_space": "preview" }
    }
  ]
}
```

Or via the explicit envelope:

```jsonc
{
  "id":    "widecast7c0d4f8a9b1e2d3f",
  "by":    "voice_file",
  "value": "XcR0k",
  "fields": [
    {
      "field_name": "layout.batch",
      "value": {
        "fields": [
          { "field_name": "overlay.narrator.rect", "value": { "x": 35, "y": 124, "w": 210, "h": 374 } },
          { "field_name": "overlay.caption.y", "value": 408 }
        ]
      }
    }
  ]
}
```

**Semantics**:

- Each child uses the same validator/apply helper as the single-edit branch (composition, not a parallel implementation).
- WideCast persists `generated_video_script` **once** and broadcasts **one** MQTT `scene_modified` event after all children succeed, so editors hot-update in a single frame.
- **Allowed children**: `overlay.narrator.*`, `overlay.caption.y`, `remotion.object.rect`, `remotion.group.rect`.
- **Disallowed in batch**: `mediaUrl`/`mediaType`, `voice.upload`, `narrator.upload_video`, `remotion.upload_overlay`, `roll.active`/`roll.switch`, `segment.text`, metadata fields — those have distinct validation/lifecycle.

Response: `layout_batch_updated: true`, plus per-family flags (`narrator_layout_updated`, `caption_layout_updated`, `remotion_spec_updated`), the cache-busted `remotion_spec_url` / `remotion_poster_url`, and the updated `segment`.

---

## Branch (H) — Upload Voice (async)

User-supplied audio. **Not Use-AI-Voice** — the caller supplies the file, so no voice/model credit is spent.

```jsonc
{
  "id":    "widecast7c0d4f8a9b1e2d3f",
  "by":    "voice_file",
  "value": "XcR0k",
  "fields": [
    { "field_name": "voice.upload", "value": "https://cdn.example.com/voice.mp3" }
  ]
}
```

`value` may also be `{ "url": "...", "filename": "voice.mp3", "content_type": "audio/mpeg" }`.

The endpoint is **asynchronous** because WideCast must transcode/transcribe the audio. Response:

```jsonc
{
  "object":     "scene_voice_upload_queued",
  "id":         "widecast7c0d4f8a9b1e2d3f",
  "scene_id":   3,
  "voice_file": "XcR0k",
  "queue_id":   "gs_widecast7c0d4f8a9b1e2d3f_XcR0k",
  "status":     "queued",
  "media_type": "audio",
  "applied":    { "field_name": "voice.upload", "audio_url": "...", "queue_id": "...", "bytes": 12345, "extension": "mp3", "cost": "free_user_supplied_audio", "async": true },
  "segment":    { /* snapshot at queue time */ }
}
```

When the transcoder finishes, the server applies `words`, `text`, `duration`, following-scene timeline shifts, inactive caption-language timelines, `narrator_face` / chroma key, and `recorded=true` to `generated_video_script` and emits MQTT `event="scene_voice_upload_applied"` with the updated segment. **Verify with [`/v1/video_data`](video-data.md) after completion.**

---

## Branch (I) — Upload Narrator Video (async)

User-supplied A-roll narrator video. Reuses the same single-scene A-roll upload pipeline as the editor's Upload button.

```jsonc
{
  "id":    "widecast7c0d4f8a9b1e2d3f",
  "by":    "voice_file",
  "value": "XcR0k",
  "fields": [
    { "field_name": "narrator.upload_video", "value": "https://cdn.example.com/narrator.mp4" }
  ]
}
```

If the target scene is currently B-roll, the server preserves the previous `mediaUrl` / `thumbnailUrl` as `brollUrl` / `brollThumbnailUrl`, processes the new video as A-roll, then applies the same server roll-switch helper as `roll.active="A"` on completion.

Response shape: `object: "scene_narrator_upload_queued"`, same `queue_id` family; completion emits MQTT `event="scene_narrator_upload_applied"`.

---

## Branch (J) — A/B-roll switch (sync data switch)

Free synchronous data switch — no upload, transcode, or generation. Preserves both lanes (`arollUrl`/`brollUrl`) and swaps active runtime fields.

```jsonc
{
  "id":    "widecast7c0d4f8a9b1e2d3f",
  "by":    "voice_file",
  "value": "XcR0k",
  "fields": [
    { "field_name": "roll.active", "value": "A" }
  ]
}
```

Values: `"A"` (show/use narrator A-roll) or `"B"` (hide narrator/use B-roll). Or use `{ "field_name": "roll.switch", "value": "toggle" }` to flip the current state.

The server mirrors the editor's Show/Hide Narrator data path — A→B protects the A-roll file family by renaming `{voice_file}.mp4` / `thumb_{voice_file}.jpg` to `_switched` when those files exist; B→A may ensure the preserved B-roll exists locally.

Response: `roll_switched: true`, `active_roll: "A"|"B"`, `show_narrator: bool`, `media_type`, plus the updated `segment`.

---

## Branch (K) — Segment text correction

Free, synchronous, distinct from Upload Voice. Updates `segment.text` and rebuilds `segment.words` over existing audio timings — does NOT change audio, duration, or following-scene timelines.

```jsonc
{
  "id":    "widecast7c0d4f8a9b1e2d3f",
  "by":    "voice_file",
  "value": "XcR0k",
  "fields": [
    { "field_name": "segment.text", "value": "Meta spent 14.3 billion to acquire Scale AI." }
  ]
}
```

`value` may also be `{ "text": "..." }`. The server also syncs the current caption-language entry in `video_script.captions` by `voice_file`.

---

## Branch (L) — Scene metadata

Update one or more scene planning fields from the same family. Validated:

| Field | Allowed values |
|---|---|
| `pattern` | `single_metric`, `bar_chart`, `proportion_chart`, `trend_chart`, `structural_diagram`, `illustration`, `hybrid_vertical`, `typography_only`, `map_chart`, `comparison_table`, `timeline_events`, `checklist_tips`, `quote_card`, `narration_only`, `real_entity` |
| `type` | `HOOK`, `STAT`, `KEY POINT`, `DATA`, `FACT`, `CALL TO ACTION` |
| `sub_mode` (only with `pattern="illustration"`) | `photo_with_people`, `photo_no_people`, `document`, `digital_ui` |
| `visual`, `keyword`, `quote`, `talking_point` | free text |

Auto-clears: `pattern="narration_only"` clears `quote` + `visual`; `pattern="typography_only"` clears `visual`.

`segment.<name>` / `scene.<name>` namespaced forms are accepted (e.g. `segment.pattern`). Metadata edits sync to the current caption-language segment by `voice_file`. No audio / words / duration / media / spec changes.

```jsonc
{
  "id":    "widecast7c0d4f8a9b1e2d3f",
  "by":    "voice_file",
  "value": "XcR0k",
  "fields": [
    { "field_name": "pattern", "value": "typography_only" },
    { "field_name": "quote",   "value": "Short headline that lands" }
  ]
}
```

---

## Branch (M) — Remotion add element

Free, synchronous, **add-only**. Appends a new Storyboard group/object to the existing Remotion spec. Does NOT auto-fit, replace, move, or modify existing objects. Returns a new `layout_id` so you can land the element precisely with a follow-up [`layout.batch`](#branch-g--layout-batch-one-persist-one-mqtt) carrying a `remotion.object.rect`.

```jsonc
{
  "id":    "widecast7c0d4f8a9b1e2d3f",
  "by":    "voice_file",
  "value": "XcR0k",
  "fields": [
    {
      "field_name": "remotion.add_element",
      "value": {
        "kind":     "stat",
        "value":    "$14.3B",
        "label":    "Meta → Scale AI",
        "position": "top"
      }
    }
  ]
}
```

You can also pass a bare string for the common `kind="text"` case:

```jsonc
{
  "fields": [
    { "field_name": "remotion.add_element", "value": "+14.3B in 12 months" }
  ]
}
```

### Value reference

| Key | Required | Description |
|---|---|---|
| `kind` | yes (or derive) | `"text"` \| `"stat"` \| `"label"` \| `"callout"` \| `"image"`. Aliases: `metric`/`number` → `stat`, `badge`/`caption` → `label`. Defaults to `image` when `url`/`image`/`src` is set, else `text`. |
| `value` | yes for text/stat/callout | Primary text content. |
| `label` | optional | Secondary text (used by `stat`/`label`). |
| `url` (`image`, `src` aliases) | yes for `kind="image"` | http(s) image URL. |
| `position` | optional | `"top"` \| `"bottom"` \| `"left"` \| `"right"` \| `"center"` — placement hint; server picks a sane default rect on that side. |
| `rect` | optional | Pin an explicit rect: `{x, y, w, h, coordinate_space: "preview" \| "canvas"}` (default `"preview"` = 280×498). Top-level shorthand `x/y/w/h` on the value object is also accepted. |
| `style_token` | optional | Visual token name (e.g. brand styling slot). |
| `emphasis` | optional | Style intensity hint. |
| `entry` | optional | Entry animation (default `"fade"`). |
| `delay_sec` | optional | Delay before the element appears (default `0`). |
| `z_index` | optional | Per-object z order inside the new Storyboard group (default `1`). |
| `element_z_index` | optional | Z order of the new Storyboard group itself (default `900`). |

### Rules

- **Add-only**: never replaces / reorders / moves / mutates existing objects. If you need polished placement, follow up with `layout.batch`.
- **Send alone**: combining `remotion.add_element` with any other Remotion field (or putting it inside `layout.batch` directly) returns `400 mixed_remotion_fields`.
- **Requires an enabled spec**: scenes with `segment.remotion_spec="none"` reject the call with `409 remotion_spec_disabled`. Use Upload Overlay (B) first if the user wants the overlay back.

### Response

```jsonc
{
  "object":                  "scene_modified",
  "id":                      "widecast7c0d4f8a9b1e2d3f",
  "scene_id":                3,
  "voice_file":              "XcR0k",
  "applied": {
    "field_name":  "remotion.add_element",
    "kind":        "stat",
    "element_id":  "agent_add_01",
    "object_id":   "add_stat_1782700000000",
    "layout_id":   "agent_add_01.add_stat_1782700000000",
    "rect":        { "x": 24, "y": 60,  "w": 232, "h": 64,  "coordinate_space": "preview" },
    "rect_canvas": { "x": 61.7, "y": 154.4, "w": 596.6, "h": 164.6, "coordinate_space": "canvas" },
    "cost":        "free_spec_append",
    "async":       false,
    "auto_fit":    false,
    "follow_up":   "Use layout.batch with remotion.object.rect and the returned layout_id to position this object."
  },
  "remotion_element_added": true,
  "remotion_spec_updated":  true,
  "remotion_spec_url":      "https://widecast.ai/downloads/<company_id>/<topic_id>/XcR0k_spec.json?v=1782700000",
  "remotion_poster_url":    "https://widecast.ai/downloads/<company_id>/<topic_id>/XcR0k_overlay_poster.png?v=1782700000",
  "segment":                { /* updated segment */ }
}
```

### Recommended workflow

```python
# 1. Add the element (default placement)
result = client.modify_scene(
    video_id,
    by="voice_file", value="XcR0k",
    fields=[{
        "field_name": "remotion.add_element",
        "value": {"kind": "stat", "value": "$14.3B", "label": "Meta → Scale AI", "position": "top"},
    }],
)
layout_id = result["applied"]["layout_id"]

# 2. Read the displayed rect + collision violations
geom = client.scene_geometry(video_id, voice_file="XcR0k", include_diagnostics=True)

# 3. Refine placement with layout.batch (and any sibling layout edits)
client.modify_scene(
    video_id,
    by="voice_file", value="XcR0k",
    fields=[{
        "field_name": "remotion.object.rect",
        "value": {"layout_id": layout_id, "x": 24, "y": 80, "w": 232, "h": 56,
                  "coordinate_space": "preview"},
    }],
)
```

### Error codes

| `error.code` | HTTP | When |
|---|---|---|
| `invalid_remotion_add_element` | 400 | `value` is neither a dict nor a non-empty string. |
| `invalid_remotion_add_element_kind` | 400 | `kind` is not in the allowed set. |
| `mixed_remotion_fields` | 400 | Sent alongside other Remotion fields (or inside `layout.batch`). |
| `remotion_spec_not_found` | 404 | The scene's spec file is missing on disk. |
| `remotion_spec_disabled` | 409 | `segment.remotion_spec="none"` — use Upload Overlay first. |
| `missing_voice_file` | 409 | Scene has no `voice_file`; can't resolve the spec filename. |
| `remotion_spec_parse_failed` / `remotion_spec_invalid` | 409 | Spec file present but unreadable / not a JSON object. |

---

## Branch (N) — Disable overlay (free, sync data edit)

Hide the Remotion overlay on one scene by setting `segment.remotion_spec="none"`. **The spec and overlay-poster files on disk are NOT deleted** — this is just an opt-out pointer flip. Re-enable later via Branch **(B) Upload Overlay** (or the manual regenerate-overlay UI flow), which writes a fresh `{voice_file}_spec.json` and stamps `remotion_spec` back to `{voice_file}_spec.json?v={mtime}` so CDN / browser caches fetch the new file.

```jsonc
{
  "id":    "widecast7c0d4f8a9b1e2d3f",
  "by":    "voice_file",
  "value": "XcR0k",
  "fields": [
    { "field_name": "disable_overlay", "value": true }
  ]
}
```

### Field reference

| Field | Type | Required | Description |
|---|---|---|---|
| `field_name` | string | yes | `disable_overlay` (canonical). Aliases accepted: `remotion.disable_overlay`, `overlay.disable`, `remotion_spec.none`. |
| `value` | boolean \| string \| object | yes | Truthy disables the overlay. Accepted forms: `true`, the string `"none"`, or `{enabled: false}` (also `{enable: false}`, `{disabled: true}`, `{disable: true}`). |

### What this branch does NOT do

- Does **not** delete `{voice_file}_spec.json` on disk.
- Does **not** delete `{voice_file}_overlay_poster.png`.
- Does **not** regenerate a replacement overlay.
- Does **not** touch narrator / caption / media (`mediaUrl`/`mediaType`) / timing / `overlay.narrator.*` / `overlay.caption.y` / `remotion.object.rect` / `remotion.group.rect`.
- Does **not** change audio, duration, words, or `videoTrim`.
- Does **not** charge credit.

### Constraints

- **Send alone.** Combining `disable_overlay` (or any of its aliases) with another field returns `400 mixed_remotion_fields`. Not allowed inside `layout.batch`.
- **Idempotent.** Disabling a scene that's already `remotion_spec="none"` returns `applied.idempotent: true` and is otherwise a no-op.

### Response highlights

- `object: "scene_modified"`.
- `applied.before` = the previous `remotion_spec` value (e.g. `"XcR0k_spec.json?v=…"` or `"none"`).
- `applied.after = "none"`.
- `applied.idempotent` — `true` when the scene was already disabled.
- `applied.cost = "free_data_edit"`.
- `overlay_disabled: true` at the top level.
- `remotion_spec_state` returns to `"disabled"`; `remotion_spec_url` empties.

### Re-enable later

Run Branch **(B) Upload Overlay** with a fresh image / SVG, OR the UI's manual regenerate-overlay flow. Either path writes the spec back to disk and stamps `remotion_spec` to the cache-busted `{voice_file}_spec.json?v={mtime}` so the editor / preview / `/v1/scene_geometry` pick it up immediately.

### Errors

| Code | HTTP | When |
|---|---|---|
| `invalid_disable_overlay_value` | 400 | `value` is not in `{true, "none", {enabled:false}, …}`. |
| `mixed_remotion_fields` | 400 | Sent alongside other fields. |
| `missing_voice_file` | 409 | Scene has no `voice_file`; can't resolve the spec filename. |

---

## Responses

### `200 OK` — `scene_modified` (sync branches)

```jsonc
{
  "object":     "scene_modified",
  "id":         "widecast7c0d4f8a9b1e2d3f",
  "scene_id":   3,
  "voice_file": "XcR0k",
  "score":      1.0,
  "applied":    { /* family-specific details */ },
  "segment":    { /* full updated segment */ },

  "layout_batch_updated":     true,
  "narrator_layout_updated":  true,
  "caption_layout_updated":   true,
  "remotion_object_updated":  true,
  "remotion_spec_updated":    true,
  "remotion_spec_file":       "XcR0k_spec.json",
  "remotion_spec_url":        "https://widecast.ai/downloads/<company_id>/<topic_id>/XcR0k_spec.json?v=1748293012",
  "remotion_spec_version":    "1748293012",
  "remotion_spec_state":      "ready",
  "remotion_spec_exists":     true,
  "remotion_poster_file":     "XcR0k_overlay_poster.png",
  "remotion_poster_url":      "https://widecast.ai/downloads/<company_id>/<topic_id>/XcR0k_overlay_poster.png?v=1748293012",
  "remotion_poster_version":  "1748293012",
  "remotion_poster_state":    "ready",
  "remotion_poster_exists":   true,
  "remotion_poster_warnings": []
}
```

Fields not relevant to the branch are omitted. `score` is `1.0` for `by="id"`/`by="voice_file"`; the fuzzy score for `by="text"`. Branches (A) also carry `media_type` / `media_url`; (B) also carries `uploaded_overlay_url` + `cost: 0`; (J) also carries `roll_switched` / `active_roll` / `show_narrator`.

### `200 OK` — `scene_voice_upload_queued` / `scene_narrator_upload_queued` (async branches)

Shown above for branch (H). The edit is **not yet visible** — wait for MQTT `scene_voice_upload_applied` / `scene_narrator_upload_applied`, then call [`/v1/video_data`](video-data.md) to verify.

### `200 OK` — `clarification` (ambiguous `by="text"`)

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

No edit was applied. Show the `text` previews to the user, get a pick, retry with `by="voice_file"`.

### `404 Not Found`

- `video_not_found` — no video with this id on the account.
- `scene_not_found` — id / voice_file / text didn't match any scene (with the configured `min_score` floor).
- `remotion_spec_not_found` — branch (C) requested but `{voice_file}_spec.json` is missing.

### `409 Precondition Failed`

- `scenes_not_ready` — the video hasn't reached `scenes_ready_for_review`. Poll `/v1/status/{id}` first.
- `invalid_script` — the stored scene script is malformed.
- `remotion_spec_disabled` — branch (C)/(D) requested but `segment.remotion_spec="none"`. Do NOT auto-enable.
- `remotion_spec_parse_failed` / `remotion_spec_invalid` — spec file present but unreadable.
- `missing_voice_file` — branch (C) but the scene has no `voice_file`.

### `400 Bad Request`

- `invalid_json` — request body is not valid JSON.
- `missing_field` — required field missing (`id`, `by`, `value`, `fields`).
- `invalid_id` — `id` doesn't match an accepted topic id.
- `invalid_by` — `by` is not one of `voice_file` / `id` / `text`.
- `invalid_field_entry` — an entry in `fields` is not `{ field_name, value }`.
- `unsupported_field` — `field_name` not in the supported set.
- `invalid_media_url` — branch (A) / (B) / (H) / (I) URL is not http(s) the server can reach.
- `mixed_remotion_fields` — multiple non-layout Remotion fields mixed; only layout fields compose via `layout.batch`.
- `missing_remotion_object_rect` — branch (C) but no `remotion.object.rect` entry.
- `object_level_edit_disabled` — *(legacy; no longer returned by current builds — branch (C) is enabled)*. Older clients may still surface it from cached docs.

### `500 / 502`

- `modify_failed`, `persist_failed`, `voice_upload_queue_failed`, `narrator_video_upload_queue_failed` — surface `request_id` and retry.

---

## SDK examples

### Python — data-first audit → object-layer rect via `layout.batch`

```python
from widecast import Widecast

client = Widecast()

# 1) Read scenes
data = client.video_data("widecast7c0d4f8a9b1e2d3f")
target = next(s for s in data["segments"] if "Scale AI" in s.get("text", ""))

# 2) Read geometry (no screenshots, cheap)
geom = client.scene_geometry(data["id"], voice_file=target["voice_file"])
oneby = next(o for o in geom["boxes"]["remotion"]["object_layer"]["objects"]
             if o["layout_id"].endswith(".one_by_one"))

# 3) Move the overlay and the narrator+caption in ONE call
result = client.modify_scene(
    data["id"],
    by="voice_file", value=target["voice_file"],
    fields=[
        {"field_name": "overlay.narrator.rect",
         "value": {"x": 35, "y": 124, "w": 210, "h": 374, "visible": True}},
        {"field_name": "overlay.caption.y", "value": 408},
        {"field_name": "remotion.object.rect",
         "value": {"layout_id": oneby["layout_id"], "x": 24, "y": 200,
                   "coordinate_space": "preview"}},
    ],
)
print("new spec:", result["remotion_spec_url"])
```

### TypeScript — upload narrator video (async)

```typescript
import Widecast from "@widecast/sdk";

const client = new Widecast();
const data = await client.video_data("widecast7c0d4f8a9b1e2d3f");
const target = data.segments.find(s => /Scale AI/i.test(s.text ?? "")) ?? data.segments[0];

const result = await client.modify_scene({
  id: data.id,
  by: "voice_file",
  value: target.voice_file,
  fields: [
    { field_name: "narrator.upload_video",
      value: "https://cdn.example.com/narrator.mp4" },
  ],
});

if (result.object === "scene_narrator_upload_queued") {
  console.log("queued:", result.queue_id);
  // Wait for MQTT "scene_narrator_upload_applied", then call video_data.
}
```

### Manual (curl) — caption Y only

```bash
curl -sS -X POST ".../v1/modify_scene" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -H "Content-Type: application/json" \
  -d '{
        "id":    "widecast7c0d4f8a9b1e2d3f",
        "by":    "voice_file",
        "value": "XcR0k",
        "fields": [
          { "field_name": "overlay.caption.y", "value": 408 }
        ]
      }' | jq
```

---

## Cost & ordering

- **Free** — `/v1/modify_scene` does not consume credits. The expensive work (re-rendering the final MP4) only runs when you call [`/v1/export_video`](export-video.md) again.
- **Order matters when re-rendering**: apply all edits first, then call `/v1/export_video` once. Edits made after `/v1/export_video` won't appear in the already-queued render.
- **Async branches** (H, I) settle later — wait for MQTT or re-verify with [`/v1/video_data`](video-data.md) before re-rendering.

---

## When to use `by="text"`

Prefer `by="voice_file"` whenever you have it from a previous [`/v1/video_data`](video-data.md) / `/v1/status` call. Use `by="text"` only when the user names a scene by what's said in it ("change the picture on the scene about Meta and Scale AI"). The endpoint is ambiguity-safe — it returns a clarification rather than guess. When the user paraphrases, lower `min_score` cautiously to `0.4`–`0.45`; do not raise past `0.9`.
