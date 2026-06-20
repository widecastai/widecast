#!/usr/bin/env bash
# 🎙️ Audio base64 → Audio-to-Video · English (AI-agent path)
# Auto-generated from widecast/docs/playgrounds/create-video.yaml.

curl -X POST "https://widecast.ai/app/dashboard/v1/create_video" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"source": "audio_base64", "output_type": "scene", "audio_filename": "voice_memo.mp3"}'
