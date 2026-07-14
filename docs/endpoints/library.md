# Read / library endpoints

A set of **read-only, synchronous, free** (0-credit) `GET` endpoints for browsing your account's data. All require your API key (`Authorization: Bearer wc_live_…`) — the key is the access control. Responses are trimmed to clean public fields.

| Endpoint | Returns |
|---|---|
| `GET /v1/videos` | Recent videos/scripts (20/page) |
| `GET /v1/account` | Account profile + remaining credits |
| `GET /v1/analytics` | Social analytics dashboard (slow) |
| `GET /v1/roadmap` | Content roadmap (weeks, slots, streak) |
| `GET /v1/production_plan` | Weekly production plan |
| `GET /v1/foundation_videos` | Curated foundation-video template library |

---

## `GET /v1/videos`

List the account's recent videos/scripts (20 per page). Query: `from_record` (default 0). Returns `{object:"list", data:[{id, title, language, created_at}], total_count, from_record}`.

<!-- widecast-playground:videos -->

## `GET /v1/account`

Account profile + remaining credits. Returns `{object:"account", company_id, plan, credits_remaining, valid_to, industry, sub_industry, email, name, location, connected_platforms}`.

<!-- widecast-playground:account -->

## `GET /v1/analytics`

Social analytics dashboard aggregated across connected platforms. **Slow** (fans out to the upstream provider). Query: `period` (`last_day`|`last_week`|`last_month`|`last_3months`|`last_year`|`custom`, default `last_week`), `start_date`/`end_date` (for `custom`). Returns `{object:"analytics", period, dashboard:{…}}`.

<!-- widecast-playground:analytics -->

## `GET /v1/roadmap`

The account's content roadmap. Query: `cycle` (default 1). Returns `{object:"roadmap", cycle, total_completed, total_slots, weekly_quota, current_week, streak, weeks:[…]}`.

<!-- widecast-playground:roadmap -->

## `GET /v1/production_plan`

The weekly production plan. Query: `page` (default 0), `week_start`, `week_end`. **Note:** passing both `week_start` and `week_end` may backfill missing plan rows upstream (a write); omit them for a pure read. Returns `{object:"production_plan", total, page, week_start, week_end, ideas:[…], topics:[…]}`.

<!-- widecast-playground:production-plan -->

## `GET /v1/foundation_videos`

Browse the curated **foundation-video template library** — proven starter angles for an industry that a user can adapt into a new video. A navigation / discovery aid: it creates or modifies nothing. Pair with [`/v1/skills/writing`](skills-writing.md) + [`/v1/create_video`](create-video.md) to seed a new video from a known-good structure. Query: `industry` (falls back to your account industry), `sub_industry` (optional narrower filter), `page` (default 0). Returns `{object:"list", data:[{id, title, description, thumbnail_url, industry, group}], total}` — `id` is the template's topic_id, `group` the foundation grouping label. Re-promoted to the public surface 2026-07-13 (Round 30).

<!-- widecast-playground:foundation-videos -->

> `GET /v1/recommendations` was withdrawn from the public surface 2026-07-13 (Round 30) — removed from the MCP tools, SDKs, and OpenAPI to cap the agent-facing tool count. The REST endpoint still serves the dashboard UI. Use [`POST /v1/collect_ideas`](collect-ideas.md) to brainstorm ideas from a product/service description.

### Errors

| `error.code` | HTTP | When |
|---|---|---|
| `missing_api_key` / `invalid_api_key` | 401 | API-key auth. |
| `read_failed` | 500/502 | The underlying read failed. |
