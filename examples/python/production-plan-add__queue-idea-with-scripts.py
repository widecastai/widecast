"""
🎬 Queue a RECOMMENDED idea WITH pre-written scripts (Script ready)

Auto-generated from widecast/docs/playgrounds/production-plan-add.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard")

resp = client.v1_production_plan_add(**{ 'idea_text': '3 estate-planning mistakes young parents make',
  'recommended': True,
  'scripts': [ { 'format': 'VE',
                 'text': 'Three estate-planning mistakes I see young parents make '
                         'every single week. Number one: they think a will is '
                         'something you do at fifty. If you have a child and no will, '
                         'a judge — not you — decides who raises them if the worst '
                         'happens. Number two: they name godparents at church but '
                         'never on paper. Courts do not care about ceremonies; they '
                         'care about documents. Pick a guardian, write it down, tell '
                         'them. Number three: they forget the beneficiary forms. Your '
                         '401k and life insurance skip the will entirely — whoever is '
                         'on that form gets the money, even an ex. Twenty minutes '
                         'fixes all three. Comment PLAN and I will send you the exact '
                         'checklist I use with my own clients.'},
               { 'format': 'MB',
                 'text': 'You do not need a lawyer to protect your kids — you need a '
                         'plan. Everyone tells young parents that estate planning '
                         'means expensive attorneys and thick binders. Wrong. The '
                         'three documents that matter most take one afternoon. A '
                         'simple will names who raises your children — without it, a '
                         'judge decides. A beneficiary check on your 401k and life '
                         'insurance takes ten minutes online — and it overrides your '
                         'will, which is why an ex-spouse still collects sometimes. A '
                         'power of attorney means someone can pay your mortgage if you '
                         'are in a hospital bed. Start with those three. A lawyer '
                         'polishes a plan; the plan itself starts with you, today. '
                         'Comment PLAN and I will send you the checklist my own '
                         'clients use.'}],
  'recommended_format': 'VE'})
print(resp)
