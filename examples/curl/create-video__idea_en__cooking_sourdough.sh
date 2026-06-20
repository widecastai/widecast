#!/usr/bin/env bash
# 💡 Idea · English — 🍞 Cooking
# Auto-generated from widecast/docs/playgrounds/create-video.yaml.

curl -X POST "https://widecast.ai/app/dashboard/v1/create_video" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"source": "idea", "language": "English", "output_type": "scene", "video_length": "short", "faceless": false, "callback_url": "", "idea_text": "Why your sourdough is dense — 75% hydration vs 65%, the 28°C fermentation sweet spot, and tight final shaping. Three fixes that produce open crumb."}'
