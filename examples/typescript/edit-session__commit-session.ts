/**
 * ✅ Commit after the last scene (REQUIRED to finish)
 *
 * Auto-generated from widecast/docs/playgrounds/edit-session.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard" });

const resp = await client.v1_edit_session({
  "id": "widecast7c0d4f8a9b1e2d3f",
  "action": "commit"
});
console.log(resp);
