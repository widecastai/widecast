/**
 * 🔬 Server/debug audit — include remotion_poster_*
 *
 * Auto-generated from widecast/docs/playgrounds/video-data.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard" });

const resp = await client.v1_video_data({
  "video_id": "widecastABCDEFGHIJKL",
  "include_diagnostics": true
});
console.log(resp);
