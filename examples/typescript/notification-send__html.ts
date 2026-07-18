/**
 * ✨ HTML-formatted body
 *
 * Auto-generated from widecast/docs/playgrounds/notification-send.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard" });

const resp = await client.v1_notification_send({
  "subject": "Render finished",
  "message": "<b>Final cut</b> is ready — open <a href='https://widecast.ai/'>WideCast</a> to publish.",
  "parse_mode": "HTML"
});
console.log(resp);
