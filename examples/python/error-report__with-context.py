"""
🔎 Report with tracing context (recommended)

Auto-generated from widecast/docs/playgrounds/error-report.yaml.
"""
from widecast import Widecast

client = Widecast(api_key="wc_live_REPLACE_ME", base_url="https://widecast.ai/app/dashboard")

resp = client.v1_error_report(**{ 'module': 'export',
  'error_message': 'export_failed: renderer exited with code 137 (OOM)',
  'context': { 'topic_id': 'widecast7c0d4f8a9b1e2d3f',
               'request_id': 'req_9f2c14ab',
               'attempted': 'second export retry after scene 4 edit'}})
print(resp)
