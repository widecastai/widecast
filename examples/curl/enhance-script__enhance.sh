#!/usr/bin/env bash
# ✨ Enhance a draft
# Auto-generated from widecast/docs/playgrounds/enhance-script.yaml.

curl -X POST "https://widecast.ai/app/dashboard/v1/enhance_script" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"script_text": "Want more views? Post consistently. Engagement matters. The end.", "intervention_level": "1", "language": "", "callback_url": ""}'
