"""
✨ HTML-formatted message

Auto-generated from widecast/docs/playgrounds/telegram-send.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard")

resp = client.v1_telegram_send(**{ 'message': '<b>Render finished</b>\n'
             "Open <a href='https://widecast.ai/'>WideCast</a> to publish.",
  'parse_mode': 'HTML'})
print(resp)
