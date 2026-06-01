/**
 * 💡 Suggest ideas
 *
 * Auto-generated from widecast/docs/playgrounds/suggest-ideas.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard2" });

const resp = await client.v1_suggest_ideas({
  "industry_id": "Real Estate",
  "num_topics": "5"
});
console.log(resp);
