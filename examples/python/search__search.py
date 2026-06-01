"""
🔎 Search by keyword

Auto-generated from widecast/docs/playgrounds/search.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard2")

resp = client.v1_search(**{'q': 'marketing tips', 'limit': 10})
print(resp)
