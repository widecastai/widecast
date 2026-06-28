/**
 * (A) Background swap — image, by voice_file
 *
 * Auto-generated from widecast/docs/playgrounds/modify-scene.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard" });

const resp = await client.v1_modify_scene({
  "id": "widecast7c0d4f8a9b1e2d3f",
  "by": "voice_file",
  "value": "XcR0k",
  "fields": [
    {
      "field_name": "mediaUrl",
      "value": "https://cdn.example.com/coast-sunset.jpg"
    },
    {
      "field_name": "mediaType",
      "value": "image"
    }
  ]
});
console.log(resp);
