// WideCast API base URL — single source of truth.
//
// All client-side pages (docs.html, playground.html, endpoints/*.html,
// webhook-test.html) load this file via <script src="assets/widecast-config.js">.
// Edit the URL here to redirect every page at once — no rebuild required.
//
// At build time, docs/build.py regenerates this file from the
// WIDECAST_API_BASE_URL env var (defaults to https://widecast.ai/app/dashboard).
window.WIDECAST_API_BASE_URL = "https://widecast.ai/app/dashboard";
