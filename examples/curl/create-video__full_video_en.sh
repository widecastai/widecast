#!/usr/bin/env bash
# Full video · English
# Auto-generated from widecast/docs/playgrounds/create-video.yaml.

curl -X POST "https://widecast.ai/app/dashboard2/v1/create_video" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"script_text": "California parents should encourage their teens to get a driver's license at 16.\nDriving builds independence, responsibility, and confidence — three things\nevery teenager needs more of, and three things you can't teach from a couch.\nBehind the wheel is where they learn to make decisions in real time, manage\nrisk, and own the consequences of their own choices.\nThe longer you delay, the harder it gets. A sixteen-year-old learns to drive\nin months. A twenty-two-year-old fresh out of college, dropped into a city\nwhere everyone else has been driving for years, learns the same skill under\npressure — with more to lose. Don't make your kid that twenty-two-year-old.\nLet them get the license now, while the stakes are low and the lessons stick.\n", "output_type": "video", "wait_for_render": false}'
