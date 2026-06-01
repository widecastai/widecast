/**
 * 🏛️ Foundation templates
 *
 * Auto-generated from widecast/docs/playgrounds/foundation-videos.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard2" });

const resp = await client.v1_foundation_videos({
  "industry": "Real Estate",
  "page": 0
});
console.log(resp);
