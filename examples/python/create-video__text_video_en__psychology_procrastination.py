"""
🎬 Script → Final MP4 · English — 🧠 Psychology

Auto-generated from widecast/docs/playgrounds/create-video.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard2")

resp = client.create_video(**{ 'source': 'text',
  'output_type': 'video',
  'callback_url': 'https://widecast.ai/app/dashboard2/webhook_to_telegram',
  'script_text': "You don't procrastinate because you're lazy. You procrastinate "
                 'because your brain treats future-you as a stranger. The prefrontal '
                 'cortex handles planning and discipline. The limbic system handles '
                 'instant reward. When they argue, limbic wins by default, even on '
                 'tasks you love. Three techniques flip the balance. The two-minute '
                 'rule, commit to just two minutes of the task; momentum does the '
                 'rest. Implementation intentions, write "when X happens I will do Y" '
                 'instead of vague goals. Pre-commitment, remove the alternative; if '
                 "you can't open social media, you don't choose to. Discipline isn't "
                 "more willpower. It's better architecture. Build the environment, "
                 'then your future self follows.'})
print(resp)
