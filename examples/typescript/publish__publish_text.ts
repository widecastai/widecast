/**
 * ✍️ Post arbitrary text
 *
 * Auto-generated from widecast/docs/playgrounds/publish.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard" });

const resp = await client.v1_publish({
  "text": "We just shipped v2 — try it free today!"
});
console.log(resp);
