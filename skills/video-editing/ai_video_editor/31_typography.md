# 31 · Fast Typography Rules

Load only when fixing overlay text or validating a text-risk overlay.

## What Matters In Fast Mode

Typography QA is limited to correctness of rendered message text:

- exact spelling
- Vietnamese diacritics and `Đ/đ`
- numbers, currency, percent, dates
- names, product/company/person/place terms
- domain terms
- stale old text
- pseudo-text or malformed glyphs

Do not judge title thickness, first-second punch, font choice, card/pill usage, hierarchy, or aesthetic taste unless the user explicitly asked for visual polish.

## Fixing Text

Use short, natural copy that preserves the scene's actual meaning. Prefer existing `quote`, `talking_point`, and `text` as source. If a visible overlay string is wrong, fix the smallest layer that contains it.

When rebuilding text:

- keep the scene language
- preserve numbers/currency/percent exactly
- keep Vietnamese diacritics
- avoid tiny text that creates another objective readability problem
- verify rendered result from `overlay_poster` when available

## Rendered Text Check

Use this focused table:

```text
Rendered text check:
| rendered string | intended copy | issue | verdict |
|---|---|---|---|
| <...> | <...> | <none|typo|diacritic|number|stale|pseudo> | <PASS|FAIL> |
```

If the table passes, stop. Do not add style commentary.
