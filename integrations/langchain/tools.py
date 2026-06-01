"""WideCast tools for LangChain agents.

Usage:
    from widecast import Widecast
    from widecast_langchain.tools import widecast_tools
    from langchain.agents import create_tool_calling_agent

    tools = widecast_tools(Widecast(api_key="wc_live_..."))
    agent = create_tool_calling_agent(llm, tools, prompt)
"""
from __future__ import annotations

from typing import Any, Dict, List, Optional

try:
    from langchain_core.tools import StructuredTool
    from pydantic import BaseModel, Field
except ImportError as e:
    raise ImportError(
        "widecast-langchain requires `langchain-core>=0.2` and `pydantic>=2`. "
        "Install with: pip install langchain-core pydantic widecast"
    ) from e

try:
    from widecast import Widecast
except ImportError as e:
    raise ImportError("`widecast` SDK not installed. pip install widecast") from e


class _CreateVideoArgs(BaseModel):
    script_text: str = Field(
        ...,
        description=("Plain-text script. The server segments it into "
                     "HOOK/BODY/CTA scenes + renders voice and B-roll."),
        min_length=1,
        max_length=50000,
    )
    wait_for_render: bool = Field(
        default=False,
        description=("If True, server blocks up to 60s waiting for render. "
                     "Otherwise async — poll widecast_get_status."),
    )


class _GetStatusArgs(BaseModel):
    video_id: str = Field(
        ...,
        description="Video id returned by widecast_create_video (e.g. vid_a1b2c3...).",
    )


def widecast_tools(client: Optional[Widecast] = None) -> List[StructuredTool]:
    """Return LangChain StructuredTools wrapping WideCast endpoints.

    Pass a pre-configured Widecast client, or omit to read WIDECAST_API_KEY
    from the environment.
    """
    c = client or Widecast()

    def _create(script_text: str, wait_for_render: bool = False) -> Dict[str, Any]:
        v = c.create_video(script_text=script_text, wait_for_render=wait_for_render)
        return dict(v)

    def _get(video_id: str) -> Dict[str, Any]:
        v = c.get_status(video_id)
        return dict(v)

    create_tool = StructuredTool.from_function(
        func=_create,
        name="widecast_create_video",
        description=("Create a short-form video from a fully-formed video script JSON. "
                     "The video renders asynchronously. Returns id and initial status='processing'. "
                     "Poll widecast_get_status until status='completed', then use result.review_url "
                     "to send the user to the scene review page."),
        args_schema=_CreateVideoArgs,
    )

    get_tool = StructuredTool.from_function(
        func=_get,
        name="widecast_get_status",
        description=("Poll the current state of a WideCast video by id. Returns status "
                     "(pending|processing|completed|failed), progress 0..1, "
                     "and when status='completed', result.review_url is the URL where "
                     "the user reviews scenes + audio."),
        args_schema=_GetStatusArgs,
    )

    return [create_tool, get_tool]


__all__ = ["widecast_tools"]
