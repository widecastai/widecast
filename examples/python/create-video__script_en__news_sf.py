"""
📜 Script · English — 📰 News

Auto-generated from widecast/docs/playgrounds/create-video.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard2")

resp = client.create_video(**{ 'source': 'text',
  'output_type': 'scene',
  'faceless': False,
  'callback_url': '',
  'script_text': "San Francisco's downtown is half empty, and that's actually "
                 'progress. Office occupancy dropped from ninety-four percent in '
                 'twenty-nineteen to forty-one percent in twenty-twenty-three. By '
                 "twenty-twenty-six, it's climbing back toward sixty percent. Three "
                 'things drove the comeback. Federal return-to-office mandates pushed '
                 'Bay Area firms to require at least three days a week. Tech layoffs '
                 'subsided, hiring resumed at Google, OpenAI, and Anthropic. Lease '
                 "prices dropped forty percent, attracting startups that couldn't "
                 "afford downtown before the pandemic. The streets still don't feel "
                 'like twenty-nineteen, but coffee shops on Market Street are crowded '
                 "again. Recovery doesn't mean return to before. It means new "
                 'equilibrium.'})
print(resp)
