"""
📝 Idea → Script text · English — 💰 Finance

Auto-generated from widecast/docs/playgrounds/create-video.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard2")

resp = client.create_video(**{ 'source': 'idea',
  'output_type': 'text',
  'language': 'English',
  'video_length': 'short',
  'idea_text': 'Why a Roth IRA opened at 25 ends up worth $1M more than the same plan '
               'started at 35 — compound interest, the years exponent that matters '
               'most, and the $100/month threshold most people miss.'})
print(resp)
