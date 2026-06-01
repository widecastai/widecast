#!/usr/bin/env bash
# 🎬 Idea → Final MP4 · English — 📱 Product Review
# Auto-generated from widecast/docs/playgrounds/create-video.yaml.

curl -X POST "https://widecast.ai/app/dashboard2/v1/create_video" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"source": "idea", "output_type": "video", "language": "English", "video_length": "short", "callback_url": "https://widecast.ai/app/dashboard2/webhook_to_telegram", "idea_text": "Why most iPhone 15 owners should skip the iPhone 17 — 20% faster processor you won't feel, the camera upgrade that only matters for portraits, and the $200 price jump."}'
