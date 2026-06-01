#!/usr/bin/env bash
# 📝 Idea → Script text · English — 📰 News
# Auto-generated from widecast/docs/playgrounds/create-video.yaml.

curl -X POST "https://widecast.ai/app/dashboard2/v1/create_video" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"source": "idea", "output_type": "text", "language": "English", "video_length": "short", "idea_text": "Why San Francisco's office occupancy climbed back from 41% to nearly 60% in two years — return-to-office mandates, tech hiring resuming at OpenAI and Anthropic, and a 40% drop in lease prices."}'
