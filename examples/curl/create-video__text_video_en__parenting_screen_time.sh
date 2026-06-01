#!/usr/bin/env bash
# 🎬 Script → Final MP4 · English — 👶 Parenting
# Auto-generated from widecast/docs/playgrounds/create-video.yaml.

curl -X POST "https://widecast.ai/app/dashboard2/v1/create_video" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"source": "text", "output_type": "video", "callback_url": "https://widecast.ai/app/dashboard2/webhook_to_telegram", "script_text": "A toddler who watches over two hours of screen daily has a thirty percent higher chance of language delay at age three. The mechanism is real. Language develops through back-and-forth conversation, not one-way listening. When a parent reads, points, and waits for a response, neural pathways form for both comprehension and production. A screen plays at the child but never responds. Six months of two-plus hours daily can set development back another six months in vocabulary. Two changes flip the trajectory. Replace one hour of passive screen with one hour of \"serve and return\" conversation. Use any screen time as a starting point: pause, ask \"what do you see?\", wait. The brain wires what you practice. Choose what to practice."}'
