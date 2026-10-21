/**
 * 🔗 Short link with a random ID
 *
 * Auto-generated from widecast/docs/playgrounds/short-link-create.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard" });

const resp = await client.v1_short_links({
  "url": "https://example.com/spring-sale?utm_source=newsletter"
});
console.log(resp);
