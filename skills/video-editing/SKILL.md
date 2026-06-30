# AI Video Editor Playbook

Version: `modular-1.2` · This file is the MASTER INDEX. Detailed protocols live in `ai_video_editor/` (modules) and `ai_video_editor/styles/` (style libraries, guarded by `styles/sync_check.py`). Keep this index small — do not paste module protocols back into it.

The goal of the AI video editor is to edit each scene so that the final video has correct content, a clear face, clear text, the right visuals, good layout, and consistent quality from beginning to end.

> **Overarching principle — name the field, do not guess.** Every inference and every edit command must stick to the exact field name in the data (§0). Example: instead of saying "the scene has a narrator," read `show_narrator=true` (equivalent to `active_roll="A"`); instead of "the scene has an overlay," read `overlay.<sub>.visible=true`. All geometry (safe zone, narrator face, overlay position) is precomputed — call `scene_geometry` instead of estimating coordinates yourself.

---

## 🛑 HOW TO USE THIS FILE — READ FIRST (the #1 way agents fail)

**This file is an INDEX, not the manual.** The actual rules for each step live in **separate MODULE FILES** under `ai_video_editor/`. **Opening a module is a REQUIRED ACTION, not optional reading**: when you reach a step, you **MUST open the module named for it BEFORE doing that step** — every time, even if you think you remember it. You **cannot** do a step correctly from this index alone; the index only tells you *which file to open*.

### 📦 HOW "open a module" works — TWO transports, ALWAYS LIVE

The exact mechanism depends on how this skill is being run. **Pick the one that matches your environment and use it consistently — both paths return identical content because they read the same files on disk.** Modules are NEVER cached by you or the CDN; every load is fresh from the server:

- **(MCP transport — REST/JSON tool — the default for the widecast MCP server, ChatGPT custom GPT Actions, plain HTTP)**
  Call **`widecast_get_editing_skill(module='<id>')`** where `<id>` is the module path without `.md`, e.g.
    - `widecast_get_editing_skill(module='ai_video_editor/10_mechanics')`
    - `widecast_get_editing_skill(module='ai_video_editor/styles/text_axes')`
  The first call (with `module` omitted) returns this `SKILL.md` plus a live `available_modules[]` index (auto-discovered from the filesystem on every request). Re-call with `module='<id>'` whenever you reach the step. The server emits `Cache-Control: no-store` and the WideCast `/app/*` API path bypasses Cloudflare, so the content is ALWAYS the latest version on disk.
  If a module call returns 404 `module_not_found`, the file isn't on disk yet — call **`widecast_get_editing_skill()`** with no args to refresh `available_modules[]` and pick from there.

- **(Anthropic Skill upload transport — Claude Desktop / Claude.ai having mounted `video-editing.zip` locally)**
  Use the host's local file `Read` tool, with the module path RELATIVE to this skill's root, e.g. `Read("ai_video_editor/10_mechanics.md")`. The zip contains the same files; treat the host's local file tree as the source of truth for the session.

**Stable rule across both transports:** *reach a step → open the module → then act.* If you did not open the module, you have not done the step. Memory of a module you opened earlier in the session does NOT replace re-opening it — both transports are cheap and always live.

> **This is exactly how the background audit gets skipped:** an agent reads the master, treats a scene as "an overlay geometry task", and never opens `20_background.md` — so the whole background/B-roll branch silently disappears. **The fix is mechanical: reach a step → open its module → then act.** If you did not open the module, you have not done the step.

- **Per scene you will almost always open, in order:** `10_mechanics.md` (data + layout) → `20_background.md` (background pass) → `40_thumbnail_cta.md` when the scene is an endpoint (scene 2 / thumbnail sync / final CTA) → `30_overlay_core.md` (overlay) → `31_typography.md` whenever the overlay has any text/title/label/value → then the matching content module (`31_typography.md`/`32_charts.md`/`33_patterns.md`) → and its `styles/*.md` recipe lib. Background, endpoint handling, overlay-core, typography, and the style lib are the ones most often skipped — they are NOT optional.
- **Opening poster + thumbnail + final CTA are special:** the first real scene after the thumbnail (usually scene 2) is an **opening poster scene** because platforms often extract it as the default cover frame. The last non-thumbnail/content scene is a **closing CTA scene** because it asks the viewer to act. `Read` `40_thumbnail_cta.md` for both endpoint scenes even if their `type`/`pattern` says HOOK/DATA/FACT/etc. Immediately after scene 2 passes, sync `type="thumbnail"` with the same poster SVG and verify it there; the thumbnail is **not** revisited at the end.
- The per-scene **Definition of Done (§3)** lists which file each gate requires. A gate is not done until its module was opened.
- **Reload, do NOT rely on memory.** Re-`Read` a module each time you reach its step, **even if you read it earlier this session**. A resumed/continued run (or a scheduled re-run) reloads the modules for the current step; running from memory is not allowed.
- **Stable TEXT markers (icons render differently across AI apps — the TEXT is the source of truth).** Use these literal markers; an emoji (⭐ ✓ → ○ !) MAY decorate but never replaces the text:
  - `[ACTION REQUIRED]` — a standalone block whenever the human must do something (record A-roll, approve, run a command, final hand-off).
  - `Scene N: PASS` / `Scene N: FAIL — …` — the per-scene verdict (§3).
  - `No action required.` — when a hand-off needs nothing from the human.

## ⬇ LOAD MAP — reach a step → open the matching module → then do the step

The **Module id** column is what you pass to `widecast_get_editing_skill(module=...)` (MCP transport) or what to `Read` (Anthropic Skill upload transport — append `.md`). One row = one required load.

| When you are… (reach this step) | Module id to load FIRST (required action) |
|---|---|
| starting a scene · reading its data · coordinates · the 13 `modify_scene` branches · auditing/adjusting layout · choosing an A-roll layout scenario · deciding how to look (screenshot) | **`ai_video_editor/10_mechanics`** |
| deciding the background (grid vs a real image/video) · searching · evaluating · applying footage | **`ai_video_editor/20_background`** |
| about to (re)build or apply ANY overlay (the SVG model, the rebuild threshold + vision gate, the SVG standard / `data-wc-*`, reuse-a-photo, apply & verify) | **`ai_video_editor/30_overlay_core`** — load FIRST for any overlay |
| the overlay has TEXT (title/label/value/quote) → make it pop + pick a diverse text LOOK | **`ai_video_editor/31_typography`** + **`ai_video_editor/styles/text_axes`** |
| the pattern is a CHART (`single_metric`/`bar_chart`/`proportion_chart`/`trend_chart`/`structural_diagram`) | **`ai_video_editor/32_charts`** + **`ai_video_editor/styles/chart_axes`** |
| the pattern is OTHER (`map_chart`/`comparison_table`/`timeline_events`/`checklist_tips`/`quote_card`/`illustration`/`hybrid_vertical`/`real_entity`/`typography_only`/`narration_only`) | **`ai_video_editor/33_patterns`** |
| handling the first real scene after the thumbnail (opening poster frame) · the immediate post-scene-2 thumbnail sync · the last content/CTA scene | **`ai_video_editor/40_thumbnail_cta`** |

**Adding modules later — automatic.** When the maintainer drops a new `.md` file under `widecast/skills/video-editing/` (root or any sub-dir), it appears in the live `available_modules[]` index returned by the entry call — no code change, no SKILL.md edit needed for the loader to find it. Each entry carries `id` + `title` (parsed from first H1) + `summary` (first paragraph) + `size_bytes`, so you can pick by relevance before loading content. **If you see an available module whose `title`/`summary` matches a step that the table above does not cover yet, load it.** Treat the live `available_modules[]` as the source of truth; this table is the curated default chain.

**Section → file key** (so an old `§N.M` cross-reference still resolves): §0.1–0.4 · §3 Step 3–4 · §6 → `10_mechanics.md` · §4 · §11 → `20_background.md` · §0.5 · §5.0 · §5.1 · §5.4 · §5.5 → `30_overlay_core.md` · §5.2 → `31_typography.md` · §5.3(chart) → `32_charts.md` · §5.3(other) → `33_patterns.md` · opening poster scene / thumbnail cover pair / final CTA scene → `40_thumbnail_cta.md` · §1 §2 §3(Step 1–2) §7 §8 §9 §10 → this file. Style taxonomies are mirrored from code and guarded by `ai_video_editor/styles/sync_check.py`. **To START a run** (manual / continued / scheduled) use `ai_video_editor/00_ENTRYPOINT.md` — it loads this master then runs the per-scene loop.

---

## ⭐ CRITICAL RULES — true in EVERY module; never forget even after a module is loaded

0. **Visual evidence gate — local-visible BEFORE reasoning.** Any image the agent uses as evidence (scene screenshots, END screenshots, found media, B-roll thumbnails/contact sheets, downloaded photos, generated images, extracted spec images, style preset previews, reference images, **and any SVG overlay image the agent creates**) **must be saved/downloaded to a local file and SHOWN visibly to the user in chat BEFORE the agent looks at it, reasons from it, edits from it, uploads it, or advances.** For WideCast scene screenshots, there is exactly ONE valid transport: call MCP `scene_inspector` / `widecast_scene_inspector` with `action="screenshot_scene_280x498"`, read `result.screenshot.url`, run `curl -L -s -o <local>.jpg "<url>"`, then show the local file. The remote URL is only a short-lived transport; do NOT judge from it and do NOT embed it as evidence. If `result.screenshot.url` is missing, the screenshot step is not satisfied; do not use base64, binary `ImageContent`, sidecar JSON, browser screenshots, or REST-auth workarounds. Sidecar JSON alone (`returned_as`, `bytes`, `request_id`, or `status`) does NOT count as shown. Raw URLs, HTML with online `<img>`, or "I pulled a screenshot" are NOT enough. If the user cannot visibly see the exact local evidence image, the step is unchecked and the agent must not proceed.
1. **Name the field, never guess.** Selector is **`voice_file`** (not `id`). After every `modify_scene`, **pull `video_data`/`scene_geometry` again** to confirm it saved.
2. **Runtime = autonomous, end-to-end.** The user is NOT present; work scene 2 → last content scene in ONE pass, with the thumbnail synced immediately after scene 2, **never pause to ask**. Do not present options for the user to choose (`A or B?`, `which style?`, `should I rebuild?`). The agent must inspect the data + local-visible evidence, choose the best path under this playbook, act, and surface notes only in the final hand-off. (Per-scene pausing is dev-mode only.)
2a. **Decision protocol — choose, don't defer.** When several valid actions exist, decide by this priority: correctness of narration/data → face/subject preservation → readability at 280x498 → safe-zone/caption compliance → aesthetic quality/brand fit → minimal necessary edit. If two options are close, pick the simpler one that passes all gates. Only block for truly missing external input that no tool can infer, such as unavailable credentials or a required user-owned media file; otherwise continue autonomously.
3. **Decide by SIGHT, not by `pattern`.** grid-vs-real and regenerate-or-leave are visual calls from a local-shown START screenshot — the `pattern`/`sub_mode` labels are for the BLIND pipeline. **Vision gate:** if you cannot see images, do only safe data-driven layout fixes and leave overlays as-is. **If you CAN see, the screenshot is REQUIRED for every visual call — `scene_geometry` is NEVER a substitute for looking, and a scene you did not screenshot cannot be declared `PASS`. The image bytes are already in the `scene_inspector` result: save → show (§6); never avoid the look because the bytes were awkward to extract.**
4. **Overlay = transparent SVG, local-shown, hosted, then uploaded.** Never paint a full-canvas background rect. Keep content in the safe box **x∈[36,684], y∈[128,960]**. Before hosting/uploading, save the authored `.svg` locally and show that local SVG to the user; only then `upload_asset`/`upload_overlay`. Do **not** spend time rasterizing/converting the SVG to PNG/JPG for preview — the SVG itself is the pre-upload transparency/content gate, and final render truth comes only from the saved/shown local post-upload screenshot.
5. **ONE atom = ONE object** (`<g data-wc-object>`); atomize, never clump (list item, check, label each separate). To co-appear, share `data-wc-delay` — don't merge groups.
6. **Font: name the HEAVY family** (`"<Family> Black"`; cairosvg ignores numeric `font-weight`). Derive ONE font + accent **per video, vary between videos.** TITLE 60–96px Black; no overlay text < ~30px; fit each line inside its container.
7. **Diversify the LOOK — never ship flat-only.** Load the style library (`styles/text_axes.md` / `styles/chart_axes.md`) and reproduce a real look (gradient/glossy/3D/metallic/bevel/…), one per video.
8. **A-roll: the face is sacred.** Never edit `narrator_face`; clear the face after upload (the SVG auto-centers onto it). Ignore face overlap on B-roll. **Final A-roll / CTA scene special rule:** if the scene is the last non-thumbnail/content scene and `show_narrator=true` / `active_roll="A"`, `Read` `40_thumbnail_cta.md`, treat the narrator as the primary closing element, and use one clear typography-led CTA when the scene asks for action. Prefer a full-canvas narrator (scenario 1/2, or 3/4 only if a small CTA support overlay needs room). Do not replace the human close with object clutter or a large checklist/chart unless a detail-dense visual is truly indispensable. No-overlay is acceptable only when the visible narrator + caption already carry the CTA clearly; otherwise use a short bold lower-third/chest/side CTA that clears the face and caption.
9. **Grid ≤ 3 scenes/video, all sharing ONE grid.** Lean to a real background otherwise.
10. **Realistic photos are REUSED, never "drawn".** To ONLY add info to a good overlay use `modify_scene` (M) `remotion.add_element` (additive, no overwrite); full re-author overwrites the spec.
11. **Show found media in chat BEFORE looking/evaluating/applying** (local file evidence — the sandbox can't fetch online URLs in a widget). No private preview first.
12. **Every scene = a BACKGROUND audit AND an overlay review — two separate passes; never skip the background** (it is its own gate, not part of the overlay check). Gate 4 uses TWO local-visible evidence images: the START composite screenshot (render truth) AND the active background/media plate (`thumbnailUrl`/fallback media thumbnail) shown separately so the agent can tell which marks belong to the background vs the overlay/caption. And **every screenshot/media plate you pull is saved/downloaded locally and SHOWN visibly to the user before you act on it**. **No visible local evidence = no visual judgment.** Complete the **per-scene Definition of Done (§3)** before advancing to the next scene.
12a. **Endpoint scenes: scene 2 + thumbnail + final CTA.** The first real scene after the thumbnail (usually `id=2`) is special regardless of `type`/`pattern`: `Read` `40_thumbnail_cta.md` and treat its first-frame composition like a thumbnail/poster, because platforms may auto-extract that frame as the default cover. Use a short whole-video hook/consequence title, poster-thick typography, strong face/subject preservation, and controlled SVG decoration. **Immediately after scene 2 PASS, before starting scene 3, sync the static thumbnail scene:** apply the same uploaded poster SVG URL to `type="thumbnail"` by `voice_file`, pull/show the thumbnail screenshot, and confirm it saved with `video_data`/`scene_geometry`. This sync is a gate; do not continue to scene 3 until it is done. **Do not re-check thumbnail at the end** unless the user explicitly asks; the thumbnail and scene 2 should already be intentionally matched. When reaching the last non-thumbnail/content scene, especially `type="CALL TO ACTION"`, `Read` `40_thumbnail_cta.md` again and treat it as a closing CTA endpoint: one clear action, typography stronger than objects, and narrator-primary if A-roll.
12b. **Gate 4 requires a printed BACKGROUND PROOF, not a vibe check.** The agent must print/fill the exact `Gate 4 BACKGROUND PROOF` template in §3 for every content scene before Gate 5 starts. A scene cannot be called PASS, and the run cannot be called done, unless every content scene has a `Gate 4 BACKGROUND PROOF` row with `Verdict: PASS keep`, `Verdict: PASS grid-by-design`, or `Verdict: FIXED + PASS`. If the proof is missing, answer "background audit not complete" and run Gate 4; do not summarize the scene as done.
12c. **Attention-drift / Gate Resume Scan — a detour is NOT a completed scene or run.** Any issue can pull the agent away from the original checklist: wrong term, typo, missing number/symbol, background replacement, geo/currency mismatch, overlay rebuild, covered face, caption collision, thumbnail sync, tool/debug problem, or a small fix applied across many scenes. After the detour is fixed, run a **Gate Resume Scan** before summarizing or moving on: re-open the current scene checklist, identify the earliest unchecked or invalidated gate, and continue from there. If the detour touched multiple scenes, resume at the earliest scene/gate whose PASS is no longer proven. No gate is exempt: Gate 1 text, Gate 2 role, Gate 3 START evidence, Gate 4 background proof, Gate 5 overlay proof, Gate 6 layout, Gate 7 dead-zone, Gate 8 END evidence, and Gate 9 server-saved confirmation can all be missed after drift.
12d. **Pre-summary completion scan — no big task left behind.** Before writing any final summary, completion report, Telegram completion message, or export question, scan the run-level checklist, not memory: every content scene must have `Scene N: PASS`; every scene must have Gate 1–9 checked; every Background Audit Ledger row must be filled; scene 2 thumbnail sync must be complete; final CTA endpoint handling must be complete for the last content scene; any `[ACTION REQUIRED]` item must be surfaced. If any major workstream is incomplete (especially background audit/replacement, endpoint scene handling, or server-saved verification), do the missing work first. Fixing a small defect across all scenes does NOT mean the video is done.
13. **This master is an INDEX — `Read` the named module BEFORE doing each step, every time (a required ACTION, see "HOW TO USE" above).** You cannot do a step from the index alone; not opening the module = skipping that step's rules. (This is the literal cause of a missed background audit: the agent never opened `20_background.md`.) **Re-`Read` it each time you reach the step, even if read earlier this session; a resumed run reloads, never works from memory.**
14. **Announce the per-scene task list at the START, report progress at each gate, and re-state the ✓/✗ checklist at the END** (§3) — so the user can audit your plan, your current position, and any gaps. Announce, don't pause. **End every scene with an explicit `Scene N: PASS`/`FAIL` verdict — say PASS only after scanning all 9 DoD gates + §7 and confirming each; never advance without a stated PASS.**

---

## ⛔ JUMP-PREVENTION RULES — catch yourself BEFORE the action

Each line is an interrupt on what you are *about to* do. If it matches, STOP, do the `→` part first, then resume. (Deliberately redundant with the Critical Rules + DoD — redundancy is what stops misses.)

- About to **start a scene** → first `Read` `10_mechanics.md`.
- About to **handle the first real scene after the thumbnail** → first `Read` `40_thumbnail_cta.md`; it is the opening poster frame even if its `type`/`pattern` is not `thumbnail`.
- About to **handle `type="thumbnail"`** → only do this as the immediate sync gate after scene 2 PASS (unless the user explicitly asks for a thumbnail-only debug/edit). First `Read` `40_thumbnail_cta.md`; clone/verify the opening poster identity, then continue to scene 3.
- About to **handle the last non-thumbnail/content scene or `type="CALL TO ACTION"`** → first `Read` `40_thumbnail_cta.md`; treat it as the closing CTA endpoint, with one clear action and typography stronger than decorative objects.
- About to **audit/choose the background** → first `Read` `20_background.md`. (Background is its OWN pass, never folded into the overlay.)
- About to **start Gate 5 / overlay work** and this scene does not yet have a printed `Gate 4 BACKGROUND PROOF` with a PASS/FIXED verdict → STOP. Run Gate 4 first. Overlay urgency, obvious text errors, or "the screenshot looks fine" do not waive background proof.
- Just finished any **detour/fix** (wrong term, typo, missing number/symbol, bad overlay word, covered face, wrong thumbnail, background swap, geo mismatch, layout tweak, tool/debug issue, or cross-scene small fix) and feel ready to summarize/handoff/move on → STOP. Run the Gate Resume Scan from Critical Rule 12c and continue from the earliest unchecked or invalidated gate; a fix is not a scene/run verdict.
- About to **(re)build or apply an overlay** → first `Read` the whole LOAD CHAIN: `30_overlay_core.md` + the matching `31`/`32`/`33` + its `styles/*.md`. Stopping at `30` = flat / off-pattern.
- About to **make ANY visual call** (grid-vs-real, regenerate-or-leave, readable?) from `scene_geometry` alone → STOP: pull the screenshot, save + show it locally, judge from the IMAGE. Geometry never substitutes for looking.
- About to **act on a screenshot / found media you have not SHOWN** locally → save + show it first (rules 0/11).
- About to **upload an overlay** you have not shown locally → show the local SVG first (rule 4).
- About to **ask the user to choose/approve an option during runtime** → STOP. Use the decision protocol in Critical Rule 2a, choose the best option yourself, act, and only report the decision/proof. Do not turn uncertainty into a user question.
- About to **declare `Scene N: PASS`** without scanning all 9 DoD gates + §7 (incl. dead-zone) → run the scan first; PASS is earned by the scan.
- About to **declare `Scene N: PASS`** but the end checklist cannot name the Gate 4 verdict (`PASS keep`, `PASS grid-by-design`, or `FIXED + PASS`) → STOP. The background audit is missing even if overlay/layout passed.
- About to **move to the next scene** with no stated `PASS`/`FAIL` verdict → declare the verdict first. No verdict = scene not done.
- About to **write a final summary / completion report / Telegram completion message / export question** → STOP and run the Pre-summary completion scan (Critical Rule 12d). If any scene/gate/ledger row is incomplete, do that work first instead of summarizing.
- About to **final-handoff a video** without a complete per-scene background-audit ledger for every content scene → STOP. Say "background audit not complete" and run the missing Gate 4 rows before hand-off/export.
- User asks **"did you audit backgrounds?" / "are backgrounds suitable?"** → answer from the Gate 4 ledger only. If any content scene lacks a Gate 4 proof row, answer "not yet" and continue the background audit; do not infer from memory or from overlay screenshots.
- **Resuming / continuing a run** → do NOT work from memory: re-`Read` the modules for the step you are on.

---

## 1. General Principles

1. Always start by pulling the entire video script (`video_data`).
2. Read the whole video context before editing each scene.
3. Concatenate the `text` of the segments into the full script to understand the topic, terminology, proper names, industry, offer, disclaimer, and tone.
4. Go through scenes in the order they appear in the video. Start with the first real scene after the thumbnail (usually scene `id=2`), but treat that scene as an **opening poster scene** using `40_thumbnail_cta.md` in addition to the normal DoD, because it may become the platform's default extracted thumbnail. The scene `type="thumbnail"` is handled immediately after scene 2 PASS as a sync gate, then skipped for the rest of the run unless the user explicitly asks. When you reach the last non-thumbnail/content scene, especially `type="CALL TO ACTION"`, use `40_thumbnail_cta.md` again and treat it as the closing CTA scene.
5. Prioritize reading the data first, including `text`, `visual`, `pattern`, `sub_mode`, `keyword`, `quote`, `talking_point`, `mediaUrl`, and the geometry from `scene_geometry`. **⭐ But `pattern`/`sub_mode` exist for the BLIND automated pipeline — you CAN see, so make the visual/aesthetic calls (grid-vs-background, regenerate-or-leave, is-this-image-right) from your own judgment + the topic's vibe, NOT from the pattern label. Use the data as input, never as the verdict (§4.1, §5.0).**
6. `scene_geometry` gives the structural data (boxes, safe zones); a **local-shown screenshot from MCP `screenshot_scene_280x498`** is how you actually SEE the scene. For every WideCast scene screenshot, download `result.screenshot.url` to a local file with `curl`, show it, then evaluate. Show START before evaluating and show END before confirming — but **don't force a fixed count and don't pull after every tiny edit** (each pull costs tokens + bandwidth); batch your edits and pull/show when you genuinely need to see the result (§6).
7. After each edit, pull `video_data`/`scene_geometry` again to check the result was saved on the server.
8. When doing an interactive review with the user, show the important images/thumbnails/layouts and your reasoning so the user can evaluate alongside you.
9. **Visual evidence before agent judgment (not just before applying).** Any visual artifact the agent is about to use as evidence — screenshot, found media, B-roll candidate thumbnail, contact sheet, downloaded image, generated image, extracted spec image, style/reference preview, or **agent-authored SVG overlay** — must be **downloaded/saved locally and rendered viewable in chat BEFORE the agent evaluates it, chooses from it, edits from it, uploads it, or calls `modify_scene` because of it**. Looking privately first is a process error. A self-authored **SVG overlay must be shown locally before upload**, but the local SVG preview is not final render truth — verify final placement/readability via the **post-upload screenshot** (§5.5), and that screenshot must still be local-shown before you judge it.
   - **THE SHOW MECHANISM — LOCAL FILE FROM `result.screenshot.url`, NOT BASE64 / BINARY / BROWSER.** For WideCast scene screenshots, call MCP `scene_inspector` / `widecast_scene_inspector` with `action="screenshot_scene_280x498"` as the source of truth. The tool must return `result.screenshot.url`. The agent must immediately download that URL to a local file with `curl -L -s -o <local>.jpg "<url>"`, then show the local file using the environment's local-file display mechanism (`SendUserFile` / `present_files` / local image attachment). **ABSOLUTELY DO NOT judge from the remote URL itself or show via an online URL** (S3/http) embedded in a widget/HTML. Sidecar JSON, request ids, truncated transcript dumps, base64, binary `ImageContent`, browser screenshots, and HTML galleries with online `<img>` are NOT sufficient for WideCast scene screenshots.

## 2. Whole-Video Workflow

Before going scene by scene, the agent needs to do one pass of a video-level audit:

1. Pull the entire video data.
2. Build the full script by concatenating each scene's `text`.
3. Identify the topic, field, and primary audience of the video.
4. Note the important terms, product names, people's names, company names, the industry, and the phrases STT is likely to mishear.
5. Identify the video type: educational, sales, explainer, how-to, reaction, case study, news, or CTA.
6. Identify the tone: serious, humorous, warning, expert, friendly, or viral hook.
7. Lightly scan each scene's classification fields **for context only** (`type`, `show_narrator`, `pattern`+`sub_mode`, `overlay.*.visible`, `remotion_spec`) — enough to infer `faceless`, spot the thumbnail, and catch context-level script errors. **This is NOT a per-scene edit plan — make NO visual judgement and take NO screenshot here.**
8. Initialize a **Background Audit Ledger** with one blank row for every content scene from scene 2 through the last content scene. Do not fill visual judgments during the context pass; rows are filled only when that scene reaches Gate 4. Required columns: `scene`, `voice_file`, `composite_local_path`, `active_plate_local_path`, `geo_context_required`, `geo_verdict`, `decision`, `action`, `verdict`. A blank row means the video is not done.

Understanding the whole picture is mandatory because many per-scene errors cannot be detected by reading a single scene in isolation.

> **⭐ AFTER this light context pass, go ONE SCENE AT A TIME — do NOT audit or pre-plan all scenes at once.** Start at the **first scene after the thumbnail (scene 2)** and treat it as the **opening poster scene**: load `40_thumbnail_cta.md`, make the first-frame overlay poster-like, and verify caption coexistence because this scene still plays as video. **After scene 2 PASS and before scene 3, immediately upload/apply that same poster SVG to the `type="thumbnail"` scene, pull/show the thumbnail screenshot, and confirm server-saved; this keeps the opening poster pair locked.** The thumbnail is then done; do NOT re-check it at the end unless the user explicitly asks. When you reach the last non-thumbnail/content scene, load `40_thumbnail_cta.md` and make the close a CTA endpoint: one clear action, typography-led, narrator-primary if A-roll. Fully handle one scene — **pull START screenshot via MCP → download `result.screenshot.url` to a local file with `curl` → show visible local evidence in chat → only then evaluate (§6) → decide (regenerate-or-leave, §5.0) → edit → pull/download/show END → only then verify** — before moving to the next. Sidecar JSON, request ids, base64, binary `ImageContent`, browser screenshots, or remote URLs shown inline do not satisfy the show gate. The visual decision for each scene is made from the **visible local screenshot of THAT scene when you reach it**, never from a whole-video table built up front. (Producing an all-scenes intention table instead of working scene-by-scene is a process error.)
>
> **⭐ RUN END-TO-END — do NOT pause between scenes.** At runtime the user is NOT present (§5.0), so the agent works **scene 2 (+ immediate thumbnail sync) → … → the last content scene**, in one continuous pass, and **only stops at the very end** to hand off the finished video for review. **Never stop mid-video to ask or wait for input.** (Pausing for review after each scene is a *development-mode* behaviour for building this playbook with a human in the loop — it is NOT a runtime rule.)

Example: in a video about insurance or estate planning, STT might write `Living Church` when the correct content should be `Living Trust`. Spelling and grammar aren't wrong, but it's wrong by context.

## 3. Per-Scene Checklist

Every scene must pass through the following steps.

> **⭐ DEFINITION OF DONE — finish EVERY gate below before moving to the next scene. Do NOT advance while any gate is unchecked.** (These are pass/fail gates; the Steps + modules are the how. Background audit, screenshot-show, and dead-zone are the three most-often-skipped — they are explicit gates here on purpose.)
>
> 1. ☐ **Text / STT** checked in whole-video context, fixed if wrong (Step 1, branch K).
> 2. ☐ **Role** understood — `type` · `pattern`/`sub_mode` · `visual` · `quote` · `talking_point` (Step 2).
> 3. ☐ **START screenshot** pulled with MCP `screenshot_scene_280x498` → `result.screenshot.url` **downloaded locally with `curl` + SHOWN visibly to the user** → **only then evaluated** (§6, `10_mechanics.md`). *Every screenshot you pull is shown, never just consumed silently. Remote URLs, base64, binary `ImageContent`, sidecar JSON, and request ids do not count.*
> 4. ☐ **`Read` `20_background.md` FIRST, then audit the BACKGROUND as its OWN pass** — NOT folded into the overlay check. Use two local-visible images: the START composite screenshot (what actually renders) AND the current active background/media plate (`thumbnailUrl` first; fallback per `active_roll`/`mediaType`) downloaded locally + SHOWN before analysis. Decide grid-vs-real BY SIGHT; if real and visible, confirm: fits narration/`keyword`, **geo/location/currency context matches when the industry/scene is location-sensitive** (real estate, insurance, tax, legal, healthcare, local services, finance, etc.), natively portrait, not too bright/cluttered behind the text, no watermark/burned-in text, clean start frame, and actually VISIBLE in the composite. **Bypass content checks in two cases:** if the active media is grid/force-grid, do not evaluate subject matter or geo cues — only check the grid cap/shared-grid rule and readability; if an A-roll narrator fills/occludes the canvas, do not evaluate the hidden fallback/background content — the narrator is the visual. Apply background changes via branch (A) `mediaUrl`.
> 5. ☐ **`Read` `30_overlay_core.md` FIRST, then handle the overlay.** If this is an endpoint scene (scene 2/opening poster, thumbnail sync, or final content/CTA), also `Read` `40_thumbnail_cta.md`. If the overlay contains ANY text/title/label/value (almost every overlay), also `Read` `31_typography.md`; then `Read` the matching content module `31`/`32`/`33` and its `styles/*.md`. **Before authoring or rebuilding any SVG, print the Gate 5 MODULE LOAD PROOF template below; if any required module line is missing, STOP and load it before drawing.** If the overlay has a title/hero line, also print **Gate 5 TITLE GATE PROOF** after drafting and before upload. If the overlay has ANY non-title text/value/label/card copy, also print **Gate 5 SECONDARY TEXT GATE PROOF** after drafting and before upload. After upload, print both screenshot checks before PASS. Loading typography without passing the relevant title AND secondary-text gates is not enough. Regenerate-or-leave decided (§5.0); if rebuilt → authored as a **DIVERSE** SVG (from the style lib, never flat-only), **saved locally + SHOWN visibly to the user before upload**, then applied, granular objects, A-roll face cleared. **Preflight constraint:** before judging/rebuilding, pull `scene_geometry` to read face/caption/safe zones/object rects, but do NOT declare layout PASS in this gate. **Readability + aesthetic padding gate:** dark/muddy/thin-bodied title text, title without a thick headline/sticker feel, tiny labels, **secondary text/labels with visible stroke/outline**, low-contrast callouts, card text that sinks into a dark panel, labels/values overlapped by another badge/object, text that only becomes legible when zoomed, or any text that touches/grazes/clips/laps a chip/card/bar border = overlay FAIL, even if the geometry is clean. A title PASS never compensates for unreadable or cramped labels.
> 6. ☐ **Final layout audited/tuned AFTER overlay/background decisions** (`scene_geometry`; Steps 3–4 in `10_mechanics.md`) — A-roll face clear, hero/title text bright and prominent, **all secondary text/labels/values readable on mobile, not overlapped, and not cramped against their container borders**, caption clear, final overlay/media arrangement balanced. If Gate 5 changed the overlay, this is the first place layout can PASS. **Center-safe composition gate:** when the title + supporting objects can fit together as one compact narrative group inside `safe_rect`, prefer placing that whole group near the visual center of `safe_rect` with coherent spacing. Do not pin the title to the top-safe band and leave the objects drifting low or disconnected just because the title is important. Center-safe is still visual, not mechanical: if the first centered placement covers a clearly important background face/product/prop, slide the whole group within `safe_rect` until the composition breathes. Use top-safe title placement only when the group is too tall/detail-dense to center, the background demands separation, or A-roll face clearance requires it. If you need to move only 1–12 individual overlay objects, use `layout.batch` + `remotion.object.rect`. If the whole overlay group is misplaced or decomposed into more than 12 objects, use `remotion.group.rect` on the Storyboard group: first try **move-only** `x/y`; if moving the group fixes one dead zone but pushes the opposite edge into another dead zone, try a **whole-group resize** (`w/h` with `resize_mode:"scale_children"`). Only rebuild/regenerate the SVG if the resized group makes title/body/secondary text too small, muddy, cramped, or otherwise fails the typography/readability/aesthetic-padding gates.
> 7. ☐ **DEAD-ZONE check** — no overlay object/text in `dead_top`/`dead_bottom` (verify step, `30_overlay_core.md` §5.5).
> 8. ☐ **END screenshot** pulled with MCP `screenshot_scene_280x498` → `result.screenshot.url` **downloaded locally with `curl` + SHOWN visibly to the user** → **only then evaluated** → confirms: face clear, hero/title text is bright/prominent, **every secondary label/value/card line is readable without zoom and has visible inner padding from its chip/card/bar border**, no dark/muddy/blurred text, no text-on-text or badge-over-label collision, no text touching/grazing/clipping/lapping a border, nothing in a dead zone, caption fits, background fits. If no edit was made, the already-shown START screenshot may serve as the final look only when the agent explicitly says "no edit, START screenshot is the END evidence"; otherwise pull and show a fresh END screenshot.
> 9. ☐ **Server-saved** — re-pulled `video_data`/`scene_geometry` to confirm every edit persisted.
>
> All nine checked → next scene. **Show ≠ pause:** present each screenshot, then keep working — the only stop is the very end of the video (§2). **Scene transition gate:** if the user has not visibly seen the final local screenshot evidence for this scene, the scene is NOT done and the agent must not start the next scene.
>
> **⭐ ANNOUNCE THE PLAN + REPORT PROGRESS (mandatory, so the user can audit you).** The user must be able to see, at any moment, **which steps you will do, which you are on, and which remain.** So:
> - **At the START of each scene**, post the **task list for THIS scene as a VERTICAL checklist** (one DoD gate per line). This is the plan the user audits up front. **Do NOT compress the 9 gates into one inline sentence** — inline checklists are easy for agents to skim past and hard for humans to audit.
> - **As you work**, announce each gate as you enter/finish it ("→ Gate 4: auditing background…" then "✓ Gate 4 done"). Don't silently jump between gates.
> - **At the END of the scene**, repeat the checklist with ✓/✗ and a one-line note per gate, so the user sees exactly what was done and whether anything was skipped, BEFORE you move on.
> - **Announce ≠ pause** — report and keep working; do not wait for a reply (§2). Skipping the announcement (working silently) is a process error: the user cannot audit what they cannot see.
>
> **Exact templates — use these verbatim shapes (text markers are the source of truth):**
> - Scene start (plan) — **vertical only, never inline**:
>   ```text
>   Scene N plan:
>   ☐ Gate 1 — Text / STT
>   ☐ Gate 2 — Role
>   ☐ Gate 3 — START screenshot shown
>   ☐ Gate 4 — Background audit
>   ☐ Gate 5 — Overlay review/rebuild
>   ☐ Gate 6 — Final layout audit/tune
>   ☐ Gate 7 — Dead-zone check
>   ☐ Gate 8 — END/final screenshot shown
>   ☐ Gate 9 — Server-saved confirmation
>   ```
> - Gate 4 background proof — print this **during Gate 4 and before any Gate 5 overlay work**. This is the mechanical guard against skipping the background pass:
>   ```text
>   Gate 4 BACKGROUND PROOF:
>   ☑ 20_background.md — opened for this scene before judging background
>   Composite evidence: <local file path shown to user>
>   Active plate evidence: <local file path shown to user>
>   Active media: <mediaUrl or active thumbnail/media URL>
>   Current background read: <what is actually visible in the plate/composite>
>   Scene context: <1-line text/talking_point/visual summary>
>   Decision: <real background | grid | A-roll narrator is the visual | force-grid by design>
>   Fit check: <PASS|FAIL> — relevant to narration/keyword/visual and visible in composite
>   Geo/currency check: <PASS|FAIL|N/A> — if location-sensitive, country/region/currency/signage/road/form cues match the target market
>   Technical check: <PASS|FAIL|N/A> — for visible real footage: portrait, not too bright/cluttered, no watermark/burned-in text, no duplicate real clip; N/A for grid or full-canvas A-roll
>   Grid cap check: <PASS|FAIL|N/A> — grid scenes count <= 3 and share one grid
>   Action: <keep current media | replace via mediaUrl | leave force-grid | no background action because A-roll narrator fills frame>
>   Verdict: <PASS keep | PASS grid-by-design | FIXED + PASS | FAIL — continue background search>
>   ```
>   **If this proof is missing, Gate 4 is BLOCKED. Do not start Gate 5, do not rebuild/upload an overlay, do not declare `Scene N: PASS`, and do not final-handoff the video.**
> - Gate 5 module load proof — print this **before authoring/rebuilding SVG**. Include only the modules required for this scene, but do not omit typography when the overlay has text:
>   ```text
>   Gate 5 MODULE LOAD PROOF:
>   ☑ 30_overlay_core.md — SVG/object/upload rules
>   ☑ 40_thumbnail_cta.md — endpoint scene rules (required only for scene 2/opening poster, thumbnail sync, or final CTA)
>   ☑ 31_typography.md — title/label/readability rules (required because overlay has text)
>   ☑ <31_typography.md | 32_charts.md | 33_patterns.md> — content module for pattern=<pattern>
>   ☑ styles/<text_axes.md | chart_axes.md> — style recipe library
>   Decision: <leave existing overlay | rebuild SVG | layout-only fix>
>   ```
>   **If a required module is not listed with ☑, Gate 5 is BLOCKED. Do not draw, upload, or declare PASS.**
> - Gate 5 title gate proof — print this **after drafting a title/hero line and before upload**. This gate exists because simply loading `31_typography.md` is not enough:
>   ```text
>   Gate 5 TITLE GATE PROOF:
>   Title copy: "<exact title text>"
>   Takeaway source: <quote/talking_point words it encodes>
>   Semantic check: <PASS|FAIL> — states the scene takeaway, not just a panel label
>   Hierarchy check: <PASS|FAIL> — title is stronger than badges/panel labels
>   Thickness check: <PASS|FAIL> — body is thick via Black/Heavy font or approved offset-face recipe; outline is thin/controlled, not over-stroked
>   Local SVG check: <PASS|FAIL> — saved local SVG was shown before upload and appears title-led
>   Verdict: <PASS to upload | REVISE title before upload>
>   ```
>   **Any FAIL = title is not approved for upload. Revise the SVG/title and repeat the gate.** Then, after upload, the final screenshot gate must still PASS from the saved/shown 280×498 composite:
>   ```text
>   Gate 6 TITLE SCREENSHOT CHECK:
>   Composite screenshot shown: <yes|no>
>   Screenshot check: <PASS|FAIL> — title is readable, prominent, thick-bodied, thin-outlined/not over-stroked, and stronger than labels
>   Verdict: <PASS title | REVISE title/rebuild overlay>
>   ```
> - Gate 5 secondary text/label gate proof — print this **after drafting every non-title text/value/label/card line and before upload**. This gate is separate from title: a title can PASS while labels FAIL.
>   ```text
>   Gate 5 SECONDARY TEXT GATE PROOF:
>   Text inventory: <exact non-title strings: values, labels, card text, badge text, callouts>
>   Size floor check: <PASS|FAIL> — each non-title text is >= ~30px on the 720 canvas OR deliberately simplified/removed; nothing depends on zoom
>   Contrast check: <PASS|FAIL> — each line uses solid high-contrast fill on a clean chip/card/quiet area; **secondary text has NO visible stroke/outline**; no dark-on-dark card text
>   Container/padding check: <PASS|FAIL> — every line fits inside its card/chip/bar area with generous interior padding; no clipped/overflowing words; no text touches, grazes, or visually crosses a border
>   Collision/Z-order check: <PASS|FAIL> — labels/values/badges do not overlap or cover each other; badges never sit on top of value labels unless both remain readable
>   Local SVG check: <PASS|FAIL> — saved local SVG was shown before upload and all secondary text appears readable
>   Verdict: <PASS to upload | REVISE labels before upload>
>   ```
>   **Any FAIL = the overlay is not approved for upload**, even if the title gate passed. Then, after upload/layout tuning, the final screenshot must pass:
>   ```text
>   Gate 6 SECONDARY TEXT SCREENSHOT CHECK:
>   Composite screenshot shown: <yes|no>
>   Screenshot check: <PASS|FAIL> — every secondary label/value/card line is readable at 280×498 without zoom, has no visible outline/stroke, is not dark/muddy, is not overlapped/covered by another text/object, and has visible breathing room from its chip/card/bar border
>   Verdict: <PASS secondary text | REVISE labels/layout/rebuild overlay>
>   ```
> - Progress (each gate): `→ Gate K: <doing…>` then `✓ Gate K: <result>`
> - Scene end (verdict): `Scene N: PASS — ✓1…✓9` **or** `Scene N: FAIL — ✗K <what's missing>; fixing.`
> - Human must act (record A-roll / final hand-off): a standalone `**[ACTION REQUIRED]**` block (see HOW TO USE markers).
>
> **⭐ PASS / FAIL VERDICT — declare it before EVERY scene hand-off; it is the gate to the next scene.** You may advance to the next scene ONLY after you state an explicit verdict:
> - To say **"Scene N: PASS"** you must FIRST **scan all 9 DoD gates above AND the §7 Quality Standard**, and confirm **every** one is met. PASS is *earned by the scan* — never declared from memory or assumption.
> - The PASS scan must include the local-visible screenshot evidence: "START shown: yes" and "END/final shown: yes". If either is missing, PASS is forbidden.
> - If any gate / §7 item is unmet → **"Scene N: FAIL — [list the failing gates]"**, fix them, then **re-scan and re-declare**. Loop until PASS.
> - **Never advance on a FAIL, and never advance with no verdict at all** (an un-verdicted scene = not done). The verdict line + its gate-by-gate ✓ is the last thing you post for a scene before starting the next.

> **⭐ FINAL VIDEO HAND-OFF — after the last content scene passes.**
> - First run the **Pre-summary completion scan** (Critical Rule 12d): every content scene has `Scene N: PASS`, Gate 1–9 checked, Background Audit Ledger complete, scene 2 thumbnail sync complete, final CTA endpoint handling complete for the last content scene, and no unhandled `[ACTION REQUIRED]` item hidden.
> - If the scan finds missing major work, do that work now. Do not write a "done" summary as a substitute for completing it.
> - Do **not** revisit the thumbnail; it was completed by the immediate post-scene-2 sync gate.
> - Pull/keep the `review_url` for the video.
> - Send the user a Telegram/self-notification (WideCast self-notify tool, with email fallback if Telegram is not connected) saying the edit is complete and including the `review_url`.
> - In chat, give a short summary of what was changed/fixed. Keep it concise; do not replay every gate.
> - Ask exactly one export question: `Render/export the final MP4 now, or do you want to review the scenes first?`
> - Do **not** call `export_video` until the user explicitly confirms render/export in the current conversation turn.

> **Before entering the checklist, determine 2 things:**
>
> **(a) Video type — `faceless` or with a narrator?**
> - `faceless=true`: there is NO narrator → **drop the face-clearance condition**, but **still keep the safe-zone condition**. Place text based on **context + the current background visual**, and check that the text does not **sink into the same color tone as the background** (§5.2).
> - `faceless=false` (has a narrator): keep the `narrator_face` clearance condition as usual (Steps 3–4).
>
> **(b) Has the A-roll scene been recorded yet?** If `arollUrl`/`mediaUrl` still points to a library placeholder image (`statics/aroll_*.png`, `mediaType=image`) → **not recorded yet**. Still edit layout/overlay normally (the placeholder is full-canvas, face in the upper part), but **REMIND the user to complete the narrator** via one of 3 ways — **each scene at most 20 seconds** (all 3 ways are capped at 20s, since each scene should only be ≤20s):
> 1. **WideCast's built-in teleprompter** — available, convenient, high quality; **RECOMMENDED** to preserve authenticity.
> 2. **Upload a file** with the narrator's face + voice (`modify_scene` (I) `narrator.upload_video`).
> 3. **AI generate from a single photo** — a feature available in WideCast.

### Step 1: Check Text and STT Errors

Read the scene's `text` field in the context of the whole video.

The agent needs to look for:

- spelling errors
- typos
- STT mishearing errors
- wrong industry terminology
- wrong proper names
- wrong figures
- sentences missing or having extra words
- sentences that are grammatically correct but wrong in meaning for the topic
- a caption that doesn't match the audio/context content

If wrong, fix `text` with `modify_scene` branch (K) Segment text correction (keeping audio timing) before doing layout or visuals.

If the correction is a domain term, proper noun, number, symbol, or entity (for example `Living Church` → `Living Trust`, `95` → `95%`, a company/person/product name), run a **semantic field sweep** before leaving Gate 1:
- check/update `text`, `quote`, `talking_point`, `visual`, `keyword`, `pattern`/`sub_mode` when relevant;
- note any overlay text that may still be baked into `remotion_spec` and must be verified in Gate 5/8 screenshots;
- re-pull `video_data` after metadata/text edits so later gates use the corrected context.

Do not let the caption fix become the whole task. A term fixed in `text` but still wrong in `quote`/`visual`/overlay is a Gate 1 failure, not a partial pass.

Do not edit based on personal feeling if you're not sure of the context. You must rely on the full script, the topic, `visual`, `keyword`, and the neighboring scenes.

### Step 2: Understand the Scene's Role

Before adjusting visual/layout, the agent must understand what job this scene is doing; read:

- `type` (HOOK / STAT / KEY POINT / DATA / FACT / CALL TO ACTION / thumbnail)
- `pattern` (15 values) **and** `sub_mode` (when `pattern=illustration`)
- `visual`, `keyword`, `quote`, `talking_point`, `text`
- `show_narrator` / `active_roll`
- `mediaUrl` / `mediaType`, the thumbnails
- `overlay.*` and `narrator_face`

The goal is to understand what idea the scene is trying to convey, whether the current visual serves that idea, and whether the scene wants a grid or a real background (§4.1) — decided by sight, not by the pattern label.

> **Step 3 (audit layout with `scene_geometry`) and Step 4 (the 5 A-roll layout scenarios) → `ai_video_editor/10_mechanics.md`.** Then the per-scene visual work: background → `20_background.md`; overlay → `30_overlay_core.md` (+ the matching style module).

---

## 7. Quality Standard for a Passing Scene

> This is the bar the per-scene **PASS verdict (§3)** is checked against: to declare **`Scene N: PASS`** you must confirm **every** item below **AND** all 9 DoD gates (§3) are met. Any miss → `FAIL`, fix, re-scan.

A scene is considered passing when:

- `text` is correct in context, with no significant STT errors
- the visual fits the content (correct `pattern`/`sub_mode`)
- for location-sensitive industries/scenes, the background's geography/culture/currency cues match the target market; wrong-country footage, foreign currency, wrong signage/language, wrong road context, or obviously foreign forms/architecture fails the scene even if the object/action is otherwise relevant
- the background is relevant (or an intentional grid within the ≤3-scene cap)
- if `show_narrator=true`, `boxes.narrator.face` is clear and not covered
- the overlay is correct in content and large enough to read on mobile
- **title readability is video-grade, not just technically present:** hero/title text is bright, high-contrast, **thick-bodied via the font/body, with a thin controlled outline**, immediately prominent, and states the scene takeaway rather than merely repeating a panel label
- **secondary text/label readability is a separate PASS gate:** every non-title label/value/card line/callout is readable in the 280×498 screenshot without zoom, has enough contrast against its own card/background, fits its container with padding, and is not overlapped/covered by another badge/object/text. **Small/non-title text must NOT use visible stroke/outline**; if contrast is weak, use a clean chip/card/backplate, increase size/weight, or simplify the copy instead of adding a border. No secondary text is dark-on-dark, muddy, over-stroked, thin, blurred, cramped into an icon/card, hidden inside a dark card, or decorative at the expense of comprehension. A strong title does not forgive unreadable labels.
- **every overlay object/text is inside `safe_rect` — NONE intrudes into `dead_top` or `dead_bottom`** (re-check on the rendered screenshot vs `scene_geometry` rects, because server auto-fit / A-roll auto-center can push content out after upload — see verify step in `30_overlay_core.md`). If the whole overlay is too tall for the safe band, the remedy order is: move whole group → resize whole group → rebuild only if the resize breaks title/secondary readability.
- the caption is readable, doesn't overflow `dead_bottom`
- the layout is balanced — nothing covers the face, overflows the safe zone, overlaps the caption, or makes important text visually fight the background/objects
- the scene plays its correct role in the whole-video flow
- **the modules required for the work actually done were `Read` this step** (background pass → `20`; endpoint scene → `40_thumbnail_cta.md`; overlay → `30` + `31_typography.md` whenever the overlay contains any text + the matching content module/style lib) — a step done "from memory" without opening its module does not count as PASS
- **if an SVG was authored/rebuilt, the Gate 5 MODULE LOAD PROOF was printed before drawing and included every required module** — a beautiful SVG created without the proof still fails the process gate, because future agents need auditable evidence that they loaded the right playbook pieces

## 8. Video-Level QA After Editing All Scenes

After editing each scene, the agent must re-check the whole video:

1. Re-read the full script after the `text` edits.
2. Check continuity between scenes.
3. Check which scenes have repeated visuals (including reusing the same `mediaUrl`).
4. Check whether the caption style is consistent.
5. Check whether the A-roll/B-roll (`show_narrator`) alternation is reasonable.
6. Check whether the hook scene (`type=HOOK`) is strong enough.
7. Check whether the CTA (`type=CALL TO ACTION`) and the last content scene are clear CTA endpoints: one action understood in ~1 second, typography stronger than decorative objects, and narrator-primary if A-roll.
8. Check whether the claim/disclaimer is correct for the industry.
9. Check whether the visual tone is consistent.
10. Check whether any scene looks markedly lower quality.
11. Check the grid balance: **≤3 scenes use grid, all sharing ONE grid (§4.1a)**; the rest use a fitting real background.

## 9. Priority Order When There's a Conflict

1. Don't get the content wrong.
2. Don't cover the narrator's face (`boxes.narrator.face`).
3. The caption/text must be readable.
4. The main overlay must be large enough.
5. The background must be relevant (or a clean grid when the overlay is the content).
6. The layout must be beautiful and intentional.
7. Limit expensive screenshot/API use only after the required local-visible visual evidence gates are satisfied; never use cost-saving as a reason to skip START/END screenshots or local-show.
8. Don't break previous intentional edits (e.g. `overlay.narrator.touched=true`, `remotion_spec="none"`).

## 10. Reminders for the Agent

- Read the entire video before editing one scene.
- Use data (`video_data` + `scene_geometry`) to measure fields/boxes, but use local-shown screenshots for every visual judgment and QA decision.
- Name fields precisely; use `voice_file` as the selector.
- Don't edit `text` just because the sentence sounds odd; you must rely on context.
- Don't pick a beautiful visual that's wrong on content.
- Don't make the overlay too small just to keep the narrator large; don't make the narrator so small the face becomes worthless.
- For UI/document/chart/laptop/code, a large overlay may be right, but on **A-roll** it is still scenario #5 (last resort): after the local-shown START screenshot, declare `narrator_role`/`overlay_role`, reject scenarios 1–4 with reasons, and keep CTA/contact/trust/direct-address scenes narrator-primary unless a detail-dense overlay truly must dominate.
- For A-roll, the narrator's face is a no-cover zone; DON'T edit `narrator_face`, adjust via `overlay.narrator.rect`.
- For B-roll (`photo_with_people`/`photo_no_people`), the visual must directly serve the sentence being spoken.
- Most scenes get a real background; grid is the capped exception (≤3/video, §4.1a). Don't force footage where the overlay fully carries the message — but don't default whole pattern-categories to grid either; decide by sight (§4.1).
- An agent-built overlay → author an **SVG** (720×1280, **transparent**, each object in its own `<g data-wc-object>`) → save/show the local SVG preview to the user **before upload** → Upload Overlay (B, FREE); the server converts. Title text is large + high-contrast + controlled outline so it does not sink (§5.2); **secondary labels/values/card text use no visible outline** and must sit on clean chips/cards/quiet areas. Reuse a real photo only via `<image>` (§5.4). Palette coordinated, accent derived (not reflexive).
- An unrecorded A-roll narrator is **the default placeholder ("YOUR FACE & VOICE HERE"), ALWAYS full-canvas, NEVER hidden**; design the text around `narrator_face` (it's in the upper part of the frame).
- **`faceless=true` video**: no narrator → **drop face clearance, keep the safe zone**; place text by context + background; judge text-vs-background tone from the **local-shown START screenshot** plus the Gate 4 active background/media plate, and if the text **sinks into the same tone as the background** build it in a contrasting color (§5.2).
- An A-roll scene **not yet recorded** (`arollUrl`=`statics/aroll_*.png`) → **remind the user in a standalone `[ACTION REQUIRED]` block** to complete it: WideCast teleprompter (recommended, authentic) / upload a face+voice file / AI-gen from a photo — **each scene ≤20s**.
- To change **color/font/content/style** of the text overlay → re-author the overlay **SVG** → save/show local SVG preview → upload (§5.2) (rect can't recolor/rewrite/restyle text). To change the **position/size** of a few overlay objects → **`layout.batch`** with `remotion.object.rect`; to move or resize the **whole overlay group** → `remotion.group.rect` (see below).
- **The overlay/text position is NOT fixed — the agent CAN change it via `modify_scene` layout edits** (FREE). The server's auto-place is just a starting point; if the server placed text into a **bright region that makes it sink** or the wrong band → measure the background brightness and move it into a better band (verified on scene 4). Use `layout.batch` + `remotion.object.rect` for up to **12** individual objects in one edit. If the SVG decomposed into more than 12 objects, or you are translating the whole overlay down/up together, use `remotion.group.rect` on the Storyboard group. If translation alone cannot keep both top and bottom inside `safe_rect`, resize the whole group with `resize_mode:"scale_children"` and verify typography from the local-shown screenshot. `upload_overlay` **strips the scrim + reflows** so position can't be locked through the image — position must be adjusted after upload.
- **SHOW every image/clip/screenshot/SVG overlay in chat BEFORE looking/evaluating/uploading/applying** so the user can audit the same evidence — never inspect privately, never upload/apply first and show afterward (§1.9). For WideCast scene screenshots specifically, the only valid route is `result.screenshot.url` → `curl` to local file → show local file.
- Text spec **comes from `quote`**; the agent **evaluates + improves the anchor line per its own judgment**, unless the user asks for their way (5.1 T1).
- Each scene must be good on its own, but still fit the whole video.

---

## ✅ SELF-AUDIT — run this BEFORE every reply (cheap meta-gate)

Before sending any reply, silently confirm — and fix any "no" before replying:

- Did I open the module(s) for the action I'm taking THIS turn — via `widecast_get_editing_skill(module='<id>')` (MCP transport) or local `Read("<id>.md")` (Anthropic Skill upload transport) — and NOT work from the index / from memory?
- Every image I used as evidence — did I save it locally AND show it to the user before I judged from it?
- Am I making visual calls from a SCREENSHOT, not from `scene_geometry` alone?
- Am I on the per-scene DoD — which gate am I on, and did I announce progress?
- If I'm ending a scene: did I scan the checklist + §7 and state `Scene N: PASS` / `FAIL`?
- Did I avoid jumping any gate (background pass · overlay LOAD CHAIN · dead-zone · verdict-before-next-scene)?
- Field discipline: `voice_file` selector, and did I re-pull to confirm the edit saved?
- If I just finished any detour/fix/debug path: did I run the Gate Resume Scan and continue from the earliest unchecked or invalidated gate instead of summarizing?
- If I am about to summarize/hand off/export/notify completion: did I run the Pre-summary completion scan, and are all scenes PASS with a complete Background Audit Ledger, scene 2 thumbnail sync, and final CTA endpoint handling?
- If the human must act, did I use a standalone `[ACTION REQUIRED]` block?

This list is intentionally redundant with the Critical Rules / Jump-Prevention / DoD — **the redundancy is the point** (it is why misses are rare).
