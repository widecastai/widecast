"""
🧩 Ideas from a product

Auto-generated from widecast/docs/playgrounds/collect-ideas.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard2")

resp = client.v1_collect_ideas(**{ 'product_service_input': 'A budgeting app for freelancers with automatic tax '
                           'estimates'})
print(resp)
