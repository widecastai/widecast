"""
📝 Written content

Auto-generated from widecast/docs/playgrounds/create-content.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard")

resp = client.v1_create_content(**{ 'content': 'Why early-stage founders should ship a new feature every week',
  'content_type': 'blog',
  'language': 'English',
  'callback_url': ''})
print(resp)
