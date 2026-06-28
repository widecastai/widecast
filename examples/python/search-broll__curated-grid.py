"""
🪟 Curated WideCast grid backgrounds (special `keyword="grid"`)

Auto-generated from widecast/docs/playgrounds/search-broll.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard")

resp = client.v1_search_broll(**{'keyword': 'grid', 'kind': 'video'})
print(resp)
