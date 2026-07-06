# 30 · Fast Overlay Text-Risk QA + Objective Fixes

Load when Gate 4 is not skipped or when an objective overlay fix is required.

## Scope

Fast overlay work is **not** visual redesign. It checks and fixes objective overlay defects:

- typo, misspelling, grammar that changes meaning
- missing/wrong Vietnamese diacritics or malformed glyphs
- pseudo-text or unreadable generated text pretending to be words
- wrong/stale number, currency, percent, name, proper noun, domain term
- broken render or missing required text/object
- objective face/caption collision visible in the screenshot

Do not fail for style, taste, title punch, title thickness, card shape, or aesthetic preference.

## Risk Triage

Run text proof when visible/message text may be baked or model-generated:

- generated illustration/document/UI/photo text
- chart/map/table/list/timeline/checklist/quote labels and values
- real-entity or hybrid overlays with meaningful text
- any overlay text the screenshot makes suspicious

Skip when there is no visible/message text or the scene is low-risk WideCast-controlled typography with no suspected text error.

## Text Proof

Use `overlay_poster` when available. Otherwise use the shown composite fallback.

Inventory only message-bearing strings. Ignore tiny incidental background signage unless it distracts or changes meaning.

Fail only objective text/data defects. If all strings match intended copy, keep the overlay and move on.

## Fix Ladder

Use the smallest passing fix:

1. Leave unchanged.
2. Correct metadata/source text if stale.
3. Add a small missing label/callout with `remotion.add_element`.
4. Rebuild only the broken text layer while preserving good current visual.
5. Replace generated/baked-text image only when text cannot be corrected or removed.
6. Full overlay replacement only for objective broken render or unrecoverable bad baked text.

If preserving a good realistic image/photo/map/entity, do not redraw it. Extract/reuse it when a rebuild is unavoidable.

## Apply + Verify

When a write occurs:

1. Save local overlay source if authoring.
2. Upload/apply via `remotion.upload_overlay` or targeted `modify_scene`.
3. Re-pull `video_data`; re-pull `scene_geometry` if layout changed.
4. Pull `overlay_poster` again if text changed.
5. Pull composite AFTER only if placement/media/layout changed or text visibility needs confirmation.

Every agent layout/overlay edit triggers Gate 6 post-edit sanity.
