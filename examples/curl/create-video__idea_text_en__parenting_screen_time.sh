#!/usr/bin/env bash
# 📝 Idea → Script text · English — 👶 Parenting
# Auto-generated from widecast/docs/playgrounds/create-video.yaml.

curl -X POST "https://widecast.ai/app/dashboard2/v1/create_video" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"source": "idea", "output_type": "text", "language": "English", "video_length": "short", "idea_text": "Why screen time over 2 hours daily at age 2 raises language-delay risk by 30% — serve-and-return conversation, brain wiring, and the recovery path."}'
