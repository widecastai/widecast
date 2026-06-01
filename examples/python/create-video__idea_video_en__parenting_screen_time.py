"""
🎬 Idea → Final MP4 · English — 👶 Parenting

Auto-generated from widecast/docs/playgrounds/create-video.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard2")

resp = client.create_video(**{ 'source': 'idea',
  'output_type': 'video',
  'language': 'English',
  'video_length': 'short',
  'callback_url': 'https://widecast.ai/app/dashboard2/webhook_to_telegram',
  'idea_text': 'Why screen time over 2 hours daily at age 2 raises language-delay risk '
               'by 30% — serve-and-return conversation, brain wiring, and the recovery '
               'path.'})
print(resp)
