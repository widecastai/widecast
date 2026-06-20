"""
📜 Script · English — 🤖 AI & LLM

Auto-generated from widecast/docs/playgrounds/create-video.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard")

resp = client.create_video(**{ 'source': 'text',
  'output_type': 'scene',
  'faceless': False,
  'callback_url': '',
  'script_text': 'Large language models make things up, even the best ones. GPT-4 and '
                 'Claude both hallucinate facts roughly five to ten percent of the '
                 'time. The reason is structural. These models predict the next likely '
                 'word, not the next true word. They have no internal fact-check. '
                 'Three things reduce hallucination in real use. Ground the model in '
                 'source documents using retrieval, give it the relevant text, then '
                 'ask. Lower the temperature to zero for factual tasks, randomness '
                 'drops. Ask the model to cite or quote, it self-corrects when forced '
                 "to point at the source. The goal isn't zero errors. The goal is "
                 'making errors visible and recoverable. Build review into every '
                 'workflow.'})
print(resp)
