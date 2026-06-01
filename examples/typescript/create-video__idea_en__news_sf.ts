/**
 * 💡 Idea · English — 📰 News
 *
 * Auto-generated from widecast/docs/playgrounds/create-video.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard2" });

const resp = await client.create_video({
  "source": "idea",
  "language": "English",
  "output_type": "scene",
  "video_length": "short",
  "faceless": false,
  "callback_url": "",
  "idea_text": "Why San Francisco's office occupancy climbed back from 41% to nearly 60% in two years — return-to-office mandates, tech hiring resuming at OpenAI and Anthropic, and a 40% drop in lease prices."
});
console.log(resp);
