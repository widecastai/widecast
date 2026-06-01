"""
📰 Blog / Article · English — 🛡 P&C Insurance

Auto-generated from widecast/docs/playgrounds/create-video.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard2")

resp = client.create_video(**{ 'source': 'blog',
  'language': 'English',
  'output_type': 'text',
  'video_length': 'short',
  'callback_url': '',
  'blog_text': 'Every hurricane season, thousands of homeowners discover the same '
               "painful fact at the worst possible moment: their homeowner's insurance "
               'does not cover flood damage. This is not fine print or a loophole. '
               'Standard policies exclude rising-water damage entirely, and the '
               'definition of rising water is broader than most people expect. It '
               'includes hurricane storm surge, river and creek overflow, and even '
               'heavy rain that simply pools faster than the ground can absorb it. If '
               'water rises from the ground up, your standard policy almost certainly '
               'will not pay. Flood coverage is a separate product. For homes in '
               'designated high-risk zones, it is typically written through the '
               'federal flood program rather than a private carrier. Despite the '
               'exposure, fewer than 15 percent of US households actually carry flood '
               'insurance, and the consequences are expensive: the average flood claim '
               'runs about 43 thousand dollars, a number large enough to wipe out most '
               "families' savings. The assumption that drives this underinsurance is "
               "that flooding is somebody else's problem, something that happens only "
               'in marked flood plains near the coast. The data says otherwise. '
               'Roughly one in four flood claims comes from properties outside the '
               'designated high-risk zones, which means moderate-risk homeowners are '
               'routinely caught uncovered. Renters are not exempt from the logic '
               'either; contents-only flood coverage is available for under 20 dollars '
               "a month and protects belongings that a landlord's policy never will. "
               'The practical step is simple and takes ten minutes. Look up your '
               "property's flood zone code, then call your agent and ask specifically "
               'about flood coverage as a separate policy. Floods do not wait for '
               'hurricane season, and neither should you.'})
print(resp)
