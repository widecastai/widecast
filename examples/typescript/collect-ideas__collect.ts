/**
 * 🧩 Ideas from a product
 *
 * Auto-generated from widecast/docs/playgrounds/collect-ideas.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard" });

const resp = await client.v1_collect_ideas({
  "product_service_input": "A budgeting app for freelancers with automatic tax estimates",
  "target_location": "California, United States"
});
console.log(resp);
