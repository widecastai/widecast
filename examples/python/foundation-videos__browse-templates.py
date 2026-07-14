"""
🎬 Browse templates for an industry

Auto-generated from widecast/docs/playgrounds/foundation-videos.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard")

resp = client.v1_foundation_videos(**{'industry': 'real estate', 'page': 0})
print(resp)
