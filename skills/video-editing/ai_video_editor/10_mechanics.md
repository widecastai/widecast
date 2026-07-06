# 10 · Fast Mechanics — Data, Evidence, Writes

Load at the start of every scene.

## Data Tools

- `video_data`: pull full video and segments.
- `scene_geometry`: measure layout boxes when needed. It is not visual proof.
- `scene_inspector action="screenshot_scene_280x498"`: canonical composite evidence.
- `scene_inspector action="overlay_poster"`: clean overlay text evidence, only for text-risk scenes or changed overlay text.
- `modify_scene`: write by `voice_file`.

## Field Discipline

- `voice_file` is the stable write selector.
- Display `id` is for human-facing scene numbers only.
- `remotion_spec="none"` means overlay is intentionally disabled; do not re-enable unless a targeted objective fix requires it and the user asked.

## Evidence Rules

### Composite Screenshot

Use once per scene:

1. Call `screenshot_scene_280x498`.
2. Read `result.screenshot.url`.
3. `curl -L -s -o <local>.jpg "<url>"`.
4. Show the local file once.
5. Judge only after it is shown.

Do not use remote URLs, base64, browser screenshots, or private views as evidence.

### Overlay Poster

Use only when Gate 4 requires text-risk proof or overlay text changed:

1. Call `overlay_poster` with `id`, `voice_file`, `activate:true`.
2. Download returned URL locally.
3. Show the local file.
4. Read visible text from the image, not from JSON/source alone.

### Active Background Plate

Use in Gate 5 only when background is visible or content-fit must be judged:

1. Prefer `thumbnailUrl`.
2. If `mediaType="image"`, fallback to `mediaUrl`.
3. Else fallback by active roll: B-roll → `brollThumbnailUrl`, A-roll → `arollThumbnailUrl`.

Skip content-fit for hidden full-canvas A-roll backgrounds.

## Writes

Common `modify_scene` branches in fast mode:

- Background: branch A `mediaUrl` + `mediaType`.
- Overlay upload/fix: branch B `remotion.upload_overlay`.
- Layout after an agent edit: branch C/D/G as needed.
- Text correction: branch K metadata `text`.
- Add small label/callout without overwriting a good overlay: branch M `remotion.add_element`.

After every write, re-pull:

- `video_data` for metadata/media/spec changes.
- `scene_geometry` for layout/overlay position changes.

## Gate 6 Trigger

Do not run layout/dead-zone proof on untouched WideCast output. Run it only after:

- the agent changed overlay/layout/media
- the agent uploaded a new overlay
- the screenshot shows an objective face/caption/text collision

When Gate 6 runs, use `scene_geometry` for measurement and the latest shown composite screenshot for visual confirmation.
