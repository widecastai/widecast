/**
 * 🖼️ Real photos (Google search)
 *
 * Auto-generated from widecast/docs/playgrounds/search-broll.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard" });

const resp = await client.v1_search_broll({
  "keyword": "Eiffel Tower morning",
  "kind": "image",
  "limit": 8
});
console.log(resp);
