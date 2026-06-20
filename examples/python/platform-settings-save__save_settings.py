"""
💾 Save publish settings

Auto-generated from widecast/docs/playgrounds/platform-settings-save.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard")

resp = client.v1_platform_settings(**{'platform': 'youtube', 'settings': {'privacy': 'public'}})
print(resp)
