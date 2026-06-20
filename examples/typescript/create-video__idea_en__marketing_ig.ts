/**
 * 💡 Idea · English — 📣 Marketing
 *
 * Auto-generated from widecast/docs/playgrounds/create-video.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard" });

const resp = await client.create_video({
  "source": "idea",
  "language": "English",
  "output_type": "scene",
  "video_length": "short",
  "faceless": false,
  "callback_url": "",
  "idea_text": "Why Instagram engagement dropped 70% in 2026 and how to recover — the algorithm shift toward Reels, the 1.5-second hook rule, and the hashtag relevance change."
});
console.log(resp);
