# Per-video edit session — `POST /v1/edit_session`

**Synchronous, free.** Manages a per-video in-memory **edit session** that makes an AI editing run **safe under parallel scene edits** and gives **instant read-after-write**. Wrap a scene-editing run in `start` … `commit` so every [`/v1/modify_scene`](modify-scene.md) write lands in a memory cache and ElasticSearch is written **once** at the end.

> **When to use it.** Any time you run more than one [`/v1/modify_scene`](modify-scene.md) edit on a video — especially with **parallel scene-editor subagents**. Without a session, concurrent writes to the same video document can clobber each other (version conflicts); with a session, all writes serialize into one cache and commit atomically.

<!-- widecast-playground:edit-session -->

---

## Actions

| `action` | What it does |
|---|---|
| `start` | Before the first scene edit: caches the whole video document in memory (crash-safe via a write-ahead file). Every `/v1/modify_scene` write lands in the cache; every read (`/v1/video_data`, `/v1/scene_geometry`, `/v1/scene_inspector`) is served fresh from the cache. ElasticSearch is written **once**, at commit. Returns `ttl_seconds` (2700 = 45 min). |
| `commit` | After the last scene: flushes the cache to permanent storage. **Required to finish a run.** An idle session auto-commits after 45 minutes as a backstop, but call `commit` explicitly to land the edits promptly. |
| `abort` | Discards staged edits without writing. |
| `status` | Reports `{active, staged_writes, started, last_write}`. |

> **Legacy direct-write mode.** If the response has `cache_enabled: false`, the server is running with the session cache disabled — proceed **without** a session. Writes are still serialized per video by the server-side lock, so `modify_scene` is safe; you just don't get the read-after-write cache.

---

## Request

```http
POST /v1/edit_session
Authorization: Bearer wc_live_REPLACE_ME
Content-Type: application/json

{ "id": "widecast7c0d4f8a9b1e2d3f", "action": "start" }
```

### Field reference

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | The video's topic_id (`topic_id` accepted as an alias). |
| `action` | string enum | yes | `start` \| `commit` \| `abort` \| `status`. |

---

## Response — `200 OK`

Fields vary by `action`:

```jsonc
// action="start"
{ "object": "edit_session", "id": "widecast…", "action": "start",
  "cache_enabled": true, "active": true, "ttl_seconds": 2700, "request_id": "req_…" }

// action="commit"
{ "object": "edit_session", "id": "widecast…", "action": "commit",
  "cache_enabled": true, "committed": true, "active": false, "request_id": "req_…" }

// action="status"
{ "object": "edit_session", "id": "widecast…", "action": "status",
  "cache_enabled": true, "active": true, "staged_writes": 6,
  "started": "…", "last_write": "…", "request_id": "req_…" }
```

### Errors

| `error.code` | HTTP | When |
|---|---|---|
| `invalid_id` | 400 | `id` missing or not a valid topic_id. |
| `invalid_action` | 400 | `action` not one of `start`/`commit`/`abort`/`status`. |
| `topic_not_found` | 404 | No video with this id (on `action="start"`). |
| `topic_fetch_failed` | 502 | Could not load the video document to start a session. |
| `missing_api_key` / `invalid_api_key` | 401 | Auth. |

---

## Typical run

```text
edit_session(start)                 → cache the video
  modify_scene(scene 2) …           → all writes land in the cache
  modify_scene(scene 3) …           (parallel subagents safe)
  video_data / scene_geometry …     → reads served fresh from cache
edit_session(commit)                → flush to storage once
```

### Python

```python
from widecast import Widecast

client = Widecast()
vid = "widecast7c0d4f8a9b1e2d3f"

client.edit_session(vid, "start")
try:
    data = client.video_data(vid)          # served from the session cache
    # … run modify_scene edits, in parallel if you like …
    client.edit_session(vid, "commit")     # REQUIRED to finish
except Exception:
    client.edit_session(vid, "abort")      # discard on failure
    raise
```

### MCP

```jsonc
{ "name": "widecast_edit_session", "arguments": { "id": "widecast7c0d4f8a9b1e2d3f", "action": "start" } }
// … widecast_modify_scene calls …
{ "name": "widecast_edit_session", "arguments": { "id": "widecast7c0d4f8a9b1e2d3f", "action": "commit" } }
```
