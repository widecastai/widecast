"""
🎬 Post an external video URL

Auto-generated from widecast/docs/playgrounds/publish.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard2")

resp = client.v1_publish(**{'video_url': 'https://cdn.example.com/clip.mp4', 'title': 'Launch teaser'})
print(resp)
