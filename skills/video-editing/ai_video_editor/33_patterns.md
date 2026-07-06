# 33 · Fast Non-Chart Pattern Text Risk

Load when Gate 4 sees a non-chart text-risk pattern.

## Risk Patterns

- `map_chart`: map labels, pins, place names, values
- `comparison_table`: headers, rows, winning values
- `timeline_events`: dates and event labels
- `checklist_tips`: list items and badges
- `quote_card`: quote and attribution
- `illustration`: document/UI/photo text, signs, labels, generated text
- `hybrid_vertical`: photo text plus lower data labels
- `real_entity`: name/logo/UI/document text when it matters

## What To Check

Check only:

- typo/spelling/grammar that changes meaning
- Vietnamese diacritics/glyphs
- wrong number/currency/date/percent
- wrong name/place/company/product
- pseudo-text / fake UI text / broken generated words
- stale old text

Ignore aesthetic style, illustration taste, visual polish, and whether a different design would look better.

## Fix Policy

Preserve good existing visuals. Fix only the bad text/data layer. Replace a realistic or generated visual only when the text is baked in and objectively wrong.
