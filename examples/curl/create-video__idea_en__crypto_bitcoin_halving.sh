#!/usr/bin/env bash
# 💡 Idea · English — ₿ Crypto
# Auto-generated from widecast/docs/playgrounds/create-video.yaml.

curl -X POST "https://widecast.ai/app/dashboard2/v1/create_video" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"source": "idea", "language": "English", "output_type": "scene", "video_length": "short", "faceless": false, "callback_url": "", "idea_text": "Why Bitcoin's halving every four years matters — Satoshi's 21M supply cap, the mining reward schedule from 2009 onwards, and why scarcity is mathematical not opinion."}'
