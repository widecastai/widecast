"""
Idea → Scenes · English

Auto-generated from widecast/docs/playgrounds/create-video.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard2")

resp = client.create_video(**{ 'source': 'idea',
  'idea_text': "Why teens should get their driver's license at 16, not 18 — "
               'independence, responsibility, and stake-low practice.',
  'language': 'English',
  'video_length': 'short',
  'output_type': 'scene',
  'wait_for_render': False})
print(resp)
