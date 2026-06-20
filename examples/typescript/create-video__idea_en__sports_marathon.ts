/**
 * 💡 Idea · English — 🏃 Sports & Fitness
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
  "idea_text": "Why marathoners hit the wall at mile 20 — the 2000-calorie glycogen tank, the 100-calorie-per-mile burn rate, and the two training fixes that push the wall back."
});
console.log(resp);
