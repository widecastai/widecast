"""
💡 Idea · English — 🛡 L&H Insurance

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
  'idea_text': 'Why term life insurance covers families better than whole life for the '
               'same death benefit — the 5-15x premium gap, the cash-value myth, and '
               'the years your kids actually depend on you.'})
print(resp)
