/**
 * 🎬 Recent videos
 *
 * Auto-generated from widecast/docs/playgrounds/videos.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard" });

const resp = await client.v1_videos({
  "from_record": 0
});
console.log(resp);
