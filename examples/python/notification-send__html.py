"""
✨ HTML-formatted body

Auto-generated from widecast/docs/playgrounds/notification-send.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard")

resp = client.v1_notification_send(**{ 'subject': 'Render finished',
  'message': '<b>Final cut</b> is ready — open <a '
             "href='https://widecast.ai/'>WideCast</a> to publish.",
  'parse_mode': 'HTML'})
print(resp)
