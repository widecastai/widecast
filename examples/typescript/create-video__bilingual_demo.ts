/**
 * Bilingual · 2 scenes (English + Vietnamese)
 *
 * Auto-generated from widecast/docs/playgrounds/create-video.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard2" });

const resp = await client.create_video({
  "wait_for_render": false,
  "script": {
    "aspectRatio": "9_16",
    "language": "vi",
    "title": "WideCast bilingual demo",
    "segments": [
      {
        "id": 1,
        "type": "HOOK",
        "text": "Here's why every California teen should get their license at 16.",
        "language": "en"
      },
      {
        "id": 2,
        "type": "BODY",
        "text": "Cha mẹ ở California nên khuyến khích con lấy bằng lái ngay khi đủ tuổi.",
        "language": "vi"
      }
    ]
  }
});
console.log(resp);
