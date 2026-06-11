# @widecast/sdk

Official JavaScript / TypeScript SDK for [WideCast.ai](https://widecast.ai) — generate short-form videos from a script, an idea, a blog post, or an existing video/audio clip via a clean REST API. Works in Node 18+, Deno, Bun, and modern browsers.

```bash
npm install @widecast/sdk
```

## 60-second example

```typescript
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME" });

// Source = "text" — you've already written the narration (verbatim).
const video = await client.create_video({
  source: "text",
  script_text:
    "The first 10 minutes after a car crash decide whether your insurance pays — or fights you. " +
    "First: pull over, hazards on; if anyone's hurt, dial 911. " +
    "Second: do NOT say 'I'm sorry' at the scene — admission of fault hurts your claim. " +
    "Third: take photos of both cars, both plates, the road, skid marks. " +
    "Fourth: swap name, license, plate, insurance company and policy number with the other driver. " +
    "Fifth: call your insurance the same day. Save this so you don't have to think when it happens.",
});

console.log(video.review_url);            // Show the user immediately — page handles early arrival
const done = await video.wait();          // Polls /v1/status with backoff (5s → 60s cap)
console.log(done.status, done.video_url); // 'completed' + final MP4 URL
```

## Source routing — pick honestly

WideCast's REST API takes one of several **sources** depending on what you have.  If you're driving the SDK from an AI agent that **cannot do real research** (no web search, no URL fetch, no image search), don't write the script yourself — let WideCast research and write it for you:

```typescript
// Source = "idea" — the server researches the topic AND writes the script.
// Use this when you (or the AI driving the SDK) can't fetch the web or
// harvest image URLs to back up a "current event" script.
const video = await client.create_video({
  source: "idea",
  idea_text: "5 things every first-time driver should do right after a car accident.",
});
const done = await video.wait();
```

Other sources:

| `source` | When to use | Required field |
|---|---|---|
| `"text"` | You have a finished 80–500-word narration. | `script_text` |
| `"idea"` | You have a short brief (5–1000 words). Server researches + writes the script. | `idea_text` |
| `"blog"` | Repurpose an existing 30–3000-word article into a video. | `blog_text` |
| `"video_url"` / `"audio_url"` | Remake from an existing media URL. | `video_url` / `audio_url` |
| `"video_file"` / `"audio_file"` | Same, from a local file (multipart upload — use the SDK helper). | `video_file` / `audio_file` |

The full writing method (research → harvest images → 3-Layer Hook → inline media → hand-off) is a vendor-neutral skill at `https://widecast.ai/skills/video-script-writing.zip` — fetch it from any LLM before drafting a `source="text"` script.

## Setup

```typescript
import Widecast from "@widecast/sdk";

const client = new Widecast({
  apiKey: "wc_live_...",                                 // or WIDECAST_API_KEY env var
  baseUrl: "https://widecast.ai/app/dashboard2",         // default for v0.1.0 pilot
  timeoutMs: 60_000,
  maxRetries: 3,
});
```

## Methods

```typescript
client.create_video({ source, script_text?, idea_text?, blog_text?,
                      video_url?, audio_url?,
                      output_type?, language?, faceless?,
                      callback_url?, metadata?, idempotency_key? }): Promise<Video>;

client.get_status(videoId: string): Promise<Video>;       // single check
client.export_video(videoId: string): Promise<Video>;     // render final MP4 (scene → video)

client.create_content({ content, content_type?, language? }): Promise<Video>;   // blog / social post
client.enhance_script({ script_text, language?, intervention_level? }): Promise<Video>;

client.suggest_ideas({ industry_id?, num_topics?, sub_industry?, user_location? }): Promise<IdeasResponse>;
client.collect_ideas({ product_service_input, sub_industry?, user_location? }): Promise<IdeasResponse>;

client.publish({ topic_id?, text?, video_url?, photo_urls?, platforms?, title? }): Promise<PublishResponse>;
client.list_videos({ from_record? }): Promise<unknown>;
client.search(query, { limit? }): Promise<unknown>;
client.account(): Promise<unknown>;

// Video instance
video.id              // string — widecast<alphanumeric>
video.status          // 'pending' | 'processing' | 'completed' | 'failed'
video.review_url      // string — share with user immediately (present from first response)
video.video_url       // string | null — final MP4 (output_type='video' only)
video.progress_label  // string — UX hint like "Generating scene visuals · ~7 min left"
video.isTerminal      // boolean
video.wait({ timeoutMs?, pollIntervalMs? })  // polls until terminal
```

See [openapi.json](https://widecast.ai/openapi.json) for the full schema.

## Error handling

```typescript
import {
  WidecastError, InvalidRequestError, NotFoundError,
  PreconditionFailedError, RateLimitError, APIError,
} from "@widecast/sdk";

try {
  const video = await client.create_video({ source: "text", script_text: "..." });
} catch (e) {
  if (e instanceof InvalidRequestError && e.code === "credit_exhausted") {
    // HTTP 402 — show user both options
    console.log(`You're out of credits on the ${e.details?.current_plan} plan.`);
    console.log(`Wait until ${e.details?.reset_at} (monthly refresh) — or upgrade now:`);
    console.log(e.upgrade_url);   // https://widecast.ai/#pricing_plans
  } else if (e instanceof InvalidRequestError) {
    console.log(`Bad input: ${e.message} (param=${e.param}, requestId=${e.requestId})`);
  } else if (e instanceof RateLimitError) {
    console.log("Slow down, retry after a moment.");
  } else if (e instanceof APIError) {
    console.log(`Server issue: ${e.code} — share requestId=${e.requestId} in support tickets.`);
  } else {
    throw e;
  }
}
```

Every error carries `e.code`, `e.message`, `e.requestId`, `e.docUrl`, `e.status`. HTTP 402 (`credit_exhausted` / `account_expired`) additionally carries `e.details` with `upgrade_url`, `reset_at`, `current_plan`, `credits_remaining`, `next_plan`, etc. — see [`CreditErrorDetails`](https://widecast.ai/openapi.json).

## Browser usage

The SDK uses native `fetch`. To call WideCast from the browser, CORS must be enabled on the server. Until you have your own backend proxy, prefer running the SDK server-side (Node / Edge functions).

## More

- **Docs & live playground**: <https://widecast.ai/docs.html> · <https://widecast.ai/playground.html>
- **OpenAPI 3.1 spec**: <https://widecast.ai/openapi.json>
- **Issues & discussion**: <https://github.com/widecastai/widecast/discussions>

## License

Apache-2.0.
