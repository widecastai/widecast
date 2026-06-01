/**
 * 🗺️ Roadmap
 *
 * Auto-generated from widecast/docs/playgrounds/roadmap.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard2" });

const resp = await client.v1_roadmap({
  "cycle": 1
});
console.log(resp);
