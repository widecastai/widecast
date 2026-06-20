#!/usr/bin/env bash
# 🎬 Post an external video URL
# Auto-generated from widecast/docs/playgrounds/publish.yaml.

curl -X POST "https://widecast.ai/app/dashboard/v1/publish" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"video_url": "https://cdn.example.com/clip.mp4", "title": "Launch teaser"}'
