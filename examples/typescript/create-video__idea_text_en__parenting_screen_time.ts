/**
 * 📝 Idea → Script text · English — 👶 Parenting
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
  "idea_text": "Why screen time over 2 hours daily at age 2 raises language-delay risk by 30% — serve-and-return conversation, brain wiring, and the recovery path."
});
console.log(resp);
