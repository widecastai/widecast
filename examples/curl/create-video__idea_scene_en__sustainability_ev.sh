#!/usr/bin/env bash
# 💡 Idea → Scenes · English — 🌱 Sustainability
# Auto-generated from widecast/docs/playgrounds/create-video.yaml.

curl -X POST "https://widecast.ai/app/dashboard2/v1/create_video" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"source": "idea", "output_type": "scene", "language": "English", "video_length": "short", "idea_text": "Why electric vehicles aren't truly zero-emission but still beat gas cars — the 10-ton manufacturing footprint, the 18-month break-even in California's grid, and the 5-year break-even in coal-heavy regions."}'
