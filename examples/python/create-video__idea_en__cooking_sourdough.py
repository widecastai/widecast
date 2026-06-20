"""
💡 Idea · English — 🍞 Cooking

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
  'idea_text': 'Why your sourdough is dense — 75% hydration vs 65%, the 28°C '
               'fermentation sweet spot, and tight final shaping. Three fixes that '
               'produce open crumb.'})
print(resp)
