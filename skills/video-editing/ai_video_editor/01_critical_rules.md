# 01 · Critical Rules — Fast Blind-Spot QA

Load at kickoff and after any resume.

## Always-On Rules

1. **Scope is objective blind spots.** Check only what WideCast cannot reliably see: rendered/baked overlay text and visible background/media fit. Do not judge taste, polish, title punch, or aesthetic quality by default.
2. **Trust WideCast-controlled layout.** Narrator placement, overlay placement, safe zones, caption position, and normal typography are accepted unless an objective defect is visible or the agent changed them.
3. **Selector discipline.** Write with `voice_file`, not display `id`. After every write, re-pull `video_data` and `scene_geometry` if layout/media/spec changed.
4. **One visual pass unless needed.** Every scene gets one BEFORE composite screenshot saved locally and shown before judgment. Reuse it as final evidence when no edit is made.
5. **Overlay poster is conditional.** Pull `overlay_poster` only for text-risk scenes with visible/message text or after changing overlay text. Do not poster-proof clean low-risk scenes.
6. **Background plate is conditional.** Pull/show the active plate only when the background is visible or must be judged. Skip content-fit checks for full-canvas A-roll, force-grid, and hidden backgrounds.
7. **AFTER screenshot is conditional.** Pull AFTER only after an edit/replacement or when the objective verdict cannot be confirmed from existing evidence.
8. **Gate 4 is typo/data proof, not design review.** Fail only for typo, missing/wrong diacritics, pseudo-text, malformed glyphs, stale copy, wrong number/currency/percent/name/domain term, or clearly broken render.
9. **Gate 5 is content/geo proof, not beauty review.** Fail only for off-topic media, wrong geography/currency/culture/signage, misleading/watermarked/burned-in text, duplicate real clip where it matters, or background invisibility when it was supposed to carry the scene.
10. **Gate 6 runs only after changes or visible objective collisions.** Missing dead-zone proof is not a failure for untouched WideCast layouts. If the agent moves/uploads overlay or layout, then Gate 6 must verify the changed state.
11. **Endpoint scenes are not poster-polish by default.** Scene 2, thumbnail, and final CTA get the same fast blind-spot checks unless the user explicitly asks for thumbnail/CTA/visual polish.
12. **Layer isolation remains.** Background fixes touch `mediaUrl`/`mediaType`; overlay typo fixes touch overlay/spec/text. Do not use a background issue as a reason to redesign overlay.
13. **No user choices during runtime.** Decide from evidence; do not ask A/B style, clip, or scope questions.
14. **Batch outputs are triage only.** A contact sheet or batch screenshot can help find suspects but cannot create `Scene N: PASS`.
15. **Run ledger is source of truth.** Record each scene's verdict, edits, skipped gates, and evidence paths. On resume, read it before continuing.

## Self-Audit Before Reply

- Did I keep the run in fast blind-spot scope?
- Did I avoid aesthetic/style/polish judgments unless the user asked?
- Did every image I used as evidence get saved locally and shown once?
- Did I avoid pulling overlay posters/background plates/AFTER screenshots when the gate was skipped?
- If I edited, did I verify save and pull only the necessary final evidence?
- Did I state `Scene N: PASS` or `Scene N: FAIL — ...` with applicable gates?
