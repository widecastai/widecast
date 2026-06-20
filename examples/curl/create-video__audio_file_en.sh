#!/usr/bin/env bash
# 🎧 Audio file → Audio-to-Video · English
# Auto-generated from widecast/docs/playgrounds/create-video.yaml.

curl -X POST "https://widecast.ai/app/dashboard/v1/create_video" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"source": "audio_file", "output_type": "scene"}'
