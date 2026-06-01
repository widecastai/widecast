#!/usr/bin/env bash
# 🎬 Recent videos
# Auto-generated from widecast/docs/playgrounds/videos.yaml.

curl -X GET "https://widecast.ai/app/dashboard2/v1/videos" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"from_record": 0}'
