"""
🎬 Recent videos

Auto-generated from widecast/docs/playgrounds/videos.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard2")

resp = client.v1_videos(**{'from_record': 0})
print(resp)
