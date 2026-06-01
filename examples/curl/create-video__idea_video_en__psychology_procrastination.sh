#!/usr/bin/env bash
# 🎬 Idea → Final MP4 · English — 🧠 Psychology
# Auto-generated from widecast/docs/playgrounds/create-video.yaml.

curl -X POST "https://widecast.ai/app/dashboard2/v1/create_video" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"source": "idea", "output_type": "video", "language": "English", "video_length": "short", "callback_url": "https://widecast.ai/app/dashboard2/webhook_to_telegram", "idea_text": "Why you procrastinate even on things you love — the prefrontal-vs-limbic argument, the two-minute rule, and implementation intentions that flip the balance."}'
