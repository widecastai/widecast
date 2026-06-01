/**
 * 🎬 Idea → Final MP4 · English — 🍞 Cooking
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
  "idea_text": "Why your sourdough is dense — 75% hydration vs 65%, the 28°C fermentation sweet spot, and tight final shaping. Three fixes that produce open crumb."
});
console.log(resp);
