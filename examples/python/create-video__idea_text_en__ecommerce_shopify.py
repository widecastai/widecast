"""
📝 Idea → Script text · English — 🛒 Ecommerce

Auto-generated from widecast/docs/playgrounds/create-video.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard2")

resp = client.create_video(**{ 'source': 'idea',
  'output_type': 'text',
  'language': 'English',
  'video_length': 'short',
  'idea_text': 'Why most Shopify stores convert under 2% and how the top stores hit '
               '4-6% — page speed under 3 seconds, real customer photos, and shipping '
               'costs surfaced above the cart.'})
print(resp)
