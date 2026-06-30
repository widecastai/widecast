# 00 · Entrypoint — how to start an AI video-editor run

Version: `modular-1.1`. Use this as the kickoff prompt for an editing run (manual, continued, or scheduled). It is short on purpose, but explicit enough to FORCE loading the real playbook instead of improvising from memory.

## Run prompt

```text
Run an AI video-editor pass on this WideCast video.

1. `Read` ai_video_editor_guideline_v2_en.md (the MASTER INDEX) first — its LOAD MAP, CRITICAL RULES, JUMP-PREVENTION, the per-scene Definition of Done (§3), and SELF-AUDIT govern everything.
2. Do NOT rely on memory. At each step `Read` the module the LOAD MAP names — every time, even if read earlier this session, and even on a resumed/continued run. Opening a module is a required ACTION.
3. Pull `video_data` once; build the full script for context (§1–§2). Determine `faceless` and find the thumbnail. Initialize a **Background Audit Ledger** with one blank row per content scene; a blank row means the run is not complete.
4. Work ONE scene at a time, scene 2 → last content scene, in one continuous pass. The thumbnail is synced immediately after scene 2 and is NOT revisited at the end.
   - **Autonomous runtime rule:** the agent chooses; the user does not. Do not ask the user to pick a background, style, overlay option, or whether to rebuild. Show evidence for audit, decide using the master decision protocol, apply the best passing option, and report the choice.
   - **Scene 2 / first real scene special rule:** before the normal DoD gates, `Read` `ai_video_editor/40_thumbnail_cta.md` and treat scene 2 as the **opening poster scene** regardless of its `type`/`pattern`. Build a short, thumbnail-like poster hook/consequence overlay for the first frame, with poster-thick title, strong face/subject preservation, and controlled SVG decoration. Because scene 2 still plays as video, verify caption coexistence in the END screenshot; if caption competes with the poster title, revise layout/caption placement instead of declaring PASS.
   - **Immediate thumbnail sync gate:** right after scene 2 PASS, before starting scene 3, apply the same uploaded poster SVG URL to the `type="thumbnail"` scene by stable `voice_file` and confirm it saved with `video_data`/`scene_geometry`. Do not continue to scene 3 until this sync is done.
   - **Final content / CTA scene special rule:** when reaching the last non-thumbnail/content scene, and always for `type="CALL TO ACTION"`, `Read` `ai_video_editor/40_thumbnail_cta.md` and treat it as the **closing CTA scene**. The close needs one clear action, typography stronger than objects, and narrator-primary layout if it is A-roll.
   For every content scene:
   a. Announce the plan as a vertical checklist, one DoD gate per line. Do NOT compress it into one inline sentence:
      ```text
      Scene N plan:
      ☐ Gate 1 — Text / STT
      ☐ Gate 2 — Role
      ☐ Gate 3 — START screenshot shown
      ☐ Gate 4 — Background audit
      ☐ Gate 5 — Overlay review/rebuild
      ☐ Gate 6 — Final layout audit/tune
      ☐ Gate 7 — Dead-zone check
      ☐ Gate 8 — END/final screenshot shown
      ☐ Gate 9 — Server-saved confirmation
      ```
   b. Run the 9 DoD gates in order, opening the module each gate requires (background → `20_background.md`; overlay → `30_overlay_core.md` + `31_typography.md` whenever any text/title/label appears + matching `31`/`32`/`33` + its `styles/*.md`). Report progress per gate (`→ Gate K…` / `✓ Gate K`).
      Attention-drift trap: after any detour/fix (wrong term, typo, missing symbol, bad overlay word, covered face, wrong thumbnail, background swap, geo mismatch, layout tweak, tool/debug issue, or cross-scene small fix), do NOT summarize or jump ahead. Run the master Gate Resume Scan: return to the 9-gate checklist and continue from the earliest unchecked or invalidated gate.
      During Gate 4, print the master `Gate 4 BACKGROUND PROOF` template and update the Background Audit Ledger. **Do not start Gate 5, rebuild/upload an overlay, declare `Scene N: PASS`, or hand off the final video until this scene has a Gate 4 proof verdict.**
      Before authoring/rebuilding any SVG, print the Gate 5 MODULE LOAD PROOF from the master checklist, including `40_thumbnail_cta.md` when the scene is scene 2/opening poster, thumbnail sync, or final CTA. If any required module line is missing, STOP and load it before drawing; Gate 5 cannot PASS without that proof. If the overlay has a title/hero line, print the Gate 5 TITLE GATE PROOF after drafting and before upload, then the screenshot/title check after upload. If the overlay has any non-title text/value/label/card copy, print the Gate 5 SECONDARY TEXT GATE PROOF after drafting and before upload, then the screenshot/secondary-text check after upload. Loading typography is not enough unless all relevant title and secondary-text checks pass; small/non-title labels must not use visible stroke/outline.
   c. Every screenshot / active background/media plate / found media / authored SVG: save locally + SHOW it to the user before judging or applying it. For WideCast scene screenshots, the only valid route is `result.screenshot.url` → `curl -L -s -o <local>.jpg "<url>"` → show the local file. In Gate 4 also pull the active media plate (`thumbnailUrl` first; fallback by `active_roll`/`mediaType`) as a separate local-visible image before judging the background.
   d. End the scene with a verdict: `Scene N: PASS — …` (only after scanning all 9 gates + §7) or `Scene N: FAIL — …; fixing.` Never advance without a stated PASS.
5. Do NOT run a final thumbnail pass. Thumbnail work is complete once the immediate post-scene-2 sync gate has passed.
6. Announce ≠ pause: present evidence and keep working; the only stop is the very end of the video (the runtime user is not present, §2). If the human must act, use a standalone `[ACTION REQUIRED]` block.
7. Before every reply, run the master SELF-AUDIT checklist.
8. Before any final summary/export question/Telegram completion message, run the master **Pre-summary completion scan**: every content scene has `Scene N: PASS`, Gate 1–9 checked, the Background Audit Ledger is complete, scene 2 thumbnail sync is complete, final CTA endpoint handling is complete for the last content scene, and no major task is still pending. If anything is missing, do that work first. Only then hand off the finished video with a short summary of changes, the completed Background Audit Ledger summary, the review URL, and one explicit question: `Render/export the final MP4 now, or review the scenes first?` Do not call export until the user explicitly confirms. Also send the user a Telegram/self-notification that editing is complete and include the review URL.
```

## Notes
- This entrypoint does not replace the master — it points at it. All rules live in the master + modules.
- A scheduled/continued run is the SAME workflow with saved context, not a memory-only shortcut: reload the modules at run time.
