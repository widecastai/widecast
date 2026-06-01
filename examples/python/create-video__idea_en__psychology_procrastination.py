"""
💡 Idea · English — 🧠 Psychology

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
  'idea_text': 'Why you procrastinate even on things you love — the '
               'prefrontal-vs-limbic argument, the two-minute rule, and implementation '
               'intentions that flip the balance.'})
print(resp)
