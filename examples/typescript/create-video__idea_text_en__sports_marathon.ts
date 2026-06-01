/**
 * 📝 Idea → Script text · English — 🏃 Sports & Fitness
 *
 * Auto-generated from widecast/docs/playgrounds/create-video.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard2" });

const resp = await client.create_video({
  "source": "idea",
  "output_type": "text",
  "language": "English",
  "video_length": "short",
  "idea_text": "Why marathoners hit the wall at mile 20 — the 2000-calorie glycogen tank, the 100-calorie-per-mile burn rate, and the two training fixes that push the wall back."
});
console.log(resp);
