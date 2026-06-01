"""
🎬 Idea → Final MP4 · English — ✈️ Travel

Auto-generated from widecast/docs/playgrounds/create-video.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard2")

resp = client.create_video(**{ 'source': 'idea',
  'output_type': 'video',
  'language': 'English',
  'video_length': 'short',
  'callback_url': 'https://widecast.ai/app/dashboard2/webhook_to_telegram',
  'idea_text': "Why Japan's Shinkansen has had zero passenger deaths in 60 years and "
               '10 billion riders — dedicated tracks, automatic train control, and '
               'earthquake detection that cuts power in one second.'})
print(resp)
