"""
💡 Idea → Scenes · English — 🗳 Politics

Auto-generated from widecast/docs/playgrounds/create-video.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard2")

resp = client.create_video(**{ 'source': 'idea',
  'output_type': 'scene',
  'language': 'English',
  'video_length': 'short',
  'idea_text': 'Why the electoral college persists despite Wyoming voters counting '
               '3.7x more than California voters — the 1787 origin without telephones '
               'or national parties, and the constitutional amendment math that keeps '
               'it.'})
print(resp)
