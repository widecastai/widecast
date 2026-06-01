# WideCast for LangChain

LangChain `StructuredTool` wrappers for the WideCast API.

## Install

```bash
pip install widecast langchain-core pydantic
# Copy tools.py into your project, or:
pip install widecast-langchain   # (planned — same content)
```

## Use

```python
from widecast import Widecast
from tools import widecast_tools
from langchain_openai import ChatOpenAI
from langchain.agents import create_tool_calling_agent, AgentExecutor
from langchain_core.prompts import ChatPromptTemplate

tools = widecast_tools(Widecast(api_key="wc_live_..."))
llm = ChatOpenAI(model="gpt-4o-mini")
prompt = ChatPromptTemplate.from_messages([
    ("system", "You generate videos via WideCast tools when asked."),
    ("user", "{input}"),
    ("placeholder", "{agent_scratchpad}"),
])
agent = create_tool_calling_agent(llm, tools, prompt)
executor = AgentExecutor(agent=agent, tools=tools)

result = executor.invoke({"input": "Tạo video về việc tập thể dục buổi sáng (3 scenes)."})
print(result["output"])
```

## Tools exposed

- `widecast_create_video(script: dict, wait_for_render: bool = False)`
- `widecast_get_video(video_id: str)`

## License

Apache-2.0.
