"""
📐 Computed boxes for scene XcR0k (preferred structural audit)

Auto-generated from widecast/docs/playgrounds/scene-inspector.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard")

resp = client.v1_scene_inspector(**{ 'id': 'widecast7c0d4f8a9b1e2d3f',
  'action': 'get_computed_boxes',
  'voice_file': 'XcR0k',
  'activate': True,
  'timeout_ms': 7000})
print(resp)
