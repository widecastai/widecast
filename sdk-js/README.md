# @widecast/sdk

Official JavaScript / TypeScript SDK for [WideCast.ai](https://widecast.ai). Works in Node 18+, Deno, Bun, and modern browsers.

```bash
npm install @widecast/sdk
```

## 60-second example

```typescript
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME" });

const video = await client.create_video({
  script: {
    language: "vi",
    aspectRatio: "9_16",
    segments: [
      { id: 1, type: "HOOK",
        text: "Bạn nên cho con lấy bằng lái xe ngay khi 16 tuổi." }
    ],
  },
}).then(v => v.wait());                  // poll until completed/failed

console.log(video.status, video.video_url);
```

## Setup

```typescript
import Widecast from "@widecast/sdk";

const client = new Widecast({
  apiKey: "wc_live_...",                                 // or WIDECAST_API_KEY env var
  baseUrl: "https://widecast.ai/app/dashboard2",             // default for v0.1.0 pilot
  timeoutMs: 60_000,
  maxRetries: 3,
});
```

## Methods

```typescript
client.create_video({
  script,
  wait_for_render?: boolean,
  callback_url?: string,
  metadata?: Record<string, unknown>,
  idempotency_key?: string,
}): Promise<Video>;

client.get_video(videoId: string): Promise<Video>;

video.wait({ timeoutMs?: number; pollIntervalMs?: number }): Promise<Video>;

video.id           // string
video.status       // 'processing' | 'rendering' | 'completed' | 'failed'
video.video_url    // string | null
video.isTerminal   // boolean
```

## Error handling

```typescript
import {
  WidecastError, InvalidRequestError, NotFoundError,
  RateLimitError, APIError,
} from "@widecast/sdk";

try {
  const video = await client.create_video({ script });
} catch (e) {
  if (e instanceof InvalidRequestError) {
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

## Browser usage

The SDK uses native `fetch`. To call WideCast from the browser, CORS must be enabled on the server.
Until you have your own backend proxy, prefer running the SDK server-side (Node / Edge functions).

## License

Apache-2.0.
