#!/usr/bin/env bash
# 💡 Idea · English — 🛒 Ecommerce
# Auto-generated from widecast/docs/playgrounds/create-video.yaml.

curl -X POST "https://widecast.ai/app/dashboard/v1/create_video" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"source": "idea", "language": "English", "output_type": "scene", "video_length": "short", "faceless": false, "callback_url": "", "idea_text": "Why most Shopify stores convert under 2% and how the top stores hit 4-6% — page speed under 3 seconds, real customer photos, and shipping costs surfaced above the cart."}'
