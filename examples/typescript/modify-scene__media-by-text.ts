/**
 * (A) Swap by what's said in the scene (video)
 *
 * Auto-generated from widecast/docs/playgrounds/modify-scene.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard" });

const resp = await client.v1_modify_scene({
  "id": "widecast7c0d4f8a9b1e2d3f",
  "by": "text",
  "value": "Meta đã chi 14.3 tỷ đô để mua Scale AI",
  "fields": [
    {
      "field_name": "mediaUrl",
      "value": "https://cdn.example.com/scale-ai-news.mp4"
    },
    {
      "field_name": "mediaType",
      "value": "video"
    }
  ]
});
console.log(resp);
