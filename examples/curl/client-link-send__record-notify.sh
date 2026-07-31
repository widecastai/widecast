#!/usr/bin/env bash
# 📬 Record link + notify via Telegram + email
# Auto-generated from widecast/docs/playgrounds/client-link-send.yaml.

curl -X POST "https://widecast.ai/app/dashboard/v1/client_link/send" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"link_type": "record", "topic_id": "widecastab12", "ttl_days": 7, "channels": {"telegram": true, "email": true}}'
