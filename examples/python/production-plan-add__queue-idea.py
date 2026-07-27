"""
📝 Queue an idea into the plan

Auto-generated from widecast/docs/playgrounds/production-plan-add.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard")

resp = client.v1_production_plan_add(**{ 'idea_text': 'Why estate planning matters for young families',
  'description': 'Hook on the 40% who die intestate; CTA to book a consult.',
  'source': 'idea'})
print(resp)
