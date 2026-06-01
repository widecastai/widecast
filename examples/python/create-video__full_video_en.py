"""
Full video · English

Auto-generated from widecast/docs/playgrounds/create-video.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard2")

resp = client.create_video(**{ 'script_text': "California parents should encourage their teens to get a driver's "
                 'license at 16.\n'
                 'Driving builds independence, responsibility, and confidence — three '
                 'things\n'
                 "every teenager needs more of, and three things you can't teach from "
                 'a couch.\n'
                 'Behind the wheel is where they learn to make decisions in real time, '
                 'manage\n'
                 'risk, and own the consequences of their own choices.\n'
                 'The longer you delay, the harder it gets. A sixteen-year-old learns '
                 'to drive\n'
                 'in months. A twenty-two-year-old fresh out of college, dropped into '
                 'a city\n'
                 'where everyone else has been driving for years, learns the same '
                 'skill under\n'
                 "pressure — with more to lose. Don't make your kid that "
                 'twenty-two-year-old.\n'
                 'Let them get the license now, while the stakes are low and the '
                 'lessons stick.\n',
  'output_type': 'video',
  'wait_for_render': False})
print(resp)
