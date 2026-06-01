/**
 * Idea → Scenes · English
 *
 * Auto-generated from widecast/docs/playgrounds/create-video.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard2" });

const resp = await client.create_video({
  "source": "idea",
  "idea_text": "Why teens should get their driver's license at 16, not 18 — independence, responsibility, and stake-low practice.",
  "language": "English",
  "video_length": "short",
  "output_type": "scene",
  "wait_for_render": false
});
console.log(resp);
