#!/usr/bin/env bash
# 💡 Idea · English — 🏠 Real Estate
# Auto-generated from widecast/docs/playgrounds/create-video.yaml.

curl -X POST "https://widecast.ai/app/dashboard/v1/create_video" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"source": "idea", "language": "English", "output_type": "scene", "video_length": "short", "faceless": false, "callback_url": "", "idea_text": "Why first-time Bay Area buyers should run the rent-vs-buy math before signing another lease — median home price, mortgage rates, hidden closing costs, and the income threshold where buying beats renting."}'
