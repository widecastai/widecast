"""
🏛️ Foundation templates

Auto-generated from widecast/docs/playgrounds/foundation-videos.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard2")

resp = client.v1_foundation_videos(**{'industry': 'Real Estate', 'page': 0})
print(resp)
