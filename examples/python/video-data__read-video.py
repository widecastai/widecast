"""
📜 Audit a video — list every scene + Remotion spec status

Auto-generated from widecast/docs/playgrounds/video-data.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard")

resp = client.v1_video_data(**{'video_id': 'widecastABCDEFGHIJKL'})
print(resp)
