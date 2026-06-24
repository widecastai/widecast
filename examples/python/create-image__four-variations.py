"""
🎴 4 square variations to pick from

Auto-generated from widecast/docs/playgrounds/create-image.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard")

resp = client.v1_create_image(**{ 'prompt': 'minimalist desk setup with a single houseplant',
  'ratio': 'square',
  'count': 4})
print(resp)
