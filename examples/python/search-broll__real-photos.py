"""
🖼️ Real photos (Google search)

Auto-generated from widecast/docs/playgrounds/search-broll.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard")

resp = client.v1_search_broll(**{'keyword': 'Eiffel Tower morning', 'kind': 'image', 'limit': 8})
print(resp)
