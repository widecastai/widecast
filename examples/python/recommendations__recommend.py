"""
💡 Recommended ideas

Auto-generated from widecast/docs/playgrounds/recommendations.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard2")

resp = client.v1_recommendations(**{'industry': 'Real Estate', 'page': 0})
print(resp)
