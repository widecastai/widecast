#!/usr/bin/env bash
# 📝 Queue an idea into the plan
# Auto-generated from widecast/docs/playgrounds/production-plan-add.yaml.

curl -X POST "https://widecast.ai/app/dashboard/v1/production_plan/add" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"idea_text": "Why estate planning matters for young families", "description": "Hook on the 40% who die intestate; CTA to book a consult.", "source": "idea"}'
