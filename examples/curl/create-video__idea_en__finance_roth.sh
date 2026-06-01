#!/usr/bin/env bash
# 💡 Idea · English — 💰 Finance
# Auto-generated from widecast/docs/playgrounds/create-video.yaml.

curl -X POST "https://widecast.ai/app/dashboard2/v1/create_video" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"source": "idea", "language": "English", "output_type": "scene", "video_length": "short", "faceless": false, "callback_url": "", "idea_text": "Why a Roth IRA opened at 25 ends up worth $1M more than the same plan started at 35 — compound interest, the years exponent that matters most, and the $100/month threshold most people miss."}'
