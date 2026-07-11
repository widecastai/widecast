/**
 * (O) Overlay text edit — retype a poster line (0-LLM, SVG-sourced)
 *
 * Auto-generated from widecast/docs/playgrounds/modify-scene.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard" });

const resp = await client.v1_modify_scene({
  "id": "widecast7c0d4f8a9b1e2d3f",
  "by": "voice_file",
  "value": "Xb79O",
  "fields": [
    {
      "field_name": "overlay.text_edit",
      "value": {
        "wc_object": "support_stack",
        "lines": [
          "KHOAN VAY MUA NHA",
          "DUNG CHU QUAN"
        ],
        "fill": "#FFD60A"
      }
    }
  ]
});
console.log(resp);
