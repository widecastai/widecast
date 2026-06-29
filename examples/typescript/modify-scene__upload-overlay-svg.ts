/**
 * (B) Upload Overlay — agent-authored SVG → svg2spec (PREFERRED, FREE)
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
      "field_name": "remotion.upload_overlay",
      "value": "https://cdn.example.com/scene-overlay.svg"
    }
  ]
});
console.log(resp);
