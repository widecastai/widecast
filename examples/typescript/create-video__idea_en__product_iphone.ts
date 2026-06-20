/**
 * 💡 Idea · English — 📱 Product Review
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
  "idea_text": "Why most iPhone 15 owners should skip the iPhone 17 — 20% faster processor you won't feel, the camera upgrade that only matters for portraits, and the $200 price jump."
});
console.log(resp);
