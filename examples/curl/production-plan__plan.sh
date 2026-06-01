#!/usr/bin/env bash
# 📅 Production plan
# Auto-generated from widecast/docs/playgrounds/production-plan.yaml.

curl -X GET "https://widecast.ai/app/dashboard2/v1/production_plan" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"page": 0}'
