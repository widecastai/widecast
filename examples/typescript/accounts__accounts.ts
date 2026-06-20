/**
 * 🔌 Connected accounts
 *
 * Auto-generated from widecast/docs/playgrounds/accounts.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard" });

const resp = await client.v1_accounts({});
console.log(resp);
