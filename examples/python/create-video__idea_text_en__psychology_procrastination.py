"""
📝 Idea → Script text · English — 🧠 Psychology

Auto-generated from widecast/docs/playgrounds/create-video.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard2")

resp = client.create_video(**{ 'source': 'idea',
  'output_type': 'text',
  'language': 'English',
  'video_length': 'short',
  'idea_text': 'Why you procrastinate even on things you love — the '
               'prefrontal-vs-limbic argument, the two-minute rule, and implementation '
               'intentions that flip the balance.'})
print(resp)
