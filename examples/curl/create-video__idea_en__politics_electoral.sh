#!/usr/bin/env bash
# 💡 Idea · English — 🗳 Politics
# Auto-generated from widecast/docs/playgrounds/create-video.yaml.

curl -X POST "https://widecast.ai/app/dashboard/v1/create_video" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"source": "idea", "language": "English", "output_type": "scene", "video_length": "short", "faceless": false, "callback_url": "", "idea_text": "Why the electoral college persists despite Wyoming voters counting 3.7x more than California voters — the 1787 origin without telephones or national parties, and the constitutional amendment math that keeps it."}'
