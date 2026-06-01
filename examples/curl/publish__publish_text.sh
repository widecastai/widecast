#!/usr/bin/env bash
# ✍️ Post arbitrary text
# Auto-generated from widecast/docs/playgrounds/publish.yaml.

curl -X POST "https://widecast.ai/app/dashboard2/v1/publish" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"text": "We just shipped v2 — try it free today!"}'
