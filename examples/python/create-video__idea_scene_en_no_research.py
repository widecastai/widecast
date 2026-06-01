"""
Idea → Scenes · research disabled

Auto-generated from widecast/docs/playgrounds/create-video.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard2")

resp = client.create_video(**{ 'source': 'idea',
  'idea_text': 'A short pep talk for someone starting their first day at a new job — '
               'keep it warm, specific, and under a minute.',
  'language': 'English',
  'video_length': 'short',
  'research_enabled': False,
  'output_type': 'scene',
  'wait_for_render': False})
print(resp)
