/**
 * 🎬 Post an external video URL
 *
 * Auto-generated from widecast/docs/playgrounds/publish.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard2" });

const resp = await client.v1_publish({
  "video_url": "https://cdn.example.com/clip.mp4",
  "title": "Launch teaser"
});
console.log(resp);
