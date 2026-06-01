"""
🎬 Script → Final MP4 · English — 📣 Marketing

Auto-generated from widecast/docs/playgrounds/create-video.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard2")

resp = client.create_video(**{ 'source': 'text',
  'output_type': 'video',
  'callback_url': 'https://widecast.ai/app/dashboard2/webhook_to_telegram',
  'script_text': 'Your Instagram engagement just dropped seventy percent, and nothing '
                 'you posted is at fault. The algorithm shifted in twenty-twenty-six. '
                 'Reels now get four times the reach of static posts. Posts with under '
                 'three seconds of attention get downranked. Hashtag relevance now '
                 'beats hashtag volume. Three things will recover your reach. Switch '
                 'to reels-first content even if you hate filming. Open with a hook in '
                 'the first one point five seconds, text, motion, or a question. Tag '
                 'your niche with three precise hashtags, not twenty broad ones. '
                 "Engagement isn't dead. The shortcut to it just changed. Test these "
                 'three changes this week, then check insights.'})
print(resp)
