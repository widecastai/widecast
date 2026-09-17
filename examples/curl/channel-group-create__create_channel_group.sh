#!/usr/bin/env bash
# ➕ Create a channel group
# Auto-generated from widecast/docs/playgrounds/channel-group-create.yaml.

curl -X POST "https://widecast.ai/app/dashboard/v1/channel_groups" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"label": "English channels"}'
