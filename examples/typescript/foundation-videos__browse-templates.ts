/**
 * 🎬 Browse templates for an industry
 *
 * Auto-generated from widecast/docs/playgrounds/foundation-videos.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard" });

const resp = await client.v1_foundation_videos({
  "industry": "real estate",
  "page": 0
});
console.log(resp);
