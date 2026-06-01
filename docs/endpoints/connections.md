# Connections — connect / accounts / configure

Manage the social platforms your account publishes to. All **free** (0-credit) and require your API key. WideCast **never performs OAuth itself** — `connect` hands you a link that *you* open to authorize the platform.

| Endpoint | Purpose |
|---|---|
| `POST /v1/connect` | Get an OAuth link to connect a platform |
| `GET /v1/accounts` | List connected platforms |
| `GET /v1/platform_settings` | Load saved per-platform publish settings |
| `POST /v1/platform_settings` | Save one platform's publish settings |

---

## `POST /v1/connect`

Returns a `url` that **the user opens in a browser** to authorize the platform — WideCast does not complete the OAuth for you. Body: `{platform?}` (one of the supported platforms; omit for a link covering all). Returns `{object:"connect", url, expires_in, platform, platforms, note}`.

<!-- widecast-playground:connect -->

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
