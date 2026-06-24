/**
 * 🎬 Stock video clips (portrait)
 *
 * Auto-generated from widecast/docs/playgrounds/search-broll.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard" });

const resp = await client.v1_search_broll({
  "keyword": "umbrella rain",
  "kind": "video",
  "ratio": "portrait",
  "limit": 10
});
console.log(resp);
