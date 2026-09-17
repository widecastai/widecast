/**
 * 🌐 Every channel group summed
 *
 * Auto-generated from widecast/docs/playgrounds/analytics.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard" });

const resp = await client.v1_analytics({
  "period": "last_month",
  "channel_group": "all"
});
console.log(resp);
