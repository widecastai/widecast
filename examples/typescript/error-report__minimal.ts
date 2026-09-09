/**
 * 🚩 Minimal report
 *
 * Auto-generated from widecast/docs/playgrounds/error-report.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard" });

const resp = await client.v1_error_report({
  "error_message": "video_data returned 502 script_parse_failed on a video that renders fine in the editor"
});
console.log(resp);
