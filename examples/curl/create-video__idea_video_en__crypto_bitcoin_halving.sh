#!/usr/bin/env bash
# 🎬 Idea → Final MP4 · English — ₿ Crypto
# Auto-generated from widecast/docs/playgrounds/create-video.yaml.

curl -X POST "https://widecast.ai/app/dashboard2/v1/create_video" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"source": "idea", "output_type": "video", "language": "English", "video_length": "short", "callback_url": "https://widecast.ai/app/dashboard2/webhook_to_telegram", "idea_text": "Why Bitcoin's halving every four years matters — Satoshi's 21M supply cap, the mining reward schedule from 2009 onwards, and why scarcity is mathematical not opinion."}'
