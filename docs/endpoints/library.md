# Read / library endpoints

A set of **read-only, synchronous, free** (0-credit) `GET` endpoints for browsing your account's data. All require your API key (`Authorization: Bearer wc_live_…`) — the key is the access control. Responses are trimmed to clean public fields.

| Endpoint | Returns |
|---|---|
| `GET /v1/videos` | Recent videos/scripts (20/page) |
| `GET /v1/search` | Content matching keywords |
| `GET /v1/account` | Account profile + remaining credits |
| `GET /v1/analytics` | Social analytics dashboard (slow) |
| `GET /v1/roadmap` | Content roadmap (weeks, slots, streak) |
| `GET /v1/production_plan` | Weekly production plan |
| `GET /v1/recommendations` | Recommended video ideas |

---

## `GET /v1/videos`

List the account's recent videos/scripts (20 per page). Query: `from_record` (default 0). Returns `{object:"list", data:[{id, title, language, created_at}], total_count, from_record}`.

<!-- widecast-playground:videos -->

## `GET /v1/search`

Search the account's content by keywords. Query: `q` (required), `limit` (1–50, default 10). Returns `{object:"list", query, data:[{id, title, description, created_at}]}`.

<!-- widecast-playground:search -->

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

## `GET /v1/recommendations`

Recommended video ideas for an industry. Query: `industry` (falls back to your account industry), `page` (default 0). Returns `{object:"ideas", industry, ideas:[{title, description, …}]}`.

<!-- widecast-playground:recommendations -->

### Errors

| `error.code` | HTTP | When |
|---|---|---|
| `missing_field` | 400 | `q` missing on `/v1/search`. |
| `missing_api_key` / `invalid_api_key` | 401 | API-key auth. |
| `read_failed` | 500/502 | The underlying read failed. |
