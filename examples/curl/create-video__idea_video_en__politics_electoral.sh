#!/usr/bin/env bash
# 🎬 Idea → Final MP4 · English — 🗳 Politics
# Auto-generated from widecast/docs/playgrounds/create-video.yaml.

curl -X POST "https://widecast.ai/app/dashboard2/v1/create_video" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"source": "idea", "output_type": "video", "language": "English", "video_length": "short", "callback_url": "https://widecast.ai/app/dashboard2/webhook_to_telegram", "idea_text": "Why the electoral college persists despite Wyoming voters counting 3.7x more than California voters — the 1787 origin without telephones or national parties, and the constitutional amendment math that keeps it."}'
