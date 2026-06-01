/**
 * 🎬 Idea → Final MP4 · English — 🚀 Startup
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
  "idea_text": "Every founder's two non-negotiable numbers — burn rate and runway. The formula, the eight-month case study, and the default-alive threshold separating fundable startups from desperate ones."
});
console.log(resp);
