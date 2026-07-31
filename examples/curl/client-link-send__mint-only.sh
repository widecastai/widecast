#!/usr/bin/env bash
# 🔗 Mint-only content_plan link
# Auto-generated from widecast/docs/playgrounds/client-link-send.yaml.

curl -X POST "https://widecast.ai/app/dashboard/v1/client_link/send" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"link_type": "content_plan"}'
