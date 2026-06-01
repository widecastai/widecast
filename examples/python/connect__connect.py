"""
🔗 Connect a platform

Auto-generated from widecast/docs/playgrounds/connect.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard2")

resp = client.v1_connect(**{'platform': 'youtube'})
print(resp)
