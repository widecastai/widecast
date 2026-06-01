"""
Idea → Scenes · Tiếng Việt

Auto-generated from widecast/docs/playgrounds/create-video.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard2")

resp = client.create_video(**{ 'source': 'idea',
  'idea_text': 'Tại sao phụ huynh nên cho con học lái xe ngay khi đủ 16 tuổi — lợi ích '
               'về tính độc lập và kỹ năng ra quyết định.',
  'language': 'Vietnamese',
  'video_length': 'short',
  'output_type': 'scene',
  'wait_for_render': False})
print(resp)
