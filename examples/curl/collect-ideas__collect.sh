#!/usr/bin/env bash
# 🧩 Ideas from a product
# Auto-generated from widecast/docs/playgrounds/collect-ideas.yaml.

curl -X POST "https://widecast.ai/app/dashboard2/v1/collect_ideas" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"product_service_input": "A budgeting app for freelancers with automatic tax estimates"}'
