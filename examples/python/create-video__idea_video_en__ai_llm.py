"""
🎬 Idea → Final MP4 · English — 🤖 AI & LLM

Auto-generated from widecast/docs/playgrounds/create-video.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard2")

resp = client.create_video(**{ 'source': 'idea',
  'output_type': 'video',
  'language': 'English',
  'video_length': 'short',
  'callback_url': 'https://widecast.ai/app/dashboard2/webhook_to_telegram',
  'idea_text': 'Why GPT-4 and Claude hallucinate 5-10% of the time and three concrete '
               'fixes — retrieval grounding, temperature zero for factual tasks, and '
               'forcing the model to cite or quote.'})
print(resp)
