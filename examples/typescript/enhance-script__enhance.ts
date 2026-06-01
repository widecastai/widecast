/**
 * ✨ Enhance a draft
 *
 * Auto-generated from widecast/docs/playgrounds/enhance-script.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard2" });

const resp = await client.v1_enhance_script({
  "script_text": "Want more views? Post consistently. Engagement matters. The end.",
  "intervention_level": "1",
  "language": "",
  "callback_url": ""
});
console.log(resp);
