/**
 * 🎬 Idea → Final MP4 · English — 💰 Finance
 *
 * Auto-generated from widecast/docs/playgrounds/create-video.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard2" });

const resp = await client.create_video({
  "source": "idea",
  "output_type": "video",
  "language": "English",
  "video_length": "short",
  "callback_url": "https://widecast.ai/app/dashboard2/webhook_to_telegram",
  "idea_text": "Why a Roth IRA opened at 25 ends up worth $1M more than the same plan started at 35 — compound interest, the years exponent that matters most, and the $100/month threshold most people miss."
});
console.log(resp);
