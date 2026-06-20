"""
💡 Idea · English — 👶 Parenting

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
  'idea_text': 'Why screen time over 2 hours daily at age 2 raises language-delay risk '
               'by 30% — serve-and-return conversation, brain wiring, and the recovery '
               'path.'})
print(resp)
