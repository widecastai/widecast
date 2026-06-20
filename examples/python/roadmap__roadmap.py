"""
🗺️ Roadmap

Auto-generated from widecast/docs/playgrounds/roadmap.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard")

resp = client.v1_roadmap(**{'cycle': 1})
print(resp)
