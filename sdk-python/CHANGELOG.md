# Changelog

All notable changes to the WideCast Python SDK. Format: [Keep a Changelog](https://keepachangelog.com/),
versioning: [Semver](https://semver.org/).

## [Unreleased]

### Changed
- `FREE_TIER_MAX_SECONDS` 60 → 90, so `FREE_TIER_MAX_WORDS` 240 → 360 (Free accounts: ~90 s / 360 spoken words of narration; mirrors the server's `WIDECAST_FREE_TIER_MAX_SECONDS`).

### Added
- `create_video(presenter=True)` — AI-presenter lane (needs `output_type="video"`, source text/idea/blog, not combined with `faceless`; server answers 402 `plan_required` on Free / Trial and 400 `presenter_not_ready` when no photo set exists). Default `False` = unchanged.
- `create_image(purpose="social")` — a standalone post image with an exact `ratio` of `1:1` / `4:5` / `16:9` / `9:16` (default `1:1` for social; `ratio` now defaults to `None` = `"portrait"` for the unchanged `scene` purpose).
- `account()` documents the new `features.avatar_video`, `avatar_ready`, `voice_clone_ready` fields. Responses of publish / create_video / export_video / create_content / create_image may carry `agent_note` and `result.library_record`.
- `send_client_link()` — POST `/v1/client_link/send`: mint a no-login client link ("magic link") for a chosen screen (`record` / `content_plan` / `setup` / `social_dashboard` / `publish_schedule`) and optionally send it through the account's notification channels (Telegram / SMS / email). Recipients are always resolved server-side from Setup > Notification settings; omitting `channels` (or all-false) is mint-only. SYNC, free.
- Constants `CLIENT_LINK_TYPES`, `CLIENT_LINK_TTL_MIN` (1), `CLIENT_LINK_TTL_MAX` (30), `CLIENT_LINK_TTL_DEFAULT` (7) — locked, mirroring the server's `WIDECAST_CLIENT_LINK_TTL_*` constants in dashboard2.py.
- Client-side pre-validation on `send_client_link()`: `invalid_link_type`, `missing_field` (`topic_id` required iff `link_type="record"`), `invalid_topic_id`, `invalid_ttl_days`, `invalid_channels`, `invalid_page`.

## [0.1.0] — 2026-05-19

### Added
- Initial pilot release.
- `Widecast` client with `create_video()` and `get_video()`.
- `Video` dict-wrapper with `.wait()` polling helper.
- Auto-retry with exponential backoff on 5xx + network errors.
- `Idempotency-Key` header sent automatically (random v4 UUID per `create_video` call, overridable).
- Typed error hierarchy: `WidecastError`, `InvalidRequestError`, `NotFoundError`, `RateLimitError`, `APIError`.
- `User-Agent` and `X-Widecast-Sdk` headers emitted on every request.

### Known limitations (pilot)
- Auth is not enforced server-side. Any `wc_*` key works for now.
- `callback_url` accepted but webhook delivery not implemented (see ROADMAP Phase 1).
- Status polling uses fixed `poll_interval` — adaptive backoff lands in 0.2.0.
