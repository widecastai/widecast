"""
🚫 record without topic_id (negative — 400)

Auto-generated from widecast/docs/playgrounds/client-link-send.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard")

resp = client.v1_client_link_send(**{'link_type': 'record'})
print(resp)
