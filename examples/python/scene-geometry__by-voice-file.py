"""
🧭 Audit a scene by voice_file (preferred)

Auto-generated from widecast/docs/playgrounds/scene-geometry.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard")

resp = client.v1_scene_geometry(**{'id': 'widecast7c0d4f8a9b1e2d3f', 'voice_file': 'XcR0k'})
print(resp)
