# 03 · Fast Per-Scene Definition Of Done

Load at the start of every scene. This module defines the fast receipt for objective blind-spot QA. It deliberately avoids full visual-polish review.

## Load Ledgers

Use `LOAD_MANIFEST.md` as the line-count canary. A module whose actual line count is less than manifest is not loaded.

```text
KICKOFF LOAD LEDGER:
☑ 00_ENTRYPOINT          lines=<N> manifest=<M>
☑ 01_critical_rules      lines=<N> manifest=<M>
☑ 02_jump_prevention     lines=<N> manifest=<M>
☑ 03_dod_gates           lines=<N> manifest=<M>
☑ 04_principles_workflow lines=<N> manifest=<M>
☑ 05_quality_qa_priority lines=<N> manifest=<M>
☑ 10_mechanics           lines=<N> manifest=<M>
Verdict: <PASS | BLOCKED — re-read module>
```

For each scene, print a smaller SCENE LOAD LEDGER for modules actually used:

```text
SCENE LOAD LEDGER:
☑ 03_dod_gates.md lines=<N> manifest=<M>
☑ 10_mechanics.md lines=<N> manifest=<M>
☑ 20_background.md <loaded>
☑ 30_overlay_core.md <loaded | N/A>
☑ 31_typography.md <loaded | N/A>
☑ 32_charts.md / 33_patterns.md <loaded | N/A>
☑ 40_thumbnail_cta.md <loaded | N/A>
Verdict: <PASS | BLOCKED>
```

## Scene Plan

```text
Scene N plan:
☐ Gate 1 — Text/STT context
☐ Gate 2 — Role
☐ Gate 3 — BEFORE screenshot shown
☐ Gate 4 — Overlay text-risk triage
☐ Gate 5 — Background QA
☐ Gate 6 — Post-edit layout sanity if needed
☐ Gate 7 — Final evidence if needed
☐ Gate 8 — Server-saved if edited
☐ Gate 9 — Module coverage
```

## Gate 1 — Text/STT Context

Check `text` against the whole script for significant context/domain errors: wrong proper noun, wrong number, wrong term, wrong currency, missing word that changes meaning. If fixed, re-pull `video_data`. Do not rewrite stylistically.

## Gate 2 — Role

Read: `type`, `pattern`, `sub_mode`, `visual`, `quote`, `talking_point`, `keyword`, `show_narrator`, `active_roll`, `mediaUrl`, `mediaType`, `thumbnailUrl`, `remotion_spec`.

## Gate 3 — BEFORE Evidence

Pull `screenshot_scene_280x498`, download `result.screenshot.url` locally, show the local file, then judge. This is normally the only composite screenshot for no-edit scenes.

```text
Gate 3 BEFORE:
Composite evidence: <local path shown>
Initial read: <one sentence: narrator/overlay/background visible?>
Verdict: PASS
```

## Gate 4 — Overlay Text-Risk Triage

Load `30_overlay_core` when this gate is not skipped. Load `31_typography` only when fixing text. Load `32_charts`/`33_patterns` only as pattern references for risk classification.

Risk patterns:
`illustration`, `real_entity`, `hybrid_vertical`, `map_chart`, charts, tables, timelines, checklists, quote cards, structural diagrams, or any visible/message text likely baked into image/spec.

Skip when no visible/message overlay text, `narration_only`, intentionally overlay-free scene, or low-risk WideCast-controlled typography with no suspected error.

```text
Gate 4 OVERLAY TEXT-RISK TRIAGE:
Pattern/sub_mode: <pattern/sub_mode>
Visible/message text risk: <yes|no> — reason: <risk pattern | no visible text | low-risk WideCast text>
Overlay poster evidence: <local path shown | N/A skipped | unavailable — composite fallback>
Text inventory checked: <strings or N/A>
Objective checks: typo=<PASS|FAIL|N/A>; diacritics/glyphs=<PASS|FAIL|N/A>; numbers/currency/names/domain=<PASS|FAIL|N/A>; stale/pseudo-text=<PASS|FAIL|N/A>
Action: <skip | keep | fix text/source | replace broken baked-text image/overlay>
Verdict: <PASS | SKIP | FAIL — fix objective text defect>
```

Do not include style, hierarchy, title punch, card padding, or aesthetics in this gate.

## Gate 5 — Background QA

Load `20_background` for every scene. Gate 5 is mandatory and must have its own ledger entry. Use Gate 3 composite as the render truth. Pull/show active plate only when the visible background needs closer judgment or metadata/source cues conflict with the composite.

You may mark `PASS skip`, but never omit the gate. `PASS skip` is only valid when the composite proves the background is objectively hidden, force-grid, full-canvas A-roll, or background changes are disabled.

```text
Gate 5 BACKGROUND QA:
Composite evidence: <Gate 3 local path>
Active plate evidence: <local path shown | N/A hidden/full-canvas A-roll | N/A force-grid>
Background visibility: <visible | hidden by narrator/overlay | grid>
Scene context: <text/keyword/visual summary>
Geo/currency context required: <yes|no> — target: <country/region/currency or N/A>
Objective fit: <PASS|FAIL|N/A> — relevant/off-topic/misleading
Geo/currency/signage/culture: <PASS|FAIL|N/A>
Technical blockers: <PASS|FAIL|N/A> — watermark/burned-in wrong text/logo/duplicate real clip
Action: <skip hidden | keep | replace mediaUrl/mediaType | keep grid>
Verdict: <PASS keep | PASS skip | PASS grid | FIXED + PASS | FAIL — continue search>
```

Do not judge beauty, mood, premium feel, or cinematic quality.

## Gate 6 — Post-Edit Layout Sanity

Run only if this scene changed overlay/layout/media or the screenshot shows an objective collision. Otherwise skip.

```text
Gate 6 POST-EDIT LAYOUT SANITY:
Required: <yes|no> — reason: <edited overlay/layout/media | visible collision | no edit, WideCast layout trusted>
Evidence: <scene_geometry + composite path | N/A skipped>
Checks if required: face_clear=<PASS|FAIL|N/A>; caption_clear=<PASS|FAIL|N/A>; changed_overlay_visible=<PASS|FAIL|N/A>; no obvious collision=<PASS|FAIL|N/A>
Action: <skip | keep | layout fix>
Verdict: <PASS | SKIP | FAIL — fix layout collision>
```

Dead-zone proof is required only after agent layout/overlay edits:

```text
Gate 6 DEAD-ZONE PROOF AFTER EDIT:
scene_geometry pulled: <yes|no>
Objects checked: <ids>
dead_top: <PASS|FAIL>
dead_bottom/caption reserve: <PASS|FAIL>
Action if FAIL: <layout.batch | group move/resize | rebuild objective fix>
Verdict: <PASS | FAIL>
```

## Gate 7 — Final Evidence

```text
Gate 7 FINAL EVIDENCE:
Final evidence type: <BEFORE reused, no edit | AFTER composite shown | overlay_poster shown | composite fallback>
Local path(s): <paths>
Reason no extra image needed: <no edit | no text-risk | no layout/media change | N/A>
Objective final checks: text_defects=<PASS|N/A>; background_defects=<PASS|N/A>; changed_state_visible=<PASS|N/A>
Verdict: <PASS | FAIL — fix and repeat applicable gates>
```

When text proof is needed, keep the transcription table focused:

```text
Rendered text check:
| rendered string | intended copy | issue | verdict |
|---|---|---|---|
| <...> | <...> | <none|typo/diacritic/number/stale/pseudo> | <PASS|FAIL> |
```

## Gate 8 — Server-Saved

Required only after writes.

```text
Gate 8 SERVER-SAVED:
Write performed: <yes|no>
Re-pulled: <video_data | scene_geometry | both | N/A>
Saved fields confirmed: <field names or N/A>
Verdict: <PASS | SKIP no write | FAIL>
```

## Gate 9 — Module Coverage

```text
MODULE COVERAGE GATE:
☑ 00_ENTRYPOINT.md — kickoff
☑ 01_critical_rules.md — kickoff
☑ 02_jump_prevention.md — kickoff
☑ 03_dod_gates.md — scene
☑ 04_principles_workflow.md — kickoff
☑ 05_quality_qa_priority.md — PASS scan
☑ 10_mechanics.md — scene mechanics
☑ 20_background.md — loaded for mandatory Gate 5
☑ 30_overlay_core.md — Gate 4 loaded OR N/A: <reason>
☑ 31_typography.md — loaded for text fix OR N/A: <reason>
☑ 32_charts.md / 33_patterns.md — loaded for risk pattern OR N/A: <reason>
☑ 40_thumbnail_cta.md — loaded only for objective endpoint fix OR N/A: <reason>
Verdict: <PASS | FAIL — load missing required module>
```

## Scene Verdict

```text
Scene N: PASS — ✓1 ✓2 ✓3 ✓4(<PASS|SKIP>) ✓5 ✓6(<PASS|SKIP>) ✓7 ✓8(<PASS|SKIP>) ✓9
```

If any applicable gate fails:

```text
Scene N: FAIL — ✗<gate> <objective issue>; fixing.
```

Do not advance without PASS or an explicit unresolved FAIL.
