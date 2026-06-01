/**
 * 💡 Idea → Scenes · English — 🧠 Psychology
 *
 * Auto-generated from widecast/docs/playgrounds/create-video.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard2" });

const resp = await client.create_video({
  "source": "idea",
  "output_type": "scene",
  "language": "English",
  "video_length": "short",
  "idea_text": "Why you procrastinate even on things you love — the prefrontal-vs-limbic argument, the two-minute rule, and implementation intentions that flip the balance."
});
console.log(resp);
