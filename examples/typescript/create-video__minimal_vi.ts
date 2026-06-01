/**
 * Minimal · 1 line (Vietnamese)
 *
 * Auto-generated from widecast/docs/playgrounds/create-video.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard2" });

const resp = await client.create_video({
  "script_text": "Bạn nên cho con lấy bằng lái xe ngay khi 16 tuổi.",
  "wait_for_render": false
});
console.log(resp);
