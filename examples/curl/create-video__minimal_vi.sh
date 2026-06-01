#!/usr/bin/env bash
# Minimal · 1 line (Vietnamese)
# Auto-generated from widecast/docs/playgrounds/create-video.yaml.

curl -X POST "https://widecast.ai/app/dashboard2/v1/create_video" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"script_text": "Bạn nên cho con lấy bằng lái xe ngay khi 16 tuổi.", "wait_for_render": false}'
