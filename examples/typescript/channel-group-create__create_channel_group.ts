/**
 * ➕ Create a channel group
 *
 * Auto-generated from widecast/docs/playgrounds/channel-group-create.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard" });

const resp = await client.v1_channel_groups({
  "label": "English channels"
});
console.log(resp);
