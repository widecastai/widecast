"""
➕ Create a channel group

Auto-generated from widecast/docs/playgrounds/channel-group-create.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard")

resp = client.v1_channel_groups(**{'label': 'English channels'})
print(resp)
