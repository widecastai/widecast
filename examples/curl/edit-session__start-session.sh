#!/usr/bin/env bash
# ▶️ Start an edit session before the first scene edit
# Auto-generated from widecast/docs/playgrounds/edit-session.yaml.

curl -X POST "https://widecast.ai/app/dashboard/v1/edit_session" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"id": "widecast7c0d4f8a9b1e2d3f", "action": "start"}'
