"""
💡 Idea · English — 🗳 Politics

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
  'idea_text': 'Why the electoral college persists despite Wyoming voters counting '
               '3.7x more than California voters — the 1787 origin without telephones '
               'or national parties, and the constitutional amendment math that keeps '
               'it.'})
print(resp)
