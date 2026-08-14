/**
 * Smoke tests — no network, just sanity check SDK boots + error hierarchy is correct.
 */
import { describe, it, expect } from "vitest";
import Widecast, {
  Video, VERSION,
  WidecastError, APIError, NotFoundError, PreconditionFailedError,
  RateLimitError, InvalidRequestError,
  SCRIPT_MIN_WORDS, SCRIPT_MAX_WORDS,
  IDEA_MIN_WORDS, IDEA_MAX_WORDS,
  BLOG_MIN_WORDS, BLOG_MAX_WORDS,
  SCRIPT_FORMATS, PLAN_SCRIPT_MIN_WORDS, PLAN_SCRIPT_MAX_WORDS,
  MEDIA_MAX_DURATION_SECONDS, MEDIA_MAX_FILE_BYTES,
  OUTPUT_TYPES, SOURCES, FACELESS_SOURCES, CONTENT_TYPES, INTERVENTION_LEVELS,
  PUBLISH_PLATFORMS, VIDEO_LENGTHS, LANGUAGES,
  CLIENT_LINK_TYPES, CLIENT_LINK_TTL_MIN, CLIENT_LINK_TTL_MAX,
  CLIENT_LINK_TTL_DEFAULT,
  verifyWebhook, WebhookVerificationError,
} from "../src/index";
import { createHmac } from "node:crypto";

const SCRIPT = (n: number) => Array(n).fill("word").join(" ");

describe("widecast SDK", () => {
  it("exports a semver string", () => {
    expect(typeof VERSION).toBe("string");
    expect(VERSION.split(".").length).toBe(3);
  });

  it("initializes with apiKey", () => {
    const c = new Widecast({ apiKey: "wc_live_dummy" });
    expect(c.apiKey).toBe("wc_live_dummy");
    expect(c.baseUrl).toMatch(/^https:/);
    expect(c.userAgent.startsWith("widecast-js/")).toBe(true);
  });

  it("reads apiKey from env", () => {
    process.env.WIDECAST_API_KEY = "wc_live_env";
    const c = new Widecast();
    expect(c.apiKey).toBe("wc_live_env");
    delete process.env.WIDECAST_API_KEY;
  });

  it("rejects empty video_id on get_status", async () => {
    const c = new Widecast({ apiKey: "dummy" });
    await expect(c.get_status("")).rejects.toThrow(InvalidRequestError);
  });

  it("rejects missing script_text on create_video", async () => {
    const c = new Widecast({ apiKey: "dummy" });
    await expect(c.create_video({ script_text: "" } as any)).rejects.toThrow(InvalidRequestError);
  });

  it("does not expose removed get_video method", () => {
    const c = new Widecast({ apiKey: "dummy" }) as any;
    expect(c.get_video).toBeUndefined();
  });

  it("error hierarchy is correct", () => {
    expect(new APIError("x")).toBeInstanceOf(WidecastError);
    expect(new NotFoundError("x")).toBeInstanceOf(WidecastError);
    expect(new PreconditionFailedError("x")).toBeInstanceOf(WidecastError);
    expect(new RateLimitError("x")).toBeInstanceOf(WidecastError);
    expect(new InvalidRequestError("x")).toBeInstanceOf(WidecastError);
  });

  it("script bounds + output types are locked (A38 parity)", () => {
    expect(SCRIPT_MIN_WORDS).toBe(80);
    expect(SCRIPT_MAX_WORDS).toBe(500);
    expect(OUTPUT_TYPES).toEqual(["text", "scene", "video"]);
  });

  it("idea bounds + source/video_length/language enums are locked (A38 parity)", () => {
    expect(IDEA_MIN_WORDS).toBe(5);
    expect(IDEA_MAX_WORDS).toBe(1000);
    expect(SOURCES).toEqual(["text", "idea", "blog",
      "video_url", "video_file", "audio_url", "audio_file"]);
    expect(VIDEO_LENGTHS).toEqual(["short", "normal"]);
    expect(LANGUAGES).toEqual(["English", "Vietnamese"]);
  });

  it("blog bounds are locked (A48 parity)", () => {
    expect(BLOG_MIN_WORDS).toBe(30);
    expect(BLOG_MAX_WORDS).toBe(3000);
  });

  it("plan script-attach vocabulary + bounds are locked (A55 parity)", () => {
    // Mirrors dashboard2.py WIDECAST_PLAN_SCRIPT_MIN/MAX_WORDS +
    // _SCRIPT_FORMAT_KEYS. Distinct from SCRIPT_MIN/MAX_WORDS (80/500).
    expect(SCRIPT_FORMATS).toEqual(["VE", "QA", "POV", "CS", "MB"]);
    expect(PLAN_SCRIPT_MIN_WORDS).toBe(80);
    expect(PLAN_SCRIPT_MAX_WORDS).toBe(1000);
  });

  it("pre-validates scripts on add_to_production_plan (A55, server-mirrored codes)", async () => {
    const c = new Widecast({ apiKey: "dummy" });
    const ok = SCRIPT(80);
    await expect(c.add_to_production_plan("idea", { scripts: [] as any }))
      .rejects.toThrow(InvalidRequestError);
    await expect(c.add_to_production_plan("idea", { scripts: [{ format: "XX", text: ok }] }))
      .rejects.toThrow(InvalidRequestError);
    await expect(c.add_to_production_plan("idea", {
      scripts: [{ format: "VE", text: ok }, { format: "VE", text: ok }] }))
      .rejects.toThrow(InvalidRequestError);
    await expect(c.add_to_production_plan("idea", { scripts: [{ format: "VE", text: SCRIPT(79) }] }))
      .rejects.toThrow(InvalidRequestError);
    await expect(c.add_to_production_plan("idea", { scripts: [{ format: "VE", text: SCRIPT(1001) }] }))
      .rejects.toThrow(InvalidRequestError);
    await expect(c.add_to_production_plan("idea", {
      scripts: [{ format: "VE", text: ok }], recommended_format: "QA" }))
      .rejects.toThrow(InvalidRequestError);
  });

  it("faceless scope is locked (A38 parity)", () => {
    // A52 (2026-06-15): audio sources joined the faceless-allowed list —
    // their scripts come from transcribing the user's audio but the visuals
    // must still be generated, so the same 3-way production mode applies.
    expect(FACELESS_SOURCES).toEqual(["text", "idea", "blog", "audio_url"]);
  });

  it("content_type + intervention_level enums are locked (A38 parity)", () => {
    expect(CONTENT_TYPES).toEqual(["blog", "facebook", "x", "linkedin"]);
    expect(INTERVENTION_LEVELS).toEqual([0, 1, 2]);
  });

  it("create_content rejects missing content", async () => {
    const c = new Widecast({ apiKey: "wc_live_dummy" });
    await expect(c.create_content({ content: "" } as any)).rejects.toThrow(InvalidRequestError);
  });

  it("create_content rejects invalid content_type", async () => {
    const c = new Widecast({ apiKey: "wc_live_dummy" });
    await expect(
      c.create_content({ content: "https://example.com/a", content_type: "tiktok" } as any),
    ).rejects.toThrow(InvalidRequestError);
  });

  // enhance_script() was withdrawn from the SDK 2026-06-21 (Round 28) —
  // its smoke tests retired. REST /v1/enhance_script still serves the UI.

  it("create_image rejects missing prompt", async () => {
    const c = new Widecast({ apiKey: "wc_live_dummy" });
    await expect(c.create_image({ prompt: "" } as any)).rejects.toThrow(InvalidRequestError);
  });

  it("create_image rejects invalid ratio", async () => {
    const c = new Widecast({ apiKey: "wc_live_dummy" });
    await expect(
      c.create_image({ prompt: "a sunset", ratio: "ultrawide" as any }),
    ).rejects.toThrow(InvalidRequestError);
  });

  it("create_image rejects out-of-range count", async () => {
    const c = new Widecast({ apiKey: "wc_live_dummy" });
    await expect(
      c.create_image({ prompt: "a sunset", count: 10 }),
    ).rejects.toThrow(InvalidRequestError);
  });

  it("search_broll rejects missing keyword", async () => {
    const c = new Widecast({ apiKey: "wc_live_dummy" });
    await expect(c.search_broll({ keyword: "", kind: "video" } as any)).rejects.toThrow(InvalidRequestError);
  });

  it("search_broll rejects invalid kind", async () => {
    const c = new Widecast({ apiKey: "wc_live_dummy" });
    await expect(
      c.search_broll({ keyword: "ocean", kind: "gif" as any }),
    ).rejects.toThrow(InvalidRequestError);
  });

  it("search_broll rejects out-of-range limit", async () => {
    const c = new Widecast({ apiKey: "wc_live_dummy" });
    await expect(
      c.search_broll({ keyword: "ocean", kind: "video", limit: 999 }),
    ).rejects.toThrow(InvalidRequestError);
  });

  it("collect_ideas rejects a too-short product_service_input", async () => {
    const c = new Widecast({ apiKey: "wc_live_dummy" });
    await expect(c.collect_ideas({ product_service_input: "short" })).rejects.toThrow(InvalidRequestError);
  });

  it("publish platform vocabulary is locked (A38 parity)", () => {
    expect(PUBLISH_PLATFORMS).toEqual(["youtube", "tiktok", "instagram", "facebook",
      "linkedin", "x", "threads", "pinterest", "reddit", "bluesky", "google_business"]);
  });

  it("publish requires exactly one content mode", async () => {
    const c = new Widecast({ apiKey: "wc_live_dummy" });
    await expect(c.publish({ platforms: ["x"] } as any)).rejects.toThrow(InvalidRequestError);
    await expect(
      c.publish({ topic_id: "widecast123abc456def", text: "hi" } as any),
    ).rejects.toThrow(InvalidRequestError);
  });

  it("publish external video requires title", async () => {
    const c = new Widecast({ apiKey: "wc_live_dummy" });
    await expect(
      c.publish({ video_url: "https://cdn.example.com/clip.mp4" }),
    ).rejects.toThrow(InvalidRequestError);
  });

  it("publish rejects unknown platform", async () => {
    const c = new Widecast({ apiKey: "wc_live_dummy" });
    await expect(
      c.publish({ text: "hi", platforms: ["myspace"] } as any),
    ).rejects.toThrow(InvalidRequestError);
  });

  it("read/library methods exist on the client", () => {
    const c = new Widecast({ apiKey: "wc_live_dummy" });
    // search() withdrawn 2026-06-21 (Round 29); video_data() added the same round.
    // recommendations() withdrawn 2026-07-13 (Round 30); foundation_videos()
    // re-promoted the same round.
    for (const name of ["list_videos", "account", "analytics", "roadmap",
      "production_plan", "foundation_videos", "video_data"]) {
      expect(typeof (c as any)[name]).toBe("function");
    }
  });

  it("recommendations() was withdrawn (Round 30)", () => {
    const c = new Widecast({ apiKey: "wc_live_dummy" });
    expect((c as any).recommendations).toBeUndefined();
  });

  it("video_data rejects an empty id", async () => {
    const c = new Widecast({ apiKey: "wc_live_dummy" });
    await expect(c.video_data("")).rejects.toThrow(InvalidRequestError);
  });

  it("connection methods exist on the client", () => {
    const c = new Widecast({ apiKey: "wc_live_dummy" });
    // connect() withdrawn 2026-06-21 (Round 28); accounts/platform_settings stay.
    for (const name of ["accounts", "platform_settings", "set_platform_settings"]) {
      expect(typeof (c as any)[name]).toBe("function");
    }
  });

  // connect() withdrawn from the SDK 2026-06-21 (Round 28) — agent UX
  // points users at https://widecast.ai/#setup instead; REST /v1/connect
  // still serves the UI.

  it("set_platform_settings rejects an unknown platform", async () => {
    const c = new Widecast({ apiKey: "wc_live_dummy" });
    await expect(c.set_platform_settings("myspace" as any, { a: 1 })).rejects.toThrow(InvalidRequestError);
  });

  it("rejects non-boolean faceless", async () => {
    const c = new Widecast({ apiKey: "wc_live_dummy" });
    await expect(
      c.create_video({ script_text: "word ".repeat(150), faceless: "yes" } as any),
    ).rejects.toThrow(InvalidRequestError);
  });

  it("rejects faceless=true with output_type=text", async () => {
    const c = new Widecast({ apiKey: "wc_live_dummy" });
    await expect(
      c.create_video({
        source: "idea",
        idea_text: "a quick tip about saving money for retirement",
        output_type: "text", faceless: true,
      }),
    ).rejects.toThrow(InvalidRequestError);
  });

  it("rejects faceless=true with a media source", async () => {
    const c = new Widecast({ apiKey: "wc_live_dummy" });
    await expect(
      c.create_video({ source: "video_url", video_url: "https://youtube.com/watch?v=x", faceless: true }),
    ).rejects.toThrow(InvalidRequestError);
  });

  it("media caps are locked (A49 parity)", () => {
    expect(MEDIA_MAX_DURATION_SECONDS).toBe(300);
    expect(MEDIA_MAX_FILE_BYTES).toBe(100 * 1024 * 1024);
  });

  it("source=video_file rejects an oversized file (file_too_large)", async () => {
    const c = new Widecast({ apiKey: "dummy" });
    // Fake Blob reporting size > cap (no real allocation).
    const bigFile = { size: MEDIA_MAX_FILE_BYTES + 1 } as unknown as Blob;
    await expect(c.create_video({ source: "video_file", video_file: bigFile } as any))
      .rejects.toThrow(/file_too_large|MB/);
  });

  it("rejects unknown source", async () => {
    const c = new Widecast({ apiKey: "dummy" });
    await expect(c.create_video({
      script_text: SCRIPT(150),
      source: "bogus" as any,
    })).rejects.toThrow(/source/);
  });

  it("source=idea requires idea_text", async () => {
    const c = new Widecast({ apiKey: "dummy" });
    await expect(c.create_video({
      source: "idea",
      idea_text: "" as any,
    })).rejects.toThrow(/idea_text|missing/);
  });

  it("source=idea rejects below 5-word floor", async () => {
    const c = new Widecast({ apiKey: "dummy" });
    await expect(c.create_video({
      source: "idea",
      idea_text: SCRIPT(IDEA_MIN_WORDS - 1),
    })).rejects.toThrow(/idea_too_short|words/);
  });

  it("source=idea does NOT reject over 1000-word ceiling (server truncates)", async () => {
    const c = new Widecast({ apiKey: "dummy" });
    // Should NOT throw client-side for too-long idea — server handles it.
    // Network failure is fine; we just check pre-validation passes.
    try {
      await c.create_video({
        source: "idea",
        idea_text: SCRIPT(IDEA_MAX_WORDS + 200),
      });
    } catch (e: any) {
      expect(e.code).not.toBe("idea_too_long");
    }
  });

  it("source=idea rejects unknown language", async () => {
    const c = new Widecast({ apiKey: "dummy" });
    await expect(c.create_video({
      source: "idea",
      idea_text: SCRIPT(20),
      language: "Klingon" as any,
    })).rejects.toThrow(/language/);
  });

  it("source=idea rejects unknown video_length", async () => {
    const c = new Widecast({ apiKey: "dummy" });
    await expect(c.create_video({
      source: "idea",
      idea_text: SCRIPT(20),
      video_length: "epic" as any,
    })).rejects.toThrow(/video_length/);
  });

  it("source=blog requires blog_text", async () => {
    const c = new Widecast({ apiKey: "dummy" });
    await expect(c.create_video({
      source: "blog",
      blog_text: "" as any,
    })).rejects.toThrow(/blog_text|missing/);
  });

  it("source=blog rejects below 30-word floor", async () => {
    const c = new Widecast({ apiKey: "dummy" });
    await expect(c.create_video({
      source: "blog",
      blog_text: SCRIPT(BLOG_MIN_WORDS - 1),
    })).rejects.toThrow(/blog_too_short|words/);
  });

  it("source=blog does NOT reject over 3000-word ceiling (server truncates)", async () => {
    const c = new Widecast({ apiKey: "dummy" });
    // A40 asymmetric bounds — blog is interpretive like idea; server truncates.
    try {
      await c.create_video({
        source: "blog",
        blog_text: SCRIPT(BLOG_MAX_WORDS + 200),
      });
    } catch (e: any) {
      expect(e.code).not.toBe("blog_too_long");
    }
  });

  it("accepts output_type=text with source=blog (A48)", async () => {
    const c = new Widecast({ apiKey: "dummy" });
    try {
      await c.create_video({
        source: "blog",
        blog_text: SCRIPT(40),
        output_type: "text",
      });
    } catch (e: any) {
      expect(e.code).not.toBe("invalid_output_type");
    }
  });

  it("source=video_url requires video_url", async () => {
    const c = new Widecast({ apiKey: "dummy" });
    await expect(c.create_video({ source: "video_url" } as any))
      .rejects.toThrow(/video_url|missing/);
  });

  it("source=audio_url requires audio_url", async () => {
    const c = new Widecast({ apiKey: "dummy" });
    await expect(c.create_video({ source: "audio_url" } as any))
      .rejects.toThrow(/audio_url|missing/);
  });

  it("source=video_file requires a file", async () => {
    const c = new Widecast({ apiKey: "dummy" });
    await expect(c.create_video({ source: "video_file" } as any))
      .rejects.toThrow(/media_file|video_file|missing/);
  });

  it("accepts output_type=text with source=video_url (Remake, A50)", async () => {
    const c = new Widecast({ apiKey: "dummy" });
    try {
      await c.create_video({
        source: "video_url",
        video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        output_type: "text",
      } as any);
    } catch (e: any) {
      expect(["invalid_output_type", "missing_video_url"]).not.toContain(e.code);
    }
  });

  it("source=text default still works without source field (backward-compat)", async () => {
    const c = new Widecast({ apiKey: "dummy" });
    // Pre-validation should pass with just script_text — only network would fail.
    try {
      await c.create_video({ script_text: SCRIPT(150) });
    } catch (e: any) {
      expect(["missing_field", "script_too_short", "script_too_long", "invalid_source"])
        .not.toContain(e.code);
    }
  });

  it("rejects script_text below the 80-word floor", async () => {
    const c = new Widecast({ apiKey: "dummy" });
    await expect(c.create_video({ script_text: SCRIPT(SCRIPT_MIN_WORDS - 1) }))
      .rejects.toThrow(/script_too_short|words/);
  });

  it("rejects script_text above the 500-word ceiling", async () => {
    const c = new Widecast({ apiKey: "dummy" });
    await expect(c.create_video({ script_text: SCRIPT(SCRIPT_MAX_WORDS + 1) }))
      .rejects.toThrow(/script_too_long|words/);
  });

  it("rejects unknown output_type", async () => {
    const c = new Widecast({ apiKey: "dummy" });
    await expect(c.create_video({
      script_text: SCRIPT(150),
      output_type: "bogus" as any,
    })).rejects.toThrow(/output_type/);
  });

  it("rejects output_type=text with source=text (A46)", async () => {
    const c = new Widecast({ apiKey: "dummy" });
    await expect(c.create_video({
      script_text: SCRIPT(150),
      source: "text",
      output_type: "text",
    })).rejects.toThrow(/output_type|generative/);
  });

  it("accepts output_type=text with source=idea (A46)", async () => {
    const c = new Widecast({ apiKey: "dummy" });
    try {
      await c.create_video({
        source: "idea",
        idea_text: SCRIPT(20),
        output_type: "text",
      });
    } catch (e: any) {
      expect(e.code).not.toBe("invalid_output_type");
    }
  });

  it("rejects empty id on export_video", async () => {
    const c = new Widecast({ apiKey: "dummy" });
    await expect(c.export_video("")).rejects.toThrow(InvalidRequestError);
  });

  it("exposes export_video method", () => {
    const c = new Widecast({ apiKey: "dummy" }) as any;
    expect(typeof c.export_video).toBe("function");
  });

  it("Video exposes review_url when completed (and topic_id alias)", () => {
    const v = new Video({
      object: "status", id: "widecastabc123def456gh", topic_id: "widecastabc123def456gh",
      type: "video",
      status: "completed", stage: "scenes_ready_for_review", progress: 1.0,
      details: { step: 5, status: "Completed", notes: "" },
      error: null, metadata: {}, usage: null,
      result: {
        review_url: "https://widecast.ai/#scene_editor?topic_id=widecastabc123def456gh",
      },
      links: { self: "/v1/status/widecastabc123def456gh" },
      meta: { request_id: "r", widecast_version: "0.1.0" },
    } as any, new Widecast({ apiKey: "x" }));
    expect(v.isTerminal).toBe(true);
    expect(v.review_url).toBe("https://widecast.ai/#scene_editor?topic_id=widecastabc123def456gh");
    expect(v.video_url).toBeNull();
    expect(v.topic_id).toBe(v.id);
    // Top-level status is our enum; details.status is the legacy free-form string.
    expect(v.status).toBe("completed");
    expect(v.details?.status).toBe("Completed");
  });

  it("Video.video_url populated for output_type=video completion", () => {
    const v = new Video({
      object: "status", id: "widecastabc123def456gh", topic_id: "widecastabc123def456gh",
      type: "video",
      status: "completed", stage: "video_rendered", progress: 1.0,
      details: { step: 5, status: "Completed", notes: "" },
      error: null, metadata: {}, usage: null,
      result: {
        review_url: "https://widecast.ai/#scene_editor?topic_id=widecastabc123def456gh",
        video_url:  "https://widecast.ai/exports/x/widecastabc123def456gh/final.mp4",
      },
      links: { self: "/v1/status/widecastabc123def456gh" },
      meta: { request_id: "r", widecast_version: "0.1.0" },
    } as any, new Widecast({ apiKey: "x" }));
    expect(v.video_url).toBe("https://widecast.ai/exports/x/widecastabc123def456gh/final.mp4");
    expect(v.review_url).toContain("scene_editor");
  });

  it("v0.1.0 dropped script + scenes_count getters", () => {
    const v = new Video({} as any, new Widecast({ apiKey: "x" })) as any;
    expect(v.script).toBeUndefined();
    expect(v.scenes_count).toBeUndefined();
  });

  it("verifyWebhook accepts a valid signature", async () => {
    const secret = "wc_live_secret";
    const body = JSON.stringify({ event_id: "evt_x", event_type: "video.completed" });
    const ts = String(Math.floor(Date.now() / 1000));
    const sig = createHmac("sha256", secret).update(`${ts}.${body}`).digest("hex");
    const ev = await verifyWebhook({ body, signatureHeader: `t=${ts},v1=${sig}`, secret });
    expect(ev.event_type).toBe("video.completed");
  });

  it("verifyWebhook rejects a bad signature", async () => {
    const ts = String(Math.floor(Date.now() / 1000));
    await expect(
      verifyWebhook({ body: "{}", signatureHeader: `t=${ts},v1=deadbeef`, secret: "wc_live_secret" })
    ).rejects.toThrow(WebhookVerificationError);
  });

  it("verifyWebhook rejects a stale timestamp", async () => {
    const secret = "wc_live_secret";
    const body = "{}";
    const stale = String(Math.floor(Date.now() / 1000) - 3600);
    const sig = createHmac("sha256", secret).update(`${stale}.${body}`).digest("hex");
    await expect(
      verifyWebhook({ body, signatureHeader: `t=${stale},v1=${sig}`, secret })
    ).rejects.toThrow(WebhookVerificationError);
  });

  it("Video.error populated when failed", () => {
    const v = new Video({
      object: "status", id: "widecastabc123def456gh", topic_id: "widecastabc123def456gh",
      type: "video",
      status: "failed", stage: "step_0", progress: 0.30,
      result: null, metadata: {}, usage: null,
      error: { code: "credit_exhausted", message: "Out of credits." },
      links: { self: "/v1/status/widecastabc123def456gh" },
      meta: { request_id: "r", widecast_version: "0.1.0" },
    } as any, new Widecast({ apiKey: "x" }));
    expect(v.isTerminal).toBe(true);
    expect(v.error).toEqual({ code: "credit_exhausted", message: "Out of credits." });
    expect(v.review_url).toBeNull();
  });
});

// ── /v1/client_link/send (sync, free — no-login client "magic link") ────────
describe("send_client_link", () => {
  /** Capturing fetch mock — records every request, replies 200 JSON. */
  function captureFetch(responseBody: unknown = {
    object: "client_link", link_type: "content_plan",
    magic_url: "https://widecast.ai/record.html#workspace?token=x&redirect=y",
    expires_in_days: 7, notified: false, request_id: "req_test",
  }) {
    const calls: Array<{ url: string; method: string; headers: Record<string, string>; body: any }> = [];
    const fetchImpl = (async (url: any, init: any) => {
      calls.push({
        url: String(url),
        method: init?.method ?? "GET",
        headers: (init?.headers ?? {}) as Record<string, string>,
        body: init?.body ? JSON.parse(String(init.body)) : undefined,
      });
      return new Response(JSON.stringify(responseBody), {
        status: 200, headers: { "Content-Type": "application/json" },
      });
    }) as typeof fetch;
    return { calls, fetchImpl };
  }

  it("client-link vocabulary + TTL bounds are locked (server parity)", () => {
    // Mirrors dashboard2.py WIDECAST_CLIENT_LINK_TTL_* — 5-surface drift canary.
    expect(CLIENT_LINK_TYPES).toEqual(["record", "content_plan", "setup",
      "social_dashboard", "publish_schedule"]);
    expect(CLIENT_LINK_TTL_MIN).toBe(1);
    expect(CLIENT_LINK_TTL_MAX).toBe(30);
    expect(CLIENT_LINK_TTL_DEFAULT).toBe(7);
  });

  it("exposes send_client_link method", () => {
    const c = new Widecast({ apiKey: "wc_live_dummy" });
    expect(typeof (c as any).send_client_link).toBe("function");
  });

  it("rejects a missing/unknown link_type", async () => {
    const c = new Widecast({ apiKey: "wc_live_dummy" });
    await expect(c.send_client_link({} as any)).rejects.toThrow(InvalidRequestError);
    await expect(
      c.send_client_link({ link_type: "billing" } as any),
    ).rejects.toMatchObject({ code: "invalid_link_type", param: "link_type" });
  });

  it("link_type=record requires topic_id", async () => {
    const c = new Widecast({ apiKey: "wc_live_dummy" });
    await expect(
      c.send_client_link({ link_type: "record" } as any),
    ).rejects.toMatchObject({ code: "missing_field", param: "topic_id" });
  });

  it("link_type=record rejects a malformed topic_id", async () => {
    const c = new Widecast({ apiKey: "wc_live_dummy" });
    await expect(
      c.send_client_link({ link_type: "record", topic_id: "bad id!" }),
    ).rejects.toMatchObject({ code: "invalid_topic_id", param: "topic_id" });
    await expect(
      c.send_client_link({ link_type: "record", topic_id: "x".repeat(65) }),
    ).rejects.toMatchObject({ code: "invalid_topic_id", param: "topic_id" });
  });

  it("rejects non-object channels and unknown channel keys", async () => {
    const c = new Widecast({ apiKey: "wc_live_dummy" });
    await expect(
      c.send_client_link({ link_type: "setup", channels: ["telegram"] as any }),
    ).rejects.toMatchObject({ code: "invalid_channels", param: "channels" });
    await expect(
      c.send_client_link({ link_type: "setup", channels: { whatsapp: true } as any }),
    ).rejects.toMatchObject({ code: "invalid_channels", param: "channels" });
  });

  it("mint-only request shape: link_type + default ttl_days, nothing else", async () => {
    const { calls, fetchImpl } = captureFetch();
    const c = new Widecast({ apiKey: "wc_live_dummy", fetchImpl });
    const resp = await c.send_client_link({ link_type: "content_plan" });
    expect(calls.length).toBe(1);
    expect(calls[0].method).toBe("POST");
    expect(calls[0].url.endsWith("/v1/client_link/send")).toBe(true);
    expect(calls[0].headers["Authorization"]).toBe("Bearer wc_live_dummy");
    expect(calls[0].body).toEqual({
      link_type: "content_plan", ttl_days: CLIENT_LINK_TTL_DEFAULT,
    });
    expect(resp.object).toBe("client_link");
    expect(resp.magic_url).toContain("#workspace?token=");
  });

  it("record request shape: topic_id sent, ttl_days clamped, channels passed through", async () => {
    const { calls, fetchImpl } = captureFetch({
      object: "client_link", link_type: "record",
      magic_url: "https://widecast.ai/record.html#workspace?token=x&redirect=y",
      expires_in_days: 30, notified: true, topic_id: "widecastab12",
      results: { telegram: { status: "sent" } }, request_id: "req_test",
    });
    const c = new Widecast({ apiKey: "wc_live_dummy", fetchImpl });
    const resp = await c.send_client_link({
      link_type: "record", topic_id: "widecastab12",
      ttl_days: 99, channels: { telegram: true, email: false },
    });
    expect(calls[0].body).toEqual({
      link_type: "record", topic_id: "widecastab12",
      ttl_days: CLIENT_LINK_TTL_MAX,                 // 99 → clamped to 30
      channels: { telegram: true, email: false },
    });
    expect(resp.notified).toBe(true);
    expect(resp.results?.telegram?.status).toBe("sent");
  });

  it("ttl_days clamps low + zero falls back to the default (server parity)", async () => {
    const { calls, fetchImpl } = captureFetch();
    const c = new Widecast({ apiKey: "wc_live_dummy", fetchImpl });
    await c.send_client_link({ link_type: "setup", ttl_days: -5 });
    expect(calls[0].body.ttl_days).toBe(CLIENT_LINK_TTL_MIN);       // -5 → 1
    await c.send_client_link({ link_type: "setup", ttl_days: 0 });
    expect(calls[1].body.ttl_days).toBe(CLIENT_LINK_TTL_DEFAULT);   // 0 → 7
  });

  it("topic_id is omitted for non-record link types; page passes through", async () => {
    const { calls, fetchImpl } = captureFetch();
    const c = new Widecast({ apiKey: "wc_live_dummy", fetchImpl });
    await c.send_client_link({
      link_type: "publish_schedule", topic_id: "widecastab12", page: "record2.html",
    });
    expect(calls[0].body).toEqual({
      link_type: "publish_schedule", ttl_days: CLIENT_LINK_TTL_DEFAULT,
      page: "record2.html",
    });
    expect(calls[0].body.topic_id).toBeUndefined();
  });
});
