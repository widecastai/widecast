"""
✨ Enhance a draft

Auto-generated from widecast/docs/playgrounds/enhance-script.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard")

resp = client.v1_enhance_script(**{ 'script_text': 'Want more views? Post consistently. Engagement matters. The end.',
  'intervention_level': '1',
  'language': '',
  'callback_url': ''})
print(resp)
