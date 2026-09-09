#!/usr/bin/env bash
# 🎬 Scene-level failure
# Auto-generated from widecast/docs/playgrounds/error-report.yaml.

curl -X POST "https://widecast.ai/app/dashboard/v1/error/report" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"module": "scene_upload", "error_message": "upload_failed: 413 payload too large after auto-compression", "context": {"topic_id": "widecast7c0d4f8a9b1e2d3f", "voice_file": "XcR0k", "scene_id": 3}}'
