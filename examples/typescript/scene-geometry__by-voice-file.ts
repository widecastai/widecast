/**
 * 🧭 Audit a scene by voice_file (preferred)
 *
 * Auto-generated from widecast/docs/playgrounds/scene-geometry.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard" });

const resp = await client.v1_scene_geometry({
  "id": "widecast7c0d4f8a9b1e2d3f",
  "voice_file": "XcR0k"
});
console.log(resp);
