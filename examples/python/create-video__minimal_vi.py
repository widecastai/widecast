"""
Minimal · 1 line (Vietnamese)

Auto-generated from widecast/docs/playgrounds/create-video.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard2")

resp = client.create_video(**{ 'script_text': 'Bạn nên cho con lấy bằng lái xe ngay khi 16 tuổi.',
  'wait_for_render': False})
print(resp)
