# Get editing skill — `GET /v1/skills/editing`

**Synchronous, free, key-free.** Returns instructions for downloading the WideCast **AI-video-editor** playbook zip and reading its `SKILL.md` from local disk. The skill itself covers per-scene composition, overlay, narrator face clearance, background audit, layout, thumbnail/CTA endpoints, dead-zone, and the 9-gate Definition of Done — for refining/editing an EXISTING video.

This is DIFFERENT from [`/v1/skills/writing`](skills-writing.md) (which is for AUTHORING new scripts); this skill is for EDITING already-generated scenes.

<!-- widecast-playground:skills-editing -->

---

## Delivery mode: download-zip (experiment, 2026-06-30)

The endpoint carries **two** blocks: (a) `preload_tools` — a hint that tells the agent to widen its MCP tool search BEFORE editing so critical tools aren't dropped by a narrow ToolSearch; and (b) the 4-step download instruction for the skill zip.

### Step 0 — preload the WideCast toolkit

Some MCP hosts (Codex, Claude Code) lazy-load tool schemas via `ToolSearch` and default to **narrow keyword queries**. If the agent's initial search misses a tool it later needs (e.g. `widecast_modify_scene`), the edit run either fails mid-flow or silently skips the edit. To prevent this, every response carries a `preload_tools` block:

- `preload_tools.one_shot_query` — a literal `select:widecast_video_data,widecast_scene_geometry,widecast_scene_inspector,widecast_modify_scene,widecast_search_broll,widecast_upload_asset,...` string. Copy verbatim into `ToolSearch`'s `query` param; one round-trip loads every edit-flow tool at once.
- `preload_tools.broad_query` — fallback keyword query (`widecast`) for hosts that don't support `select:` syntax.
- `preload_tools.broad_max_results` — max_results to pass with `broad_query`; auto-scales with the tool count (`≥ tool_count + 5`, min 30).
- `preload_tools.tools[]` — every tool with a 1-line reason (first sentence of the tool's own MCP description).

**Zero-config for future tool additions.** The list is derived from the live `_WC_MCP_TOOLS` registry at request time — when a new WideCast tool is added, it automatically appears in this hint on the very next call. No maintainer action required.

`preload_tools` ships in BOTH delivery modes (download_zip and inline_content).

### Then — download the zip

1. `mkdir -p ./.widecast-skill-video-editing && cd ./.widecast-skill-video-editing`
2. `curl -fsSL <result.download.zip_url> -o video-editing.zip`
3. (optional) `shasum -a 256 video-editing.zip` matches `result.download.sha256`
4. `unzip -o video-editing.zip`

Then `Read('./.widecast-skill-video-editing/video-editing/SKILL.md')` (or `cat` via bash if your host's Read tool can't reach unzipped files) and follow its LOAD MAP — each step names a sub-module that you read from disk.

**Why this mode**: agent step-adherence (background audit, screenshot show-local, gate verdicts, module reload) is measurably better when the playbook is read from a local file than from a tool result. Local-file path forces full reading and re-reading at each step; tool-result path tends to be skimmed once. The skill content on disk is identical to the previous inline-content mode (master `SKILL.md` + 5 core modules + per-scene modules + style libs) — only the delivery mechanism changed.

**Server config**: flip back to inline-content with env `WIDECAST_EDITING_DELIVERY_MODE=inline_content` + Flask restart. Default is `download_zip`.

---

## Host requirements

Your runtime MUST have:

- A local shell tool (`bash`/`run_command`/equivalent)
- `curl` (or any HTTPS downloader)
- `unzip`
- A file-reading tool — `Read('<path>')` if your host supports it, `cat <path>` via bash if Read is restricted to project files, or your equivalent `view_file`/`view_image`.

If your host has **none of these** (a pure JSON-only chat surface with no shell), you cannot follow the full skill in this mode. Fall back to the `contract` field (always returned, ~1.5 KB) for the cross-cutting rules and tell the user the editing skill needs a desktop+shell host (Claude Desktop, Codex CLI, local agent runtime).

**Cross-FS note**: on some hosts (Claude.ai web, certain cloud agents) the bash sandbox FS is separate from the file-tool FS — your `Read` tool may not see the unzipped files even though `ls` in bash does. In that case use `cat`/`head` via bash to read each file. Content identical, only the access tool differs.

---

## Request

```http
GET /v1/skills/editing
```

No auth, no params. (The `module` param from previous inline-content mode is still accepted but ignored — every call returns the same download instruction.)

## Response — HTTP 200

```jsonc
{
  "object":        "skill",
  "name":          "video-editing",
  "delivery_mode": "download_zip",
  "contract": "<~1.5 KB cross-cutting rules — selector=voice_file, autonomous run, screenshot evidence, SVG overlay rules, DoD gates, lazy-load contract. Read this FIRST; survives any truncation>",
  "download": {
    "zip_url":     "https://origin.widecast.ai/skills/video-editing.zip?v=1782800000",
    "sha256":      "3dd0beb2…",
    "size_bytes":  102030,
    "filename":    "video-editing.zip",
    "work_dir":    "./.widecast-skill-video-editing",
    "entry_file":  "./.widecast-skill-video-editing/video-editing/SKILL.md"
  },
  "preload_tools": {
    "why": "The editing workflow will need every WideCast tool listed below. Some MCP hosts (Codex, Claude Code) lazy-load tool schemas via ToolSearch and default to NARROW keyword queries — so any tool the initial search missed will FAIL when the edit flow calls it. Load them ALL now, in ONE ToolSearch call, BEFORE running the 4 setup commands below. This list is auto-derived from the live MCP tool registry, so adding a new tool later is zero-config.",
    "one_shot_query": "select:widecast_video_data,widecast_scene_geometry,widecast_scene_inspector,widecast_modify_scene,widecast_search_broll,widecast_upload_asset,widecast_wait_for_video,widecast_export_video,widecast_get_status,widecast_send_telegram_message",
    "broad_query": "widecast",
    "broad_max_results": 30,
    "tools": [
      { "name": "widecast_video_data",      "why": "Read structured video/scene data for a topic_id" },
      { "name": "widecast_scene_geometry",  "why": "Read data-only layout geometry for ONE scene" },
      { "name": "widecast_scene_inspector", "why": "SYNC scene inspector for an existing video" },
      { "name": "widecast_modify_scene",    "why": "SYNC scene editor — 14 edit branches" },
      { "name": "widecast_search_broll",    "why": "Search stock B-roll (video clips or real photos)" },
      { "name": "widecast_upload_asset",    "why": "Upload a media asset (image/video/audio) to WideCast's S3" }
      // …plus every other widecast_* tool in the registry, auto-derived
    ]
  },
  "instructions": "MANDATORY setup BEFORE any editing work… 0) PRELOAD ALL WIDECAST TOOLS FIRST (skip → edit will fail mid-run) — copy preload_tools.one_shot_query into your ToolSearch call. 1) mkdir 2) curl 3) verify 4) unzip …",
  "next_action":  "First, run ToolSearch with preload_tools.one_shot_query (or broad_query if your host doesn't support select:) to load EVERY WideCast tool. THEN run the 4 setup commands and Read('.../SKILL.md'). Do not declare any scene PASS without having loaded the modules from disk first.",
  "meta": {
    "request_id":         "req_…",
    "widecast_version":   "X.Y.Z",
    "delivery_mode":      "download_zip",
    "contract_length":    1811,
    "skill_root_local":   "/mnt/html/lcw/skills/video-editing",
    "experiment_note":    "Flip back with WIDECAST_EDITING_DELIVERY_MODE=inline_content."
  }
}
```

**Key invariants**

| Property | Value |
|---|---|
| Auth on download URL | **None** — `origin.widecast.ai/skills/*.zip` is public; agent's `curl` works without headers. |
| Host | `origin.widecast.ai` — bypasses Cloudflare entirely. CF caches `.zip` by extension; routing through origin keeps the agent on the live build. |
| Cache-bust | `?v=<mtime>` per request. Every deploy → new mtime → new URL → guaranteed fresh content. |
| TTL | Permanent (until next deploy overwrites). Deploy refreshes mtime; cache invalidates. |
| Sha256 | Computed server-side, mtime-cached. Verify with `shasum -a 256` (macOS) or `sha256sum` (Linux). |

---

## Adding/editing modules — maintainer workflow

Drop a new `.md` file anywhere under `widecast/skills/video-editing/` (root or `ai_video_editor/` or `ai_video_editor/styles/`) → run `bash deploy_widecast.sh`. The deploy script:

1. **Step [0]** runs `python3 widecast/docs/build.py`, which calls `_zip_skills()` — `rglob`s every `.md/.txt/.json/.yaml/.yml` under each skill folder and rebuilds `widecast/skills/video-editing.zip`.
2. **Step [1c]** rsync's the entire `skills/` tree (including the new zip) to `/mnt/html/lcw/skills/`.
3. **Server side**, on the NEXT request, `_wc_editing_zip_meta()` notices the new mtime → re-computes sha256 → response carries the new URL (`?v=<new mtime>`) + new sha256. **No Flask restart needed for content updates.**

Flask restart is only required when you change `dashboard2.py` itself (env var add, route logic change, helper rename) or when you flip the delivery-mode env var.

### File naming

- Module files should be `.md`
- Any file extension other than `.md/.txt/.json/.yaml/.yml` is excluded from the zip (so `sync_check.py`, `.DS_Store`, images, etc are silently skipped).
- Master entry must remain at `widecast/skills/video-editing/SKILL.md` — the zip's `unzip` step creates `video-editing/` then `SKILL.md` at root.

### Content guidance

- Write `# H1` at top of each file — the agent can pick by browsing `ls` output + `head -5` to find the relevant module.
- The master `SKILL.md` should still maintain its LOAD MAP table so agents have a curated default chain.
- No required format beyond standard markdown — the server doesn't parse module metadata in download-zip mode (auto-discovery is local, agent does the discovery).

---

## Errors

| HTTP | `error.code` | When |
|---|---|---|
| 503 | `skill_zip_unavailable` | `video-editing.zip` not readable on disk. Server build/deploy out of sync — re-run `bash deploy_widecast.sh`. |

---

## Client snippets

### MCP

```jsonc
{ "name": "widecast_get_editing_skill", "arguments": {} }
```

The MCP wrapper passes through the JSON response unchanged. The agent runs the 4 setup commands then reads `SKILL.md` from disk.

### curl + bash (any host with shell)

```bash
# 1) call the endpoint, capture response
RESP=$(curl -sS https://widecast.ai/app/dashboard/v1/skills/editing)

# 2) extract download URL + sha256
ZIP_URL=$(echo "$RESP" | jq -r .download.zip_url)
SHA256=$(echo "$RESP" | jq -r .download.sha256)

# 3) download + verify + unzip
mkdir -p ./.widecast-skill-video-editing && cd ./.widecast-skill-video-editing
curl -fsSL "$ZIP_URL" -o video-editing.zip
echo "$SHA256  video-editing.zip" | shasum -a 256 -c

unzip -o video-editing.zip

# 4) read SKILL.md
cat video-editing/SKILL.md
```

---

## Reverting to inline-content mode

If the download-zip experiment doesn't deliver the expected step-adherence improvement, flip back instantly:

```bash
# On the server:
export WIDECAST_EDITING_DELIVERY_MODE=inline_content
# Then restart Flask (e.g. systemd / pm2 / docker exec):
sudo systemctl restart wc-dashboard  # or whatever runs dashboard2.py
```

The previous code path (multi-module inline content with `available_modules[]` index + per-module `?module=<id>` lazy-load) is retained as the fallback — flipping the env unbreaks it instantly without re-deploying.
