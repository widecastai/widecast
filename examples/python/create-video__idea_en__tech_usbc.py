"""
💡 Idea · English — 💻 Technology

Auto-generated from widecast/docs/playgrounds/create-video.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard")

resp = client.create_video(**{ 'source': 'idea',
  'language': 'English',
  'output_type': 'scene',
  'video_length': 'short',
  'faceless': False,
  'callback_url': '',
  'idea_text': 'How USB-C ended fifteen years of cable chaos — from 1996 micro-USB at '
               '12 Mbps to USB-C with Thunderbolt at 40 Gbps and 240W power, plus the '
               "EU mandate that forced Apple's hand."})
print(resp)
