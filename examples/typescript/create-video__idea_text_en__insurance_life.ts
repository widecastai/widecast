/**
 * 📝 Idea → Script text · English — 🛡 L&H Insurance
 *
 * Auto-generated from widecast/docs/playgrounds/create-video.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard2" });

const resp = await client.create_video({
  "source": "idea",
  "output_type": "text",
  "language": "English",
  "video_length": "short",
  "idea_text": "Why term life insurance covers families better than whole life for the same death benefit — the 5-15x premium gap, the cash-value myth, and the years your kids actually depend on you."
});
console.log(resp);
