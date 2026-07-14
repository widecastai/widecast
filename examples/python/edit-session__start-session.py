"""
▶️ Start an edit session before the first scene edit

Auto-generated from widecast/docs/playgrounds/edit-session.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard")

resp = client.v1_edit_session(**{'id': 'widecast7c0d4f8a9b1e2d3f', 'action': 'start'})
print(resp)
