#!/usr/bin/env bash
# 🎬 Idea → Final MP4 · English — 🏠 Real Estate
# Auto-generated from widecast/docs/playgrounds/create-video.yaml.

curl -X POST "https://widecast.ai/app/dashboard2/v1/create_video" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"source": "idea", "output_type": "video", "language": "English", "video_length": "short", "callback_url": "https://widecast.ai/app/dashboard2/webhook_to_telegram", "idea_text": "Why first-time Bay Area buyers should run the rent-vs-buy math before signing another lease — median home price, mortgage rates, hidden closing costs, and the income threshold where buying beats renting."}'
