# 00 · Fast Entrypoint

Use this to start every WideCast existing-video edit run.

## Run Prompt

```text
Run a fast WideCast video-editor pass.

Scope: targeted blind-spot QA only. Trust WideCast for overlay/narrator layout,
safe zones, caption placement, title style, and aesthetics unless there is an
objective rendered defect. Do not run a full visual-polish audit.

1. Read SKILL.md, then load kickoff modules:
   01_critical_rules, 02_jump_prevention, 03_dod_gates,
   04_principles_workflow, 05_quality_qa_priority, 10_mechanics.
   Print the KICKOFF LOAD LEDGER against LOAD_MANIFEST.md.

2. Pull video_data once. Build whole-video context: topic, audience, glossary,
   likely STT traps, location/currency context, content-scene roster, thumbnail
   scene, final content scene.

3. Choose execution:
   - <=30 content scenes: inline in roster order.
   - >30 content scenes or explicit parallel request: load 06_subagent_protocol
     and use scene editors.

4. For each content scene, load 03_dod_gates + 10_mechanics + 20_background,
   then run the fast 9 gates:
   1 Text/STT context
   2 Role
   3 BEFORE screenshot shown
   4 Overlay text-risk triage
   5 Background QA
   6 Post-edit layout sanity, only if edited/objective collision
   7 Final evidence, reuse BEFORE if no edit
   8 Server-saved, only if edited
   9 Module coverage

5. Scene 2 and final CTA are not automatic poster-polish tasks in fast mode.
   Only check them for objective text-risk and background issues unless the
   user explicitly asks for thumbnail/CTA redesign.

6. Do not ask the user to choose styles, clips, or scope during the run. Decide
   from objective evidence.

7. Before final handoff, run the completion scan from the run ledger. Do not ask
   for export until every content scene has a PASS or an explicit unresolved FAIL.
```

## Fast Scene Plan Template

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
