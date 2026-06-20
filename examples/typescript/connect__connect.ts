/**
 * 🔗 Connect a platform
 *
 * Auto-generated from widecast/docs/playgrounds/connect.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard" });

const resp = await client.v1_connect({
  "platform": "youtube"
});
console.log(resp);
