/**
 * 📬 Record link + notify via Telegram + email
 *
 * Auto-generated from widecast/docs/playgrounds/client-link-send.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard" });

const resp = await client.v1_client_link_send({
  "link_type": "record",
  "topic_id": "widecastab12",
  "ttl_days": 7,
  "channels": {
    "telegram": true,
    "email": true
  }
});
console.log(resp);
