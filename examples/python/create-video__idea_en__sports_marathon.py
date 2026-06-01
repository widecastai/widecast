"""
💡 Idea · English — 🏃 Sports & Fitness

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
  'idea_text': 'Why marathoners hit the wall at mile 20 — the 2000-calorie glycogen '
               'tank, the 100-calorie-per-mile burn rate, and the two training fixes '
               'that push the wall back.'})
print(resp)
