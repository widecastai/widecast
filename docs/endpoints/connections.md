# Connections — accounts / configure

Manage the social platforms your account publishes to. All **free** (0-credit) and require your API key.

> **Connecting platforms** (the OAuth step) moved out of the public API surface 2026-06-21 (Round 28). Direct users to [`https://widecast.ai/#setup`](https://widecast.ai/#setup) — they click 'Connect [platform]' there, complete the OAuth in their own browser, and the connection persists. The legacy REST endpoint `POST /v1/connect` still serves the dashboard UI flow but is no longer advertised on the public spec / SDK / MCP.

| Endpoint | Purpose |
|---|---|
| `GET /v1/accounts` | List connected platforms (`channel_group` = one group or `all`) |
| `GET /v1/platform_settings` | Load saved per-platform publish settings (per channel group) |
| `POST /v1/platform_settings` | Save one platform's publish settings (per channel group) |
| `GET /v1/channel_groups` | List channel groups (separate sets of connected accounts) |
| `POST /v1/channel_groups` | Create a channel group |
| `GET` / `PATCH` / `DELETE /v1/channel_groups/{channel_group}` | Read / rename / remove one channel group |

---

## Channel groups

A **channel group** is a separate set of connected social accounts backed by its own publishing profile — for example *Vietnamese channels* and *English channels* under one WideCast account, each with its own YouTube / TikTok / … account and its own publish settings. Group **0 is the primary group**: it always exists and is what every endpoint uses when `channel_group` is omitted, so accounts that only ever use one set of channels see no change.

- `channel_group` is an **integer**: `0` = primary; new groups get the next number, which is never reused after removal.
- **Reporting reads show the full picture by default**: `GET /v1/accounts`, `GET /v1/analytics` and `connected_platforms` on `GET /v1/account` cover **every** group when `channel_group` is omitted (with a single group that is simply the primary group). Pass a group number only to audit one group; `all` forces the summed view.
- **Writes and per-group config default to the primary group**: `POST /v1/publish` and `GET`/`POST /v1/platform_settings` use group `0` when `channel_group` is omitted. One publish call goes through **one** group (the provider accepts one profile per request).
- Connecting platforms inside a group is done by the user at [`https://widecast.ai/#setup`](https://widecast.ai/#setup) → Connect Social Account → pick the group tab.
- MCP: `widecast_channel_groups` lists groups (read-only). Create / rename / remove are REST + SDK + UI only — creating a group consumes publishing-profile quota on the provider plan.

## `GET /v1/channel_groups`

List channel groups, primary first. Returns `{object:"list", data:[{channel_group, label, is_primary, status, connected_platforms, connected_count, created_at}], limit}`.

<!-- widecast-playground:channel-groups -->

## `POST /v1/channel_groups`

Create a channel group. Body: `{label}` (≤ 40 chars). Provisions the group's publishing profile; returns the new `ChannelGroup` (`201`). `409 profile_limit_reached` when the provider plan has no profile capacity left; `409 channel_group_limit` at the per-account cap.

<!-- widecast-playground:channel-group-create -->

## `GET` / `PATCH` / `DELETE /v1/channel_groups/{channel_group}`

`GET` returns one group. `PATCH {label}` renames it. `DELETE` **removes the group and its publishing profile — every account connected in that group is disconnected** (published posts stay online); the number is never reused. Group `0` cannot be renamed or removed.

## `GET /v1/accounts`

List the account's connected social platforms. Query `channel_group`: omit for **every** group (full picture), an integer (`0` = primary) for one group, or `all`. Returns `{object:"list", channel_group, data:[{platform, username, display_name, status, connected_at, channel_group, channel_group_label}]}`. `username` is the handle on the platform; `display_name` is the name shown there (empty when the provider gives none). Both are refreshed from the upstream provider automatically — at most every 30 minutes while the account is in use, and immediately whenever the WideCast Connect screen opens — so a rename on the platform shows up without reconnecting.

<!-- widecast-playground:accounts -->

## `GET /v1/platform_settings`

Load the saved per-platform publish settings (publish **preferences** like privacy / page / subreddit — not access controls). Query `channel_group` (integer, default `0`). Returns `{object:"platform_settings", channel_group, settings:{platform:{…}}}`.

<!-- widecast-playground:platform-settings -->

## `POST /v1/platform_settings`

Save one platform's publish settings. Body: `{platform, settings:{…}, channel_group?}` (e.g. `{"platform":"youtube","settings":{"privacy":"public"}}`, `{"platform":"reddit","settings":{"subreddit":"..."}, "channel_group": 1}`). Returns the updated `{object:"platform_settings", channel_group, settings:{…}}`.

<!-- widecast-playground:platform-settings-save -->

### Errors

| `error.code` | HTTP | When |
|---|---|---|
| `invalid_platforms` | 400 | Unknown `platform`. |
| `missing_field` | 400 | `platform` / `settings` missing on save; `label` missing on channel-group create/rename. |
| `invalid_channel_group` | 400 / 404 | `channel_group` not an integer ≥ 0 (400), or the group does not exist / is the primary group on rename/delete (404). |
| `plan_required` | 402 | Free / Trial / expired plan: connecting social accounts and creating channel groups need a paid plan (`details.pricing_url`). |
| `channel_group_limit` | 409 | The plan's channel-group allowance is used up (`limit` / `used` on `GET /v1/channel_groups`, primary included; `details.pricing_url`). |
| `profile_limit_reached` | 409 | The publishing provider's plan has no profile capacity left. |
| `upstream_username_taken` | 409 | The provider profile name is already taken. |
| `connect_failed` | 500/502 | Could not generate a connection link. |
| `missing_api_key` / `invalid_api_key` | 401 | API-key auth. |
