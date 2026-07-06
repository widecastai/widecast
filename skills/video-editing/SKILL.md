# AI Video Editor Fast Playbook

Version: `fast-1.0`. This is the **default WideCast video-editing skill**. It is intentionally scoped to the two things WideCast cannot fully control because it does not see rendered scenes:

1. **Baked/rendered text inside visual overlays** — generated images, charts, maps, document/UI mockups, labels, values, names, numbers, currency, Vietnamese diacritics, and pseudo-text.
2. **Background/media fit** — whether the active background actually matches the scene, especially geography/currency/culture/watermarks/off-topic footage.

Trust WideCast for layout, narrator placement, safe zones, caption placement, title weight, style, and normal overlay aesthetics unless an objective defect is visible or the user explicitly asks for visual polish. Do not judge taste. Do not redesign because something could be prettier.

> **Default scope:** fast blind-spot QA + objective fixes only. The previous full visual-polish audit is intentionally not described here.

---

## How To Use

Open the module for the step you are doing. Do not work from memory.

### Kickoff Modules

Load these at the start of every run:

1. `ai_video_editor/00_ENTRYPOINT`
2. `ai_video_editor/01_critical_rules`
3. `ai_video_editor/02_jump_prevention`
4. `ai_video_editor/03_dod_gates`
5. `ai_video_editor/04_principles_workflow`
6. `ai_video_editor/05_quality_qa_priority`
7. `ai_video_editor/10_mechanics`

Print a KICKOFF LOAD LEDGER with each module's actual line count matched against `LOAD_MANIFEST.md`. A shortfall means truncated, not loaded.

### Step Load Map

| When you reach this step | Load |
|---|---|
| Run kickoff | `00_ENTRYPOINT` + the six core modules above |
| Start every scene | `03_dod_gates` + `10_mechanics` |
| Overlay text-risk triage or objective overlay fix | `30_overlay_core`; add `31_typography` if fixing text |
| Chart/data/table/text-heavy pattern needs typo proof | `32_charts` or `33_patterns` as the pattern reference |
| Background audit or replacement | `20_background` |
| Scene 2 thumbnail or final CTA has objective text/background issue | `40_thumbnail_cta` |
| More than 30 content scenes or user asks for parallel | `06_subagent_protocol` |

---

## Critical Defaults

- Use `voice_file` as the selector for `scene_geometry` and `modify_scene`; never use display `id` as the write selector.
- Work autonomously from scene 2 through the last content scene. Do not ask the user to choose options during an edit run.
- Pull `video_data` once at kickoff, build whole-video context, then work scenes in roster order.
- Every scene gets a **fast 9-gate receipt**, but Gates 4/6/7 are conditional and skip cleanly when WideCast-controlled layers were not edited.
- A scene normally needs **one BEFORE composite screenshot**. Reuse it as final evidence when no edit is made.
- Pull an `overlay_poster` only for text-risk scenes with visible/message text, or after changing overlay text.
- Pull an active background/media plate only when the background is visible or must be judged; skip hidden full-canvas A-roll plates and force-grid content-fit checks.
- Pull an AFTER screenshot only after an edit, replacement, or objective uncertainty that must be verified.
- Do not print aesthetic/taste failures in this fast skill. Objective defects only.
- After any edit, re-pull `video_data`/`scene_geometry` as relevant to confirm server save.

---

## Fast 9-Gate Definition Of Done

1. **Text/STT context** — check spoken `text` for significant context/domain errors.
2. **Role** — read `type`, `pattern`, `sub_mode`, `visual`, `quote`, `talking_point`, `show_narrator`, active media.
3. **BEFORE evidence** — pull one `screenshot_scene_280x498`, download locally, show it, then judge.
4. **Overlay text-risk triage** — only risk patterns / visible message text; check typo, pseudo-text, wrong diacritics, stale text, wrong number/currency/name/domain term. Otherwise skip and trust WideCast overlay.
5. **Background QA** — judge visible active background/media plate for objective fit; skip full-canvas A-roll, force-grid, or invisible background content.
6. **Post-edit layout sanity** — only if this run changed overlay/layout/media or an objective collision is visible. Otherwise skip and trust WideCast layout.
7. **Final evidence** — use BEFORE as final if no edit; pull AFTER / overlay poster only when needed by an edit or text-risk proof.
8. **Server-saved** — required only after writes.
9. **Module coverage** — required modules loaded or explicitly N/A.

`Scene N: PASS` requires all applicable gates to pass. Skipped gates must state why.

---

## Overlay Text-Risk Patterns

Run overlay text proof when visible/message text may be baked or model-generated:

- `illustration` with `document`, `digital_ui`, `photo_with_people`, `photo_no_people` when any image text is visible or expected
- `real_entity` when labels/logos/UI/document text matter
- `hybrid_vertical`
- `map_chart`
- `single_metric`, `bar_chart`, `proportion_chart`, `trend_chart`, `structural_diagram`
- `comparison_table`, `timeline_events`, `checklist_tips`, `quote_card`

Skip by default:

- `narration_only`
- no visible/message overlay text
- normal typography generated by WideCast unless the screenshot/poster shows a concrete text error

---

## Final Handoff

Before handoff, read the run ledger and confirm every content scene has `PASS` or a clear unresolved `FAIL`. Report succinctly:

- text-risk overlay issues fixed or none found
- background issues fixed or none found
- scenes skipped because WideCast-controlled layers were trusted
- review URL

Ask only after all scenes pass: `Render/export the final MP4 now, or review the scenes first?`
