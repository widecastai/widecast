# 06 · Subagent Protocol v3 — parallel scene editors on a server edit session

Load this module **BEFORE spawning any subagent** for scene work, and re-load it when resuming a run that uses subagents.

## Delegation is the DEFAULT, not an option

**If the runtime can spawn subagents (an Agent/Task tool or equivalent), the scene-editor pipeline below IS the standard way to run an edit.** Consent is already granted: a WideCast edit trigger (editor URL / `topic_id` + edit intent) is the user's explicit, standing authorization for scene-editor fan-out (MCP server instructions rule 5) — do not wait for the word "subagent" in chat. Inline single-agent editing is the FALLBACK, allowed only for: (a) no subagent capability, (b) ≤2 content scenes, (c) user explicitly asked single-agent, (d) host HARD-BLOCKS spawning (real tool refusal — report it to the user at hand-off). Record `delegation mode: subagent (K=<n>)` or `inline — reason: <a|b|c|d>` in the run_ledger at kickoff.

## Why this shape is safe — the server does the hard part

- **Per-video write lock (always on):** the server serializes every `modify_scene` on the same `topic_id` — concurrent writes queue, none clobber.
- **Edit session (`widecast_edit_session`):** `action='start'` caches the whole video document in server memory (crash-safe via write-ahead file). All writes stage in the cache; ALL reads — `video_data`, `scene_geometry`, `scene_inspector` screenshots, `overlay_poster` — are served fresh from the cache (read-after-write is instant), and permanent storage is written ONCE at `action='commit'`. Idle sessions auto-commit after 45 minutes.
- Therefore **each scene editor can write its own scene directly** — no payload files, no courier, no single-writer queue in the agent layer.
- If `edit_session` returns `cache_enabled=false` (server kill-switch), proceed WITHOUT a session and note it in the run_ledger — the per-video lock still protects parallel writes.

## Roles

- **MAIN AGENT — pure coordinator, ZERO writes to scenes, ZERO images.** Opens/commits the edit session, prepares the environment (data + skill files), spawns/validates/records, escalates, hands off. It never calls `modify_scene`, never views a screenshot (NO-RELOOK below).
- **SCENE EDITOR** (one per content scene) — the whole per-scene job in one warm context: Gates 1–9 for ITS scene, writing directly via `modify_scene` **scoped to its own `voice_file` only**. It is both the fixer and the verifier of its own work (look BEFORE → edit → look AFTER + poster + typo table → verdict).
- **QA AGENT** (one, at the end) — video-level §8 pass (`05_quality_qa_priority`) using the evidence files editors saved on disk; pulls nothing new from the server except when a cross-scene inconsistency needs one fresh look.

## The flow

- **Phase 0 — kickoff (main, once).** Load kickoff modules; pull `video_data` ONCE; choose the ONE design look for the whole video; print SCENE ROSTER; write run_ledger; export steward files (`run_script.txt`, per-scene `record.json`, full snapshot); ensure the skill zip is **already unzipped locally** and note its root path; call `widecast_edit_session action='start'`.
- **Phase 1 — spawn scene editors.** One editor per content scene, **rolling pool of K=5**: keep 5 in flight, top up the moment one finishes (never fixed batches). If the host's own limit is lower, run at the host's max and top up on every freed slot; retry refused spawns as slots open. Scene 2's editor is spawned first (it also owns the thumbnail sync).
- **Phase 2 — collect (main, event-driven).** As each editor reports: validate mechanically (`ls` checks, report block complete, write scope respected) → record verdict in run_ledger. No waiting on scene order; rows close in arrival order.
- **Phase 3 — video-level QA.** When all roster rows are closed, spawn the QA agent (§8: continuity, repeated visuals, caption consistency, grid cap ≤3 shared, hook/CTA strength). A finding goes back to the owning scene's editor via a follow-up message (warm context) or a `Scene <id> fix agent (cycle 1)` if that editor is gone.
- **Phase 4 — close.** Pre-summary completion scan against the roster → `widecast_edit_session action='commit'` (MANDATORY — staged edits are not live until commit; never commit while any editor is still running) → hand-off + notification.

## Scene-editor contract (the fixed prompt template)

Fill ONLY the `<...>` slots — never paraphrase skill rules into the prompt:

```text
You are "Scene <id> editor agent" for a WideCast video. You own EXACTLY ONE scene.
WRITE SCOPE (hard): you may call widecast_modify_scene ONLY with by=voice_file,
value=<voice_file>. Writing any other scene, export, publish, voice/narrator upload,
or platform tools = your report is INVALID. widecast_upload_asset (S3) is allowed.
An edit session is open on the server: your writes stage safely; reads are always fresh.

FIRST ACTION — load the skill from LOCAL disk (already unzipped; do NOT download
anything): Read <skill_root>/SKILL.md, then these modules for your scene:
01_critical_rules, 02_jump_prevention, 03_dod_gates, 10_mechanics, 20_background,
plus per your scene: 30_overlay_core + 31_typography + styles/text_axes when the
overlay has/needs text; 32_charts or 33_patterns per pattern (unknown pattern →
33_patterns); 40_thumbnail_cta + styles/design_languages for endpoint scenes.
Print your SCENE LOAD LEDGER against <skill_root>/LOAD_MANIFEST.md. Only if a local
file is missing may you fall back to widecast_get_editing_skill — say so in the report.
SECOND ACTION: Read your record.json and run_script.txt (whole-video context: topic,
terminology, geo, numbers) — you edit one scene but judge it against the whole video.
Do NOT call widecast_video_data unless a file is missing/unreadable.

topic_id: <...>
scene: voice_file=<...>  id=<...>  class=<normal | scene2_opening_poster | final_CTA>
scene record: <scratchpad>/scene_<voice_file>/record.json
run script: <scratchpad>/run_script.txt
skill_root: <local path to unzipped skill>
run digest: topic=<...>; tone=<...>; glossary=<...>; design_look=<language_id + font +
            accent>; grid_used=<n>/3
run_ledger (READ-ONLY): <path>     your file dir (write ONLY here): <scratchpad>/scene_<voice_file>/

JOB: run the full per-scene playbook end-to-end for this scene — BEFORE screenshot
(local + saved), Gates 1–9 with their proofs, apply your own edits via modify_scene
(self-scoped), confirm saved (re-pull scene_geometry/video_data — reads are instant in
the session), AFTER screenshot + overlay_poster + per-string typo table, §7 scan, then
report: SCENE LOAD LEDGER, gate verdicts, files list, and final `Scene <id>: PASS|FAIL
— reasons`. <For scene 2 ONLY: after your scene passes, sync the thumbnail scene
(voice_file=<thumb_vf>) with the same poster overlay per 40_thumbnail_cta — this is the
one write outside your scene you are allowed, then confirm it saved.>
Decide autonomously; ask no questions.
```

**Naming:** every spawn is labeled exactly `Scene <id> editor agent` / `Scene <id> fix agent (cycle <c>)` / `Video QA agent`, and the same label is used in run_ledger rows and progress messages. Generic names are a process error.

## Main-agent rules

- **NO-RELOOK (hard):** the main agent never downloads/opens/judges any scene image and never calls `scene_inspector`. Editors look; the QA agent looks; the main agent forwards editors' saved evidence files to the user when recording verdicts (sending ≠ analyzing). Sole exception: a scene escalated to inline (below).
- **Report validity gates:** LOAD LEDGER printed with PASS · write scope respected (no foreign-scene writes) · listed files exist on disk (`ls`, not eyes) · report block complete with explicit verdict. Any miss → re-spawn that scene once with a note; a second structural failure → **inline takeover** of that one scene by the main agent (classic flow, normal look rules apply), rest of the run unaffected.
- **Fix cycles:** an editor that ends `FAIL` on its own scene has already tried; main spawns `Scene <id> fix agent (cycle 1)` with the editor's report paths. Cap 2 cycles → inline takeover. Fix agents inherit the same contract (self-scoped write, local skill, own dir).
- **Steward files are BEFORE-state reference.** Editors work against live server state through their own reads (instant in the session); the main agent does not refresh per-write. Refresh the full snapshot once after commit for the record.
- **run_ledger:** main-agent-only writes; update on every spawn/report/verdict/escalation; re-`Read` after any resume/compaction. Roster = completeness tracker (rows close in event order; every row must close).
- **File namespacing:** every editor writes only inside `<scratchpad>/scene_<voice_file>/`; S3 keys are per-call UUIDs; server per-scene artifacts are keyed by `voice_file` — no collision surfaces.
- **One video at a time.** Commit the session before starting another video's run.
