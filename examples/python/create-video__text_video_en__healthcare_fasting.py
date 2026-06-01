"""
🎬 Script → Final MP4 · English — 🏥 Healthcare

Auto-generated from widecast/docs/playgrounds/create-video.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard2")

resp = client.create_video(**{ 'source': 'text',
  'output_type': 'video',
  'callback_url': 'https://widecast.ai/app/dashboard2/webhook_to_telegram',
  'script_text': 'Intermittent fasting works for half the people who try it, and fails '
                 'for the other half. The mechanism is real. Sixteen hours without '
                 'food drops insulin, lets stored fat get used, and resets hunger '
                 'hormones. The fail mode is also real. People in calorie deficit '
                 'during the eating window can binge in the four-hour eating window. '
                 'Skipping breakfast then eating a thousand-calorie lunch defeats the '
                 'metabolic benefit. Genetics matter too, about thirty percent of '
                 'people have a CLOCK gene variant that handles late-day eating '
                 "poorly. If you've tried intermittent fasting and gained weight, your "
                 'eating window is too short and your meals are too dense. Try '
                 'fourteen-ten before sixteen-eight. Build the habit before stretching '
                 'the fast.'})
print(resp)
