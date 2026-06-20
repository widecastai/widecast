#!/usr/bin/env bash
# 💡 Idea · English — 📣 Marketing
# Auto-generated from widecast/docs/playgrounds/create-video.yaml.

curl -X POST "https://widecast.ai/app/dashboard/v1/create_video" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"source": "idea", "language": "English", "output_type": "scene", "video_length": "short", "faceless": false, "callback_url": "", "idea_text": "Why Instagram engagement dropped 70% in 2026 and how to recover — the algorithm shift toward Reels, the 1.5-second hook rule, and the hashtag relevance change."}'
