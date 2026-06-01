/**
 * Short paragraph (English)
 *
 * Auto-generated from widecast/docs/playgrounds/create-video.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard2" });

const resp = await client.create_video({
  "script_text": "California parents should encourage their teens to get a driver's license at 16.\nDriving builds independence, responsibility, and confidence.\nDon't wait — the longer you delay, the harder it gets.\n",
  "wait_for_render": false
});
console.log(resp);
