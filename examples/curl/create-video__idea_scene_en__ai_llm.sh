#!/usr/bin/env bash
# 💡 Idea → Scenes · English — 🤖 AI & LLM
# Auto-generated from widecast/docs/playgrounds/create-video.yaml.

curl -X POST "https://widecast.ai/app/dashboard2/v1/create_video" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"source": "idea", "output_type": "scene", "language": "English", "video_length": "short", "idea_text": "Why GPT-4 and Claude hallucinate 5-10% of the time and three concrete fixes — retrieval grounding, temperature zero for factual tasks, and forcing the model to cite or quote."}'
