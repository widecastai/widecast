"""
💡 Idea → Scenes · English — 🛡 P&C Insurance

Auto-generated from widecast/docs/playgrounds/create-video.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard2")

resp = client.create_video(**{ 'source': 'idea',
  'output_type': 'scene',
  'language': 'English',
  'video_length': 'short',
  'idea_text': "Why standard homeowner's insurance excludes flood damage — the federal "
               'flood program, the 15% of households actually covered, and why one in '
               'four flood claims comes from outside high-risk zones.'})
print(resp)
