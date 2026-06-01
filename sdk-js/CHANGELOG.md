# Changelog

All notable changes to the WideCast JS/TS SDK. Format: [Keep a Changelog](https://keepachangelog.com/),
versioning: [Semver](https://semver.org/).

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
