"""
Short paragraph (English)

Auto-generated from widecast/docs/playgrounds/create-video.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard2")

resp = client.create_video(**{ 'script_text': "California parents should encourage their teens to get a driver's "
                 'license at 16.\n'
                 'Driving builds independence, responsibility, and confidence.\n'
                 "Don't wait — the longer you delay, the harder it gets.\n",
  'wait_for_render': False})
print(resp)
