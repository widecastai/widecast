/**
 * 🎴 4 square variations to pick from
 *
 * Auto-generated from widecast/docs/playgrounds/create-image.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard" });

const resp = await client.v1_create_image({
  "prompt": "minimalist desk setup with a single houseplant",
  "ratio": "square",
  "count": 4
});
console.log(resp);
