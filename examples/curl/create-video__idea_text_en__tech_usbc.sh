#!/usr/bin/env bash
# 📝 Idea → Script text · English — 💻 Technology
# Auto-generated from widecast/docs/playgrounds/create-video.yaml.

curl -X POST "https://widecast.ai/app/dashboard2/v1/create_video" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"source": "idea", "output_type": "text", "language": "English", "video_length": "short", "idea_text": "How USB-C ended fifteen years of cable chaos — from 1996 micro-USB at 12 Mbps to USB-C with Thunderbolt at 40 Gbps and 240W power, plus the EU mandate that forced Apple's hand."}'
