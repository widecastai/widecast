# 06 · Fast Subagent Protocol

Load before spawning scene editors.

## When To Use

- Inline is default for `<=30` content scenes.
- Use subagents when the video has more than 30 content scenes or the user asks for parallel processing.

Record `delegation mode` in the run ledger.

## Roles

- Main agent: coordinator only. Opens/commits edit session, prepares files, spawns editors, validates reports, updates run ledger.
- Scene editor: owns exactly one scene and runs the fast 9 gates.
- QA agent: checks ledger completeness and unresolved text/background failures.

## Scene Editor Contract

Each editor must:

1. Load local `SKILL.md` and required fast modules.
2. Read `record.json` and full `run_script.txt`.
3. Work only its assigned `voice_file`.
4. Pull/show one BEFORE screenshot.
5. Run Gate 4 only for text-risk overlays.
6. Run mandatory Gate 5 for background/media using the BEFORE composite; pull a plate only if needed.
7. Pull extra evidence only after edits or required text-risk proof.
8. Verify saves after writes.
9. Report files, gate verdicts, and `Scene N: PASS|FAIL`.

Scene 2 editor may sync thumbnail only if scene 2 was edited or thumbnail has an objective mismatch.

## Report Validity

Main validates:

- load ledger present
- evidence files listed and exist
- write scope respected
- Gate 4/5 verdicts present
- no full aesthetic redesign was done without explicit user request
- final verdict present

Invalid report → respawn once, then inline takeover for that scene.

## Edit Session

If using subagents:

1. Start `widecast_edit_session`.
2. Spawn rolling pool up to K=5.
3. Collect reports and update ledger.
4. Run QA.
5. Commit session before handoff.
