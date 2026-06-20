"""
💬 Plain text notification

Auto-generated from widecast/docs/playgrounds/telegram-send.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard")

resp = client.v1_telegram_send(**{'message': 'Your video is ready to review! Open the dashboard to pick scenes.'})
print(resp)
