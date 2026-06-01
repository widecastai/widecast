#!/usr/bin/env bash
# 📜 Script · English — 💻 Technology
# Auto-generated from widecast/docs/playgrounds/create-video.yaml.

curl -X POST "https://widecast.ai/app/dashboard2/v1/create_video" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"source": "text", "output_type": "scene", "faceless": false, "callback_url": "", "script_text": "USB-C ended fifteen years of cable chaos in one decision. Before USB-C, every device needed its own cable. Phones used micro USB, laptops used barrel chargers, Apple used Lightning, Samsung used proprietary plugs. The original USB from nineteen ninety-six maxed out at twelve megabits per second. USB-C with Thunderbolt now handles forty gigabits, three thousand times faster. It also delivers up to two hundred forty watts of power, enough to charge a gaming laptop. The breakthrough was the reversible connector. No more checking orientation in the dark. The European Union forced Apple's hand in twenty-twenty-four. Now one cable charges your phone, your laptop, and your headphones. Throw out the drawer of old cables. You don't need them."}'
