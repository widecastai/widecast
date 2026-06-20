/**
 * 💬 Plain text notification
 *
 * Auto-generated from widecast/docs/playgrounds/telegram-send.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard" });

const resp = await client.v1_telegram_send({
  "message": "Your video is ready to review! Open the dashboard to pick scenes."
});
console.log(resp);
