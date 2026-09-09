/**
 * 🎬 Scene-level failure
 *
 * Auto-generated from widecast/docs/playgrounds/error-report.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard" });

const resp = await client.v1_error_report({
  "module": "scene_upload",
  "error_message": "upload_failed: 413 payload too large after auto-compression",
  "context": {
    "topic_id": "widecast7c0d4f8a9b1e2d3f",
    "voice_file": "XcR0k",
    "scene_id": 3
  }
});
console.log(resp);
