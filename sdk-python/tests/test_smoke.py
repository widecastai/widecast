"""Smoke tests — no network, just sanity check SDK boots + error hierarchy is correct."""
import os
import pytest

import widecast
from widecast import (
    Widecast, Video, WidecastError, APIError,
    NotFoundError, PreconditionFailedError, RateLimitError,
    InvalidRequestError,
    SCRIPT_MIN_WORDS, SCRIPT_MAX_WORDS,
    IDEA_MIN_WORDS, IDEA_MAX_WORDS,
    BLOG_MIN_WORDS, BLOG_MAX_WORDS,
    SCRIPT_FORMATS, PLAN_SCRIPT_MIN_WORDS, PLAN_SCRIPT_MAX_WORDS,
    MEDIA_MAX_DURATION_SECONDS, MEDIA_MAX_FILE_BYTES,
    OUTPUT_TYPES, SOURCES, FACELESS_SOURCES, CONTENT_TYPES, INTERVENTION_LEVELS,
    PUBLISH_PLATFORMS, VIDEO_LENGTHS, LANGUAGES,
    CLIENT_LINK_TYPES, CLIENT_LINK_TTL_MIN, CLIENT_LINK_TTL_MAX,
    CLIENT_LINK_TTL_DEFAULT,
    __version__,
)


def test_version_string():
    assert isinstance(__version__, str)
    assert __version__.count(".") == 2  # semver


def test_public_surface_exports():
    # Lock the public surface — adding/removing requires a version bump.
    assert sorted(widecast.__all__) == sorted([
        "Widecast", "Video", "WidecastError", "APIError",
        "RateLimitError", "NotFoundError", "PreconditionFailedError",
        "InvalidRequestError",
        "SCRIPT_MIN_WORDS", "SCRIPT_MAX_WORDS",
        "IDEA_MIN_WORDS", "IDEA_MAX_WORDS",
        "BLOG_MIN_WORDS", "BLOG_MAX_WORDS",
        "SCRIPT_FORMATS", "PLAN_SCRIPT_MIN_WORDS", "PLAN_SCRIPT_MAX_WORDS",
        "MEDIA_MAX_DURATION_SECONDS", "MEDIA_MAX_FILE_BYTES",
        "FREE_TIER_MAX_SECONDS", "FREE_TIER_MAX_WORDS",
        "FREE_TIER_WORDS_PER_SECOND", "PRICING_URL",
        "OUTPUT_TYPES", "SOURCES", "FACELESS_SOURCES", "CONTENT_TYPES",
        "INTERVENTION_LEVELS", "PUBLISH_PLATFORMS", "VIDEO_LENGTHS", "LANGUAGES",
        "CLIENT_LINK_TYPES", "CLIENT_LINK_TTL_MIN", "CLIENT_LINK_TTL_MAX",
        "CLIENT_LINK_TTL_DEFAULT",
        "verify_webhook", "WebhookVerificationError",
        "__version__",
    ])


def test_script_bounds_constants_locked():
    """The 80/500 bounds are LOCKED. Server mirrors these — changing one
    side without the other breaks parity with dashboard2.py.

    A38 parity: server (WIDECAST_SCRIPT_MIN_WORDS / MAX_WORDS) + this constant
    + OpenAPI description + markdown docs + playground YAML MUST all move
    together. This test is the canary that fails when only one side is touched."""
    assert SCRIPT_MIN_WORDS == 80
    assert SCRIPT_MAX_WORDS == 500
    assert OUTPUT_TYPES == ("text", "scene", "video")


def test_idea_bounds_and_enums_locked():
    """A38 parity for source='idea' flow constants. Server mirrors these
    (WIDECAST_IDEA_MIN_WORDS / MAX_WORDS / _WIDECAST_SOURCES /
    _WIDECAST_VIDEO_LENGTHS / _WIDECAST_LANGUAGES). 5-surface drift canary."""
    assert IDEA_MIN_WORDS == 5
    assert IDEA_MAX_WORDS == 1000
    assert SOURCES == ("text", "idea", "blog",
                       "video_url", "video_file",
                       "audio_url", "audio_file")
    assert VIDEO_LENGTHS == ("short", "normal")
    assert LANGUAGES == ("English", "Vietnamese")


def test_blog_bounds_locked():
    """A48 parity for source='blog' flow constants. Server mirrors these
    (WIDECAST_BLOG_MIN_WORDS / MAX_WORDS). Same 5-surface drift canary as
    idea — blog is a generative source (auto-truncate over max, like idea)."""
    assert BLOG_MIN_WORDS == 30
    assert BLOG_MAX_WORDS == 3000


def test_plan_script_attach_locked():
    """A55 parity for script attach on /v1/production_plan/add. Server mirrors
    these (WIDECAST_PLAN_SCRIPT_MIN_WORDS / MAX_WORDS / _SCRIPT_FORMAT_KEYS).
    NOTE: distinct from SCRIPT_MIN/MAX_WORDS (80/500, create_video
    source='text') — a plan-attached script may run up to 1000 words.
    5-surface drift canary (server + OpenAPI + SDKs + docs + playground)."""
    assert SCRIPT_FORMATS == ("VE", "QA", "POV", "CS", "MB")
    assert PLAN_SCRIPT_MIN_WORDS == 80
    assert PLAN_SCRIPT_MAX_WORDS == 1000


def test_plan_script_attach_prevalidation():
    """Client-side pre-validation of scripts mirrors the server's
    _wc_validate_plan_scripts (same error codes) — bad payloads never hit
    the wire."""
    c = Widecast(api_key="wc_live_test")
    ok = " ".join(["word"] * 80)

    with pytest.raises(InvalidRequestError) as e:
        c.add_to_production_plan("idea", scripts=[])
    assert e.value.code == "invalid_scripts"

    with pytest.raises(InvalidRequestError) as e:
        c.add_to_production_plan("idea", scripts=[{"format": "XX", "text": ok}])
    assert e.value.code == "invalid_scripts"

    with pytest.raises(InvalidRequestError) as e:
        c.add_to_production_plan("idea", scripts=[
            {"format": "VE", "text": ok}, {"format": "VE", "text": ok}])
    assert e.value.code == "invalid_scripts"

    with pytest.raises(InvalidRequestError) as e:
        c.add_to_production_plan("idea", scripts=[
            {"format": "VE", "text": " ".join(["w"] * 79)}])
    assert e.value.code == "script_too_short"

    with pytest.raises(InvalidRequestError) as e:
        c.add_to_production_plan("idea", scripts=[
            {"format": "VE", "text": " ".join(["w"] * 1001)}])
    assert e.value.code == "script_too_long"

    with pytest.raises(InvalidRequestError) as e:
        c.add_to_production_plan("idea", scripts=[{"format": "VE", "text": ok}],
                                 recommended_format="QA")
    assert e.value.code == "invalid_recommended_format"


def test_media_caps_locked():
    """A49 parity for media-ingest caps. Server mirrors these
    (WIDECAST_MEDIA_MAX_DURATION_SECONDS / MAX_FILE_BYTES). Duration = 5 min
    (all media, server-enforced); size = 100 MB (uploads only, also
    pre-validated client-side → file_too_large)."""
    assert MEDIA_MAX_DURATION_SECONDS == 300
    assert MEDIA_MAX_FILE_BYTES == 100 * 1024 * 1024


def test_verify_webhook_accepts_valid_signature():
    import hmac as _hmac, hashlib as _hashlib, json as _json
    from widecast import verify_webhook
    secret = "wc_live_secret"
    body = _json.dumps({"event_id": "evt_x", "event_type": "video.completed", "data": {"id": "widecast_x"}})
    ts = str(int(__import__("time").time()))
    sig = _hmac.new(secret.encode(), f"{ts}.{body}".encode(), _hashlib.sha256).hexdigest()
    header = f"t={ts},v1={sig}"
    event = verify_webhook(body, header, secret=secret)
    assert event["event_type"] == "video.completed"


def test_verify_webhook_rejects_bad_signature():
    from widecast import verify_webhook, WebhookVerificationError
    body = '{"event_id":"evt_x"}'
    ts = str(int(__import__("time").time()))
    header = f"t={ts},v1=deadbeef"
    with pytest.raises(WebhookVerificationError):
        verify_webhook(body, header, secret="wc_live_secret")


def test_verify_webhook_rejects_stale_timestamp():
    import hmac as _hmac, hashlib as _hashlib
    from widecast import verify_webhook, WebhookVerificationError
    secret = "wc_live_secret"
    body = '{"a":1}'
    stale_ts = str(int(__import__("time").time()) - 3600)  # 1 hour ago
    sig = _hmac.new(secret.encode(), f"{stale_ts}.{body}".encode(), _hashlib.sha256).hexdigest()
    header = f"t={stale_ts},v1={sig}"
    with pytest.raises(WebhookVerificationError):
        verify_webhook(body, header, secret=secret)


def test_client_init_default_base_url():
    c = Widecast(api_key="wc_live_dummy")
    assert c.api_key == "wc_live_dummy"
    assert c.base_url.startswith("https://")
    assert c.user_agent.startswith("widecast-python/")
    assert c.timeout > 0
    assert c.max_retries >= 0


def test_client_reads_env_api_key(monkeypatch):
    monkeypatch.setenv("WIDECAST_API_KEY", "wc_live_env_val")
    c = Widecast()
    assert c.api_key == "wc_live_env_val"


def test_client_reads_env_base_url(monkeypatch):
    monkeypatch.setenv("WIDECAST_BASE_URL", "https://example.invalid/api")
    c = Widecast(api_key="dummy")  # env read at __init__, no reload needed
    assert "example.invalid" in c.base_url


def test_get_status_rejects_empty_id():
    c = Widecast(api_key="dummy")
    with pytest.raises(InvalidRequestError) as ei:
        c.get_status("")
    assert ei.value.code == "invalid_id"


def test_client_does_not_expose_get_video_method():
    # Removed in v0.1.0 — surface is /v1/status only.
    c = Widecast(api_key="dummy")
    assert not hasattr(c, "get_video")


def test_error_hierarchy():
    for cls in (APIError, NotFoundError, PreconditionFailedError,
                RateLimitError, InvalidRequestError):
        assert issubclass(cls, WidecastError)


def test_telemetry_header_emitted_by_default():
    c = Widecast(api_key="dummy")
    headers = c._headers()
    assert "X-Widecast-Telemetry" in headers
    assert headers["X-Widecast-Telemetry"].startswith("sdk=python/")


def test_telemetry_header_suppressed_via_env(monkeypatch):
    monkeypatch.setenv("WIDECAST_DISABLE_TELEMETRY", "1")
    c = Widecast(api_key="dummy")
    headers = c._headers()
    assert "X-Widecast-Telemetry" not in headers


def test_video_dict_access_processing():
    v = Video({
        "object": "status", "id": "widecastabc123def456gh",
        "topic_id": "widecastabc123def456gh", "type": "video",
        "status": "processing", "stage": "step_0", "progress": 0.30,
        "details": {"step": 0, "status": "", "notes": ""},
        "result": None, "error": None,
        "metadata": {}, "usage": None,
        "links": {"self": "/v1/status/widecastabc123def456gh"},
        "meta": {"request_id": "req_x", "widecast_version": "0.1.0"},
    })
    assert v.id == "widecastabc123def456gh"
    assert v.topic_id == "widecastabc123def456gh"
    assert v.status == "processing"     # top-level enum
    assert v.details["status"] == ""    # legacy free-form (deliberate clash)
    assert v.details["step"] == 0
    assert v.review_url is None
    assert v.error is None
    assert v.is_terminal is False


def test_video_details_clash_documented():
    """`details.status` is a free-form legacy string, NOT mirroring top-level."""
    v = Video({
        "status": "processing",
        "details": {"step": 0, "status": "Avatar videos downloaded", "notes": "ok"},
    })
    # Top-level: our enum value
    assert v.status == "processing"
    # Sub-field: legacy free-form string (CLASH is intentional)
    assert v.details["status"] == "Avatar videos downloaded"


def test_video_dict_access_completed():
    v = Video({
        "object": "status", "id": "widecastabc123def456gh",
        "topic_id": "widecastabc123def456gh", "type": "video",
        "status": "completed", "stage": "scenes_ready_for_review", "progress": 1.0,
        "error": None, "metadata": {}, "usage": None,
        "result": {
            "review_url": "https://widecast.ai/#scene_editor?topic_id=widecastabc123def456gh",
        },
        "links": {"self": "/v1/status/widecastabc123def456gh"},
        "meta": {"request_id": "req_x", "widecast_version": "0.1.0"},
    })
    assert v.is_terminal is True
    assert v.review_url == "https://widecast.ai/#scene_editor?topic_id=widecastabc123def456gh"
    assert v.topic_id == v.id


def test_video_has_no_script_or_scenes_count_accessors():
    """v0.1.0 result is minimal — script + scenes_count were dropped from SDK."""
    v = Video({"id": "x", "result": {"review_url": "y"}})
    assert not hasattr(v, "scenes_count")
    assert not hasattr(v, "script")


def test_create_video_rejects_missing_script_text():
    c = Widecast(api_key="dummy")
    with pytest.raises(InvalidRequestError) as ei:
        c.create_video(script_text="")
    assert ei.value.code == "missing_field"
    assert ei.value.param == "script_text"


def _make_script(word_count):
    return " ".join(["word"] * word_count)


def _offline_client():
    """Client pointed at a dead local port. For tests that EXPECT
    pre-validation to PASS — the call then reaches the network and fails
    fast with a connection error (no real server, no credits spent). This
    keeps the suite offline (memory rule: never hit live dashboard2.py) and
    deterministic (not dependent on what's deployed)."""
    return Widecast(api_key="dummy",
                    base_url="http://127.0.0.1:1",
                    max_retries=0)


def test_create_video_rejects_script_too_short():
    c = Widecast(api_key="dummy")
    with pytest.raises(InvalidRequestError) as ei:
        c.create_video(script_text=_make_script(SCRIPT_MIN_WORDS - 1))
    assert ei.value.code == "script_too_short"
    assert ei.value.param == "script_text"


def test_create_video_rejects_script_too_long():
    c = Widecast(api_key="dummy")
    with pytest.raises(InvalidRequestError) as ei:
        c.create_video(script_text=_make_script(SCRIPT_MAX_WORDS + 1))
    assert ei.value.code == "script_too_long"
    assert ei.value.param == "script_text"


def test_create_video_rejects_invalid_source():
    c = Widecast(api_key="dummy")
    with pytest.raises(InvalidRequestError) as ei:
        c.create_video(script_text=_make_script(150), source="bogus")
    assert ei.value.code == "invalid_source"
    assert ei.value.param == "source"


def test_faceless_sources_locked():
    """A38 canary: faceless scope must match the server's
    _WIDECAST_FACELESS_SOURCES — text/idea/blog AND audio sources
    (audio_url; A52 2026-06-15). Video sources still excluded
    (the footage IS the visuals)."""
    assert FACELESS_SOURCES == ("text", "idea", "blog", "audio_url")


def test_create_video_rejects_faceless_non_bool():
    c = Widecast(api_key="dummy")
    with pytest.raises(InvalidRequestError) as ei:
        c.create_video(script_text=_make_script(150), faceless="yes")
    assert ei.value.code == "invalid_faceless"
    assert ei.value.param == "faceless"


def test_create_video_rejects_faceless_with_output_type_text():
    c = Widecast(api_key="dummy")
    with pytest.raises(InvalidRequestError) as ei:
        c.create_video(source="idea",
                       idea_text="a quick tip about saving money for retirement",
                       output_type="text", faceless=True)
    assert ei.value.code == "invalid_faceless"
    assert ei.value.param == "faceless"


def test_create_video_rejects_faceless_with_media_source():
    c = Widecast(api_key="dummy")
    with pytest.raises(InvalidRequestError) as ei:
        c.create_video(source="video_url", faceless=True)
    assert ei.value.code == "invalid_faceless"
    assert ei.value.param == "faceless"


def test_create_video_accepts_faceless_true_with_scene():
    """faceless=True with source=text + output_type=scene must PASS validation
    (the failure here is the network call, not InvalidRequestError)."""
    c = _offline_client()
    with pytest.raises(WidecastError) as ei:
        c.create_video(script_text=_make_script(150), faceless=True)
    assert not isinstance(ei.value, InvalidRequestError)


# ── /v1/create_content + /v1/enhance_script (Batch A async content) ─────────

def test_content_types_locked():
    """A38 canary: friendly content_type enum must match the server map."""
    assert CONTENT_TYPES == ("blog", "facebook", "x", "linkedin")


def test_intervention_levels_locked():
    assert INTERVENTION_LEVELS == (0, 1, 2)


def test_create_content_rejects_missing_content():
    c = Widecast(api_key="dummy")
    with pytest.raises(InvalidRequestError) as ei:
        c.create_content(content="")
    assert ei.value.code == "missing_field"
    assert ei.value.param == "content"


def test_create_content_rejects_invalid_content_type():
    c = Widecast(api_key="dummy")
    with pytest.raises(InvalidRequestError) as ei:
        c.create_content(content="https://example.com/a", content_type="tiktok")
    assert ei.value.code == "invalid_content_type"
    assert ei.value.param == "content_type"


def test_create_content_accepts_valid():
    """Valid create_content passes validation → network failure, not InvalidRequestError."""
    c = _offline_client()
    with pytest.raises(WidecastError) as ei:
        c.create_content(content="https://example.com/a", content_type="linkedin", language="English")
    assert not isinstance(ei.value, InvalidRequestError)


# enhance_script() was withdrawn from the SDK 2026-06-21 (Round 28) —
# its smoke tests retired. REST /v1/enhance_script still serves the UI.

# ── /v1/create_image + /v1/search_broll (Round 28 — AI-agent assets) ────────

def test_create_image_rejects_missing_prompt():
    c = Widecast(api_key="dummy")
    with pytest.raises(InvalidRequestError) as ei:
        c.create_image(prompt="")
    assert ei.value.code == "missing_field"
    assert ei.value.param == "prompt"


def test_create_image_rejects_invalid_ratio():
    c = Widecast(api_key="dummy")
    with pytest.raises(InvalidRequestError) as ei:
        c.create_image(prompt="a sunset over mountains", ratio="ultrawide")
    assert ei.value.code == "invalid_ratio"
    assert ei.value.param == "ratio"


def test_create_image_rejects_invalid_count():
    c = Widecast(api_key="dummy")
    with pytest.raises(InvalidRequestError) as ei:
        c.create_image(prompt="a sunset over mountains", count=10)
    assert ei.value.code == "invalid_count"
    assert ei.value.param == "count"


def test_create_image_accepts_valid():
    c = _offline_client()
    with pytest.raises(WidecastError) as ei:
        c.create_image(prompt="a sunset over mountains", ratio="portrait", count=2)
    assert not isinstance(ei.value, InvalidRequestError)


def test_search_broll_rejects_missing_keyword():
    c = Widecast(api_key="dummy")
    with pytest.raises(InvalidRequestError) as ei:
        c.search_broll(keyword="", kind="video")
    assert ei.value.code == "missing_field"
    assert ei.value.param == "keyword"


def test_search_broll_rejects_invalid_kind():
    c = Widecast(api_key="dummy")
    with pytest.raises(InvalidRequestError) as ei:
        c.search_broll(keyword="ocean waves", kind="gif")
    assert ei.value.code == "invalid_kind"
    assert ei.value.param == "kind"


def test_search_broll_rejects_invalid_limit():
    c = Widecast(api_key="dummy")
    with pytest.raises(InvalidRequestError) as ei:
        c.search_broll(keyword="ocean waves", kind="video", limit=999)
    assert ei.value.code == "invalid_limit"
    assert ei.value.param == "limit"


def test_search_broll_accepts_valid():
    c = _offline_client()
    with pytest.raises(WidecastError) as ei:
        c.search_broll(keyword="ocean waves", kind="image", limit=5)
    assert not isinstance(ei.value, InvalidRequestError)


# ── /v1/collect_ideas (Batch A sync ideas) ──────────────────────────────────

def test_collect_ideas_rejects_short_input():
    c = Widecast(api_key="dummy")
    with pytest.raises(InvalidRequestError) as ei:
        c.collect_ideas(product_service_input="too short")
    assert ei.value.code == "missing_field"
    assert ei.value.param == "product_service_input"


def test_collect_ideas_accepts_valid():
    c = _offline_client()
    with pytest.raises(WidecastError) as ei:
        c.collect_ideas(product_service_input="A budgeting app for freelancers with tax estimates")
    assert not isinstance(ei.value, InvalidRequestError)


# ── /v1/modify_scene (sync, no credit) ──────────────────────────────────────

def test_modify_scene_rejects_empty_id():
    c = Widecast(api_key="dummy")
    with pytest.raises(InvalidRequestError) as ei:
        c.modify_scene("", by="voice_file", value="XcR0k",
                       fields=[{"field_name": "mediaUrl",
                                "value": "https://x.test/a.jpg"}])
    assert ei.value.code == "invalid_id"


def test_modify_scene_rejects_bad_by():
    c = Widecast(api_key="dummy")
    with pytest.raises(InvalidRequestError) as ei:
        c.modify_scene("widecastabc123def456", by="title", value="X",
                       fields=[{"field_name": "mediaUrl",
                                "value": "https://x.test/a.jpg"}])
    assert ei.value.code == "invalid_by"


def test_modify_scene_rejects_empty_fields():
    c = Widecast(api_key="dummy")
    with pytest.raises(InvalidRequestError) as ei:
        c.modify_scene("widecastabc123def456", by="voice_file", value="X",
                       fields=[])
    assert ei.value.code == "missing_field"
    assert ei.value.param == "fields"


def test_modify_scene_rejects_missing_value():
    c = Widecast(api_key="dummy")
    with pytest.raises(InvalidRequestError) as ei:
        c.modify_scene("widecastabc123def456", by="voice_file", value="  ",
                       fields=[{"field_name": "mediaUrl",
                                "value": "https://x.test/a.jpg"}])
    assert ei.value.code == "missing_field"
    assert ei.value.param == "value"


def test_modify_scene_accepts_valid():
    """Valid request reaches the network layer (not blocked by client-side validation)."""
    c = _offline_client()
    with pytest.raises(WidecastError) as ei:
        c.modify_scene("widecastabc123def456", by="voice_file", value="XcR0k",
                       fields=[{"field_name": "mediaUrl",
                                "value": "https://x.test/a.jpg"}])
    assert not isinstance(ei.value, InvalidRequestError)


def test_client_exposes_modify_scene():
    c = Widecast(api_key="dummy")
    assert callable(getattr(c, "modify_scene", None))


# ── /v1/publish (Batch B distribution) ──────────────────────────────────────

def test_publish_platforms_locked():
    """A38 canary: publish platform vocabulary mirrors the server set."""
    assert PUBLISH_PLATFORMS == ("youtube", "tiktok", "instagram", "facebook",
                                 "linkedin", "x", "threads", "pinterest",
                                 "reddit", "bluesky", "google_business")


def test_publish_requires_exactly_one_mode():
    c = Widecast(api_key="dummy")
    # zero modes
    with pytest.raises(InvalidRequestError) as ei:
        c.publish(platforms=["x"])
    assert ei.value.code == "invalid_publish_input"
    # two modes
    with pytest.raises(InvalidRequestError) as ei2:
        c.publish(topic_id="widecast123abc456def", text="hi there")
    assert ei2.value.code == "invalid_publish_input"


def test_publish_external_video_requires_title():
    c = Widecast(api_key="dummy")
    with pytest.raises(InvalidRequestError) as ei:
        c.publish(video_url="https://cdn.example.com/clip.mp4")
    assert ei.value.code == "missing_field"
    assert ei.value.param == "title"


def test_publish_rejects_unknown_platform():
    c = Widecast(api_key="dummy")
    with pytest.raises(InvalidRequestError) as ei:
        c.publish(text="Launch day!", platforms=["myspace"])
    assert ei.value.code == "invalid_platforms"
    assert ei.value.param == "platforms"


def test_publish_accepts_valid():
    """Valid publish passes client validation → network failure, not InvalidRequestError."""
    c = _offline_client()
    with pytest.raises(WidecastError) as ei:
        c.publish(text="We just shipped v2 — try it free today!")
    assert not isinstance(ei.value, InvalidRequestError)


# ── Batch C read/library (GET, free) ────────────────────────────────────────

# search() was withdrawn from the SDK 2026-06-21 (Round 29) — REST /v1/search
# still serves the UI. Its smoke tests retired in the same round.


def test_video_data_requires_id():
    c = Widecast(api_key="dummy")
    with pytest.raises(InvalidRequestError) as ei:
        c.video_data("")
    assert ei.value.code == "missing_field"
    assert ei.value.param == "video_id"


def test_video_data_accepts_valid():
    c = _offline_client()
    with pytest.raises(WidecastError) as ei:
        c.video_data("widecastABCDEFGHIJKL")
    assert not isinstance(ei.value, InvalidRequestError)


def test_read_methods_exist_and_are_callable():
    """The read methods exist on the client (server reuse verified live).
    search() withdrawn 2026-06-21; video_data() added the same round.
    recommendations() withdrawn 2026-07-13 (Round 30); foundation_videos()
    re-promoted the same round."""
    c = Widecast(api_key="dummy")
    for name in ("list_videos", "account", "analytics", "roadmap",
                 "production_plan", "foundation_videos", "video_data"):
        assert callable(getattr(c, name)), name


def test_recommendations_withdrawn():
    """recommendations() was withdrawn from the SDK 2026-07-13 (Round 30)."""
    c = Widecast(api_key="dummy")
    assert not hasattr(c, "recommendations")


def test_account_passes_validation():
    """account() has no required args → reaches the network (offline → APIError)."""
    c = _offline_client()
    with pytest.raises(WidecastError) as ei:
        c.account()
    assert not isinstance(ei.value, InvalidRequestError)


# ── Batch E connections (accounts / configure, free) — connect() was
#    withdrawn from the SDK 2026-06-21 (Round 28); REST /v1/connect still
#    serves the UI but agents are pointed at https://widecast.ai/#setup. ────

def test_set_platform_settings_validates():
    c = Widecast(api_key="dummy")
    with pytest.raises(InvalidRequestError) as ei:
        c.set_platform_settings("myspace", {"a": 1})
    assert ei.value.code == "invalid_platforms"


def test_connection_methods_exist():
    c = Widecast(api_key="dummy")
    for name in ("accounts", "platform_settings", "set_platform_settings"):
        assert callable(getattr(c, name)), name


def test_create_video_idea_rejects_missing_idea_text():
    c = Widecast(api_key="dummy")
    with pytest.raises(InvalidRequestError) as ei:
        c.create_video(source="idea", idea_text="")
    assert ei.value.code == "missing_idea_text"
    assert ei.value.param == "idea_text"


def test_create_video_idea_rejects_too_short():
    c = Widecast(api_key="dummy")
    with pytest.raises(InvalidRequestError) as ei:
        c.create_video(source="idea",
                       idea_text=_make_script(IDEA_MIN_WORDS - 1))
    assert ei.value.code == "idea_too_short"
    assert ei.value.param == "idea_text"


def test_create_video_idea_accepts_over_max_without_reject():
    """source=idea: >IDEA_MAX_WORDS is auto-truncated server-side, NOT
    rejected client-side. SDK must let the request through (server handles
    truncation + surfaces details.idea_truncated_from)."""
    c = _offline_client()
    long_idea = _make_script(IDEA_MAX_WORDS + 500)
    try:
        c.create_video(source="idea", idea_text=long_idea)
    except InvalidRequestError as e:
        # Should NOT raise for "too long" — only network/missing_field, etc.
        assert e.code != "idea_too_long", \
            "SDK incorrectly rejects oversized idea_text; should let server truncate"
    except Exception:
        # Network error is expected (we have no real server) — that's fine,
        # what matters is we didn't pre-reject for length.
        pass


def test_create_video_idea_rejects_invalid_language():
    c = Widecast(api_key="dummy")
    with pytest.raises(InvalidRequestError) as ei:
        c.create_video(source="idea",
                       idea_text=_make_script(20),
                       language="Klingon")
    assert ei.value.code == "invalid_language"
    assert ei.value.param == "language"


def test_create_video_idea_rejects_invalid_video_length():
    c = Widecast(api_key="dummy")
    with pytest.raises(InvalidRequestError) as ei:
        c.create_video(source="idea",
                       idea_text=_make_script(20),
                       video_length="epic")
    assert ei.value.code == "invalid_video_length"
    assert ei.value.param == "video_length"


def test_create_video_idea_rejects_non_bool_research_enabled():
    c = Widecast(api_key="dummy")
    with pytest.raises(InvalidRequestError) as ei:
        c.create_video(source="idea",
                       idea_text=_make_script(20),
                       research_enabled="yes")  # type: ignore[arg-type]
    assert ei.value.code == "invalid_research_enabled"
    assert ei.value.param == "research_enabled"


def test_create_video_blog_rejects_missing_blog_text():
    c = Widecast(api_key="dummy")
    with pytest.raises(InvalidRequestError) as ei:
        c.create_video(source="blog", blog_text="")
    assert ei.value.code == "missing_blog_text"
    assert ei.value.param == "blog_text"


def test_create_video_blog_rejects_too_short():
    c = Widecast(api_key="dummy")
    with pytest.raises(InvalidRequestError) as ei:
        c.create_video(source="blog",
                       blog_text=_make_script(BLOG_MIN_WORDS - 1))
    assert ei.value.code == "blog_too_short"
    assert ei.value.param == "blog_text"


def test_create_video_blog_accepts_over_max_without_reject():
    """source=blog: >BLOG_MAX_WORDS is auto-truncated server-side, NOT
    rejected client-side (A40 asymmetric bounds — blog is interpretive like
    idea). SDK must let the request through (server truncates + surfaces
    details.input_truncated_from)."""
    c = _offline_client()
    long_blog = _make_script(BLOG_MAX_WORDS + 500)
    try:
        c.create_video(source="blog", blog_text=long_blog)
    except InvalidRequestError as e:
        assert e.code != "blog_too_long", \
            "SDK incorrectly rejects oversized blog_text; should let server truncate"
    except Exception:
        pass  # network error fine — pre-validation is what we test


def test_create_video_blog_text_output_passes_prevalidation():
    """A48: source='blog' + output_type='text' is valid — stop after the AI
    turns the article into a script. Only network failure expected."""
    c = _offline_client()
    try:
        c.create_video(source="blog", blog_text=_make_script(40),
                       output_type="text")
    except InvalidRequestError as e:
        assert e.code != "invalid_output_type", \
            "SDK wrongly rejects source=blog + output_type=text"
    except Exception:
        pass  # network error fine — pre-validation is what we test


def test_create_video_video_url_rejects_missing_url():
    c = Widecast(api_key="dummy")
    with pytest.raises(InvalidRequestError) as ei:
        c.create_video(source="video_url")
    assert ei.value.code == "missing_video_url"
    assert ei.value.param == "video_url"


def test_create_video_audio_url_rejects_missing_url():
    c = Widecast(api_key="dummy")
    with pytest.raises(InvalidRequestError) as ei:
        c.create_video(source="audio_url")
    assert ei.value.code == "missing_audio_url"
    assert ei.value.param == "audio_url"


def test_create_video_video_file_rejects_missing_file():
    c = Widecast(api_key="dummy")
    with pytest.raises(InvalidRequestError) as ei:
        c.create_video(source="video_file")
    assert ei.value.code == "missing_media_file"
    assert ei.value.param == "video_file"


def test_create_video_audio_file_rejects_missing_file():
    c = Widecast(api_key="dummy")
    with pytest.raises(InvalidRequestError) as ei:
        c.create_video(source="audio_file")
    assert ei.value.code == "missing_media_file"
    assert ei.value.param == "audio_file"


def test_create_video_video_url_text_output_passes_prevalidation():
    """A49/A50: source='video_url' + output_type='text' (Remake) is valid —
    extract the transcript only. Only network failure expected (no live server)."""
    c = _offline_client()
    try:
        c.create_video(source="video_url",
                       video_url="https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                       output_type="text")
    except InvalidRequestError as e:
        assert e.code not in ("invalid_output_type", "missing_video_url"), \
            "SDK wrongly rejects source=video_url + output_type=text"
    except Exception:
        pass  # network error fine — pre-validation is what we test


def test_create_video_audio_url_scene_passes_prevalidation():
    """A49: source='audio_url' (Audio-to-Video) passes pre-validation."""
    c = _offline_client()
    try:
        c.create_video(source="audio_url",
                       audio_url="https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                       output_type="scene")
    except InvalidRequestError as e:
        assert e.code != "missing_audio_url", \
            "SDK wrongly rejects a valid audio_url"
    except Exception:
        pass


class _FakeBigFile:
    """A file-like that REPORTS a size via seek/tell without allocating it —
    lets us test the 100 MB pre-check without a real 100 MB buffer."""
    def __init__(self, size):
        self._size = size
        self._pos = 0
    def tell(self):
        return self._pos
    def seek(self, offset, whence=0):
        if whence == os.SEEK_END:
            self._pos = self._size + offset
        elif whence == os.SEEK_SET:
            self._pos = offset
        else:
            self._pos += offset
        return self._pos


def test_create_video_video_file_rejects_oversized():
    """A49: source=video_file over MEDIA_MAX_FILE_BYTES is rejected
    client-side (file_too_large) before any bytes are sent."""
    c = Widecast(api_key="dummy")
    big = _FakeBigFile(MEDIA_MAX_FILE_BYTES + 1)
    with pytest.raises(InvalidRequestError) as ei:
        c.create_video(source="video_file", video_file=big)
    assert ei.value.code == "file_too_large"
    assert ei.value.param == "video_file"


def test_create_video_audio_file_under_cap_passes_prevalidation():
    """A49: an under-cap file-like passes the size pre-check (only network
    failure expected — no live server)."""
    c = _offline_client()
    small = _FakeBigFile(1024)  # 1 KB
    try:
        c.create_video(source="audio_file", audio_file=small)
    except InvalidRequestError as e:
        assert e.code != "file_too_large", \
            "SDK wrongly rejected an under-cap file"
    except Exception:
        pass  # network/read error fine — pre-validation is what we test


def test_create_video_text_still_works_without_source_kwarg():
    """Backward-compat: existing callers pass only script_text positionally
    and don't specify source. Must continue to work (default source='text')."""
    c = _offline_client()
    # Pre-validation should pass; only network call would fail.
    try:
        c.create_video(_make_script(150))
    except InvalidRequestError as e:
        assert e.code not in (
            "missing_field", "script_too_short", "script_too_long",
            "invalid_source",
        ), f"backward-compat broken: SDK pre-validation raised {e.code}"
    except Exception:
        pass


def test_create_video_rejects_invalid_output_type():
    c = Widecast(api_key="dummy")
    with pytest.raises(InvalidRequestError) as ei:
        c.create_video(script_text=_make_script(150), output_type="bogus")
    assert ei.value.code == "invalid_output_type"
    assert ei.value.param == "output_type"


def test_create_video_rejects_text_output_for_source_text():
    """A46: output_type='text' + source='text' is a meaningless combo —
    you already supplied the script. SDK rejects before the round-trip."""
    c = Widecast(api_key="dummy")
    with pytest.raises(InvalidRequestError) as ei:
        c.create_video(script_text=_make_script(150),
                       source="text", output_type="text")
    assert ei.value.code == "invalid_output_type"
    assert ei.value.param == "output_type"


def test_create_video_idea_text_output_passes_prevalidation():
    """A46: source='idea' + output_type='text' is valid — stop after the
    AI writes the script. Only network failure expected (no live server)."""
    c = _offline_client()
    try:
        c.create_video(source="idea", idea_text=_make_script(20),
                       output_type="text")
    except InvalidRequestError as e:
        assert e.code != "invalid_output_type", \
            "SDK wrongly rejects source=idea + output_type=text"
    except Exception:
        pass  # network error fine — pre-validation is what we test


def test_export_video_rejects_empty_id():
    c = Widecast(api_key="dummy")
    with pytest.raises(InvalidRequestError) as ei:
        c.export_video("")
    assert ei.value.code == "invalid_id"


def test_client_exposes_export_video():
    c = Widecast(api_key="dummy")
    assert callable(getattr(c, "export_video", None))


def test_video_video_url_unwrapper():
    """video_url is None unless result.video_url is populated."""
    v_scene = Video({
        "status": "completed",
        "result": {"review_url": "https://review/x"},
    })
    assert v_scene.video_url is None
    v_full = Video({
        "status": "completed",
        "result": {
            "review_url": "https://review/x",
            "video_url": "https://widecast.ai/exports/x/final.mp4",
        },
    })
    assert v_full.video_url == "https://widecast.ai/exports/x/final.mp4"


def test_video_dict_access_failed():
    v = Video({
        "object": "status", "id": "widecastabc123def456gh",
        "topic_id": "widecastabc123def456gh", "type": "video",
        "status": "failed", "stage": "step_0", "progress": 0.30,
        "result": None, "metadata": {}, "usage": None,
        "error": {"code": "credit_exhausted", "message": "Out of credits."},
        "links": {"self": "/v1/status/widecastabc123def456gh"},
        "meta": {"request_id": "req_x", "widecast_version": "0.1.0"},
    })
    assert v.is_terminal is True
    assert v.error == {"code": "credit_exhausted", "message": "Out of credits."}
    assert v.review_url is None


# ── /v1/client_link/send (no-login client "magic links") ────────────────────

def test_client_link_constants_locked():
    """Parity canary: the link_type enum + TTL bounds must match the server
    (/v1/client_link/send + WIDECAST_CLIENT_LINK_TTL_* in dashboard2.py).
    Changing one side without the other breaks parity."""
    assert CLIENT_LINK_TYPES == ("record", "content_plan", "setup",
                                 "social_dashboard", "publish_schedule")
    assert CLIENT_LINK_TTL_MIN == 1
    assert CLIENT_LINK_TTL_MAX == 30
    assert CLIENT_LINK_TTL_DEFAULT == 7


def test_client_exposes_send_client_link():
    assert callable(getattr(Widecast(api_key="dummy"), "send_client_link", None))


def test_send_client_link_rejects_invalid_link_type():
    c = Widecast(api_key="dummy")
    with pytest.raises(InvalidRequestError) as ei:
        c.send_client_link("dashboard")
    assert ei.value.code == "invalid_link_type"
    assert ei.value.param == "link_type"


def test_send_client_link_record_requires_topic_id():
    c = Widecast(api_key="dummy")
    with pytest.raises(InvalidRequestError) as ei:
        c.send_client_link("record")
    assert ei.value.code == "missing_field"
    assert ei.value.param == "topic_id"


def test_send_client_link_rejects_bad_topic_id():
    c = Widecast(api_key="dummy")
    for bad in ("bad id!", "x" * 65):
        with pytest.raises(InvalidRequestError) as ei:
            c.send_client_link("record", topic_id=bad)
        assert ei.value.code == "invalid_topic_id"
        assert ei.value.param == "topic_id"


def test_send_client_link_rejects_ttl_out_of_bounds():
    c = Widecast(api_key="dummy")
    for bad in (CLIENT_LINK_TTL_MIN - 1, CLIENT_LINK_TTL_MAX + 1, "7"):
        with pytest.raises(InvalidRequestError) as ei:
            c.send_client_link("setup", ttl_days=bad)
        assert ei.value.code == "invalid_ttl_days"
        assert ei.value.param == "ttl_days"


def test_send_client_link_rejects_bad_channels():
    c = Widecast(api_key="dummy")
    # Not an object
    with pytest.raises(InvalidRequestError) as ei:
        c.send_client_link("content_plan", channels=["telegram"])
    assert ei.value.code == "invalid_channels"
    assert ei.value.param == "channels"
    # Unknown channel key (recipients are server-resolved — no phone/email)
    with pytest.raises(InvalidRequestError) as ei:
        c.send_client_link("content_plan", channels={"whatsapp": True})
    assert ei.value.code == "invalid_channels"
    assert ei.value.param == "channels"


def test_send_client_link_rejects_invalid_page():
    c = Widecast(api_key="dummy")
    with pytest.raises(InvalidRequestError) as ei:
        c.send_client_link("setup", page="index.html")
    assert ei.value.code == "invalid_page"
    assert ei.value.param == "page"


def test_send_client_link_mint_only_passes_prevalidation():
    """Mint-only (channels omitted) content_plan link must PASS validation
    (the failure here is the network call, not InvalidRequestError)."""
    c = _offline_client()
    with pytest.raises(WidecastError) as ei:
        c.send_client_link("content_plan")
    assert not isinstance(ei.value, InvalidRequestError)


def test_send_client_link_record_with_channels_passes_prevalidation():
    """record + topic_id + channels + ttl at the max + page must all PASS
    pre-validation → network failure, not InvalidRequestError."""
    c = _offline_client()
    with pytest.raises(WidecastError) as ei:
        c.send_client_link("record", topic_id="widecastab12",
                           channels={"telegram": True, "sms": False,
                                     "email": True},
                           ttl_days=CLIENT_LINK_TTL_MAX,
                           page="record2.html")
    assert not isinstance(ei.value, InvalidRequestError)
