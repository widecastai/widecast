/**
 * 🎧 Audio URL → Audio-to-Video · English — 🎬 Open Movie (Sintel)
 *
 * Auto-generated from widecast/docs/playgrounds/create-video.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard" });

const resp = await client.create_video({
  "source": "audio_url",
  "output_type": "scene",
  "callback_url": "",
  "audio_url": "https://www.youtube.com/watch?v=eRsGyueVLvQ"
});
console.log(resp);
