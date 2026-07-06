# 04 · Principles + Whole-Video Workflow — Fast Edition

Load at kickoff.

## Principles

- Prefer **objective checks** over taste calls.
- Trust WideCast layout and design output unless there is a visible, objective defect.
- Spend vision tokens where WideCast is blind: generated/baked text and background/media fit.
- Do not add overlays, restyle overlays, or polish endpoints unless the user asked or an objective defect requires a targeted fix.
- Use the minimum evidence needed:
  - one BEFORE composite for every scene
  - overlay poster only for text-risk scenes
  - active plate only for visible/background-relevant scenes
  - AFTER only after edits

## Whole-Video Setup

1. Pull `video_data`.
2. Build full script context and glossary.
3. Identify location/currency sensitivity.
4. Identify content scenes: scene 2 through last non-thumbnail/content scene.
5. Identify thumbnail scene, but do not run poster polish by default.
6. Create a run ledger with one row per content scene:
   `scene`, `voice_file`, `pattern`, `background_verdict`, `overlay_text_verdict`, `edits`, `final_evidence`, `verdict`.
7. Decide inline vs subagent by scene count.

## Per-Scene Loop

For each scene in roster order:

1. Run Gates 1–3.
2. Run Gate 4 only if text-risk exists; otherwise skip explicitly.
3. Run Gate 5 for visible background/media; skip hidden/full-canvas A-roll or force-grid content fit.
4. Run Gate 6 only after edits or objective collision.
5. Run Gate 7 with existing evidence unless edits require a fresh look.
6. Run Gate 8 only if edited.
7. Run Gate 9 and verdict.

## Completion Scan

Before final handoff, read the run ledger and confirm:

- every content scene has PASS or an explicit unresolved FAIL
- all objective text-risk scenes were checked or skipped with reason
- all visible backgrounds were checked or skipped with reason
- all edits were server-saved
- no export is requested before PASS completion
