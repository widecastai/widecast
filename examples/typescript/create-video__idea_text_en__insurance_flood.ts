/**
 * 📝 Idea → Script text · English — 🛡 P&C Insurance
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
  "idea_text": "Why standard homeowner's insurance excludes flood damage — the federal flood program, the 15% of households actually covered, and why one in four flood claims comes from outside high-risk zones."
});
console.log(resp);
