"""
💡 Idea · English — 🌱 Sustainability

Auto-generated from widecast/docs/playgrounds/create-video.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard2")

resp = client.create_video(**{ 'source': 'idea',
  'language': 'English',
  'output_type': 'scene',
  'video_length': 'short',
  'faceless': False,
  'callback_url': '',
  'idea_text': "Why electric vehicles aren't truly zero-emission but still beat gas "
               'cars — the 10-ton manufacturing footprint, the 18-month break-even in '
               "California's grid, and the 5-year break-even in coal-heavy regions."})
print(resp)
