/**
 * 📝 Written content
 *
 * Auto-generated from widecast/docs/playgrounds/create-content.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard" });

const resp = await client.v1_create_content({
  "content": "Why early-stage founders should ship a new feature every week",
  "content_type": "blog",
  "language": "English",
  "callback_url": ""
});
console.log(resp);
