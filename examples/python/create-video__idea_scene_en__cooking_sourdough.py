"""
💡 Idea → Scenes · English — 🍞 Cooking

Auto-generated from widecast/docs/playgrounds/create-video.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard2")

resp = client.create_video(**{ 'source': 'idea',
  'output_type': 'scene',
  'language': 'English',
  'video_length': 'short',
  'idea_text': 'Why your sourdough is dense — 75% hydration vs 65%, the 28°C '
               'fermentation sweet spot, and tight final shaping. Three fixes that '
               'produce open crumb.'})
print(resp)
