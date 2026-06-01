"""
🎬 Script → Final MP4 · English — 🛡 P&C Insurance

Auto-generated from widecast/docs/playgrounds/create-video.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard2")

resp = client.create_video(**{ 'source': 'text',
  'output_type': 'video',
  'callback_url': 'https://widecast.ai/app/dashboard2/webhook_to_telegram',
  'script_text': "Your homeowner's insurance probably doesn't cover floods. Most "
                 'people learn this after a storm. Standard policies exclude '
                 'rising-water damage entirely, including hurricanes, river overflow, '
                 'and even heavy rain pooling. Flood insurance is a separate policy, '
                 'usually sold through the federal flood program for homes in '
                 'high-risk zones. Less than fifteen percent of US households carry '
                 'it. The average flood claim is forty-three thousand dollars. Renters '
                 'can buy contents-only flood coverage for under twenty dollars a '
                 'month. Homeowners outside high-risk zones still face moderate risk, '
                 'about one in four flood claims happens outside designated zones. '
                 "Check your zone code, then call your agent. Floods don't wait for "
                 'hurricane season.'})
print(resp)
