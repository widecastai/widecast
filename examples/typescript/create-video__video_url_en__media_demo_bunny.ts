/**
 * 🎬 Video URL → Auto-Edit · English — 🎬 Open Movie (Big Buck Bunny)
 *
 * Auto-generated from widecast/docs/playgrounds/create-video.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard" });

const resp = await client.create_video({
  "source": "video_url",
  "output_type": "scene",
  "callback_url": "",
  "video_url": "https://www.youtube.com/watch?v=YE7VzlLtp-4"
});
console.log(resp);
