"""
📝 Idea → Script text · English — ₿ Crypto

Auto-generated from widecast/docs/playgrounds/create-video.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard2")

resp = client.create_video(**{ 'source': 'idea',
  'output_type': 'text',
  'language': 'English',
  'video_length': 'short',
  'idea_text': "Why Bitcoin's halving every four years matters — Satoshi's 21M supply "
               'cap, the mining reward schedule from 2009 onwards, and why scarcity is '
               'mathematical not opinion.'})
print(resp)
