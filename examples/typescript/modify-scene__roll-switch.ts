/**
 * (J) A/B-roll switch — show narrator A-roll
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
      "field_name": "roll.active",
      "value": "A"
    }
  ]
});
console.log(resp);
