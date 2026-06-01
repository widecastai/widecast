#!/usr/bin/env bash
# Idea → Scenes · English
# Auto-generated from widecast/docs/playgrounds/create-video.yaml.

curl -X POST "https://widecast.ai/app/dashboard2/v1/create_video" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"source": "idea", "idea_text": "Why teens should get their driver's license at 16, not 18 — independence, responsibility, and stake-low practice.", "language": "English", "video_length": "short", "output_type": "scene", "wait_for_render": false}'
