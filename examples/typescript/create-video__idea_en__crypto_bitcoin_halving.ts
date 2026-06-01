/**
 * 💡 Idea · English — ₿ Crypto
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
  "idea_text": "Why Bitcoin's halving every four years matters — Satoshi's 21M supply cap, the mining reward schedule from 2009 onwards, and why scarcity is mathematical not opinion."
});
console.log(resp);
