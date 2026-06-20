"""
🎬 Video URL → Auto-Edit · English — 🎬 Open Movie (Sintel)

Auto-generated from widecast/docs/playgrounds/create-video.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard")

resp = client.create_video(**{ 'source': 'video_url',
  'output_type': 'scene',
  'callback_url': '',
  'video_url': 'https://www.youtube.com/watch?v=eRsGyueVLvQ'})
print(resp)
