#!/usr/bin/env bash
# 📜 Script · English — 🗳 Politics
# Auto-generated from widecast/docs/playgrounds/create-video.yaml.

curl -X POST "https://widecast.ai/app/dashboard/v1/create_video" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wc_live_REPLACE_ME" \
  -d '{"source": "text", "output_type": "scene", "faceless": false, "callback_url": "", "script_text": "The electoral college exists because the founders didn't trust voters directly. In seventeen eighty-seven, the United States had no telephones, no national newspapers, and no party machinery. The Constitution gave states electors instead of a popular vote. Each state gets electors equal to its house seats plus two senators. Wyoming with six hundred thousand people gets three. California with thirty-nine million gets fifty-four. That ratio means a vote in Wyoming weighs three point seven times more than a vote in California. Five times in US history the popular vote loser won the presidency. Most recently in twenty-sixteen. Abolishing the electoral college needs a constitutional amendment, and two-thirds of states. The math means it stays."}'
