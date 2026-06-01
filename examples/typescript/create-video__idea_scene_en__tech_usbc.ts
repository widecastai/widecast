/**
 * 💡 Idea → Scenes · English — 💻 Technology
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
  "idea_text": "How USB-C ended fifteen years of cable chaos — from 1996 micro-USB at 12 Mbps to USB-C with Thunderbolt at 40 Gbps and 240W power, plus the EU mandate that forced Apple's hand."
});
console.log(resp);
