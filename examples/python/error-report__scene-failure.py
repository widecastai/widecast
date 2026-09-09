"""
🎬 Scene-level failure

Auto-generated from widecast/docs/playgrounds/error-report.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard")

resp = client.v1_error_report(**{ 'module': 'scene_upload',
  'error_message': 'upload_failed: 413 payload too large after auto-compression',
  'context': { 'topic_id': 'widecast7c0d4f8a9b1e2d3f',
               'voice_file': 'XcR0k',
               'scene_id': 3}})
print(resp)
