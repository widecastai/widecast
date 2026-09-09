#!/usr/bin/env bash
# 🚩 Minimal report
# Auto-generated from widecast/docs/playgrounds/error-report.yaml.

curl -X POST "https://widecast.ai/app/dashboard/v1/error/report" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"error_message": "video_data returned 502 script_parse_failed on a video that renders fine in the editor"}'
