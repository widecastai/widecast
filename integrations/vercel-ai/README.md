# WideCast for Vercel AI SDK

[Vercel AI SDK](https://sdk.vercel.ai/) tool wrappers for the WideCast API. Works with any provider supported by the SDK (OpenAI, Anthropic, Mistral, Google, …).

## Install

```bash
npm install @widecast/sdk ai zod
```

Copy `tools.ts` into your project (or `npm install @widecast/vercel-ai` once published).

## Use

```typescript
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import Widecast from "@widecast/sdk";
import { widecastTools } from "./tools";

const tools = widecastTools(new Widecast({ apiKey: process.env.WIDECAST_API_KEY }));

const { text } = await generateText({
  model: openai("gpt-4o-mini"),
  tools,
  prompt: "Tạo video về việc tập thể dục buổi sáng (3 scenes).",
  maxSteps: 5,
});
console.log(text);
```

## Tools exposed

- `widecast_create_video({ script, wait_for_render? })`
- `widecast_get_video({ video_id })`

## License

Apache-2.0.
