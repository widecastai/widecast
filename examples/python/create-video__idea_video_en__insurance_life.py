"""
🎬 Idea → Final MP4 · English — 🛡 L&H Insurance

Auto-generated from widecast/docs/playgrounds/create-video.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard2")

resp = client.create_video(**{ 'source': 'idea',
  'output_type': 'video',
  'language': 'English',
  'video_length': 'short',
  'callback_url': 'https://widecast.ai/app/dashboard2/webhook_to_telegram',
  'idea_text': 'Why term life insurance covers families better than whole life for the '
               'same death benefit — the 5-15x premium gap, the cash-value myth, and '
               'the years your kids actually depend on you.'})
print(resp)
