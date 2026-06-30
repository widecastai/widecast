#!/usr/bin/env bash
# 🎯 Kickoff core 5/5 — quality standard + video-level QA + priority
# Auto-generated from widecast/docs/playgrounds/skills-editing.yaml.

curl -X GET "https://widecast.ai/app/dashboard/v1/skills/editing" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"module": "ai_video_editor/05_quality_qa_priority"}'
