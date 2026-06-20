/**
 * 📅 Production plan
 *
 * Auto-generated from widecast/docs/playgrounds/production-plan.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard" });

const resp = await client.v1_production_plan({
  "page": 0
});
console.log(resp);
