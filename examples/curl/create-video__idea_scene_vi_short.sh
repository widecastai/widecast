#!/usr/bin/env bash
# Idea → Scenes · Tiếng Việt
# Auto-generated from widecast/docs/playgrounds/create-video.yaml.

curl -X POST "https://widecast.ai/app/dashboard2/v1/create_video" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"source": "idea", "idea_text": "Tại sao phụ huynh nên cho con học lái xe ngay khi đủ 16 tuổi — lợi ích về tính độc lập và kỹ năng ra quyết định.", "language": "Vietnamese", "video_length": "short", "output_type": "scene", "wait_for_render": false}'
