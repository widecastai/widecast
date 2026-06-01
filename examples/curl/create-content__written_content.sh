#!/usr/bin/env bash
# 📝 Written content
# Auto-generated from widecast/docs/playgrounds/create-content.yaml.

curl -X POST "https://widecast.ai/app/dashboard2/v1/create_content" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"content": "Why early-stage founders should ship a new feature every week", "content_type": "blog", "language": "English", "callback_url": ""}'
