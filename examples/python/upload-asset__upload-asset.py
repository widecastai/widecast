"""
📎 Upload an asset (audio / video / image / document)

Auto-generated from widecast/docs/playgrounds/upload-asset.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard")

resp = client.v1_upload_asset(**{})
print(resp)
