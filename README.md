<div align="center">
  <img src="statics/widecast_logo_gray.svg" alt="WideCast" width="64" height="64">

# WideCast

**Give your AI agent a media team.**

2-minute videos, blogs, and posts for 10 platforms.
Works with **Claude** · **ChatGPT** · **Grok** · **Gemini**.

[![PyPI](https://img.shields.io/pypi/v/widecast?label=pypi%20widecast&color=8b5cf6)](https://pypi.org/project/widecast/)
[![npm SDK](https://img.shields.io/npm/v/@widecast/sdk?label=npm%20sdk&color=8b5cf6)](https://www.npmjs.com/package/@widecast/sdk)
[![npm MCP](https://img.shields.io/npm/v/@widecast/mcp-server?label=npm%20mcp&color=8b5cf6)](https://www.npmjs.com/package/@widecast/mcp-server)
[![tests](https://img.shields.io/github/actions/workflow/status/widecastai/widecast/test.yml?branch=main&label=tests)](https://github.com/widecastai/widecast/actions/workflows/test.yml)
[![Downloads](https://img.shields.io/pypi/dm/widecast?label=pypi%20downloads&color=22c55e)](https://pypi.org/project/widecast/)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![widecast.ai](https://img.shields.io/badge/widecast-ai-8b5cf6)](https://widecast.ai)

</div>

---

## ✨ Install in one prompt

Tell your AI chat host: **`install https://widecast.ai`** — Claude, ChatGPT, Grok, or Gemini will fetch [`install.json`](install.json), detect itself, and walk you through the recipe.

If you'd rather click than type, pick your path below.

---

## Pick your path

### 🟣 I use ChatGPT, Claude, Grok, or Gemini

Connect WideCast to your AI host. The AI writes the script, calls WideCast, hands you a review URL. No code.

→ [Claude](https://widecast.ai/claude.html) · [ChatGPT](https://widecast.ai/chatgpt.html) · [Codex](https://widecast.ai/chatgpt.html) · [Grok](https://widecast.ai/grok.html) · [Gemini](https://widecast.ai/gemini.html) · [Antigravity](https://widecast.ai/gemini.html)

### 🟣 I build AI agents

Install the MCP server. Your Hermes / OpenClaw / Claude Code / custom agent gets `create_video`, `wait_for_video`, `publish`, `get_writing_skill` as native tools. Streamable HTTP or local stdio.

```bash
claude mcp add widecast widecast-mcp --env WIDECAST_API_KEY=wc_live_...
```

→ [MCP install & tool reference](https://widecast.ai/docs.html)

### 🟣 I'm a developer

Call the REST API directly. Python & JS SDKs, OpenAPI 3.1, HMAC-signed webhooks, idempotent retries. No agent framework required.

```bash
pip install widecast        # Python
npm i @widecast/sdk         # JavaScript / TypeScript
```

→ [API reference & playground](https://widecast.ai/endpoints/create-video.html)

---

## 60-second quickstart

```python
from widecast import Widecast

client = Widecast(api_key="wc_live_...")
video = client.create_video(
    source="idea",
    idea_text="why founders should ship on day one",
).wait()
print(video.status, video.review_url)
```

```typescript
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_..." });
const v = await client.create_video({
  source: "idea",
  idea_text: "why founders should ship on day one",
}).then(v => v.wait());
console.log(v.status, v.review_url);
```

```bash
# MCP — your AI calls this inside Claude, Cursor, Codex, etc.
widecast_create_video({
  "source": "idea",
  "idea_text": "why founders should ship on day one"
})
```

```bash
# Raw cURL
curl -X POST https://widecast.ai/v1/create_video \
  -H "Authorization: Bearer wc_live_..." \
  -H "Content-Type: application/json" \
  -d '{"source":"idea","idea_text":"why founders should ship on day one"}'
```

Get your API key at [widecast.ai/#setup](https://widecast.ai/#setup).

---

## What's in this repo

| Path | What |
|---|---|
| [`sdk-python/`](sdk-python/) | Official Python SDK · `pip install widecast` |
| [`sdk-js/`](sdk-js/) | Official JS/TS SDK · `npm i @widecast/sdk` |
| [`mcp-server/`](mcp-server/) | Local MCP server (stdio + HTTP) · `npx @widecast/mcp-server` |
| [`skills/`](skills/) | 3 Agent Skills (`SKILL.md`) for video, blog, and social — the writing method shipped to Claude / ChatGPT via MCP |
| [`openapi/`](openapi/) | OpenAPI 3.1 spec (canonical source of truth) |
| [`openapi.json`](openapi.json) · [`openapi-actions.json`](openapi-actions.json) | Generated specs (the Actions variant is optimized for ChatGPT Custom GPT imports) |
| [`llms.txt`](llms.txt) | AI-readable API spec for HTTP-capable agents that don't run MCP |
| [`install.json`](install.json) | Machine-readable install recipe for `install https://widecast.ai` prompts |
| [`docs/`](docs/) · [`endpoints/`](endpoints/) | Reference documentation source |
| [`integrations/`](integrations/) | Adapter stubs (LangChain, Vercel AI SDK, OpenAI tools, Postman) |
| [`playgrounds/`](playgrounds/) | Per-endpoint playground HTML |
| [`examples/`](examples/) | Code samples per endpoint × language |

**Not in this repo:** the rendering engine, the scene editor, the social-distribution worker, the billing pipeline. Those run on WideCast's hosted backend. This repo is everything you need to **call WideCast from your agent or app**, plus the AI Skills that drive script quality.

---

## How it works

1. **Tell your AI host** (Claude / ChatGPT / Grok / Gemini) what you want — a video, a blog, or social posts about a topic.
2. **The AI calls WideCast's writing skill** via MCP or the Custom GPT Action. The skill returns a research-first, structured method (3-Layer Hook, inline media, faceless vs narrator, cost estimate).
3. **The AI researches, writes, gathers candidate images, and hands off** the script with a review link.
4. **WideCast renders** the scenes server-side. You review at [widecast.ai/#scene_editor](https://widecast.ai/#scene_editor) and either approve or tweak.
5. **Publish** to the connected platforms (TikTok / YouTube / Instagram / X / LinkedIn / Facebook / Threads / Pinterest / Reddit / Bluesky).

The whole loop — research → script → scenes → render → publish — is one MCP call away. The human review checkpoint is the 5% that separates agency work from AI slop.

---

## Why agents love it

| | |
|---|---|
| **Self-describing** | OpenAPI 3.1 + JSON Schema 2020-12. Agents auto-tool from [`/openapi.json`](https://widecast.ai/openapi.json). |
| **Async by default** | POST then poll `/v1/status/{id}`, or get an HMAC webhook. SDKs handle the cadence. |
| **Structured errors** | `type` · `code` · `doc_url` · `request_id` — machine-routable, never a guess. |
| **Idempotent** | `Idempotency-Key` dedupe — a retrying agent never double-charges or double-publishes. |
| **Early review URL** | The review link is in the create response. One-shot agents (ChatGPT Action without polling) still hand the user a real link. |
| **`media_pool`** | Uncertain image URLs go in `media_pool[]` — the scene editor's drop-in library. |

---

## Contributing

PRs welcome on SDKs, MCP server, Skills, docs, and integrations. See [CONTRIBUTING.md](CONTRIBUTING.md).

**Out of scope for this repo:** changes to the rendering engine, social distribution, billing, or backend routes. Those live in WideCast's private engine repo. Open an [issue](../../issues) describing the change you'd like and we'll work it from our side.

---

## Security

Report vulnerabilities to **security@widecast.ai** — see [SECURITY.md](SECURITY.md).

---

## License

[Apache License 2.0](LICENSE) — use this code freely in commercial and personal projects.

---

<div align="center">

**[widecast.ai](https://widecast.ai)** · [Docs](https://widecast.ai/docs.html) · [Playground](https://widecast.ai/playground.html) · [API](https://widecast.ai/endpoints/create-video.html)

</div>
