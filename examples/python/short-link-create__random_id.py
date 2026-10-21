"""
🔗 Short link with a random ID

Auto-generated from widecast/docs/playgrounds/short-link-create.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard")

resp = client.v1_short_links(**{'url': 'https://example.com/spring-sale?utm_source=newsletter'})
print(resp)
