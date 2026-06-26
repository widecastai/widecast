#!/usr/bin/env bash
# 📜 Audit a video — list every scene + Remotion spec status
# Auto-generated from widecast/docs/playgrounds/video-data.yaml.

curl -X POST "https://widecast.ai/app/dashboard/v1/video_data" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"video_id": "widecastABCDEFGHIJKL"}'
