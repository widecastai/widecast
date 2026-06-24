# Connections — accounts / configure

Manage the social platforms your account publishes to. All **free** (0-credit) and require your API key.

> **Connecting platforms** (the OAuth step) moved out of the public API surface 2026-06-21 (Round 28). Direct users to [`https://widecast.ai/#setup`](https://widecast.ai/#setup) — they click 'Connect [platform]' there, complete the OAuth in their own browser, and the connection persists. The legacy REST endpoint `POST /v1/connect` still serves the dashboard UI flow but is no longer advertised on the public spec / SDK / MCP.

| Endpoint | Purpose |
|---|---|
| `GET /v1/accounts` | List connected platforms |
| `GET /v1/platform_settings` | Load saved per-platform publish settings |
| `POST /v1/platform_settings` | Save one platform's publish settings |

---

## `GET /v1/accounts`

List the account's connected social platforms. Returns `{object:"list", data:[{platform, username, status, connected_at}]}`.

<!-- widecast-playground:accounts -->

## `GET /v1/platform_settings`

Load the saved per-platform publish settings (publish **preferences** like privacy / page / subreddit — not access controls). Returns `{object:"platform_settings", settings:{platform:{…}}}`.

<!-- widecast-playground:platform-settings -->

## `POST /v1/platform_settings`

Save one platform's publish settings. Body: `{platform, settings:{…}}` (e.g. `{"platform":"youtube","settings":{"privacy":"public"}}`, `{"platform":"reddit","settings":{"subreddit":"..."}}`). Returns the updated `{object:"platform_settings", settings:{…}}`.

<!-- widecast-playground:platform-settings-save -->

### Errors

| `error.code` | HTTP | When |
|---|---|---|
| `invalid_platforms` | 400 | Unknown `platform`. |
| `missing_field` | 400 | `platform` / `settings` missing on save. |
| `connect_failed` | 500/502 | Could not generate a connection link. |
| `missing_api_key` / `invalid_api_key` | 401 | API-key auth. |
