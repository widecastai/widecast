"""
Scene review · English (default)

Auto-generated from widecast/docs/playgrounds/create-video.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard2")

resp = client.create_video(**{ 'script_text': "Want to make a video in 60 seconds? Here's how — and why it actually "
                 'works.\n'
                 "First, draft your script in bullet points. Don't overthink it. Three "
                 'to five\n'
                 'beats is plenty: a hook that grabs attention, a body that delivers '
                 'one clear\n'
                 'idea, and a call to action that tells the viewer exactly what to do '
                 'next.\n'
                 'Second, paste it into WideCast and pick an aspect ratio that fits '
                 'the\n'
                 "platform you're posting to. Vertical for TikTok and Reels, square "
                 'for feed\n'
                 'posts, landscape for YouTube. The same script, three different '
                 'videos.\n'
                 'Third, hit render and grab a coffee. The AI does the work — '
                 'segments,\n'
                 "voice, B-roll. You come back to a video that's ready to publish.\n"
                 'Try it free at widecast.ai and ship your first short-form video '
                 'today.\n',
  'output_type': 'scene',
  'wait_for_render': False})
print(resp)
