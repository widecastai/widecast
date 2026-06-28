"""
(C) Object-layer rect — move a single overlay text object

Auto-generated from widecast/docs/playgrounds/modify-scene.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard")

resp = client.v1_modify_scene(**{ 'id': 'widecast7c0d4f8a9b1e2d3f',
  'by': 'voice_file',
  'value': 'XcR0k',
  'fields': [ { 'field_name': 'remotion.object.rect',
                'value': { 'layout_id': 'main.obj_03_text',
                           'x': 24,
                           'y': 160,
                           'w': 232,
                           'h': 42,
                           'coordinate_space': 'preview'}}]})
print(resp)
