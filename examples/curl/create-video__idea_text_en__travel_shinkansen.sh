#!/usr/bin/env bash
# 📝 Idea → Script text · English — ✈️ Travel
# Auto-generated from widecast/docs/playgrounds/create-video.yaml.

curl -X POST "https://widecast.ai/app/dashboard2/v1/create_video" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"source": "idea", "output_type": "text", "language": "English", "video_length": "short", "idea_text": "Why Japan's Shinkansen has had zero passenger deaths in 60 years and 10 billion riders — dedicated tracks, automatic train control, and earthquake detection that cuts power in one second."}'
