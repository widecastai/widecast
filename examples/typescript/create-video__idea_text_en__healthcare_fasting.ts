/**
 * 📝 Idea → Script text · English — 🏥 Healthcare
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
  "idea_text": "Why intermittent fasting works for half the people who try it and fails for the other half — insulin mechanism, the binge trap in the eating window, and the 30% of people with a CLOCK gene variant."
});
console.log(resp);
