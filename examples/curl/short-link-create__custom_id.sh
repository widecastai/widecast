#!/usr/bin/env bash
# 🏷️ Short link with your own ID
# Auto-generated from widecast/docs/playgrounds/short-link-create.yaml.

curl -X POST "https://widecast.ai/app/dashboard/v1/short_links" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"url": "https://example.com/spring-sale", "custom_id": "SALE2026"}'
