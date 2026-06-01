/**
 * 💡 Idea · English — 🗳 Politics
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
  "idea_text": "Why the electoral college persists despite Wyoming voters counting 3.7x more than California voters — the 1787 origin without telephones or national parties, and the constitutional amendment math that keeps it."
});
console.log(resp);
