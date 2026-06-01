/**
 * 💡 Idea · English — 🏠 Real Estate
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
  "idea_text": "Why first-time Bay Area buyers should run the rent-vs-buy math before signing another lease — median home price, mortgage rates, hidden closing costs, and the income threshold where buying beats renting."
});
console.log(resp);
