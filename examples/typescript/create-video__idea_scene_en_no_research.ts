/**
 * Idea → Scenes · research disabled
 *
 * Auto-generated from widecast/docs/playgrounds/create-video.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard2" });

const resp = await client.create_video({
  "source": "idea",
  "idea_text": "A short pep talk for someone starting their first day at a new job — keep it warm, specific, and under a minute.",
  "language": "English",
  "video_length": "short",
  "research_enabled": false,
  "output_type": "scene",
  "wait_for_render": false
});
console.log(resp);
