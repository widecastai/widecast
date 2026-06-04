"""WideCast.ai Python SDK — single-file thin client.

Design goals:
  * Readable in < 5 minutes (one file, no abstractions).
  * No heavy dependencies — only `requests`.
  * Predictable: every method returns a dict-like Video / plain dict.
  * Polling baked in via Video.wait() with exponential backoff (mirrors UI cadence).

Public surface:
  Widecast(api_key, *, base_url=None, timeout=60.0, max_retries=3)
    .create_video(script, *, output_type="scene", wait_for_render=False,
                  callback_url=None, metadata=None,
                  idempotency_key=None) -> Video
    .export_video(video_id) -> Video
    .get_status(video_id) -> Video

  Video.wait(timeout=600.0, initial_interval=5.0, max_interval=60.0) -> Video
  Video["..."] / Video.attr — dict-style access to JSON fields
"""
from __future__ import annotations

import json
import os
import time
import uuid
from typing import Any, Mapping, Optional
from urllib.parse import urlencode

import requests


__version__ = "0.1.0"

_FALLBACK_BASE_URL = "https://widecast.ai/app/dashboard2"
DEFAULT_TIMEOUT = 60.0
TERMINAL_STATUSES = ("completed", "failed")

# Field-requirement constants (LOCKED — A38 parity rule, 5 surfaces in sync).
#
# These mirror server-side enforcement in dashboard2.py
# (WIDECAST_SCRIPT_MIN_WORDS / MAX_WORDS / WIDECAST_IDEA_MIN_WORDS / MAX_WORDS /
# _WIDECAST_SOURCES / _WIDECAST_OUTPUT_TYPES / _WIDECAST_VIDEO_LENGTHS /
# _WIDECAST_LANGUAGES) and the OpenAPI `CreateVideoRequest` description.
# Any change must update server + OpenAPI + this constant + the markdown docs
# + the playground YAML/JS in the same commit — otherwise the parity tests
# fail on the next test run and downstream tools (MCP / OpenAI tools / Postman
# collection) drift.
SCRIPT_MIN_WORDS = 80     # ~20s of narration (source="text")
SCRIPT_MAX_WORDS = 500    # ~120s / 2 min of narration (source="text")
IDEA_MIN_WORDS = 5        # source="idea" floor — reject if shorter
IDEA_MAX_WORDS = 1000     # source="idea" ceiling — auto-truncate not reject
BLOG_MIN_WORDS = 30       # source="blog" floor — reject if shorter (use idea)
BLOG_MAX_WORDS = 3000     # source="blog" ceiling — auto-truncate not reject
OUTPUT_TYPES = ("text", "scene", "video")  # pipeline depth (A46)
# blog = generative (mirrors idea, A48). video_*/audio_* = media-ingest (A49):
# the script already lives in the media; output_type="text" = Remake (A50).
SOURCES = ("text", "idea", "blog",
           "video_url", "video_file", "audio_url", "audio_file")
# faceless=True forces every scene to B-roll (no narrator A-roll). Only valid
# with output_type scene/video for these script-based sources.
FACELESS_SOURCES = ("text", "idea", "blog")
VIDEO_LENGTHS = ("short", "normal")    # generative sources — maps to content_type 9/10
LANGUAGES = ("English", "Vietnamese")  # generative sources — locked enum v0.1.0
# Written content (/v1/create_content): friendly types → legacy content_type 3/4/5/6.
CONTENT_TYPES = ("blog", "facebook", "x", "linkedin")
# Enhance aggressiveness (/v1/enhance_script): 0=segment only, 1=natural, 2=max rewrite.
INTERVENTION_LEVELS = (0, 1, 2)
# Social platforms WideCast can publish to (/v1/publish). Locked vocabulary
# mirroring the server's _WIDECAST_PUBLISH_PLATFORMS.
PUBLISH_PLATFORMS = ("youtube", "tiktok", "instagram", "facebook", "linkedin",
                     "x", "threads", "pinterest", "reddit", "bluesky",
                     "google_business")
# Generative sources (have a Phase 1 script-writer) → which input field +
# bounds + error codes. source="text" is NOT here (caller supplies the script).
_GENERATIVE_SOURCES = {
    "idea": {"field": "idea_text", "min": IDEA_MIN_WORDS, "max": IDEA_MAX_WORDS,
             "too_short_code": "idea_too_short", "missing_code": "missing_idea_text"},
    "blog": {"field": "blog_text", "min": BLOG_MIN_WORDS, "max": BLOG_MAX_WORDS,
             "too_short_code": "blog_too_short", "missing_code": "missing_blog_text"},
}
# Media-ingest sources (A49): audio/video provided by URL (YouTube/TikTok/FB)
# or by uploading a file (multipart). field = the request key (JSON for url,
# multipart file part for file). output_type scene/video = full build;
# text = Remake (transcript only, A50). language/video_length/research_enabled
# do NOT apply.
MEDIA_SOURCES = {
    "video_url":  {"media_type": "video", "input_kind": "url",  "field": "video_url"},
    "video_file": {"media_type": "video", "input_kind": "file", "field": "video_file"},
    "audio_url":  {"media_type": "audio", "input_kind": "url",  "field": "audio_url"},
    "audio_file": {"media_type": "audio", "input_kind": "file", "field": "audio_file"},
}
# Media caps (A49). Duration applies to ALL media (url + file) and is enforced
# SERVER-SIDE (a thin SDK can't probe duration without heavy deps). File size
# applies to UPLOADS only and IS pre-validated client-side below (fast fail,
# no bytes sent). Both mirror the server constants in dashboard2.py.
MEDIA_MAX_DURATION_SECONDS = 120                 # 2 min — server enforces (media_too_long)
MEDIA_MAX_FILE_BYTES = 100 * 1024 * 1024         # 100 MB — uploads only (file_too_large)


def _default_base_url() -> str:
    """Read at call time so env changes take effect without re-import."""
    return os.environ.get("WIDECAST_BASE_URL") or _FALLBACK_BASE_URL


# ──────────────────────────────────────────────────────────────────────────────
# Errors — one class per error.type so users can catch granularly.
# ──────────────────────────────────────────────────────────────────────────────
class WidecastError(Exception):
    def __init__(self, message: str, *, code: str = "", request_id: str = "",
                 status: int = 0, doc_url: str = "", param: Optional[str] = None,
                 response_json: Optional[dict] = None,
                 details: Optional[dict] = None):
        super().__init__(message)
        self.code = code
        self.request_id = request_id
        self.status = status
        self.doc_url = doc_url
        self.param = param
        self.response_json = response_json or {}
        # Code-specific structured data. Populated for HTTP 402 (`credit_exhausted`
        # / `account_expired`) with {upgrade_url, reset_at | expired_at,
        # current_plan, credits_remaining, credits_required, ...}. None for
        # other error codes.
        self.details = details or None

    @property
    def upgrade_url(self) -> str:
        """Shortcut for ``details["upgrade_url"]`` — empty when not a 402."""
        return (self.details or {}).get("upgrade_url", "") or ""

    @property
    def reset_at(self) -> str:
        """ISO timestamp when the monthly quota next refreshes (credit_exhausted only)."""
        return (self.details or {}).get("reset_at", "") or ""

    def __repr__(self) -> str:
        return (f"{type(self).__name__}(code={self.code!r}, "
                f"request_id={self.request_id!r}, status={self.status}, "
                f"message={self.args[0]!r})")


class InvalidRequestError(WidecastError): ...
class NotFoundError(WidecastError): ...
class PreconditionFailedError(WidecastError): ...
class RateLimitError(WidecastError): ...
class APIError(WidecastError): ...


_ERROR_CLASSES = {
    "invalid_request_error": InvalidRequestError,
    "not_found_error": NotFoundError,
    "precondition_failed": PreconditionFailedError,
    "rate_limit_error": RateLimitError,
    "api_error": APIError,
    "authentication_error": WidecastError,
    "permission_error": WidecastError,
}


# ──────────────────────────────────────────────────────────────────────────────
# Video — dict wrapper with .wait() helper and ergonomic property accessors.
# ──────────────────────────────────────────────────────────────────────────────
class Video(dict):
    """Dict-like video resource. Mirrors server `{"object": "status", ...}` envelope.
    `video.wait()` polls /v1/status/<id> until terminal (completed / failed)."""

    _client: Optional["Widecast"] = None

    # ── Top-level fields ──
    @property
    def id(self) -> str:
        return self["id"]

    @property
    def topic_id(self) -> str:
        """Alias for `id` — exposed because the legacy widecast flow uses this name
        in scene-editor URLs (`?topic_id=...`)."""
        return self.get("topic_id") or self["id"]

    @property
    def status(self) -> str:
        """One of: pending | processing | completed | failed."""
        return self.get("status", "")

    @property
    def stage(self) -> str:
        """Free-form internal stage. Don't gate logic on this — use `status`."""
        return self.get("stage", "")

    @property
    def progress(self) -> float:
        return float(self.get("progress", 0.0) or 0.0)

    @property
    def progress_hint(self) -> Optional[dict]:
        """Time-based pseudo-progress for UX during long renders.

        Returns ``{stage, label, elapsed_ms, remaining_ms_estimate}`` when the
        server is computing it (only while ``status == "processing"``), else
        ``None``. Display only — don't gate logic on ``stage`` since it's
        derived from elapsed time, not real worker state.

        The ``label`` is English with a baked ETA suffix
        (``"Generating scene visuals · ~7 min left"``).
        """
        return self.get("progress_hint")

    @property
    def progress_label(self) -> str:
        """Shortcut to ``progress_hint["label"]`` — empty string when unset."""
        hint = self.progress_hint
        return (hint or {}).get("label", "") or ""

    @property
    def details(self) -> Optional[dict]:
        """Raw worker state — {step, status, notes, updated_at}. `None` during
        the pending race window. Note `details["status"]` is a free-form
        legacy string and does NOT mirror the top-level `.status` enum."""
        return self.get("details")

    @property
    def scheduled_for(self) -> Optional[str]:
        return self.get("scheduled_for")

    @property
    def is_terminal(self) -> bool:
        return self.status in TERMINAL_STATUSES

    # ── Convenience: unwrap `result` for review/MP4 URLs ──
    @property
    def review_url(self) -> Optional[str]:
        """URL where the user reviews the rendered scenes + audio.
        Present from the first response (pending / processing / completed) —
        the review page handles early arrival itself (spinner + in-page
        polling), so this is safe to share before status='completed'."""
        return (self.get("result") or {}).get("review_url")

    @property
    def video_url(self) -> Optional[str]:
        """Direct URL to the final rendered MP4. Present only when status='completed'
        AND the video was created with output_type='video' (or exported via
        client.export_video)."""
        return (self.get("result") or {}).get("video_url")

    @property
    def error(self) -> Optional[dict]:
        """{'code': str, 'message': str} when status='failed', else None."""
        return self.get("error")

    # ── Polling ──
    def wait(self, timeout: float = 600.0,
             initial_interval: float = 5.0,
             max_interval: float = 5.0,
             backoff_multiplier: float = 1.0) -> "Video":
        """Block until status in {completed, failed} or timeout.
        Default: fixed 5-second polling (no backoff) — feedback was that
        exp-backoff drifting to 25-60s feels laggy. Override the kwargs if
        you want backoff for long polls."""
        if self._client is None:
            raise WidecastError("Video instance is detached from client; "
                                "call client.get_status(id) to refresh.")
        deadline = time.monotonic() + timeout
        latest: "Video" = self
        interval = initial_interval
        while not latest.is_terminal:
            if time.monotonic() >= deadline:
                break
            wait_s = min(interval, max(0.1, deadline - time.monotonic()))
            time.sleep(wait_s)
            latest = self._client.get_status(self.id)
            interval = min(interval * backoff_multiplier, max_interval)
        return latest


# ──────────────────────────────────────────────────────────────────────────────
# Widecast client
# ──────────────────────────────────────────────────────────────────────────────
class Widecast:
    def __init__(self, api_key: Optional[str] = None, *,
                 base_url: Optional[str] = None,
                 timeout: float = DEFAULT_TIMEOUT,
                 max_retries: int = 3,
                 user_agent: Optional[str] = None,
                 session: Optional[requests.Session] = None):
        self.api_key = api_key or os.environ.get("WIDECAST_API_KEY")
        self.base_url = (base_url or _default_base_url()).rstrip("/")
        self.timeout = timeout
        self.max_retries = max_retries
        self.user_agent = user_agent or f"widecast-python/{__version__}"
        self._session = session or requests.Session()

    # ── HTTP plumbing ─────────────────────────────────────────────────────
    def _headers(self, idempotency_key: Optional[str] = None,
                 multipart: bool = False) -> dict:
        h = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "User-Agent": self.user_agent,
            "X-Widecast-Sdk": f"python/{__version__}",
        }
        # For multipart uploads, let `requests` set Content-Type (with the
        # boundary) — never send our application/json default.
        if multipart:
            h.pop("Content-Type", None)
        # Telemetry header: opt-OUT via env var. Sends only SDK name + version
        # (no user data). Lets us measure which versions are in the wild so we
        # can deprecate gracefully. Set WIDECAST_DISABLE_TELEMETRY=1 to suppress.
        if os.environ.get("WIDECAST_DISABLE_TELEMETRY", "").lower() not in ("1", "true", "yes"):
            h["X-Widecast-Telemetry"] = f"sdk=python/{__version__}"
        if self.api_key:
            h["Authorization"] = f"Bearer {self.api_key}"
        if idempotency_key:
            h["Idempotency-Key"] = idempotency_key
        return h

    def _request(self, method: str, path: str, *,
                 json_body: Optional[Mapping[str, Any]] = None,
                 idempotency_key: Optional[str] = None) -> dict:
        url = self.base_url + path
        last_exc: Optional[Exception] = None
        for attempt in range(self.max_retries + 1):
            try:
                resp = self._session.request(
                    method, url,
                    headers=self._headers(idempotency_key),
                    json=json_body,
                    timeout=self.timeout,
                )
            except requests.RequestException as e:
                last_exc = e
                if attempt >= self.max_retries:
                    raise APIError(f"Network error after {attempt + 1} attempts: {e}")
                time.sleep(_backoff(attempt))
                continue

            # Server error → retry
            if 500 <= resp.status_code < 600 and attempt < self.max_retries:
                time.sleep(_backoff(attempt))
                continue
            # 429 → respect Retry-After
            if resp.status_code == 429 and attempt < self.max_retries:
                retry_after = float(resp.headers.get("Retry-After", "2"))
                time.sleep(retry_after)
                continue

            return _decode_response(resp)
        raise APIError(f"Exhausted retries: {last_exc}")

    def _post_multipart(self, path: str, *, form: Mapping[str, Any],
                        file_field: str, file_obj,
                        idempotency_key: Optional[str] = None) -> dict:
        """POST multipart/form-data — for media file sources (video_file /
        audio_file). `file_obj` is an open binary file or a path str. Single
        attempt (uploads aren't safe to blindly retry; the Idempotency-Key
        lets the server dedupe if you retry yourself)."""
        url = self.base_url + path
        opened = None
        try:
            if isinstance(file_obj, str):
                opened = open(file_obj, "rb")
                fh = opened
            else:
                fh = file_obj
            files = {file_field: fh}
            data = {k: v for k, v in form.items() if v is not None}
            try:
                resp = self._session.request(
                    "POST", url,
                    headers=self._headers(idempotency_key, multipart=True),
                    data=data, files=files, timeout=self.timeout,
                )
            except requests.RequestException as e:
                raise APIError(f"Network error during upload: {e}")
            return _decode_response(resp)
        finally:
            if opened is not None:
                opened.close()

    # ── Public methods ────────────────────────────────────────────────────
    def create_video(self, script_text: Optional[str] = None, *,
                     source: str = "text",
                     idea_text: Optional[str] = None,
                     blog_text: Optional[str] = None,
                     video_url: Optional[str] = None,
                     audio_url: Optional[str] = None,
                     video_file: Optional[Any] = None,
                     audio_file: Optional[Any] = None,
                     language: str = "English",
                     video_length: str = "short",
                     research_enabled: bool = True,
                     output_type: str = "scene",
                     faceless: bool = False,
                     media_pool: Optional[list] = None,
                     wait_for_render: bool = False,
                     callback_url: Optional[str] = None,
                     metadata: Optional[Mapping[str, Any]] = None,
                     idempotency_key: Optional[str] = None) -> Video:
        """POST /v1/create_video — create a video from a script, an idea, or
        a blog/article.

        Input flows, picked by `source`:

        - `source="text"` (default — backward-compat): pass `script_text`
          as the first positional arg. Used VERBATIM by the narrator. Must
          be SCRIPT_MIN_WORDS..SCRIPT_MAX_WORDS (80-500 words, ~20s-2min).
          You may embed direct image/video file URLs inline (see
          `script_text` arg below) to use your own visuals for specific
          scenes instead of auto-sourced B-roll.
        - `source="idea"`: pass `idea_text` (5-1000 words; >1000 is
          auto-truncated server-side, surfaced in
          `details.input_truncated_from`). Server writes a narration from
          the idea (AI), then continues into the same scene-sourcing
          pipeline as text mode. Pick `language`, `video_length`,
          `research_enabled`.
        - `source="blog"`: pass `blog_text` (30-3000 words — an article to
          repurpose; >3000 auto-truncated). Identical pipeline to idea.
        idea + blog are GENERATIVE sources → they also accept
        output_type="text" (stop at the editable script).

        Media-ingest sources (A49) — the script already lives in the media:
        - `source="video_url"` / `"audio_url"`: pass `video_url` / `audio_url`
          (a YouTube / TikTok / Facebook URL). Pure JSON.
        - `source="video_file"` / `"audio_file"`: pass `video_file` /
          `audio_file` (a path str or an open binary file). Sent as
          multipart/form-data.
        For media sources output_type "scene"/"video" runs the full build
        (the footage becomes b-roll / the audio becomes narration); output_type
        "text" = Remake (extract the transcript only → editable script, A50).
        language / video_length / research_enabled do NOT apply to media.

        Args:
            script_text:      Required when source="text". Plain narration,
                              used verbatim. May contain inline image/video
                              file URLs in EITHER form:
                                * Markdown image syntax (recommended for
                                  AI-chat callers — chat hosts render the
                                  picture inline):
                                  `![brief description](https://…/photo.jpg)`
                                * Raw URL on its own line (backward compat):
                                  `… https://cdn.acme.com/photo.jpg …`
                              Direct file links only — image extensions
                              .png/.jpg/.jpeg/.gif/.webp/.bmp/.avif/.svg or
                              video extensions .mp4/.webm/.mov/.m4v/.avi
                              (optional ?query). WideCast strips both forms
                              from the narration and uses them as the
                              matching scene's visual.
                              Page links (e.g. youtube.com/watch) are NOT
                              inlined — use source="video_url" for a whole clip.
            source:           "text" (default) or "idea". See SOURCES tuple.
            idea_text:        Required when source="idea". Short description.
            language:         Narration language (source=idea). Default
                              "English". Locked enum: see LANGUAGES.
            video_length:     "short" (~90s, default) or "normal" (~3 min cap)
                              for source=idea. See VIDEO_LENGTHS.
            research_enabled: True (default) enables AI research / fact-check
                              during narration generation (source=idea only).
            output_type:      Pipeline depth. "text" stops after the
                              source→script phase (review_url → Script Editor;
                              generative sources only — NOT source="text").
                              "scene" (default) stops at scenes-ready.
                              "video" auto-chains into renderer for final MP4.
            faceless:         If True, every scene is B-roll (no narrator
                              A-roll anywhere) — a "faceless" video. Default
                              False (scenes mix A-roll + B-roll). Only valid
                              with output_type scene/video for sources
                              text/idea/blog (see FACELESS_SOURCES); else
                              raises invalid_faceless.
            wait_for_render:  If True, server blocks up to 60s waiting for
                              completion.
            callback_url:     HTTPS URL for webhook events.
            metadata:         Optional kv echoed back on get_status.
            idempotency_key:  Optional client-supplied UUID. If omitted,
                              a v4 is generated.

        Examples:
            # Text flow
            client.create_video(my_script_80_to_500_words)

            # Idea flow with defaults
            client.create_video(source="idea", idea_text="why teens should drive at 16")

            # Idea flow, Vietnamese, normal length, end-to-end MP4
            client.create_video(
                source="idea",
                idea_text="Tại sao phụ huynh nên cho con học lái xe sớm",
                language="Vietnamese",
                video_length="normal",
                output_type="video",
            )
        """
        # ── Validate source + output_type up front (cheap checks) ─────────
        if source not in SOURCES:
            raise InvalidRequestError(
                f"source must be one of {list(SOURCES)} (got {source!r}).",
                code="invalid_source", param="source")
        if output_type not in OUTPUT_TYPES:
            raise InvalidRequestError(
                f"output_type must be one of {list(OUTPUT_TYPES)} "
                f"(got {output_type!r}).",
                code="invalid_output_type", param="output_type")
        # output_type='text' = stop after the source→script-text phase, which
        # only exists for generative sources. source='text' already provides
        # the script, so 'text' output would echo the input (A46).
        if output_type == "text" and source == "text":
            raise InvalidRequestError(
                "output_type='text' requires a generative source (e.g. "
                "source='idea'). With source='text' you already supplied "
                "the script — use output_type 'scene' or 'video'.",
                code="invalid_output_type", param="output_type")
        # faceless = force every scene to B-roll (no narrator A-roll). Only
        # valid with scenes (scene/video) for the script-based sources.
        # Mirrors the server's invalid_faceless rule.
        if not isinstance(faceless, bool):
            raise InvalidRequestError(
                f"faceless must be a bool (got {type(faceless).__name__}).",
                code="invalid_faceless", param="faceless")
        if faceless:
            if output_type == "text":
                raise InvalidRequestError(
                    "faceless controls A/B-roll for generated scenes; it has "
                    "no effect with output_type='text'. Use 'scene' or 'video'.",
                    code="invalid_faceless", param="faceless")
            if source not in FACELESS_SOURCES:
                raise InvalidRequestError(
                    f"faceless is only supported for source in "
                    f"{list(FACELESS_SOURCES)} (got source={source!r}).",
                    code="invalid_faceless", param="faceless")

        # ── Build body, pre-validating per source ─────────────────────────
        body: dict = {"source": source, "output_type": output_type}
        if faceless:
            body["faceless"] = True
        if media_pool:
            # Extra image/video URLs the caller couldn't place inline → added to
            # the first scene's media library (scene editor lists them).
            body["media_pool"] = [u for u in media_pool if isinstance(u, str) and u.strip()]
        # For media file sources we send multipart instead of JSON; these hold
        # the file to upload until dispatch.
        _upload_field: Optional[str] = None
        _upload_value: Any = None

        if source == "text":
            if not isinstance(script_text, str) or not script_text.strip():
                raise InvalidRequestError(
                    "script_text (non-empty string) is required when source='text'.",
                    code="missing_field", param="script_text")
            word_count = len(script_text.split())
            if word_count < SCRIPT_MIN_WORDS:
                raise InvalidRequestError(
                    f"script_text has {word_count} words; minimum is "
                    f"{SCRIPT_MIN_WORDS} (~20s of narration).",
                    code="script_too_short", param="script_text")
            if word_count > SCRIPT_MAX_WORDS:
                raise InvalidRequestError(
                    f"script_text has {word_count} words; maximum is "
                    f"{SCRIPT_MAX_WORDS} (~120s / 2 min of narration).",
                    code="script_too_long", param="script_text")
            body["script_text"] = script_text
        elif source in _GENERATIVE_SOURCES:  # idea / blog — A48 shared validation
            gen = _GENERATIVE_SOURCES[source]
            field = gen["field"]
            # Pick the right input arg by source.
            value = idea_text if source == "idea" else blog_text
            if not isinstance(value, str) or not value.strip():
                raise InvalidRequestError(
                    f"{field} (non-empty string) is required when source={source!r}.",
                    code=gen["missing_code"], param=field)
            word_count = len(value.split())
            if word_count < gen["min"]:
                raise InvalidRequestError(
                    f"{field} has {word_count} words; minimum is {gen['min']}.",
                    code=gen["too_short_code"], param=field)
            # NO upper-bound rejection — server auto-truncates over max.
            if language not in LANGUAGES:
                raise InvalidRequestError(
                    f"language must be one of {list(LANGUAGES)} (got {language!r}).",
                    code="invalid_language", param="language")
            if video_length not in VIDEO_LENGTHS:
                raise InvalidRequestError(
                    f"video_length must be one of {list(VIDEO_LENGTHS)} "
                    f"(got {video_length!r}).",
                    code="invalid_video_length", param="video_length")
            if not isinstance(research_enabled, bool):
                raise InvalidRequestError(
                    f"research_enabled must be a bool (got {type(research_enabled).__name__}).",
                    code="invalid_research_enabled", param="research_enabled")
            body[field] = value
            body["language"] = language
            body["video_length"] = video_length
            body["research_enabled"] = research_enabled

        else:  # media-ingest source (audio/video, url/file) — A49/A50
            media = MEDIA_SOURCES[source]
            field = media["field"]
            if media["input_kind"] == "url":
                value = video_url if source == "video_url" else audio_url
                if not isinstance(value, str) or not value.strip():
                    raise InvalidRequestError(
                        f"{field} (a media URL) is required when source={source!r}.",
                        code=f"missing_{field}", param=field)
                body[field] = value.strip()
            else:  # file — defer to multipart dispatch
                value = video_file if source == "video_file" else audio_file
                if value is None:
                    raise InvalidRequestError(
                        f"{field} (a path or open binary file) is required when "
                        f"source={source!r}.",
                        code="missing_media_file", param=field)
                # File-size pre-validation (uploads only — 100 MB). Fast-fail
                # before sending bytes. Duration is enforced server-side.
                _size = None
                if isinstance(value, str):
                    try:
                        _size = os.path.getsize(value)
                    except OSError:
                        _size = None
                else:
                    try:
                        _cur = value.tell()
                        value.seek(0, os.SEEK_END)
                        _size = value.tell()
                        value.seek(_cur)
                    except Exception:
                        _size = None
                if _size is not None and _size > MEDIA_MAX_FILE_BYTES:
                    raise InvalidRequestError(
                        f"{field} is {_size/1024/1024:.1f} MB; maximum is "
                        f"{MEDIA_MAX_FILE_BYTES // (1024*1024)} MB.",
                        code="file_too_large", param=field)
                _upload_field = field
                _upload_value = value

        if wait_for_render:
            body["wait_for_render"] = True
        if callback_url:
            body["callback_url"] = callback_url
        if metadata:
            body["metadata"] = dict(metadata)
        idem = idempotency_key or str(uuid.uuid4())

        # Media file sources go out as multipart/form-data (mirrors the UI
        # upload); everything else is JSON.
        if _upload_field is not None:
            form = {k: (json.dumps(v) if isinstance(v, (dict, list)) else v)
                    for k, v in body.items()}
            data = self._post_multipart(
                "/v1/create_video", form=form,
                file_field=_upload_field, file_obj=_upload_value,
                idempotency_key=idem)
        else:
            data = self._request("POST", "/v1/create_video",
                                 json_body=body, idempotency_key=idem)
        return self._wrap_video(data)

    def export_video(self, video_id: str) -> Video:
        """POST /v1/export_video — kick the final-MP4 renderer for an existing
        scene-output video. Idempotent: calling twice is a no-op.

        Returns a Video with status='processing' (or the current state).
        Use .wait() to block until the MP4 is ready — completion gate is
        result.video_url non-empty.

        Raises PreconditionFailedError if scenes are not yet ready."""
        if not video_id or not isinstance(video_id, str):
            raise InvalidRequestError("video_id must be a non-empty string.",
                                      code="invalid_id", param="video_id")
        data = self._request("POST", "/v1/export_video",
                             json_body={"id": video_id})
        return self._wrap_video(data)

    def get_status(self, video_id: str) -> Video:
        """GET /v1/status/<video_id> — fetch current state (universal poll endpoint).

        Status is one of: pending, processing, completed, failed.
        * `video.review_url` is present from the first response (every state):
          the review page handles early arrival itself (spinner + in-page
          polling) so it's safe to share with the user before completion.
        * `video.video_url` is the direct MP4 URL — only populated when
          `status == "completed"` AND output_type was "video" (or after a
          successful /v1/export_video)."""
        if not video_id or not isinstance(video_id, str):
            raise InvalidRequestError("video_id must be a non-empty string.",
                                      code="invalid_id", param="video_id")
        data = self._request("GET", f"/v1/status/{video_id}")
        return self._wrap_video(data)

    def create_content(self, content: str, *,
                       content_type: str = "blog",
                       language: str = "English",
                       callback_url: Optional[str] = None,
                       metadata: Optional[Mapping[str, Any]] = None,
                       idempotency_key: Optional[str] = None) -> "Video":
        """POST /v1/create_content — generate written content (blog / social
        post) from a URL, an idea/topic, or pasted text.

        Async: returns a Video with status='processing' AND
        `video.review_url` already populated (the public content viewer; safe
        to share before completion — page shows a spinner while content
        generates). Poll with `.wait()` for the final state. Consumes credits.

        Args:
            content:      Required. A URL, an idea/topic, or pasted text.
            content_type: 'blog' (default), 'facebook', 'x', or 'linkedin'.
                          See CONTENT_TYPES.
            language:     Output language. Default 'English'. See LANGUAGES.
        """
        if not isinstance(content, str) or not content.strip():
            raise InvalidRequestError(
                "content (non-empty string: a URL, idea, or text) is required.",
                code="missing_field", param="content")
        if content_type not in CONTENT_TYPES:
            raise InvalidRequestError(
                f"content_type must be one of {list(CONTENT_TYPES)} (got {content_type!r}).",
                code="invalid_content_type", param="content_type")
        if not isinstance(language, str) or not language.strip():
            raise InvalidRequestError(
                "language (e.g. 'English') is required.",
                code="missing_field", param="language")
        body: dict = {
            "content": content.strip(),
            "content_type": content_type,
            "language": language.strip(),
        }
        if callback_url:
            body["callback_url"] = callback_url
        if metadata:
            body["metadata"] = dict(metadata)
        idem = idempotency_key or str(uuid.uuid4())
        data = self._request("POST", "/v1/create_content",
                             json_body=body, idempotency_key=idem)
        return self._wrap_video(data)

    def enhance_script(self, script_text: str, *,
                       language: str = "",
                       intervention_level: int = 1,
                       callback_url: Optional[str] = None,
                       metadata: Optional[Mapping[str, Any]] = None,
                       idempotency_key: Optional[str] = None) -> "Video":
        """POST /v1/enhance_script — improve a DRAFT script with AI (fix
        grammar, add examples, sharpen the hook).

        Async: returns a Video with status='processing' AND
        `video.review_url` already populated (opens the Script Editor; safe to
        share before completion — page shows a spinner while enhancing).
        Poll with `.wait()` for the final enhanced script. Consumes credits.

        Args:
            script_text:        Required. The draft script to enhance.
            language:           Output language. "" (default) keeps the original.
            intervention_level: 0=segment only, 1=natural enhance (default),
                                2=maximum rewrite. See INTERVENTION_LEVELS.
        """
        if not isinstance(script_text, str) or not script_text.strip():
            raise InvalidRequestError(
                "script_text (the draft to enhance) is required.",
                code="missing_field", param="script_text")
        if intervention_level not in INTERVENTION_LEVELS:
            raise InvalidRequestError(
                f"intervention_level must be one of {list(INTERVENTION_LEVELS)} "
                f"(got {intervention_level!r}).",
                code="invalid_intervention_level", param="intervention_level")
        body: dict = {
            "script_text": script_text.strip(),
            "intervention_level": intervention_level,
        }
        if isinstance(language, str) and language.strip():
            body["language"] = language.strip()
        if callback_url:
            body["callback_url"] = callback_url
        if metadata:
            body["metadata"] = dict(metadata)
        idem = idempotency_key or str(uuid.uuid4())
        data = self._request("POST", "/v1/enhance_script",
                             json_body=body, idempotency_key=idem)
        return self._wrap_video(data)

    def suggest_ideas(self, industry_id: Optional[str] = None, *,
                      num_topics: int = 5,
                      sub_industry: Optional[str] = None,
                      user_location: Optional[str] = None,
                      idempotency_key: Optional[str] = None) -> dict:
        """POST /v1/suggest_ideas — SYNCHRONOUS. Suggest video topic ideas for an
        industry. Returns the ideas dict immediately (no polling):
        `{"object": "ideas", "industry": "...", "ideas": [{"title", "description",
        "industry", "audience", "professional", "level"}, ...]}`. Consumes credits.

        Args:
            industry_id: Industry name (e.g. "Real Estate"). Falls back to your
                         account industry if omitted.
            num_topics:  How many ideas (1–20, default 5).
        """
        body: dict = {"num_topics": int(num_topics)}
        if industry_id:
            body["industry_id"] = industry_id
        if sub_industry:
            body["sub_industry"] = sub_industry
        if user_location:
            body["user_location"] = user_location
        return self._request("POST", "/v1/suggest_ideas", json_body=body,
                             idempotency_key=idempotency_key or str(uuid.uuid4()))

    def collect_ideas(self, product_service_input: str, *,
                      sub_industry: Optional[str] = None,
                      user_location: Optional[str] = None,
                      idempotency_key: Optional[str] = None) -> dict:
        """POST /v1/collect_ideas — SYNCHRONOUS. Generate video ideas from a
        product/service description (≥10 chars). Returns the ideas dict
        immediately (same shape as suggest_ideas, no `industry`). Consumes credits.
        """
        if not isinstance(product_service_input, str) or len(product_service_input.strip()) < 10:
            raise InvalidRequestError(
                "product_service_input is required (a description ≥10 chars).",
                code="missing_field", param="product_service_input")
        body: dict = {"product_service_input": product_service_input.strip()}
        if sub_industry:
            body["sub_industry"] = sub_industry
        if user_location:
            body["user_location"] = user_location
        return self._request("POST", "/v1/collect_ideas", json_body=body,
                             idempotency_key=idempotency_key or str(uuid.uuid4()))

    def publish(self, *,
                topic_id: Optional[str] = None,
                text: Optional[str] = None,
                video_url: Optional[str] = None,
                title: Optional[str] = None,
                description: Optional[str] = None,
                photo_urls: Optional[list] = None,
                platforms: Optional[list] = None,
                scheduled_date: Optional[str] = None,
                timezone: Optional[str] = None,
                callback_url: Optional[str] = None,
                metadata: Optional[Mapping[str, Any]] = None,
                idempotency_key: Optional[str] = None) -> dict:
        """POST /v1/publish — distribute content to connected social platforms.

        Provide EXACTLY ONE content mode:
          * topic_id  — publish a WideCast video OR blog/social post you already
                        created (auto-detects article vs video; a video must be
                        rendered first — see export_video).
          * text      — post arbitrary text (optionally with photo_urls).
          * video_url — a direct video file URL to download + publish (needs title).

        `platforms` defaults to ALL connected platforms. Charges 1 credit.

        Returns the accepted-publish dict (HTTP 202):
        `{"object": "publish", "id": "...", "request_ids": [...], "status":
        "processing", "platforms": [...], "skipped": [...]}`. Publishing is
        async on the platform side — poll `get_status(request_id)` (with any of
        `request_ids`) for per-platform post URLs in `result.posts`.
        """
        modes = [bool(topic_id), bool(text), bool(video_url)]
        if modes.count(True) != 1:
            raise InvalidRequestError(
                "Provide exactly one of topic_id, text, or video_url.",
                code="invalid_publish_input")
        if video_url and not (isinstance(title, str) and title.strip()):
            raise InvalidRequestError(
                "title is required when posting an external video_url.",
                code="missing_field", param="title")
        if platforms is not None:
            if not isinstance(platforms, (list, tuple)):
                raise InvalidRequestError("platforms must be a list.",
                                          code="invalid_platforms", param="platforms")
            bad = [p for p in platforms if p not in PUBLISH_PLATFORMS]
            if bad:
                raise InvalidRequestError(
                    f"Unknown platform(s) {bad}. Valid: {list(PUBLISH_PLATFORMS)}.",
                    code="invalid_platforms", param="platforms")
        body: dict = {}
        if topic_id:
            body["topic_id"] = topic_id.strip()
        if text:
            body["text"] = text.strip()
        if video_url:
            body["video_url"] = video_url.strip()
        if title:
            body["title"] = title.strip()
        if description:
            body["description"] = description.strip()
        if photo_urls:
            body["photo_urls"] = list(photo_urls)
        if platforms:
            body["platforms"] = list(platforms)
        if scheduled_date:
            body["scheduled_date"] = scheduled_date
        if timezone:
            body["timezone"] = timezone
        if callback_url:
            body["callback_url"] = callback_url
        if metadata:
            body["metadata"] = dict(metadata)
        return self._request("POST", "/v1/publish", json_body=body,
                             idempotency_key=idempotency_key or str(uuid.uuid4()))

    # ── Read / library (Batch C — GET, synchronous, free) ───────────────────
    def _get(self, path: str, params: Optional[Mapping[str, Any]] = None) -> dict:
        """GET a read endpoint. Builds the query string into the path (the
        thin _request() is JSON-body oriented)."""
        clean = {k: v for k, v in (params or {}).items() if v is not None and v != ""}
        qs = ("?" + urlencode(clean)) if clean else ""
        return self._request("GET", path + qs)

    def list_videos(self, *, from_record: int = 0) -> dict:
        """GET /v1/videos — list the account's recent videos (20/page). Free.
        Returns `{object:"list", data:[{id, title, language, created_at}], total_count, from_record}`."""
        return self._get("/v1/videos", {"from_record": from_record})

    def search(self, query: str, *, limit: int = 10) -> dict:
        """GET /v1/search — search the account's content by keywords. Free.
        Returns `{object:"list", query, data:[{id, title, description, created_at}]}`."""
        if not isinstance(query, str) or not query.strip():
            raise InvalidRequestError("query is required.", code="missing_field", param="q")
        return self._get("/v1/search", {"q": query.strip(), "limit": limit})

    def account(self) -> dict:
        """GET /v1/account — account profile + remaining credits. Free."""
        return self._get("/v1/account")

    def analytics(self, *, period: str = "last_week",
                  start_date: Optional[str] = None,
                  end_date: Optional[str] = None) -> dict:
        """GET /v1/analytics — social analytics dashboard. Free but SLOW.
        `period` ∈ last_day|last_week|last_month|last_3months|last_year|custom."""
        return self._get("/v1/analytics",
                         {"period": period, "start_date": start_date, "end_date": end_date})

    def roadmap(self, *, cycle: int = 1) -> dict:
        """GET /v1/roadmap — the account's content roadmap. Free."""
        return self._get("/v1/roadmap", {"cycle": cycle})

    def production_plan(self, *, page: int = 0,
                        week_start: Optional[str] = None,
                        week_end: Optional[str] = None) -> dict:
        """GET /v1/production_plan — the weekly production plan. Free.
        NOTE: passing both week_start + week_end may backfill missing rows upstream."""
        return self._get("/v1/production_plan",
                         {"page": page, "week_start": week_start, "week_end": week_end})

    def foundation_videos(self, *, industry: Optional[str] = None,
                          sub_industry: Optional[str] = None, page: int = 0) -> dict:
        """GET /v1/foundation_videos — curated foundation-video templates. Free.
        `industry` falls back to your account industry."""
        return self._get("/v1/foundation_videos",
                         {"industry": industry, "sub_industry": sub_industry, "page": page})

    def recommendations(self, *, industry: Optional[str] = None, page: int = 0) -> dict:
        """GET /v1/recommendations — recommended video ideas for an industry. Free.
        Returns `{object:"ideas", industry, ideas:[…]}`."""
        return self._get("/v1/recommendations", {"industry": industry, "page": page})

    # ── Connections (Batch E — connect / accounts / configure, free) ────────
    def connect(self, *, platform: Optional[str] = None) -> dict:
        """POST /v1/connect — get an OAuth link to connect a social platform.
        Free. Returns `{object:"connect", url, expires_in, ...}` — the USER opens
        `url` to complete the connection on the web (WideCast never performs the
        OAuth itself). Omit `platform` for a link covering all supported platforms."""
        if platform is not None and platform not in PUBLISH_PLATFORMS:
            raise InvalidRequestError(
                f"Unknown platform {platform!r}. Valid: {list(PUBLISH_PLATFORMS)}.",
                code="invalid_platforms", param="platform")
        body: dict = {}
        if platform:
            body["platform"] = platform
        return self._request("POST", "/v1/connect", json_body=body)

    def accounts(self) -> dict:
        """GET /v1/accounts — list the account's connected social platforms. Free.
        Returns `{object:"list", data:[{platform, username, status, connected_at}]}`."""
        return self._get("/v1/accounts")

    def platform_settings(self) -> dict:
        """GET /v1/platform_settings — load saved per-platform publish settings. Free."""
        return self._get("/v1/platform_settings")

    def set_platform_settings(self, platform: str, settings: Mapping[str, Any]) -> dict:
        """POST /v1/platform_settings — save one platform's publish settings (e.g.
        youtube privacy, reddit subreddit, facebook page id). Free."""
        if not isinstance(platform, str) or platform not in PUBLISH_PLATFORMS:
            raise InvalidRequestError(
                f"platform must be one of {list(PUBLISH_PLATFORMS)} (got {platform!r}).",
                code="invalid_platforms", param="platform")
        if not isinstance(settings, Mapping):
            raise InvalidRequestError("settings (an object) is required.",
                                      code="missing_field", param="settings")
        return self._request("POST", "/v1/platform_settings",
                             json_body={"platform": platform, "settings": dict(settings)})

    # ── Helpers ───────────────────────────────────────────────────────────
    def _wrap_video(self, data: dict) -> Video:
        v = Video(data)
        v._client = self
        return v


# ──────────────────────────────────────────────────────────────────────────────
# Module-level helpers
# ──────────────────────────────────────────────────────────────────────────────
def _backoff(attempt: int) -> float:
    """Exponential with light jitter. 0.5s, 1s, 2s, 4s..."""
    base = min(0.5 * (2 ** attempt), 8.0)
    return base + (uuid.uuid4().int & 0xFF) / 256.0 * 0.25


def _decode_response(resp: requests.Response) -> dict:
    request_id = resp.headers.get("X-Request-Id", "")
    try:
        data = resp.json()
    except ValueError:
        if 200 <= resp.status_code < 300:
            return {}
        raise APIError(f"Non-JSON error response (HTTP {resp.status_code}): "
                       f"{resp.text[:300]}", status=resp.status_code,
                       request_id=request_id)

    if 200 <= resp.status_code < 300:
        return data

    err = (data or {}).get("error") or {}
    error_type = err.get("type") or "api_error"
    cls = _ERROR_CLASSES.get(error_type, WidecastError)
    raise cls(
        err.get("message") or f"HTTP {resp.status_code}",
        code=err.get("code", ""),
        request_id=err.get("request_id") or request_id,
        status=resp.status_code,
        doc_url=err.get("doc_url", ""),
        param=err.get("param"),
        response_json=data,
        details=err.get("details"),
    )
