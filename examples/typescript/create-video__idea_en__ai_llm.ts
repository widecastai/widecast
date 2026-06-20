/**
 * 💡 Idea · English — 🤖 AI & LLM
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
  "idea_text": "Why GPT-4 and Claude hallucinate 5-10% of the time and three concrete fixes — retrieval grounding, temperature zero for factual tasks, and forcing the model to cite or quote."
});
console.log(resp);
