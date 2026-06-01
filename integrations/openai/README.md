# WideCast for OpenAI (function calling / Assistants)

Drop-in function specs for [OpenAI's function-calling API](https://platform.openai.com/docs/guides/function-calling) and [Assistants API](https://platform.openai.com/docs/assistants/overview).

## Use

### With Chat Completions

```python
import json
from openai import OpenAI
import requests

client = OpenAI()
TOOLS = json.load(open("tools.json"))

def call_widecast(name, args):
    if name == "widecast_create_video":
        return requests.post(
            "https://widecast.ai/app/dashboard2/v1/create_video",
            headers={"Authorization": f"Bearer {os.environ['WIDECAST_API_KEY']}"},
            json=args,
        ).json()
    if name == "widecast_get_video":
        return requests.get(
            f"https://widecast.ai/app/dashboard2/v1/videos/{args['video_id']}",
            headers={"Authorization": f"Bearer {os.environ['WIDECAST_API_KEY']}"},
        ).json()

resp = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "Tạo video về việc tập thể dục buổi sáng."}],
    tools=TOOLS,
)
# Inspect resp.choices[0].message.tool_calls and route to call_widecast.
```

### With Assistants API

```python
assistant = client.beta.assistants.create(
    name="Video Maker",
    instructions="You generate videos via WideCast when asked.",
    tools=json.load(open("tools.json")),
    model="gpt-4o",
)
```

## Files

- [`tools.json`](./tools.json) — array of `{type: "function", function: {...}}` definitions.

## License

Apache-2.0.
