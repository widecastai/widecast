/**
 * 💡 Idea · English — 🛒 Ecommerce
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
  "idea_text": "Why most Shopify stores convert under 2% and how the top stores hit 4-6% — page speed under 3 seconds, real customer photos, and shipping costs surfaced above the cart."
});
console.log(resp);
