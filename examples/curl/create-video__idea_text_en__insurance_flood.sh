#!/usr/bin/env bash
# 📝 Idea → Script text · English — 🛡 P&C Insurance
# Auto-generated from widecast/docs/playgrounds/create-video.yaml.

curl -X POST "https://widecast.ai/app/dashboard2/v1/create_video" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"source": "idea", "output_type": "text", "language": "English", "video_length": "short", "idea_text": "Why standard homeowner's insurance excludes flood damage — the federal flood program, the 15% of households actually covered, and why one in four flood claims comes from outside high-risk zones."}'
