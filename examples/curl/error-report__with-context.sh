#!/usr/bin/env bash
# 🔎 Report with tracing context (recommended)
# Auto-generated from widecast/docs/playgrounds/error-report.yaml.

curl -X POST "https://widecast.ai/app/dashboard/v1/error/report" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"module": "export", "error_message": "export_failed: renderer exited with code 137 (OOM)", "context": {"topic_id": "widecast7c0d4f8a9b1e2d3f", "request_id": "req_9f2c14ab", "attempted": "second export retry after scene 4 edit"}}'
