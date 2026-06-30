"""
⛔ Kickoff core 2/5 — jump-prevention interrupts

Auto-generated from widecast/docs/playgrounds/skills-editing.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard")

resp = client.v1_skills_editing(**{'module': 'ai_video_editor/02_jump_prevention'})
print(resp)
