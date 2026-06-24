/**
 * 🖼️ Single portrait image
 *
 * Auto-generated from widecast/docs/playgrounds/create-image.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard" });

const resp = await client.v1_create_image({
  "prompt": "a wooden ladder leaning against a red brick wall, morning light",
  "ratio": "portrait",
  "count": 1
});
console.log(resp);
