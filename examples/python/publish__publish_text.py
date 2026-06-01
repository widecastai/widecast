"""
✍️ Post arbitrary text

Auto-generated from widecast/docs/playgrounds/publish.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard2")

resp = client.v1_publish(**{'text': 'We just shipped v2 — try it free today!'})
print(resp)
