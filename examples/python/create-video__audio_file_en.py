"""
🎧 Audio file → Audio-to-Video · English

Auto-generated from widecast/docs/playgrounds/create-video.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard")

resp = client.create_video(**{'source': 'audio_file', 'output_type': 'scene'})
print(resp)
