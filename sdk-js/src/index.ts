/**
 * WideCast.ai TypeScript / JavaScript SDK — thin client for the public API.
 *
 * Works in Node 18+, Deno, Bun, browsers — uses the global `fetch`.
 *
 * @example
 *   import Widecast from "@widecast/sdk";
 *   const client = new Widecast({ apiKey: "wc_live_REPLACE_ME" });
 *   const video = await client.create_video({ script }).then(v => v.wait());
 *   console.log(video.review_url);
 */

export const VERSION = "0.1.0";

const DEFAULT_BASE_URL =
  (typeof process !== "undefined" && process.env?.WIDECAST_BASE_URL) ||
  "https://widecast.ai/app/dashboard2";

const TERMINAL_STATUSES = ["completed", "failed"] as const;

// Field-requirement constants (LOCKED — A38 parity rule, 5 surfaces in sync).
//
// These mirror server enforcement in dashboard2.py
// (WIDECAST_SCRIPT_MIN_WORDS / MAX_WORDS / WIDECAST_IDEA_MIN_WORDS / MAX_WORDS /
// _WIDECAST_SOURCES / _WIDECAST_OUTPUT_TYPES / _WIDECAST_VIDEO_LENGTHS /
// _WIDECAST_LANGUAGES) and the OpenAPI `CreateVideoRequest` description.
// Any change must update server + OpenAPI + this constant + the markdown docs +
// the playground YAML/JS in the same commit — otherwise the parity tests fail
// and downstream tools (MCP / OpenAI tools / Postman) drift out of sync.
export const SCRIPT_MIN_WORDS = 80;    // ~20s of narration (source="text")
export const SCRIPT_MAX_WORDS = 500;   // ~120s / 2 min of narration (source="text")
export const IDEA_MIN_WORDS = 5;       // source="idea" floor — reject if shorter
export const IDEA_MAX_WORDS = 1000;    // source="idea" ceiling — auto-truncate not reject
export const BLOG_MIN_WORDS = 30;      // source="blog" floor — reject if shorter (use idea)
export const BLOG_MAX_WORDS = 3000;    // source="blog" ceiling — auto-truncate not reject
export const OUTPUT_TYPES = ["text", "scene", "video"] as const;  // pipeline depth (A46)
export type OutputType = (typeof OUTPUT_TYPES)[number];
// blog = generative (mirrors idea, A48). video_*/audio_* = media-ingest (A49):
// the script already lives in the media; output_type="text" = Remake (A50).
export const SOURCES = ["text", "idea", "blog",
  "video_url", "video_file", "audio_url", "audio_file"] as const;
export type Source = (typeof SOURCES)[number];
// faceless=true forces every scene to B-roll (no narrator A-roll). Only valid
// with output_type scene/video for these script-based sources.
export const FACELESS_SOURCES = ["text", "idea", "blog"] as const;
// Written content (/v1/create_content): friendly types → legacy content_type 3/4/5/6.
export const CONTENT_TYPES = ["blog", "facebook", "x", "linkedin"] as const;
export type ContentType = (typeof CONTENT_TYPES)[number];
// Enhance aggressiveness (/v1/enhance_script): 0=segment only, 1=natural, 2=max rewrite.
export const INTERVENTION_LEVELS = [0, 1, 2] as const;
export type InterventionLevel = (typeof INTERVENTION_LEVELS)[number];
// Social platforms WideCast can publish to (/v1/publish). Locked vocabulary
// mirroring the server's _WIDECAST_PUBLISH_PLATFORMS.
export const PUBLISH_PLATFORMS = ["youtube", "tiktok", "instagram", "facebook",
  "linkedin", "x", "threads", "pinterest", "reddit", "bluesky",
  "google_business"] as const;
export type PublishPlatform = (typeof PUBLISH_PLATFORMS)[number];

/** Options for client.create_content(). */
export interface CreateContentOptions {
  /** A URL, an idea/topic, or pasted text the content is created from. */
  content: string;
  /** "blog" (default) / "facebook" / "x" / "linkedin". */
  content_type?: ContentType;
  /** Output language (e.g. "English"). Default "English". */
  language?: string;
  callback_url?: string;
  metadata?: Record<string, unknown>;
  idempotency_key?: string;
}

/** Options for client.enhance_script(). */
export interface EnhanceScriptOptions {
  /** The DRAFT script to enhance. */
  script_text: string;
  /** Output language; "" (default) keeps the draft's original language. */
  language?: string;
  /** 0=segment only, 1=natural enhance (default), 2=maximum rewrite. */
  intervention_level?: InterventionLevel;
  callback_url?: string;
  metadata?: Record<string, unknown>;
  idempotency_key?: string;
}

/** Options for client.suggest_ideas(). */
export interface SuggestIdeasOptions {
  /** Industry name (e.g. "Real Estate"). Falls back to your account industry if omitted. */
  industry_id?: string;
  /** How many ideas (1–20, default 5). */
  num_topics?: number;
  sub_industry?: string;
  user_location?: string;
  idempotency_key?: string;
}

/** Options for client.collect_ideas(). */
export interface CollectIdeasOptions {
  /** Product/service description (≥10 chars) to brainstorm ideas from. */
  product_service_input: string;
  sub_industry?: string;
  user_location?: string;
  idempotency_key?: string;
}

/** Options for client.publish(). Provide EXACTLY ONE of topic_id / text / video_url. */
export interface PublishOptions {
  /** Publish an existing WideCast video OR blog/social post (auto-detected). */
  topic_id?: string;
  /** Post arbitrary text (optionally with photo_urls). */
  text?: string;
  /** A direct video file URL to download + publish. Requires `title`. */
  video_url?: string;
  /** Caption/title. Required for video_url; optional override for topic_id. */
  title?: string;
  description?: string;
  /** Image URLs to attach (with `text`). */
  photo_urls?: string[];
  /** Target platforms. Defaults to ALL connected platforms. */
  platforms?: PublishPlatform[];
  scheduled_date?: string;
  timezone?: string;
  callback_url?: string;
  metadata?: Record<string, unknown>;
  idempotency_key?: string;
}

/** Accepted-publish envelope (HTTP 202) returned by client.publish(). */
export interface PublishResponse {
  object: string;
  /** Primary upstream request_id — poll get_status(id). */
  id: string;
  /** All upstream request_ids (article spanning text+photo may return two). */
  request_ids: string[];
  status: "processing";
  platforms: string[];
  skipped?: string[];
  metadata?: Record<string, unknown>;
  links?: { status?: string };
  meta?: { request_id?: string; widecast_version?: string };
}

/** One idea in an IdeasResponse. */
export interface Idea {
  title: string;
  description: string;
  industry?: string;
  audience?: string;
  professional?: string;
  level?: string;
}

/** Synchronous response of suggest_ideas / collect_ideas. */
export interface IdeasResponse {
  object: string;
  industry?: string;
  ideas: Idea[];
}
// Media-ingest sources (A49): audio/video by URL (YouTube/TikTok/FB) or by an
// uploaded file (multipart). field = the request key. output_type scene/video
// = full build; text = Remake (transcript only, A50). language/video_length/
// research_enabled do NOT apply.
export const MEDIA_SOURCES = {
  video_url:  { media_type: "video", input_kind: "url",  field: "video_url" },
  video_file: { media_type: "video", input_kind: "file", field: "video_file" },
  audio_url:  { media_type: "audio", input_kind: "url",  field: "audio_url" },
  audio_file: { media_type: "audio", input_kind: "file", field: "audio_file" },
} as const;
// Media caps (A49). Duration applies to ALL media and is enforced SERVER-SIDE
// (a thin SDK can't probe duration). File size applies to UPLOADS only and IS
// pre-validated client-side below. Mirror the dashboard2.py server constants.
export const MEDIA_MAX_DURATION_SECONDS = 120;            // 2 min (media_too_long)
export const MEDIA_MAX_FILE_BYTES = 100 * 1024 * 1024;    // 100 MB (file_too_large)
export const VIDEO_LENGTHS = ["short", "normal"] as const;
export type VideoLength = (typeof VIDEO_LENGTHS)[number];
export const LANGUAGES = ["English", "Vietnamese"] as const;
export type Language = (typeof LANGUAGES)[number];

// ────────────────────────────────────────────────────────────────────────────
// Types — mirror OpenAPI 3.1 schema, locked surface.
// ────────────────────────────────────────────────────────────────────────────

export type VideoStatus = "pending" | "processing" | "completed" | "failed";

export type ErrorCode =
  | "account_expired"
  | "credit_exhausted"
  | "render_failed"
  | "unknown_error"
  | "scenes_not_ready"
  | "export_failed"
  | "script_too_short"
  | "script_too_long"
  | "invalid_output_type";

export interface StatusResult {
  review_url: string;
  /** Direct MP4 URL. Present only when output_type="video" OR after
   *  /v1/export_video completes. */
  video_url?: string;
  // v0.1.0 keeps `result` MINIMAL — no script dump, no scenes_count. A future
  // `GET /v1/videos/{id}/script` will serve the full rendered script when needed.
}

/**
 * Fine-grained worker state surfaced from the legacy row.
 * ⚠ DELIBERATE NAME CLASH: `details.status` is a free-form legacy string
 * (e.g. "Completed", "Avatar videos downloaded"), DISTINCT from the
 * top-level `status` enum. Gate logic on the top-level field only.
 */
export interface ProcessingDetails {
  step: number;
  status: string;
  notes: string;
  updated_at?: string;
}

export interface StatusError {
  code: ErrorCode | string;
  message: string;
}

/**
 * Time-based pseudo-progress for UX during long renders. Present only while
 * `status === "processing"`. Derived from elapsed time alone — `stage` may
 * not match what the worker is actually doing internally. Display only.
 *
 * `label` is English with a baked ETA suffix
 * (`"Generating scene visuals · ~7 min left"`). AIs are expected to translate
 * to the user's language when relaying.
 */
export interface ProgressHint {
  stage: string;
  label: string;
  elapsed_ms: number;
  remaining_ms_estimate: number;
}

export interface VideoResource {
  object: "status";
  id: string;
  topic_id: string;
  type: "video";
  status: VideoStatus;
  stage: string;
  progress: number;
  progress_hint?: ProgressHint | null;
  details: ProcessingDetails | null;
  result: StatusResult | null;
  error: StatusError | null;
  callback_url?: string | null;
  metadata: Record<string, unknown>;
  usage: Record<string, unknown> | null;
  links: { self: string };
  meta: {
    request_id: string;
    widecast_version: string;
  };
}

export interface CreateVideoOptions {
  /** Input flow: "text" (default — backward-compat) requires `script_text`;
   *  "idea" requires `idea_text` (+ optional language / video_length /
   *  research_enabled). */
  source?: Source;
  /** Plain text script — required when `source="text"`. Used VERBATIM by the
   *  narrator (no AI rewriting). Must be `SCRIPT_MIN_WORDS`–`SCRIPT_MAX_WORDS`
   *  words (80–500, ~20s–2min). Word count = whitespace split.
   *  May contain inline image/video file URLs in either form:
   *  - Markdown image syntax (recommended for AI-chat callers; chat hosts
   *    render the picture inline so the end-user can visually approve each
   *    scene): `![brief description](https://cdn.acme.com/photo.jpg)`.
   *  - Raw URL on its own line (backward compat): `… https://… …`.
   *  Direct file links only — .png/.jpg/.jpeg/.gif/.webp/.bmp/.avif/.svg or
   *  .mp4/.webm/.mov/.m4v/.avi (optional ?query). WideCast strips both forms
   *  from the narration and uses them as that scene's visual instead of
   *  auto-sourced B-roll. Page links (e.g. youtube.com/watch) are NOT
   *  inlined; use `source="video_url"` for a whole clip. */
  script_text?: string;
  /** Short idea description — required when `source="idea"`. Server writes
   *  a narration from this (AI) then continues into scene-sourcing. Bounds:
   *  `IDEA_MIN_WORDS` (5) min, `IDEA_MAX_WORDS` (1000) max — over-max is
   *  auto-truncated server-side, NOT rejected. Original word count surfaces
   *  in `details.input_truncated_from`. */
  idea_text?: string;
  /** Blog/article to repurpose — required when `source="blog"`. Same AI
   *  script-writer + pipeline as idea, just a longer input. Bounds:
   *  `BLOG_MIN_WORDS` (30) min, `BLOG_MAX_WORDS` (3000) max — over-max
   *  auto-truncated, surfaced in `details.input_truncated_from`. */
  blog_text?: string;
  /** Media URL (YouTube/TikTok/Facebook) — required when source="video_url" /
   *  "audio_url" (A49). The media's own audio becomes the narration / footage
   *  becomes b-roll. */
  video_url?: string;
  audio_url?: string;
  /** Media file to upload — required when source="video_file" / "audio_file"
   *  (A49). Sent as multipart/form-data. Pass a Blob/File (in Node 18+ build one
   *  with `new Blob([buffer])` or `await openAsBlob(path)`). */
  video_file?: Blob;
  audio_file?: Blob;
  /** Narration language (generative sources only). Default "English". Locked
   *  enum v0.1.0: see `LANGUAGES`. */
  language?: Language;
  /** Target video length (generative sources only). Default "short". "normal"
   *  caps at ~3 min. See `VIDEO_LENGTHS`. */
  video_length?: VideoLength;
  /** Whether the AI does research / fact-check during narration generation
   *  (generative sources only). Default true. */
  research_enabled?: boolean;
  /** Pipeline depth. "text" stops after the source→script phase (review_url →
   *  Script Editor; generative sources only, NOT source="text"). "scene"
   *  (default) stops at scenes-ready-for-review. "video" auto-chains into the
   *  renderer for the final MP4. */
  output_type?: OutputType;
  /** If true, every scene is B-roll (no narrator A-roll anywhere) — a
   *  "faceless" video. Default false (scenes mix A-roll + B-roll). Only valid
   *  with output_type scene/video for sources text/idea/blog (FACELESS_SOURCES);
   *  otherwise the server returns invalid_faceless. */
  faceless?: boolean;
  /** Extra direct image/video URLs you couldn't confidently place inline →
   *  added to the first scene's media library so the scene editor lists them
   *  for the user to drop into any scene. Direct file links only. */
  media_pool?: string[];
  wait_for_render?: boolean;
  callback_url?: string;
  metadata?: Record<string, unknown>;
  idempotency_key?: string;
}

export interface WidecastConfig {
  apiKey?: string;
  baseUrl?: string;
  timeoutMs?: number;
  maxRetries?: number;
  userAgent?: string;
  fetchImpl?: typeof fetch;
}

export interface WaitOptions {
  timeoutMs?: number;
  initialIntervalMs?: number;
  maxIntervalMs?: number;
  backoffMultiplier?: number;
}

// ────────────────────────────────────────────────────────────────────────────
// Errors — one class per error.type for granular catching.
// ────────────────────────────────────────────────────────────────────────────
interface ErrorBody {
  type?: string;
  code?: string;
  message?: string;
  param?: string;
  doc_url?: string;
  request_id?: string;
  details?: CreditErrorDetails | Record<string, unknown> | null;
}

/**
 * Structured upgrade / wait info attached to HTTP 402 responses
 * (`credit_exhausted` or `account_expired`). Surface both options to the user:
 * wait until `reset_at` (monthly quota refresh) OR upgrade via `upgrade_url`.
 */
export interface CreditErrorDetails {
  upgrade_url: string;
  reset_at?: string | null;       // credit_exhausted only
  expired_at?: string | null;     // account_expired only
  renew_url?: string | null;      // account_expired only
  current_plan: string;
  current_plan_quota?: number | null;
  credits_remaining: number;
  credits_required: number;
  next_plan?: string | null;
  next_plan_quota?: number | null;
}

export class WidecastError extends Error {
  code: string;
  requestId: string;
  status: number;
  docUrl: string;
  param?: string;
  responseJson: unknown;
  /** Code-specific structured data. Populated for HTTP 402 (`credit_exhausted`
   *  / `account_expired`) with a `CreditErrorDetails` payload. Null for other
   *  error codes. */
  details?: CreditErrorDetails | Record<string, unknown> | null;
  constructor(message: string, opts: Partial<{
    code: string; requestId: string; status: number;
    docUrl: string; param: string; responseJson: unknown;
    details: CreditErrorDetails | Record<string, unknown> | null;
  }> = {}) {
    super(message);
    this.name = "WidecastError";
    this.code = opts.code ?? "";
    this.requestId = opts.requestId ?? "";
    this.status = opts.status ?? 0;
    this.docUrl = opts.docUrl ?? "";
    this.param = opts.param;
    this.responseJson = opts.responseJson;
    this.details = opts.details ?? null;
  }
  /** Shortcut for `details.upgrade_url` — empty when not a 402. */
  get upgrade_url(): string {
    return (this.details && (this.details as CreditErrorDetails).upgrade_url) || "";
  }
}
export class InvalidRequestError    extends WidecastError { constructor(m: string, o = {}) { super(m, o); this.name = "InvalidRequestError"; } }
export class NotFoundError          extends WidecastError { constructor(m: string, o = {}) { super(m, o); this.name = "NotFoundError"; } }
export class PreconditionFailedError extends WidecastError { constructor(m: string, o = {}) { super(m, o); this.name = "PreconditionFailedError"; } }
export class RateLimitError         extends WidecastError { constructor(m: string, o = {}) { super(m, o); this.name = "RateLimitError"; } }
export class APIError               extends WidecastError { constructor(m: string, o = {}) { super(m, o); this.name = "APIError"; } }

const ERROR_CLASSES: Record<string, new (m: string, o: object) => WidecastError> = {
  invalid_request_error: InvalidRequestError,
  not_found_error: NotFoundError,
  precondition_failed: PreconditionFailedError,
  rate_limit_error: RateLimitError,
  api_error: APIError,
  authentication_error: WidecastError,
  permission_error: WidecastError,
};

// ────────────────────────────────────────────────────────────────────────────
// Video — wraps a status resource with .wait() helper + ergonomic accessors.
// ────────────────────────────────────────────────────────────────────────────
export class Video implements VideoResource {
  object!: "status";
  id!: string;
  topic_id!: string;
  type!: "video";
  status!: VideoStatus;
  stage!: string;
  progress!: number;
  progress_hint?: ProgressHint | null;
  details!: ProcessingDetails | null;
  result!: StatusResult | null;
  error!: StatusError | null;
  callback_url?: string | null;
  metadata!: Record<string, unknown>;
  usage!: Record<string, unknown> | null;
  links!: { self: string };
  meta!: VideoResource["meta"];

  #client: Widecast;

  constructor(data: VideoResource, client: Widecast) {
    Object.assign(this, data);
    this.#client = client;
  }

  get isTerminal(): boolean {
    return (TERMINAL_STATUSES as readonly string[]).includes(this.status);
  }

  // ── Ergonomic unwrapper for `result` ─────────────────────────────────────
  /** URL where the user reviews the rendered scenes + audio. Present from the
   *  first response (pending / processing / completed) — the review page
   *  handles early arrival itself (spinner + in-page polling), so this is
   *  safe to share with the user before status='completed'. */
  /** Time-based pseudo-progress label with baked ETA, e.g.
   *  "Generating scene visuals · ~7 min left". Empty while not processing.
   *  Display only — translate to the user's language when relaying. */
  get progress_label(): string { return this.progress_hint?.label ?? ""; }
  get review_url(): string | null { return this.result?.review_url ?? null; }
  /** Direct MP4 URL — present only when status='completed' AND the video was
   *  created with output_type='video' (or exported via client.export_video). */
  get video_url(): string | null { return this.result?.video_url ?? null; }

  /** Poll /v1/status until terminal or timeout.
   *  Default: fixed 5-second polling (no backoff). Override kwargs for
   *  long-running polls where backoff is preferred. */
  async wait(opts: WaitOptions = {}): Promise<Video> {
    const timeoutMs = opts.timeoutMs ?? 600_000;
    const maxIntervalMs = opts.maxIntervalMs ?? 5_000;
    const backoff = opts.backoffMultiplier ?? 1.0;
    let interval = opts.initialIntervalMs ?? 5_000;
    const deadline = Date.now() + timeoutMs;
    let latest: Video = this;
    while (!latest.isTerminal && Date.now() < deadline) {
      const remaining = deadline - Date.now();
      await sleep(Math.min(interval, Math.max(100, remaining)));
      latest = await this.#client.get_status(this.id);
      interval = Math.min(interval * backoff, maxIntervalMs);
    }
    return latest;
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Widecast client
// ────────────────────────────────────────────────────────────────────────────
export class Widecast {
  apiKey?: string;
  baseUrl: string;
  timeoutMs: number;
  maxRetries: number;
  userAgent: string;
  #fetch: typeof fetch;

  constructor(cfg: WidecastConfig = {}) {
    this.apiKey = cfg.apiKey ?? (typeof process !== "undefined" ? process.env?.WIDECAST_API_KEY : undefined);
    this.baseUrl = (cfg.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, "");
    this.timeoutMs = cfg.timeoutMs ?? 60_000;
    this.maxRetries = cfg.maxRetries ?? 3;
    this.userAgent = cfg.userAgent ?? `widecast-js/${VERSION}`;
    this.#fetch = cfg.fetchImpl ?? globalThis.fetch;
    if (!this.#fetch) {
      throw new Error("No fetch implementation found. Pass `fetchImpl` for environments without global fetch.");
    }
  }

  // ── Public methods ──────────────────────────────────────────────────────
  async create_video(opts: CreateVideoOptions): Promise<Video> {
    if (!opts) {
      throw new InvalidRequestError(
        "create_video requires options.",
        { code: "missing_field", param: "options" },
      );
    }
    const source: Source = (opts.source ?? "text") as Source;
    if (!SOURCES.includes(source)) {
      throw new InvalidRequestError(
        `source must be one of ${JSON.stringify(SOURCES)} (got ${JSON.stringify(opts.source)}).`,
        { code: "invalid_source", param: "source" },
      );
    }
    const outputType: OutputType = opts.output_type ?? "scene";
    if (!OUTPUT_TYPES.includes(outputType)) {
      throw new InvalidRequestError(
        `output_type must be one of ${JSON.stringify(OUTPUT_TYPES)} (got ${JSON.stringify(opts.output_type)}).`,
        { code: "invalid_output_type", param: "output_type" },
      );
    }
    // output_type='text' = stop after the source→script-text phase, which
    // only exists for generative sources. source='text' already supplies the
    // script, so 'text' output would echo the input (A46).
    if (outputType === "text" && source === "text") {
      throw new InvalidRequestError(
        "output_type='text' requires a generative source (e.g. source='idea'). " +
        "With source='text' you already supplied the script — use output_type 'scene' or 'video'.",
        { code: "invalid_output_type", param: "output_type" },
      );
    }
    // faceless = force every scene to B-roll (no narrator A-roll). Only valid
    // with scenes (scene/video) for the script-based sources. Mirrors the
    // server's invalid_faceless rule.
    const faceless = opts.faceless === true;
    if (opts.faceless !== undefined && typeof opts.faceless !== "boolean") {
      throw new InvalidRequestError(
        `faceless must be a boolean (got ${JSON.stringify(opts.faceless)}).`,
        { code: "invalid_faceless", param: "faceless" },
      );
    }
    if (faceless) {
      if (outputType === "text") {
        throw new InvalidRequestError(
          "faceless controls A/B-roll for generated scenes; it has no effect " +
          "with output_type='text'. Use output_type 'scene' or 'video'.",
          { code: "invalid_faceless", param: "faceless" },
        );
      }
      if (!(FACELESS_SOURCES as readonly string[]).includes(source)) {
        throw new InvalidRequestError(
          `faceless is only supported for source in ${JSON.stringify(FACELESS_SOURCES)} ` +
          `(got source=${JSON.stringify(source)}).`,
          { code: "invalid_faceless", param: "faceless" },
        );
      }
    }
    const body: Record<string, unknown> = { source, output_type: outputType };
    if (faceless) body.faceless = true;
    if (Array.isArray(opts.media_pool) && opts.media_pool.length) {
      body.media_pool = opts.media_pool.filter((u) => typeof u === "string" && u.trim());
    }
    // Media file sources (video_file / audio_file) are sent as multipart;
    // these hold the file + its field name until dispatch.
    let uploadField: string | undefined;
    let uploadFile: Blob | undefined;

    if (source === "text") {
      if (typeof opts.script_text !== "string" || !opts.script_text.trim()) {
        throw new InvalidRequestError(
          "script_text (non-empty string) is required when source='text'.",
          { code: "missing_field", param: "script_text" },
        );
      }
      const wordCount = opts.script_text.trim().split(/\s+/).length;
      if (wordCount < SCRIPT_MIN_WORDS) {
        throw new InvalidRequestError(
          `script_text has ${wordCount} words; minimum is ${SCRIPT_MIN_WORDS} (~20s of narration).`,
          { code: "script_too_short", param: "script_text" },
        );
      }
      if (wordCount > SCRIPT_MAX_WORDS) {
        throw new InvalidRequestError(
          `script_text has ${wordCount} words; maximum is ${SCRIPT_MAX_WORDS} (~120s / 2 min of narration).`,
          { code: "script_too_long", param: "script_text" },
        );
      }
      body.script_text = opts.script_text;
    } else if (source === "idea" || source === "blog") { // generative — A48
      // Pick the input field + bounds + error codes by source.
      const genSpec = source === "idea"
        ? { field: "idea_text", value: opts.idea_text, min: IDEA_MIN_WORDS,
            missingCode: "missing_idea_text", tooShortCode: "idea_too_short" }
        : { field: "blog_text", value: opts.blog_text, min: BLOG_MIN_WORDS,
            missingCode: "missing_blog_text", tooShortCode: "blog_too_short" };
      if (typeof genSpec.value !== "string" || !genSpec.value.trim()) {
        throw new InvalidRequestError(
          `${genSpec.field} (non-empty string) is required when source='${source}'.`,
          { code: genSpec.missingCode, param: genSpec.field },
        );
      }
      const wordCount = genSpec.value.trim().split(/\s+/).length;
      if (wordCount < genSpec.min) {
        throw new InvalidRequestError(
          `${genSpec.field} has ${wordCount} words; minimum is ${genSpec.min}.`,
          { code: genSpec.tooShortCode, param: genSpec.field },
        );
      }
      // NO upper-bound rejection — server auto-truncates over the max.
      const language: Language = (opts.language ?? "English") as Language;
      if (!LANGUAGES.includes(language)) {
        throw new InvalidRequestError(
          `language must be one of ${JSON.stringify(LANGUAGES)} (got ${JSON.stringify(opts.language)}).`,
          { code: "invalid_language", param: "language" },
        );
      }
      const videoLength: VideoLength = (opts.video_length ?? "short") as VideoLength;
      if (!VIDEO_LENGTHS.includes(videoLength)) {
        throw new InvalidRequestError(
          `video_length must be one of ${JSON.stringify(VIDEO_LENGTHS)} (got ${JSON.stringify(opts.video_length)}).`,
          { code: "invalid_video_length", param: "video_length" },
        );
      }
      const researchEnabled = opts.research_enabled ?? true;
      if (typeof researchEnabled !== "boolean") {
        throw new InvalidRequestError(
          `research_enabled must be a boolean (got ${typeof researchEnabled}).`,
          { code: "invalid_research_enabled", param: "research_enabled" },
        );
      }
      body[genSpec.field] = genSpec.value;
      body.language = language;
      body.video_length = videoLength;
      body.research_enabled = researchEnabled;
    } else { // media-ingest source (audio/video, url/file) — A49/A50
      const media = MEDIA_SOURCES[source as keyof typeof MEDIA_SOURCES];
      if (media.input_kind === "url") {
        const value = source === "video_url" ? opts.video_url : opts.audio_url;
        if (typeof value !== "string" || !value.trim()) {
          throw new InvalidRequestError(
            `${media.field} (a media URL) is required when source='${source}'.`,
            { code: `missing_${media.field}`, param: media.field },
          );
        }
        body[media.field] = value.trim();
      } else { // file → multipart dispatch
        const file = source === "video_file" ? opts.video_file : opts.audio_file;
        if (!file) {
          throw new InvalidRequestError(
            `${media.field} (a Blob/File) is required when source='${source}'.`,
            { code: "missing_media_file", param: media.field },
          );
        }
        // File-size pre-validation (uploads only — 100 MB). Duration is
        // enforced server-side.
        if (typeof file.size === "number" && file.size > MEDIA_MAX_FILE_BYTES) {
          throw new InvalidRequestError(
            `${media.field} is ${(file.size / 1024 / 1024).toFixed(1)} MB; maximum is ` +
            `${Math.floor(MEDIA_MAX_FILE_BYTES / (1024 * 1024))} MB.`,
            { code: "file_too_large", param: media.field },
          );
        }
        uploadField = media.field;
        uploadFile = file;
      }
    }

    if (opts.wait_for_render) body.wait_for_render = true;
    if (opts.callback_url) body.callback_url = opts.callback_url;
    if (opts.metadata) body.metadata = opts.metadata;
    const idem = opts.idempotency_key ?? randomUuid();

    // Media file sources go out as multipart/form-data (mirrors the UI upload);
    // everything else is JSON.
    let data: VideoResource;
    if (uploadField) {
      const form = new FormData();
      for (const [k, v] of Object.entries(body)) {
        form.set(k, typeof v === "object" && v !== null ? JSON.stringify(v) : String(v));
      }
      form.set(uploadField, uploadFile as Blob,
               (uploadFile as { name?: string }).name ?? "upload");
      data = await this.#requestMultipart<VideoResource>("/v1/create_video", form, idem);
    } else {
      data = await this.#request<VideoResource>("POST", "/v1/create_video", body, idem);
    }
    return new Video(data, this);
  }

  /** POST /v1/export_video — kick the final-MP4 renderer for an existing
   *  scene-output video. Idempotent: calling twice is a no-op.
   *  Throws `PreconditionFailedError` if scenes are not yet ready. */
  async export_video(videoId: string): Promise<Video> {
    if (!videoId || typeof videoId !== "string") {
      throw new InvalidRequestError("video_id must be a non-empty string.", { code: "invalid_id", param: "video_id" });
    }
    const data = await this.#request<VideoResource>("POST", "/v1/export_video", { id: videoId });
    return new Video(data, this);
  }

  async get_status(videoId: string): Promise<Video> {
    if (!videoId || typeof videoId !== "string") {
      throw new InvalidRequestError("video_id must be a non-empty string.", { code: "invalid_id", param: "video_id" });
    }
    const data = await this.#request<VideoResource>("GET", `/v1/status/${videoId}`);
    return new Video(data, this);
  }

  /** POST /v1/create_content — generate written content (blog / social post)
   *  from a URL, an idea/topic, or pasted text. Async: returns a Video with
   *  `review_url` (the public content viewer) already populated — safe to
   *  share before completion; the viewer shows a spinner while content
   *  generates. Poll with `.wait()` for the final state. */
  async create_content(opts: CreateContentOptions): Promise<Video> {
    if (!opts || typeof opts.content !== "string" || !opts.content.trim()) {
      throw new InvalidRequestError("content (a URL, idea, or text) is required.",
        { code: "missing_field", param: "content" });
    }
    const contentType = opts.content_type ?? "blog";
    if (!(CONTENT_TYPES as readonly string[]).includes(contentType)) {
      throw new InvalidRequestError(
        `content_type must be one of ${JSON.stringify(CONTENT_TYPES)} (got ${JSON.stringify(opts.content_type)}).`,
        { code: "invalid_content_type", param: "content_type" });
    }
    const language = opts.language ?? "English";
    if (typeof language !== "string" || !language.trim()) {
      throw new InvalidRequestError('language (e.g. "English") is required.',
        { code: "missing_field", param: "language" });
    }
    const body: Record<string, unknown> = {
      content: opts.content.trim(), content_type: contentType, language: language.trim(),
    };
    if (opts.callback_url) body.callback_url = opts.callback_url;
    if (opts.metadata) body.metadata = opts.metadata;
    const data = await this.#request<VideoResource>("POST", "/v1/create_content", body);
    return new Video(data, this);
  }

  /** POST /v1/enhance_script — improve a DRAFT script with AI. Async: returns
   *  a Video with `review_url` (the Script Editor) already populated — safe
   *  to share before completion; the editor shows a spinner while enhancing.
   *  Poll with `.wait()` for the final enhanced script. */
  async enhance_script(opts: EnhanceScriptOptions): Promise<Video> {
    if (!opts || typeof opts.script_text !== "string" || !opts.script_text.trim()) {
      throw new InvalidRequestError("script_text (the draft to enhance) is required.",
        { code: "missing_field", param: "script_text" });
    }
    const level = opts.intervention_level ?? 1;
    if (!(INTERVENTION_LEVELS as readonly number[]).includes(level)) {
      throw new InvalidRequestError(
        `intervention_level must be one of ${JSON.stringify(INTERVENTION_LEVELS)} (got ${JSON.stringify(opts.intervention_level)}).`,
        { code: "invalid_intervention_level", param: "intervention_level" });
    }
    const body: Record<string, unknown> = {
      script_text: opts.script_text.trim(), intervention_level: level,
    };
    if (typeof opts.language === "string" && opts.language.trim()) body.language = opts.language.trim();
    if (opts.callback_url) body.callback_url = opts.callback_url;
    if (opts.metadata) body.metadata = opts.metadata;
    const data = await this.#request<VideoResource>("POST", "/v1/enhance_script", body);
    return new Video(data, this);
  }

  /** POST /v1/suggest_ideas — SYNCHRONOUS. Returns video topic ideas for an
   *  industry immediately (no polling). `industry_id` falls back to your
   *  account industry if omitted. Consumes credits. */
  async suggest_ideas(opts: SuggestIdeasOptions = {}): Promise<IdeasResponse> {
    const body: Record<string, unknown> = { num_topics: opts.num_topics ?? 5 };
    if (opts.industry_id) body.industry_id = opts.industry_id;
    if (opts.sub_industry) body.sub_industry = opts.sub_industry;
    if (opts.user_location) body.user_location = opts.user_location;
    return await this.#request<IdeasResponse>("POST", "/v1/suggest_ideas", body);
  }

  /** POST /v1/collect_ideas — SYNCHRONOUS. Returns video ideas derived from a
   *  product/service description (≥10 chars) immediately. Consumes credits. */
  async collect_ideas(opts: CollectIdeasOptions): Promise<IdeasResponse> {
    if (!opts || typeof opts.product_service_input !== "string"
        || opts.product_service_input.trim().length < 10) {
      throw new InvalidRequestError("product_service_input is required (≥10 chars).",
        { code: "missing_field", param: "product_service_input" });
    }
    const body: Record<string, unknown> = { product_service_input: opts.product_service_input.trim() };
    if (opts.sub_industry) body.sub_industry = opts.sub_industry;
    if (opts.user_location) body.user_location = opts.user_location;
    return await this.#request<IdeasResponse>("POST", "/v1/collect_ideas", body);
  }

  /** POST /v1/publish — distribute content to connected social platforms.
   *  Provide EXACTLY ONE of topic_id / text / video_url. `platforms` defaults
   *  to ALL connected. Charges 1 credit. Returns the accepted-publish envelope
   *  (HTTP 202) — publishing is async on the platform side, so poll
   *  get_status(id) (with any of `request_ids`) for per-platform post URLs. */
  async publish(opts: PublishOptions): Promise<PublishResponse> {
    const modes = [opts.topic_id, opts.text, opts.video_url].filter(Boolean);
    if (modes.length !== 1) {
      throw new InvalidRequestError(
        "Provide exactly one of topic_id, text, or video_url.",
        { code: "invalid_publish_input" });
    }
    if (opts.video_url && !(typeof opts.title === "string" && opts.title.trim())) {
      throw new InvalidRequestError(
        "title is required when posting an external video_url.",
        { code: "missing_field", param: "title" });
    }
    if (opts.platforms !== undefined) {
      const bad = opts.platforms.filter(
        (p) => !(PUBLISH_PLATFORMS as readonly string[]).includes(p));
      if (bad.length) {
        throw new InvalidRequestError(
          `Unknown platform(s) ${JSON.stringify(bad)}. Valid: ${JSON.stringify(PUBLISH_PLATFORMS)}.`,
          { code: "invalid_platforms", param: "platforms" });
      }
    }
    const body: Record<string, unknown> = {};
    if (opts.topic_id) body.topic_id = opts.topic_id.trim();
    if (opts.text) body.text = opts.text.trim();
    if (opts.video_url) body.video_url = opts.video_url.trim();
    if (opts.title) body.title = opts.title.trim();
    if (opts.description) body.description = opts.description.trim();
    if (opts.photo_urls) body.photo_urls = opts.photo_urls;
    if (opts.platforms) body.platforms = opts.platforms;
    if (opts.scheduled_date) body.scheduled_date = opts.scheduled_date;
    if (opts.timezone) body.timezone = opts.timezone;
    if (opts.callback_url) body.callback_url = opts.callback_url;
    if (opts.metadata) body.metadata = opts.metadata;
    return await this.#request<PublishResponse>("POST", "/v1/publish", body,
      opts.idempotency_key);
  }

  // ── Read / library (Batch C — GET, synchronous, free) ───────────────────
  #get<T>(path: string, params?: Record<string, unknown>): Promise<T> {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(params ?? {})) {
      if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
    }
    const q = qs.toString();
    return this.#request<T>("GET", q ? `${path}?${q}` : path);
  }

  /** GET /v1/videos — list the account's recent videos (20/page). Free. */
  async list_videos(opts: { from_record?: number } = {}): Promise<any> {
    return await this.#get("/v1/videos", { from_record: opts.from_record ?? 0 });
  }

  /** GET /v1/search — search the account's content by keywords. Free. */
  async search(query: string, opts: { limit?: number } = {}): Promise<any> {
    if (typeof query !== "string" || !query.trim()) {
      throw new InvalidRequestError("query is required.", { code: "missing_field", param: "q" });
    }
    return await this.#get("/v1/search", { q: query.trim(), limit: opts.limit ?? 10 });
  }

  /** GET /v1/account — account profile + remaining credits. Free. */
  async account(): Promise<any> {
    return await this.#get("/v1/account");
  }

  /** GET /v1/analytics — social analytics dashboard. Free but SLOW. */
  async analytics(opts: { period?: string; start_date?: string; end_date?: string } = {}): Promise<any> {
    return await this.#get("/v1/analytics", {
      period: opts.period ?? "last_week",
      start_date: opts.start_date,
      end_date: opts.end_date,
    });
  }

  /** GET /v1/roadmap — the account's content roadmap. Free. */
  async roadmap(opts: { cycle?: number } = {}): Promise<any> {
    return await this.#get("/v1/roadmap", { cycle: opts.cycle ?? 1 });
  }

  /** GET /v1/production_plan — the weekly production plan. Free.
   *  NOTE: passing both week_start + week_end may backfill rows upstream. */
  async production_plan(opts: { page?: number; week_start?: string; week_end?: string } = {}): Promise<any> {
    return await this.#get("/v1/production_plan", {
      page: opts.page ?? 0,
      week_start: opts.week_start,
      week_end: opts.week_end,
    });
  }

  /** GET /v1/foundation_videos — curated foundation-video templates. Free. */
  async foundation_videos(opts: { industry?: string; sub_industry?: string; page?: number } = {}): Promise<any> {
    return await this.#get("/v1/foundation_videos", {
      industry: opts.industry,
      sub_industry: opts.sub_industry,
      page: opts.page ?? 0,
    });
  }

  /** GET /v1/recommendations — recommended video ideas for an industry. Free. */
  async recommendations(opts: { industry?: string; page?: number } = {}): Promise<IdeasResponse> {
    return await this.#get<IdeasResponse>("/v1/recommendations", {
      industry: opts.industry,
      page: opts.page ?? 0,
    });
  }

  // ── Connections (Batch E — connect / accounts / configure, free) ────────
  /** POST /v1/connect — get an OAuth link to connect a social platform. Free.
   *  Returns `{object:"connect", url, expires_in, ...}` — the USER opens `url`
   *  to complete the connection on the web (WideCast never performs the OAuth). */
  async connect(opts: { platform?: PublishPlatform } = {}): Promise<any> {
    if (opts.platform && !(PUBLISH_PLATFORMS as readonly string[]).includes(opts.platform)) {
      throw new InvalidRequestError(
        `Unknown platform ${JSON.stringify(opts.platform)}. Valid: ${JSON.stringify(PUBLISH_PLATFORMS)}.`,
        { code: "invalid_platforms", param: "platform" });
    }
    const body: Record<string, unknown> = {};
    if (opts.platform) body.platform = opts.platform;
    return await this.#request<any>("POST", "/v1/connect", body);
  }

  /** GET /v1/accounts — list the account's connected social platforms. Free. */
  async accounts(): Promise<any> {
    return await this.#get("/v1/accounts");
  }

  /** GET /v1/platform_settings — load saved per-platform publish settings. Free. */
  async platform_settings(): Promise<any> {
    return await this.#get("/v1/platform_settings");
  }

  /** POST /v1/platform_settings — save one platform's publish settings. Free. */
  async set_platform_settings(platform: PublishPlatform, settings: Record<string, unknown>): Promise<any> {
    if (!(PUBLISH_PLATFORMS as readonly string[]).includes(platform)) {
      throw new InvalidRequestError(
        `platform must be one of ${JSON.stringify(PUBLISH_PLATFORMS)} (got ${JSON.stringify(platform)}).`,
        { code: "invalid_platforms", param: "platform" });
    }
    if (!settings || typeof settings !== "object") {
      throw new InvalidRequestError("settings (an object) is required.",
        { code: "missing_field", param: "settings" });
    }
    return await this.#request<any>("POST", "/v1/platform_settings", { platform, settings });
  }

  // ── HTTP plumbing ───────────────────────────────────────────────────────
  async #request<T>(method: string, path: string, body?: unknown, idempotencyKey?: string): Promise<T> {
    const url = this.baseUrl + path;
    const headers: Record<string, string> = {
      "Accept": "application/json",
      "User-Agent": this.userAgent,
      "X-Widecast-Sdk": `js/${VERSION}`,
    };
    // Telemetry header: opt-OUT via env. Only sends SDK name + version (no user data).
    // Set WIDECAST_DISABLE_TELEMETRY=1 to suppress.
    const disableTel = (typeof process !== "undefined" && process.env?.WIDECAST_DISABLE_TELEMETRY) || "";
    if (!["1", "true", "yes"].includes(String(disableTel).toLowerCase())) {
      headers["X-Widecast-Telemetry"] = `sdk=js/${VERSION}`;
    }
    if (body !== undefined) headers["Content-Type"] = "application/json";
    if (this.apiKey) headers["Authorization"] = `Bearer ${this.apiKey}`;
    if (idempotencyKey) headers["Idempotency-Key"] = idempotencyKey;

    let lastErr: unknown;
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      const controller = new AbortController();
      const tid = setTimeout(() => controller.abort(), this.timeoutMs);
      try {
        const resp = await this.#fetch(url, {
          method,
          headers,
          body: body === undefined ? undefined : JSON.stringify(body),
          signal: controller.signal,
        });
        clearTimeout(tid);
        // retry on 5xx/429
        if ((resp.status >= 500 || resp.status === 429) && attempt < this.maxRetries) {
          const wait = resp.status === 429
            ? Number(resp.headers.get("Retry-After") ?? 2) * 1000
            : backoffMs(attempt);
          await sleep(wait);
          continue;
        }
        return await decodeResponse<T>(resp);
      } catch (e) {
        clearTimeout(tid);
        lastErr = e;
        if (e instanceof WidecastError) throw e;
        if (attempt >= this.maxRetries) {
          throw new APIError(`Network error after ${attempt + 1} attempts: ${String(e)}`);
        }
        await sleep(backoffMs(attempt));
      }
    }
    throw new APIError(`Exhausted retries: ${String(lastErr)}`);
  }

  /** POST multipart/form-data — for media file sources (video_file /
   *  audio_file). Single attempt (uploads aren't safe to blindly retry; the
   *  Idempotency-Key lets the server dedupe if you retry yourself). NOTE: no
   *  Content-Type header — fetch sets the multipart boundary from the FormData. */
  async #requestMultipart<T>(path: string, form: FormData, idempotencyKey?: string): Promise<T> {
    const url = this.baseUrl + path;
    const headers: Record<string, string> = {
      "Accept": "application/json",
      "User-Agent": this.userAgent,
      "X-Widecast-Sdk": `js/${VERSION}`,
    };
    const disableTel = (typeof process !== "undefined" && process.env?.WIDECAST_DISABLE_TELEMETRY) || "";
    if (!["1", "true", "yes"].includes(String(disableTel).toLowerCase())) {
      headers["X-Widecast-Telemetry"] = `sdk=js/${VERSION}`;
    }
    if (this.apiKey) headers["Authorization"] = `Bearer ${this.apiKey}`;
    if (idempotencyKey) headers["Idempotency-Key"] = idempotencyKey;

    const controller = new AbortController();
    const tid = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const resp = await this.#fetch(url, { method: "POST", headers, body: form, signal: controller.signal });
      clearTimeout(tid);
      return await decodeResponse<T>(resp);
    } catch (e) {
      clearTimeout(tid);
      if (e instanceof WidecastError) throw e;
      throw new APIError(`Network error during upload: ${String(e)}`);
    }
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Module helpers
// ────────────────────────────────────────────────────────────────────────────
function sleep(ms: number): Promise<void> { return new Promise(r => setTimeout(r, ms)); }

function backoffMs(attempt: number): number {
  const base = Math.min(500 * 2 ** attempt, 8_000);
  return base + Math.random() * 250;
}

function randomUuid(): string {
  if (typeof crypto !== "undefined" && (crypto as Crypto).randomUUID) {
    return (crypto as Crypto).randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

async function decodeResponse<T>(resp: Response): Promise<T> {
  const requestId = resp.headers.get("X-Request-Id") ?? "";
  let data: unknown = null;
  try { data = await resp.json(); } catch (_) { data = null; }

  if (resp.ok) return data as T;

  const err = ((data as { error?: ErrorBody })?.error) ?? {};
  const ErrClass = ERROR_CLASSES[err.type ?? "api_error"] ?? WidecastError;
  throw new ErrClass(err.message ?? `HTTP ${resp.status}`, {
    code: err.code ?? "",
    requestId: err.request_id ?? requestId,
    status: resp.status,
    docUrl: err.doc_url ?? "",
    param: err.param,
    details: (err as { details?: unknown }).details ?? null,
    responseJson: data,
  });
}

// ────────────────────────────────────────────────────────────────────────────
// Webhook signature verification.
//
// WideCast signs every webhook with HMAC-SHA256:
//   signed   = `${timestamp}.${requestBody}`
//   sig      = HMAC_SHA256(secret, signed).hexdigest()
//   header   = `X-WideCast-Signature: t=<timestamp>,v1=<sig_hex>`
//
// Example (Node http):
//   import { verifyWebhook, WebhookVerificationError } from "@widecast/sdk";
//   const body = await readRawBody(req);  // raw text, NOT re-stringified JSON
//   try {
//     const event = await verifyWebhook({
//       body,
//       signatureHeader: req.headers["x-widecast-signature"] as string,
//       secret: process.env.WIDECAST_WEBHOOK_SECRET!,
//     });
//   } catch (e) { ... }
// ────────────────────────────────────────────────────────────────────────────
export class WebhookVerificationError extends Error {
  constructor(m: string) { super(m); this.name = "WebhookVerificationError"; }
}

export interface VerifyWebhookOptions {
  body: string;                  // raw request body as text — DO NOT re-stringify JSON
  signatureHeader: string;       // full `t=…,v1=…` value
  secret: string;
  toleranceSeconds?: number;     // default 300 (5 min)
}

export async function verifyWebhook(opts: VerifyWebhookOptions): Promise<any> {
  const { body, signatureHeader, secret } = opts;
  const tolerance = opts.toleranceSeconds ?? 300;

  if (!signatureHeader) throw new WebhookVerificationError("missing X-WideCast-Signature header");

  const parts: Record<string, string> = {};
  for (const piece of signatureHeader.split(",")) {
    const [k, v] = piece.split("=", 2);
    if (k && v !== undefined) parts[k.trim()] = v;
  }
  const ts = parts["t"];
  const sig = parts["v1"];
  if (!ts || !sig) throw new WebhookVerificationError("signature header missing t= or v1=");
  const tsInt = Number(ts);
  if (!Number.isFinite(tsInt)) throw new WebhookVerificationError("t= is not an integer");
  if (Math.abs(Date.now() / 1000 - tsInt) > tolerance) {
    throw new WebhookVerificationError(
      `signature timestamp outside tolerance window (${tolerance}s) — possible replay`
    );
  }

  const signed = `${ts}.${body}`;
  const expected = await hmacSha256Hex(secret, signed);
  if (!timingSafeEqual(expected, sig)) throw new WebhookVerificationError("signature mismatch");

  try {
    return JSON.parse(body);
  } catch (e: any) {
    throw new WebhookVerificationError(`body is not valid JSON: ${e?.message}`);
  }
}

async function hmacSha256Hex(secret: string, msg: string): Promise<string> {
  const enc = new TextEncoder();
  const subtle = (globalThis.crypto && (globalThis.crypto as any).subtle) || null;
  if (subtle) {
    const key = await subtle.importKey(
      "raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
    );
    const buf = await subtle.sign("HMAC", key, enc.encode(msg));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
  }
  // Node fallback
  const cryptoMod = await import("node:crypto");
  return cryptoMod.createHmac("sha256", secret).update(msg).digest("hex");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// Default export for convenient `import Widecast from "@widecast/sdk"`.
export default Widecast;
