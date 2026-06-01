#!/usr/bin/env bash
# 📊 Analytics dashboard
# Auto-generated from widecast/docs/playgrounds/analytics.yaml.

curl -X GET "https://widecast.ai/app/dashboard2/v1/analytics" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"period": "last_week"}'
