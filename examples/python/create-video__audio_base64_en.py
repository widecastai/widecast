"""
🎙️ Audio base64 → Audio-to-Video · English (AI-agent path)

Auto-generated from widecast/docs/playgrounds/create-video.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard")

resp = client.create_video(**{'source': 'audio_base64', 'output_type': 'scene', 'audio_filename': 'voice_memo.mp3'})
print(resp)
