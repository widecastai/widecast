/**
 * (G) Layout batch — via the explicit `layout.batch` envelope
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
      "field_name": "layout.batch",
      "value": {
        "fields": [
          {
            "field_name": "overlay.narrator.rect",
            "value": {
              "x": 35,
              "y": 124,
              "w": 210,
              "h": 374
            }
          },
          {
            "field_name": "overlay.caption.y",
            "value": 408
          }
        ]
      }
    }
  ]
});
console.log(resp);
