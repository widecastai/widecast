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

## 🎬 See it in action

**From faceless AI to fully authentic — same prompt, four modes.** Each clip below was created from a single line of natural-language prompt typed into an AI chat.

<table>
  <tr>
    <td align="center" width="50%">
      <video src="https://github.com/user-attachments/assets/f37a88f8-704b-4bc3-a358-5b315207ad80" poster="https://widecast.ai/landing/easement_thumb.jpg" controls muted playsinline width="100%"></video>
      <br><sub>👤 <b>Real face</b> · 🎙️ <b>Real voice</b></sub><br>
      <b>What is an easement?</b>
    </td>
    <td align="center" width="50%">
      <video src="https://github.com/user-attachments/assets/e9dceacb-2d8d-4191-937b-dcead61d7735" poster="https://widecast.ai/landing/crashscene_thumb.jpg" controls muted playsinline width="100%"></video>
      <br><sub>🤖 <b>AI face</b> · 🤖 <b>AI voice</b></sub><br>
      <b>Eight things to do at the crash scene</b>
    </td>
  </tr>
  <tr>
    <td align="center">
      <video src="https://github.com/user-attachments/assets/cb88c304-768a-48fd-a937-c29b4030f46b" poster="https://widecast.ai/landing/roof_thumb.jpg" controls muted playsinline width="100%"></video>
      <br><sub>🎬 <b>Faceless</b> · 🎙️ <b>Real voice</b></sub><br>
      <b>Top 5 things to ask at an open house</b>
    </td>
    <td align="center">
      <video src="https://github.com/user-attachments/assets/bb454d54-dcb9-4bb7-8948-e635a20582d3" poster="https://widecast.ai/landing/ideablognews_thumb.jpg" controls muted playsinline width="100%"></video>
      <br><sub>🎬 <b>Faceless</b> · 🤖 <b>AI voice</b></sub><br>
      <b>Jensen Huang's quote at CES 2026</b>
    </td>
  </tr>
</table>

The same engine, picking real-world topics across categories — every one driven by an AI agent calling WideCast:

<table>
  <tr>
    <td align="center" width="50%">
      <video src="https://github.com/user-attachments/assets/cec5b4a1-9775-4fbc-a34e-0d427833df85" poster="https://widecast.ai/landing/8_firsttime_homebuyer_thumb.jpg" controls muted playsinline width="100%"></video>
      <br><sub>Real estate</sub><br>
      <b>8 things first-time home buyers need to know</b>
    </td>
    <td align="center" width="50%">
      <video src="https://github.com/user-attachments/assets/94a5ef02-0fb9-469a-ae3a-762691562ab5" poster="https://widecast.ai/landing/scam_text_thumb.jpg" controls muted playsinline width="100%"></video>
      <br><sub>Scam awareness</sub><br>
      <b>Scam texts: 5 signs not to click</b>
    </td>
  </tr>
  <tr>
    <td align="center">
      <video src="https://github.com/user-attachments/assets/068daa42-3ba4-494d-95a5-98a2111b195b" poster="https://widecast.ai/landing/laidoff_thumb.jpg" controls muted playsinline width="100%"></video>
      <br><sub>Career</sub><br>
      <b>Laid off? 7 things to do in the first 48 hours</b>
    </td>
    <td align="center">
      <video src="https://github.com/user-attachments/assets/4bcf9472-ade6-4fe6-b74b-2ca7243bd98b" poster="https://widecast.ai/landing/ask_doctor_thumb.jpg" controls muted playsinline width="100%"></video>
      <br><sub>Health</sub><br>
      <b>7 questions to ask your doctor before you leave</b>
    </td>
  </tr>
  <tr>
    <td align="center">
      <video src="https://github.com/user-attachments/assets/6cf71786-1697-4a07-acf6-ff18ec5c6a0e" poster="https://widecast.ai/landing/buy_used_car_thumb.jpg" controls muted playsinline width="100%"></video>
      <br><sub>Automotive</sub><br>
      <b>Buying a used car: 6 red flags in 5 minutes</b>
    </td>
    <td align="center">
      <video src="https://github.com/user-attachments/assets/8cdcb47e-7fa5-4860-825c-d7a730ddcf33" poster="https://widecast.ai/landing/AI_halu_thumb.jpg" controls muted playsinline width="100%"></video>
      <br><sub>AI literacy</sub><br>
      <b>5 ways to fact-check ChatGPT and Claude</b>
    </td>
  </tr>
  <tr>
    <td align="center">
      <video src="https://github.com/user-attachments/assets/605bfa4c-ff2b-4959-b5ef-9ebdfa451fe6" poster="https://widecast.ai/landing/renting_buying_home_thumb.jpg" controls muted playsinline width="100%"></video>
      <br><sub>Real estate</sub><br>
      <b>Renting or buying: 7 things to check before deposit</b>
    </td>
    <td align="center">
      <video src="https://github.com/user-attachments/assets/fa075a23-3358-4bac-a6d2-b6257f4e2a68" poster="https://widecast.ai/landing/sunscreen_thumb.jpg" controls muted playsinline width="100%"></video>
      <br><sub>Skincare</sub><br>
      <b>Sunscreen: 6 mistakes that still leave dark spots</b>
    </td>
  </tr>
  <tr>
    <td align="center">
      <video src="https://github.com/user-attachments/assets/3f372ee0-ed5b-4b44-9ade-9c2e6af41d79" poster="https://widecast.ai/landing/creditcard_minimum_thumb.jpg" controls muted playsinline width="100%"></video>
      <br><sub>Personal finance</sub><br>
      <b>Credit card debt: why minimum payments trap you</b>
    </td>
    <td align="center">
      <video src="https://github.com/user-attachments/assets/c172e57b-a79a-4218-9208-42422a8459ff" poster="https://widecast.ai/landing/insurance_fee_up_thumb.jpg" controls muted playsinline width="100%"></video>
      <br><sub>Insurance</sub><br>
      <b>Car insurance going up? 6 factors that could be the cause</b>
    </td>
  </tr>
</table>

→ See the full gallery + live playground at **[widecast.ai](https://widecast.ai/#see-it-in-action)**.

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
