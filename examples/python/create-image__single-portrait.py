"""
🖼️ Single portrait image

Auto-generated from widecast/docs/playgrounds/create-image.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard")

resp = client.v1_create_image(**{ 'prompt': 'a wooden ladder leaning against a red brick wall, morning light',
  'ratio': 'portrait',
  'count': 1})
print(resp)
