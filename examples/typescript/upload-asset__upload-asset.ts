/**
 * 📎 Upload an asset (audio / video / image / document)
 *
 * Auto-generated from widecast/docs/playgrounds/upload-asset.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard" });

const resp = await client.v1_upload_asset({});
console.log(resp);
