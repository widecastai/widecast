"""
(I) Upload Narrator Video — user-supplied A-roll (ASYNC; queued)

Auto-generated from widecast/docs/playgrounds/modify-scene.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard")

resp = client.v1_modify_scene(**{ 'id': 'widecast7c0d4f8a9b1e2d3f',
  'by': 'voice_file',
  'value': 'XcR0k',
  'fields': [ { 'field_name': 'narrator.upload_video',
                'value': 'https://cdn.example.com/narrator.mp4'}]})
print(resp)
