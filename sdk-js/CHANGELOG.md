# Changelog

All notable changes to the WideCast JS/TS SDK. Format: [Keep a Changelog](https://keepachangelog.com/),
versioning: [Semver](https://semver.org/).

## [Unreleased]

### Changed
- `FREE_TIER_MAX_SECONDS` 60 -> 90, so `FREE_TIER_MAX_WORDS` 240 -> 360 (Free accounts: ~90 s / 360 spoken words of narration; mirrors the server's `WIDECAST_FREE_TIER_MAX_SECONDS`).
- A 429 whose `Retry-After` is longer than 60 s (an hourly quota such as the short-link limit) now throws `RateLimitError` at once instead of waiting it out; short `Retry-After` values are still retried.

### Added
- `create_short_link(url, { custom_id })` / `get_short_link(shortLink)` / `update_short_link(shortLink, url)` — POST / GET / PATCH `/v1/short_links`: short `https://widecast.ai/s/<ID>` links to any http(s) URL, their click count, and changing where one goes (the ID never changes). `custom_id` = 6-32 letters or digits, case-insensitive (sent in capitals); omit it for a random ID. The get/update methods accept the ID or the whole short URL. Free. New `ShortLink` type.
- Constants `SHORT_LINK_URL_MAX_CHARS` (2048), `SHORT_LINK_CUSTOM_ID_MIN_CHARS` (6), `SHORT_LINK_CUSTOM_ID_MAX_CHARS` (32), `SHORT_LINK_CREATES_PER_HOUR` (10), `SHORT_LINK_EDITS_PER_HOUR` (100), mirroring the server's `WIDECAST_SHORT_LINK_*`. Pre-validation: `missing_field` / `invalid_url` (param `url`), `invalid_custom_id`, `invalid_short_link_id`.
- `create_video({ presenter: true })` — AI-presenter lane (needs `output_type: "video"`, source text/idea/blog, not combined with `faceless`; the server answers 402 `plan_required` on Free / Trial and 400 `presenter_not_ready` when no photo set exists). Default `false` = unchanged.
- `create_image({ purpose: "social" })` — a standalone post image with an exact `ratio` of `"1:1"` / `"4:5"` / `"16:9"` / `"9:16"` (default `"1:1"` for social). `ImageSetResponse` gains optional `purpose`, `agent_note`, `result.library_record`.
- `account()` documents the new `features.avatar_video`, `avatar_ready`, `voice_clone_ready` fields. Responses of publish / create_video / export_video / create_content / create_image may carry `agent_note` and `result.library_record`.
- `send_client_link()` — POST `/v1/client_link/send`: mint a no-login client
  link ("magic link") to one of the account's client screens (`record` /
  `content_plan` / `setup` / `social_dashboard` / `publish_schedule`) and
  optionally send it through the account's notification channels
  (Telegram / SMS / email). SYNC, FREE. Mint-only when `channels` is omitted
  or all-false; recipients are always resolved server-side from
  Setup > Notification (anti-spam-relay design).
- `SendClientLinkOptions` + `ClientLinkResponse` types.
- Exported constants `CLIENT_LINK_TYPES`, `CLIENT_LINK_TTL_MIN` (1),
  `CLIENT_LINK_TTL_MAX` (30), `CLIENT_LINK_TTL_DEFAULT` (7) — locked, mirror
  the server's `WIDECAST_CLIENT_LINK_TTL_*` constants.

## [0.1.0] — 2026-05-19

### Added
- Initial pilot release.
- `Widecast` class with `create_video()` and `get_video()`.
- `Video` class with `.wait()` polling helper.
- Auto-retry with exponential backoff on 5xx + network errors.
- `Idempotency-Key` header sent automatically (UUID per `create_video` call, overridable).
- Typed error hierarchy: `WidecastError`, `InvalidRequestError`, `NotFoundError`, `RateLimitError`, `APIError`.
- `User-Agent` and `X-Widecast-Sdk` headers emitted on every request.
- Works in Node 18+, Deno, Bun, and browsers (BYO fetch supported via `fetchImpl`).

### Known limitations (pilot)
- Auth is not enforced server-side. Any `wc_*` key works for now.
- `callback_url` accepted but webhook delivery not implemented (see ROADMAP Phase 1).
- Status polling uses fixed `pollIntervalMs` — adaptive backoff lands in 0.2.0.
