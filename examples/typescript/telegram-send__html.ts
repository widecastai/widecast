/**
 * ✨ HTML-formatted message
 *
 * Auto-generated from widecast/docs/playgrounds/telegram-send.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard" });

const resp = await client.v1_telegram_send({
  "message": "<b>Render finished</b>\nOpen <a href='https://widecast.ai/'>WideCast</a> to publish.",
  "parse_mode": "HTML"
});
console.log(resp);
