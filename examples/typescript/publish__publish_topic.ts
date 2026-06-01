/**
 * 📣 Publish an existing WideCast video/blog
 *
 * Auto-generated from widecast/docs/playgrounds/publish.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard2" });

const resp = await client.v1_publish({
  "topic_id": "widecast7c0d4f8a9b1e2d3f",
  "platforms": [
    "youtube",
    "x"
  ]
});
console.log(resp);
