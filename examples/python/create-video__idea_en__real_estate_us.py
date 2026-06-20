"""
💡 Idea · English — 🏠 Real Estate

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
  'idea_text': 'Why first-time Bay Area buyers should run the rent-vs-buy math before '
               'signing another lease — median home price, mortgage rates, hidden '
               'closing costs, and the income threshold where buying beats renting.'})
print(resp)
