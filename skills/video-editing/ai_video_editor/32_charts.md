# 32 · Fast Chart/Data Pattern Text Risk

Load when Gate 4 sees one of these patterns:

- `single_metric`
- `bar_chart`
- `proportion_chart`
- `trend_chart`
- `structural_diagram`

## What To Check

Only objective data/text correctness:

- metric value, percent, currency, date
- bar/donut/axis/value labels
- legend names
- arrow/step labels in diagrams
- title text if visible
- pseudo-text or malformed glyphs
- stale text from an old spec

Do not judge chart style, flatness, 3D/glossy quality, palette, title punch, or design taste.

## Fix Policy

If the chart's data/text is correct, keep it.

If a label/value is wrong, fix the smallest possible text/data layer. Rebuild the chart only when the wrong text is baked into an image or the render is objectively broken.
