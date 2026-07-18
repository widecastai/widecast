/**
 * 🔔 Plain notification (email + Telegram if connected)
 *
 * Auto-generated from widecast/docs/playgrounds/notification-send.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard" });

const resp = await client.v1_notification_send({
  "subject": "Your video is ready",
  "message": "All 8 scenes finished rendering — open the editor to review."
});
console.log(resp);
