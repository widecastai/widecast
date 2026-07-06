# 20 · Fast Background QA

Load when reaching Gate 5 or replacing background media.

## Scope

Background QA checks objective fit only:

- relevant to `text`, `talking_point`, `keyword`, or `visual`
- not clearly off-topic or misleading
- correct geography/culture/currency/signage when location matters
- no watermark, burned-in text, logo, or visible document/UI text that creates the wrong message
- no accidental duplicate real clip when repetition is noticeable

Do not judge beauty, taste, mood, cinematic quality, or whether a better clip might exist.

## Skip Cases

Mark Gate 5 `PASS skip` when:

- full-canvas A-roll narrator hides/occludes the background
- active media is force-grid / grid-by-design
- background is not visible and not intended to carry the scene
- user explicitly disabled stock/background changes

Still record the skip reason in the ledger.

## Evidence

Use the Gate 3 composite screenshot as render truth.

Pull/show active plate only if the background is visible or must be judged:

1. `thumbnailUrl`
2. `mediaUrl` if `mediaType="image"`
3. active-roll fallback thumbnail

## Geo/Currency Trigger

Turn on geo/currency check when the script, offer, law/regulation, industry, audience, scene text, or currency points to a specific location.

Examples: real estate, mortgage, insurance, legal, tax, healthcare, immigration, education, local services, finance, benefits, named city/state/country, USD or other currency.

Reject obvious wrong-location cues: foreign currency, wrong-language signage, wrong road side, wrong official forms, foreign architecture when local trust matters.

If no correct geo-specific asset is available, prefer neutral close-up or grid over a vivid but wrong-country clip.

## Replace Workflow

Only search/replace after Gate 5 objective FAIL.

1. State the search keyword/context.
2. Search B-roll/photo.
3. Download candidate thumbnails locally and build/show a contact sheet.
4. Choose after the contact sheet is shown.
5. Apply with `modify_scene` branch A `mediaUrl` + `mediaType`.
6. Re-pull `video_data`.
7. Pull AFTER composite only when the replacement must be visually confirmed.

Layer isolation: background replacement must not rebuild/restyle overlay unless an independent Gate 4 text/objective overlay FAIL exists.
