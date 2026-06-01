#!/usr/bin/env bash
# 🎬 Video URL → Auto-Edit · English — 🎬 Open Movie (Big Buck Bunny)
# Auto-generated from widecast/docs/playgrounds/create-video.yaml.

curl -X POST "https://widecast.ai/app/dashboard2/v1/create_video" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"source": "video_url", "output_type": "scene", "callback_url": "", "video_url": "https://www.youtube.com/watch?v=YE7VzlLtp-4"}'
