/**
 * 🚫 record without topic_id (negative — 400)
 *
 * Auto-generated from widecast/docs/playgrounds/client-link-send.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard" });

const resp = await client.v1_client_link_send({
  "link_type": "record"
});
console.log(resp);
