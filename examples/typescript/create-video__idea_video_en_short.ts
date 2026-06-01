/**
 * Idea → Final MP4 · English (with webhook)
 *
 * Auto-generated from widecast/docs/playgrounds/create-video.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard2" });

const resp = await client.create_video({
  "source": "idea",
  "idea_text": "A practical guide to choosing a first driver's license: when to start, what California permits look like, and how parents can coach without being annoying.",
  "language": "English",
  "video_length": "short",
  "output_type": "video",
  "callback_url": "https://widecast.ai/app/dashboard2/webhook_to_telegram",
  "wait_for_render": false
});
console.log(resp);
