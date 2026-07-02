/**
 * 🎨 Overlay-only on solid black — audit typos/diacritics/glyph/grammar/semantic
 *
 * Auto-generated from widecast/docs/playgrounds/scene-inspector.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard" });

const resp = await client.v1_scene_inspector({
  "id": "widecast7c0d4f8a9b1e2d3f",
  "action": "overlay_poster",
  "voice_file": "XcR0k"
});
console.log(resp);
