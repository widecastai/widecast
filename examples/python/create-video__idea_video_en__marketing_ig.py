"""
🎬 Idea → Final MP4 · English — 📣 Marketing

Auto-generated from widecast/docs/playgrounds/create-video.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard2")

resp = client.create_video(**{ 'source': 'idea',
  'output_type': 'video',
  'language': 'English',
  'video_length': 'short',
  'callback_url': 'https://widecast.ai/app/dashboard2/webhook_to_telegram',
  'idea_text': 'Why Instagram engagement dropped 70% in 2026 and how to recover — the '
               'algorithm shift toward Reels, the 1.5-second hook rule, and the '
               'hashtag relevance change.'})
print(resp)
