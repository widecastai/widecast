#!/usr/bin/env bash
# Idea → Scenes · research disabled
# Auto-generated from widecast/docs/playgrounds/create-video.yaml.

curl -X POST "https://widecast.ai/app/dashboard2/v1/create_video" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"source": "idea", "idea_text": "A short pep talk for someone starting their first day at a new job — keep it warm, specific, and under a minute.", "language": "English", "video_length": "short", "research_enabled": false, "output_type": "scene", "wait_for_render": false}'
