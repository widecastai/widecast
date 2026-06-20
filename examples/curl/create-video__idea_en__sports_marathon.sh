#!/usr/bin/env bash
# 💡 Idea · English — 🏃 Sports & Fitness
# Auto-generated from widecast/docs/playgrounds/create-video.yaml.

curl -X POST "https://widecast.ai/app/dashboard/v1/create_video" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"source": "idea", "language": "English", "output_type": "scene", "video_length": "short", "faceless": false, "callback_url": "", "idea_text": "Why marathoners hit the wall at mile 20 — the 2000-calorie glycogen tank, the 100-calorie-per-mile burn rate, and the two training fixes that push the wall back."}'
