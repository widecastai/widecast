"""
⚙️ Load the mechanics submodule

Auto-generated from widecast/docs/playgrounds/skills-editing.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard")

resp = client.v1_skills_editing(**{'module': 'ai_video_editor/10_mechanics'})
print(resp)
