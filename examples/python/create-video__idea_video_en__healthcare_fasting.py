"""
🎬 Idea → Final MP4 · English — 🏥 Healthcare

Auto-generated from widecast/docs/playgrounds/create-video.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard2")

resp = client.create_video(**{ 'source': 'idea',
  'output_type': 'video',
  'language': 'English',
  'video_length': 'short',
  'callback_url': 'https://widecast.ai/app/dashboard2/webhook_to_telegram',
  'idea_text': 'Why intermittent fasting works for half the people who try it and '
               'fails for the other half — insulin mechanism, the binge trap in the '
               'eating window, and the 30% of people with a CLOCK gene variant.'})
print(resp)
