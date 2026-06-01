/**
 * WideCast tools for the Vercel AI SDK.
 *
 * Usage:
 *   import { generateText } from "ai";
 *   import { openai } from "@ai-sdk/openai";
 *   import Widecast from "@widecast/sdk";
 *   import { widecastTools } from "./tools";
 *
 *   const tools = widecastTools(new Widecast({ apiKey: process.env.WIDECAST_API_KEY }));
 *   const { text } = await generateText({
 *     model: openai("gpt-4o-mini"),
 *     tools,
 *     prompt: "Generate a video about morning exercise.",
 *   });
 */
import { tool } from "ai";
import { z } from "zod";
import Widecast from "@widecast/sdk";

export function widecastTools(client?: Widecast) {
  const c = client ?? new Widecast();

  return {
    widecast_create_video: tool({
      description:
        "Create a short-form video from a fully-formed video script JSON. " +
        "The video renders asynchronously. Returns id and initial status='processing'. " +
        "Poll widecast_get_status until status='completed', then use result.review_url " +
        "to send the user to the scene review page.",
      parameters: z.object({
        script_text: z
          .string()
          .min(1)
          .max(50000)
          .describe(
            "Plain-text script. The server segments it into HOOK/BODY/CTA scenes + renders voice + B-roll.",
          ),
        wait_for_render: z
          .boolean()
          .optional()
          .default(false)
          .describe(
            "If true, server blocks up to 60s waiting for render. Otherwise async — poll widecast_get_status.",
          ),
      }),
      execute: async ({ script_text, wait_for_render }) => {
        const v = await c.create_video({ script_text, wait_for_render });
        return v;
      },
    }),

    widecast_get_status: tool({
      description:
        "Poll the current state of a WideCast video by id. " +
        "Returns status (pending|processing|completed|failed), " +
        "progress 0..1, and when status='completed', result.review_url is " +
        "the URL where the user reviews scenes + audio.",
      parameters: z.object({
        video_id: z
          .string()
          .regex(/^widecast[a-zA-Z0-9]{12,32}$/)
          .describe("Video id returned by widecast_create_video (e.g. widecast7c0d4f8a9b1e2d3f)."),
      }),
      execute: async ({ video_id }) => c.get_status(video_id),
    }),
  };
}
