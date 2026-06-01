"""
📣 Publish an existing WideCast video/blog

Auto-generated from widecast/docs/playgrounds/publish.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard2")

resp = client.v1_publish(**{'topic_id': 'widecast7c0d4f8a9b1e2d3f', 'platforms': ['youtube', 'x']})
print(resp)
