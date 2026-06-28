"""
📸 Small 280×498 screenshot — binary JPEG (REST) / ImageContent (MCP)

Auto-generated from widecast/docs/playgrounds/scene-inspector.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard")

resp = client.v1_scene_inspector(**{ 'id': 'widecast7c0d4f8a9b1e2d3f',
  'action': 'screenshot_scene_280x498',
  'voice_file': 'XcR0k',
  'activate': True})
print(resp)
