/**
 * 🎙️ Audio base64 → Audio-to-Video · English (AI-agent path)
 *
 * Auto-generated from widecast/docs/playgrounds/create-video.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard" });

const resp = await client.create_video({
  "source": "audio_base64",
  "output_type": "scene",
  "audio_filename": "voice_memo.mp3"
});
console.log(resp);
