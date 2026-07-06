# 40 · Fast Endpoint Handling

Load only when scene 2, thumbnail, or final CTA has an objective text/background issue, or when the user explicitly asks for thumbnail/CTA visual polish.

## Fast Default

Scene 2, the static thumbnail, and final CTA are **not automatic redesign tasks** in this fast skill. Trust WideCast endpoint design unless:

- visible endpoint text has typo/diacritic/glyph/pseudo-text/stale-copy issues
- CTA/action text is objectively wrong or missing when the scene is a CTA
- thumbnail/scene 2 background is clearly off-topic or wrong-geo
- user explicitly asks for poster/thumbnail/CTA polish

Do not fail endpoint scenes for not being poster-like enough, not punchy enough, or not matching the agent's taste.

### Endpoint visual style ladder

The ladder is kept machine-readable for the SVG engine and is used only when an endpoint overlay must be rebuilt for an objective defect or when the user explicitly asks for endpoint polish.

1. **Dynamic poster typography:** oversized short words with motion-oriented placement.
2. **Magazine-cover thumbnail:** editorial headline, one support line, subject-preserving framing.
3. **Kinetic stacked type:** 2-4 short words stacked with clear hierarchy.
4. **Typographic collage:** one giant keyword plus 1-2 support words.
5. **Object-integrated title:** title frames the face/product/document without covering the important part.
6. **Premium CTA poster:** one dominant action verb plus one support line.
7. **Minimal premium cover:** one huge word/number plus a small context label.

## Scene 2 + Thumbnail

Fast checks:

- title/hook text correctness
- generated/baked text correctness
- background/frame objective fit
- thumbnail sync only if scene 2 was edited or thumbnail has an objective mismatch

If scene 2 is not edited and thumbnail has no objective defect, do not run a thumbnail sync pass.

## Final CTA

Fast checks:

- CTA text, if present, names the intended action correctly
- no typo/diacritic/glyph/pseudo-text issue
- background is not misleading

If the CTA is merely less stylish than desired, keep it.

## Fixes

Use the smallest fix:

1. correct endpoint text
2. replace wrong background/frame
3. sync thumbnail only when scene 2 changed or thumbnail objectively differs
4. rebuild endpoint overlay only for unrecoverable wrong baked text or explicit user polish request
