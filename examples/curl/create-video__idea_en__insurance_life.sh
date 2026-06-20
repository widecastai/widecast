#!/usr/bin/env bash
# 💡 Idea · English — 🛡 L&H Insurance
# Auto-generated from widecast/docs/playgrounds/create-video.yaml.

curl -X POST "https://widecast.ai/app/dashboard/v1/create_video" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"source": "idea", "language": "English", "output_type": "scene", "video_length": "short", "faceless": false, "callback_url": "", "idea_text": "Why term life insurance covers families better than whole life for the same death benefit — the 5-15x premium gap, the cash-value myth, and the years your kids actually depend on you."}'
