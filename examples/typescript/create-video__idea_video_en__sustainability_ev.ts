/**
 * 🎬 Idea → Final MP4 · English — 🌱 Sustainability
 *
 * Auto-generated from widecast/docs/playgrounds/create-video.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard2" });

const resp = await client.create_video({
  "source": "idea",
  "output_type": "video",
  "language": "English",
  "video_length": "short",
  "callback_url": "https://widecast.ai/app/dashboard2/webhook_to_telegram",
  "idea_text": "Why electric vehicles aren't truly zero-emission but still beat gas cars — the 10-ton manufacturing footprint, the 18-month break-even in California's grid, and the 5-year break-even in coal-heavy regions."
});
console.log(resp);
