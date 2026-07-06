# 05 · Fast Quality Standard + Priority Order

Load before declaring `Scene N: PASS` and before final handoff.

## Fast PASS Standard

A scene passes when all applicable items are true:

- Spoken `text` has no significant context/domain/STT error.
- Overlay text-risk triage is `PASS` or `SKIP` with a valid reason.
- Any rendered/baked message text checked has no typo, pseudo-text, malformed glyph, wrong/missing Vietnamese diacritics, stale copy, wrong number/currency/name/domain term.
- Visible background/media is relevant enough for the sentence and not objectively misleading.
- Location/currency/culture cues match when the video/scene is location-sensitive.
- No visible watermark/burned-in text/logo creates a wrong message.
- Any edits made by the agent are saved and verified.
- Any agent-made overlay/layout/media change has enough final evidence to show it did not create an obvious collision.
- Required modules for applicable gates were loaded.

The following are **not** fast-mode failures by themselves:

- Style is not the agent's taste.
- Title could be more punchy.
- Overlay could be redesigned.
- Narrator or overlay layout differs from the agent's preference.
- Endpoint scene could look more like a poster.
- Background could be more cinematic while still objectively relevant.

## Video-Level QA

After all scenes:

1. Check ledger completeness.
2. Check repeated real background URLs only if they are likely accidental; grid reuse is allowed when intentional.
3. Check no unresolved text-risk FAIL remains.
4. Check no unresolved background FAIL remains.
5. Check all writes saved.

## Priority Order

1. Do not get content, names, numbers, currency, or domain terms wrong.
2. Do not leave generated/baked text errors.
3. Do not use misleading/off-topic/wrong-geo background media.
4. Do not create new face/caption/layout collisions when fixing.
5. Preserve WideCast's existing layout/style unless an objective fix requires a small targeted change.
6. Save tokens: skip extra screenshots/posters/plates when the gate is N/A or no edit occurred.
