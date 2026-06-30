# Get editing skill — `GET /v1/skills/editing`

**Synchronous, free, key-free.** Loads the WideCast **AI-video-editor** playbook (per-scene composition, overlay, narrator face clearance, background audit, layout, thumbnail/CTA endpoints, dead-zone, definition-of-done) — for refining/editing an EXISTING video.

This is the **lazy-load** companion to [`/v1/skills/writing`](skills-editing.md): the writing skill is one self-contained markdown per format, but the editing skill is too large to ship in one response, so it's split into a master `SKILL.md` + an auto-discovered tree of submodules. The agent loads one module at a time as it reaches the step that needs it.

<!-- widecast-playground:skills-editing -->

---

## Lazy-load contract — multi-module

Master `SKILL.md` is intentionally a small (~13 KB) INDEX so it never hits a per-tool-call output cap. Every detail (critical rules, jump-prevention triggers, DoD gates + templates, principles, workflow, quality bar) lives in separate modules. Call this endpoint **many times per run**:

1. **First call — `module` omitted.** Returns `SKILL.md` + an `available_modules[]` array (auto-discovered from the filesystem on every request) + an always-returned `contract` field (~1.5 KB).
2. **Run kickoff — ALWAYS load the 5 core modules** in addition to `SKILL.md`:
   - `ai_video_editor/01_critical_rules` — 14 cross-scene rules + the self-audit checklist run before each reply.
   - `ai_video_editor/02_jump_prevention` — "about to do X → STOP, do Y first" interrupt list.
   - `ai_video_editor/03_dod_gates` — per-scene Definition of Done (9 gates) + every template block (Gate 4 module-load proof, Gate 4 title proof, Gate 4 secondary text proof, Gate 5 background proof, Gate 6 screenshot checks, Gate 9 module coverage).
   - `ai_video_editor/04_principles_workflow` — §1 general principles, §2 whole-video workflow (initial context pass + Background Audit Ledger init), §10 reminders.
   - `ai_video_editor/05_quality_qa_priority` — §7 Quality Standard, §8 video-level QA, §9 priority order for gate conflicts.
3. **Per-scene calls** — at scene start load `ai_video_editor/10_mechanics`, then each gate's named module when you reach that gate. Reload modules at each step — do NOT work from memory.

## Always-returned `contract` field

Every response (entry, SKILL-as-module, submodule) carries a short (~1.5 KB) `contract` field listing the cross-cutting rules: selector = `voice_file`, autonomous end-to-end run, screenshot evidence, SVG overlay rules, 9-gate DoD, lazy-load contract. **This field is ordered first in the response body so it survives any runtime truncation of `method`** — even if the agent host caps output at a low number of tokens, `contract` reaches the model intact.

The agent should:
- Read `contract` FIRST.
- Compare `meta.contract_length` and `meta.method_length` to the actual received string lengths to detect truncation.
- If `method` is truncated, recall the tool for the specific module needed; don't try to reconstruct the missing content from memory.

## Auto-expansion (zero-config)

Drop a new `.md` file under the skill root (default `/mnt/html/lcw/skills/video-editing/`, override via env `WIDECAST_EDITING_SKILL_ROOT`) and it appears in `available_modules[]` on the next request — **no code change, no manifest edit, no Flask restart**. The server walks the tree with `os.walk` + filters to `.md`; hidden dirs and non-`.md` files are ignored. Per-module `title` (first H1) + `summary` (first paragraph) are auto-parsed.

| Property | Value |
|---|---|
| **Module discovery** | `rglob *.md` under the skill root on every request, excluding `SKILL.md` itself. |
| **Module IDs** | Hierarchical filesystem path without `.md`. Segments must match `^[A-Za-z0-9_-]+$`. Example: `ai_video_editor/styles/text_axes`. |
| **Path safety** | `os.path.realpath()` must remain under the resolved root. `../`, hidden dirs, symlink escape → 400 `invalid_module_id`. |
| **Per-module cache** | mtime-based; deploy that rsyncs new content invalidates automatically. No Flask restart. |
| **CDN** | The WideCast `/app/*` path bypasses Cloudflare entirely. There is no CDN layer to purge. |
| **Response header** | `Cache-Control: no-store` — content is always live. |
| **Size cap** | 512 KB per module file. Oversized files treated as missing. |

---

## Request — entry (module omitted)

```http
GET /v1/skills/editing
```

No auth required, no `format` param. (For the writing skill the format enum is required; for editing there's only one skill so it's implied.)

### Response — entry shape

```jsonc
{
  "object":         "skill",
  "name":           "video-editing",
  "module":         "SKILL.md",
  "method_format":  "markdown",
  "method":         "<full SKILL.md, YAML frontmatter stripped>",
  "available_modules": [
    {
      "id":         "ai_video_editor/10_mechanics",
      "title":      "Mechanics — placement, animation, z-order",
      "summary":    "When and how to move overlay objects without breaking…",
      "size_bytes": 8420
    },
    {
      "id":         "ai_video_editor/20_background",
      "title":      "Background audit — grid vs real footage",
      "summary":    "Decide grid-vs-real by sight from the START screenshot…",
      "size_bytes": 9180
    },
    {
      "id":         "ai_video_editor/styles/text_axes",
      "title":      "Text style axes",
      "summary":    "Diverse text looks: gradient, glossy, 3D, metallic, bevel…",
      "size_bytes": 3140
    }
    /* …auto-discovered from disk; grows as new .md files are added… */
  ],
  "next_action":   "Read SKILL.md above first to understand the per-scene Definition of Done. When you reach a step that names a module (e.g. 'Read ai_video_editor/10_mechanics.md'), call widecast_get_editing_skill(module='ai_video_editor/10_mechanics') to load that module's content.",
  "meta": {
    "request_id":         "req_5f10e9cc0a384e979f8a00e8",
    "widecast_version":   "X.Y.Z",
    "skill_root":         "/mnt/html/lcw/skills/video-editing",
    "freshness":          "no-store; per-module mtime cache; auto-discovered"
  }
}
```

---

## Request — submodule

```http
GET /v1/skills/editing?module=ai_video_editor/10_mechanics
```

### Response — submodule shape

```jsonc
{
  "object":        "skill",
  "name":          "video-editing",
  "module":        "ai_video_editor/10_mechanics.md",
  "module_id":     "ai_video_editor/10_mechanics",
  "title":         "Mechanics — placement, animation, z-order",
  "size_bytes":    8420,
  "method_format": "markdown",
  "method":        "<file content, frontmatter stripped>",
  "meta": {
    "request_id":       "req_…",
    "widecast_version": "X.Y.Z"
  }
}
```

> No `available_modules[]` on submodule responses — call the endpoint with `module` omitted to refresh the index.

---

## Field reference

| Field | Type | Required | Description |
|---|---|---|---|
| `module` | string | no | Hierarchical module id without the `.md` extension, e.g. `ai_video_editor/10_mechanics` or `ai_video_editor/styles/text_axes`. Omit (or pass empty) to load the master `SKILL.md` + the live `available_modules[]` index. |

---

## Errors

| HTTP | `error.code` | When |
|---|---|---|
| 400 | `invalid_module_id` | `module` contained traversal (`../`), a hidden segment (`.foo`), or characters outside `[A-Za-z0-9_-]`. |
| 404 | `module_not_found` | No `.md` file at that path on disk. Recall with `module` omitted to refresh `available_modules[]` and pick from there. |
| 503 | `skill_unavailable` | Root directory or `SKILL.md` not readable on disk (deploy out of sync, env var pointing somewhere wrong). The error message includes the resolved root path. |

---

## Client snippets

### curl — load entry + one module

```bash
# 1) load entry (module omitted) — get SKILL.md + available_modules
curl -sS "https://widecast.ai/app/dashboard/v1/skills/editing" \
  | jq '{module, modules: (.available_modules | map(.id))}'

# 2) load a specific module
curl -sS "https://widecast.ai/app/dashboard/v1/skills/editing?module=ai_video_editor/10_mechanics" \
  | jq '{module, title, size_bytes}'
```

### MCP

The remote MCP wrapper and the local `@widecast/mcp-server` both expose this as **`widecast_get_editing_skill`**. The `module` arg maps 1:1.

```jsonc
{
  "name": "widecast_get_editing_skill",
  "arguments": { "module": "ai_video_editor/10_mechanics" }
}
```

Omit `arguments` (or pass `{"module": ""}`) to load the entry.

---

## Adding new modules — what the maintainer does

1. Drop a `.md` file anywhere under `widecast/skills/video-editing/` (root or nested sub-dir, doesn't matter).
2. **Write whatever you want inside.** There is no required format — no required `# H1`, no required summary line, no frontmatter. The server picks `title` and `summary` from whatever content the file has (see "Title & summary auto-extraction" below).
3. Optionally edit `SKILL.md` to mention the new module in its load map (so agents trying to follow the curated chain know to load it). Not strictly required — agents that scan `available_modules[]` will still find it.
4. Run `bash deploy_widecast.sh` to rsync the file to the server. No code change, no restart.

### Title & summary auto-extraction

The server runs a tolerant Markdown-aware parser on each module file to populate `available_modules[]`. **You do NOT have to format the file in any specific way.**

**Title fallback chain** (first match wins):
1. First `# H1` heading.
2. First `## H2` heading.
3. First non-empty content line, with leading markdown markers (`# ## - * + 1. > [ ]`) stripped.
4. The filename basename (e.g. `40_thumbnail_cta`).

**Summary** = the first ~200 chars of meaningful content found AFTER the title line — paragraphs, bullets, sub-headings, blockquotes, even just a bold/italic phrase all qualify. Markdown decoration is stripped (inline code spans, links, emphasis); leading list/quote markers are removed. If there's no content after the title, summary stays empty — agents pick by title alone in that case.

Examples — every shape produces something usable:

| File content shape | Resulting `title` | Resulting `summary` |
|---|---|---|
| `# Mechanics`<br>`When and how to move overlay objects without breaking the spec.` | `Mechanics` | `When and how to move overlay objects without breaking the spec.` |
| `## Background audit`<br>`Grid vs real.` | `Background audit` | `Grid vs real.` |
| `- thumbnail rules`<br>`- final CTA rules` | `thumbnail rules` | `final CTA rules` |
| `> Note: this module covers chart axes.` | `Note: this module covers chart axes.` | *(empty)* |
| `**Quick fact:** _typography rules live here._`<br>`Load before any text overlay.` | `Quick fact: typography rules live here.` | `Load before any text overlay.` |
| *(empty file)* | filename basename | *(empty)* |

Module ID = relative path from the skill root, with `.md` stripped. E.g.:

| File on disk | Module id |
|---|---|
| `widecast/skills/video-editing/ai_video_editor/10_mechanics.md` | `ai_video_editor/10_mechanics` |
| `widecast/skills/video-editing/ai_video_editor/styles/text_axes.md` | `ai_video_editor/styles/text_axes` |
| `widecast/skills/video-editing/60_audio.md` *(new — drops in at root)* | `60_audio` |

Non-`.md` files (`sync_check.py`, `.DS_Store`, images) are ignored automatically.

---

## When to use which skill endpoint

| Goal | Endpoint |
|---|---|
| Write a new video script / blog post / social caption | **[`/v1/skills/writing`](skills-editing.md)** (`format=video|blog|social`) |
| Edit / refine / audit an existing video's scenes | **`/v1/skills/editing`** (this endpoint) |
