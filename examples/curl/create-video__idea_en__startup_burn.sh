#!/usr/bin/env bash
# 💡 Idea · English — 🚀 Startup
# Auto-generated from widecast/docs/playgrounds/create-video.yaml.

curl -X POST "https://widecast.ai/app/dashboard2/v1/create_video" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"source": "idea", "language": "English", "output_type": "scene", "video_length": "short", "faceless": false, "callback_url": "", "idea_text": "Every founder's two non-negotiable numbers — burn rate and runway. The formula, the eight-month case study, and the default-alive threshold separating fundable startups from desperate ones."}'
