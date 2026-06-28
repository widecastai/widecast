"""
(E) Narrator layout rect — 280×498 preview coords

Auto-generated from widecast/docs/playgrounds/modify-scene.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard")

resp = client.v1_modify_scene(**{ 'id': 'widecast7c0d4f8a9b1e2d3f',
  'by': 'voice_file',
  'value': 'XcR0k',
  'fields': [ { 'field_name': 'overlay.narrator.rect',
                'value': {'x': 35, 'y': 124, 'w': 210, 'h': 374, 'visible': True}}]})
print(resp)
