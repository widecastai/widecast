/**
 * 💡 Idea · English — ✈️ Travel
 *
 * Auto-generated from widecast/docs/playgrounds/create-video.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard" });

const resp = await client.create_video({
  "source": "idea",
  "language": "English",
  "output_type": "scene",
  "video_length": "short",
  "faceless": false,
  "callback_url": "",
  "idea_text": "Why Japan's Shinkansen has had zero passenger deaths in 60 years and 10 billion riders — dedicated tracks, automatic train control, and earthquake detection that cuts power in one second."
});
console.log(resp);
