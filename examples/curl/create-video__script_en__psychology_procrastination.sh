#!/usr/bin/env bash
# 📜 Script · English — 🧠 Psychology
# Auto-generated from widecast/docs/playgrounds/create-video.yaml.

curl -X POST "https://widecast.ai/app/dashboard/v1/create_video" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"source": "text", "output_type": "scene", "faceless": false, "callback_url": "", "script_text": "You don't procrastinate because you're lazy. You procrastinate because your brain treats future-you as a stranger. The prefrontal cortex handles planning and discipline. The limbic system handles instant reward. When they argue, limbic wins by default, even on tasks you love. Three techniques flip the balance. The two-minute rule, commit to just two minutes of the task; momentum does the rest. Implementation intentions, write \"when X happens I will do Y\" instead of vague goals. Pre-commitment, remove the alternative; if you can't open social media, you don't choose to. Discipline isn't more willpower. It's better architecture. Build the environment, then your future self follows."}'
