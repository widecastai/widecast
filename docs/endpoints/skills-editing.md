# Get editing skill — `GET /v1/skills/editing`

**Synchronous, free, key-free.** Loads the WideCast **AI-video-editor** playbook (per-scene composition, overlay, narrator face clearance, background audit, layout, thumbnail/CTA endpoints, dead-zone, definition-of-done) — for refining/editing an EXISTING video.

This is the **lazy-load** companion to [`/v1/skills/writing`](skills-editing.md): the writing skill is one self-contained markdown per format, but the editing skill is too large to ship in one response, so it's split into a master `SKILL.md` + an auto-discovered tree of submodules. The agent loads one module at a time as it reaches the step that needs it.

<!-- widecast-playground:skills-editing -->

---

## Lazy-load contract

Call this endpoint **twice or more**:

1. **First call — `module` omitted.** Returns the master `SKILL.md` (the INDEX with rules + per-scene Definition of Done + module load map) PLUS an `available_modules[]` array that is **auto-discovered from the filesystem on every request**.
2. **Subsequent calls — `module=<id>`.** When the agent reaches a step in `SKILL.md` that names a module (e.g. "open `ai_video_editor/10_mechanics`"), call again with `module=ai_video_editor/10_mechanics` (no `.md` suffix) to load that submodule's content. Reload each module AT the step that needs it — do NOT work from memory across modules.

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
2. Give it a sensible first `# H1` line + a one-line summary paragraph after it. Both are parsed automatically and surfaced in `available_modules[]`.
3. Optionally edit `SKILL.md` to mention the new module in its load map (so agents trying to follow the curated chain know to load it). Not strictly required — agents that scan `available_modules[]` will still find it.
4. Run `bash deploy_widecast.sh` to rsync the file to the server. No code change, no restart.

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
