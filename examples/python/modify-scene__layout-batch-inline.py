"""
(G) Layout batch — multiple layout fields directly

Auto-generated from widecast/docs/playgrounds/modify-scene.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard")

resp = client.v1_modify_scene(**{ 'id': 'widecast7c0d4f8a9b1e2d3f',
  'by': 'voice_file',
  'value': 'XcR0k',
  'fields': [ { 'field_name': 'overlay.narrator.rect',
                'value': {'x': 35, 'y': 124, 'w': 210, 'h': 374, 'visible': True}},
              {'field_name': 'overlay.caption.y', 'value': 408},
              { 'field_name': 'remotion.object.rect',
                'value': { 'layout_id': 'main.one_by_one',
                           'x': 24,
                           'y': 200,
                           'coordinate_space': 'preview'}}]})
print(resp)
