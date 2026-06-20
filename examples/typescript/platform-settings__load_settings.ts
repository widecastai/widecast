/**
 * ⚙️ Load publish settings
 *
 * Auto-generated from widecast/docs/playgrounds/platform-settings.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard" });

const resp = await client.v1_platform_settings({});
console.log(resp);
