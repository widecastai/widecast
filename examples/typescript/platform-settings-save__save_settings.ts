/**
 * 💾 Save publish settings
 *
 * Auto-generated from widecast/docs/playgrounds/platform-settings-save.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard2" });

const resp = await client.v1_platform_settings({
  "platform": "youtube",
  "settings": {
    "privacy": "public"
  }
});
console.log(resp);
