"""
🎬 Idea → Final MP4 · English — 📰 News

Auto-generated from widecast/docs/playgrounds/create-video.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard2")

resp = client.create_video(**{ 'source': 'idea',
  'output_type': 'video',
  'language': 'English',
  'video_length': 'short',
  'callback_url': 'https://widecast.ai/app/dashboard2/webhook_to_telegram',
  'idea_text': "Why San Francisco's office occupancy climbed back from 41% to nearly "
               '60% in two years — return-to-office mandates, tech hiring resuming at '
               'OpenAI and Anthropic, and a 40% drop in lease prices.'})
print(resp)
