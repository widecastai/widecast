"""
5-line tutorial (English)

Auto-generated from widecast/docs/playgrounds/create-video.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard2")

resp = client.create_video(**{ 'script_text': "Want to make a video in 60 seconds? Here's how.\n"
                 'First, draft your script — bullet points work fine.\n'
                 'Second, paste it into WideCast and pick an aspect ratio.\n'
                 'Third, hit render and grab a coffee — done in under a minute.\n'
                 'Try it free at widecast.ai.\n',
  'wait_for_render': False})
print(resp)
