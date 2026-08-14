---
slug: api-and-mcp
title: Let your AI assistant run WideCast
group: help
order: 1
summary: "How to get an API key and MCP connector, link an AI assistant like Claude or ChatGPT to your account, what it can safely do on your behalf, and how to stay in control of access."
updated: 2026-08-12
covers:
  - api:POST /v1/edit_session
  - api:POST /v1/modify_scene
  - api:POST /v1/scene_geometry
  - api:POST /v1/scene_inspector
  - api:POST /v1/video_data
  - api:POST /v1/upload_asset
  - api:GET /v1/videos
  - api:POST /v1/mcp_token
  - api:GET /v1/skills/writing
  - api:GET /v1/skills/editing
  - mcp:widecast_edit_session
  - mcp:widecast_modify_scene
  - mcp:widecast_scene_geometry
  - mcp:widecast_scene_inspector
  - mcp:widecast_video_data
  - mcp:widecast_upload_asset
  - mcp:widecast_list_videos
  - mcp:widecast_get_writing_skill
  - mcp:widecast_get_editing_skill
sources:
  - gubo-remotion-player/js/setup.js (API Keys & MCP panel: generate/reveal/mint/revoke button labels, secrecy copy)
  - widecast/docs/index.md (endpoint list, per-host setup guide links, writing-skill reference)
  - widecast/llms.txt (mcp_token minting, key-free skills/status endpoints, agent editing chain, install manifest, export-confirmation convention)
  - widecast/claude.html (per-assistant connector steps and test prompt)
  - widecast/gemini.html (confirms Gemini and Antigravity share one combined setup page)
  - widecast/antigravity.html (confirms this page now redirects into gemini.html)
  - widecast/docs/endpoints/video-data.md (data-first audit chain: video_data first)
  - widecast/docs/endpoints/modify-scene.md (data-first agent rule: video_data then scene_geometry then modify_scene)
---

WideCast does not have to stay something you only click through yourself. Connect an AI assistant, like Claude or ChatGPT, to your account and ask it to make a video, write a post, or fix a scene, the same way you would ask a teammate. This page covers getting your key and connector, what a connected assistant can actually do, how it learns WideCast's own methods on its own, and how to keep access safe.

## Get your key and connector

Open [widecast.ai/#setup](https://widecast.ai/#setup) and choose **API Keys & MCP**. Click **Generate API key and MCP url**, optionally give the key a name, and WideCast hands you both credentials at once: an **API key** that starts with `wc_live_`, for calling WideCast directly from your own code, and an **MCP URL**, for pasting into an AI assistant. You do not have to choose between them; every key comes with both, and you can come back later and click **Show API key & MCP url** on that key to see them again.

Treat both like a password. Whoever has your MCP URL or API key can act on your account and spend your credits, so only paste them into an assistant or tool you trust, and never post them anywhere public. Click **Revoke** next to a key in **API Keys & MCP** any time you want to shut it off.

## Connect your assistant

Paste the MCP URL into your assistant's connector settings and it can start using WideCast right away, no separate download or install involved. WideCast has a short setup page for each major assistant: [Claude Web & Desktop](claude.html), [ChatGPT & Codex](chatgpt.html), [Gemini & Antigravity](gemini.html), and [Grok](grok.html). Any other tool that supports custom MCP connectors, like Cursor, can use the same MCP URL even without a dedicated WideCast page.

In Claude, for example, the steps are: **Settings**, then **Connectors**, then **Add custom connector**, paste the link, name it "WideCast", and click **Connect**. Turn the connector on for your chat, then ask for what you want, like "Use WideCast to make a video about [your topic]." The other assistants follow the same paste-a-link idea with their own menu names; use the matching page above for the exact steps.

## What a connected assistant can do

Once it is connected, an assistant can do most of what you can do yourself in the studio, only when you ask it to, and always against your own account:

- Start a new video, blog post, or social caption from an idea, a script, a link, or a file you hand it. See [Every way to start a video](guide/create-video.html) and [Social posts and captions](guide/social-captions.html).
- List your video library and check on anything already in progress.
- Read a video's scenes in detail, then audit and fix individual ones, like swapping a background or fixing on-screen text, without touching the rest of the video.
- Search stock footage and real photos, or upload a file of your own for it to use. See [Backgrounds and footage](guide/backgrounds-broll.html).
- Publish a finished video or post, send yourself a notification, or send a client a review link. See [Client links](guide/client-links.html) for that last one.

It never reaches outside your account: no one else's credits, videos, or connected platforms are involved.

## Auditing and fixing scenes for you

Ask a connected assistant to review or fix a video, and it works scene by scene, the same careful way a good editor would:

1. First, it reads the video's full scene-by-scene data: what each scene currently says, shows, and how it is put together (`POST /v1/video_data`, MCP tool `widecast_video_data`).
2. For anything about position or layout, it checks a lightweight map of where the on-screen text, captions, and your face or avatar currently sit, without opening a live preview (`POST /v1/scene_geometry`, MCP tool `widecast_scene_geometry`).
3. Then it applies one focused change at a time: swap a background, reposition an overlay, fix on-screen text or a caption, correct the narration wording, or show and hide the narrator, the same moves available in the scene editor itself (`POST /v1/modify_scene`, MCP tool `widecast_modify_scene`).
4. If it is fixing several scenes in the same pass, it first groups those changes into one session so they land cleanly without conflicting with each other, then closes the session when done (`POST /v1/edit_session`, MCP tool `widecast_edit_session`).
5. On the rare occasion it genuinely needs to see the result, not just know where things sit, it can request a quick screenshot of one scene as a last resort, after the steps above were not enough (`POST /v1/scene_inspector`, MCP tool `widecast_scene_inspector`).

None of this spends a credit by itself. Editing a scene you already have is always free, in the studio or through an assistant; only generating something new, or exporting, does.

## It already knows how to write and edit

You never have to teach a connected assistant how WideCast wants a script written or a scene fixed. The moment it needs that knowledge, it fetches WideCast's own playbook by itself: a writing method for a new video, blog post, or social caption (`GET /v1/skills/writing`, MCP tool `widecast_get_writing_skill`), and an editing method for auditing and fixing an existing video (`GET /v1/skills/editing`, MCP tool `widecast_get_editing_skill`). Both are free to fetch and need no key, so there is no setup step on your side beyond connecting the assistant in the first place; it already knows what to do.

## Uploading files and checking your library

Your assistant can also pull in outside material and check what you already have:

- **Upload a file**: hand it a video, audio clip, image, or document from your chat, like a script you already wrote, and it stores the file with WideCast and gets back a link it can use right away (`POST /v1/upload_asset`, MCP tool `widecast_upload_asset`).
- **List your library**: ask what you have made recently and it reads back your videos (`GET /v1/videos`, MCP tool `widecast_list_videos`), the same list you see under **Recent** on the home screen.

See [AI-generated images](guide/ai-images.html) for generating a new image the same way.

## Keeping access safe

- **Your key always starts `wc_live_`.** Only paste it, or your MCP URL, into an assistant or tool you actually trust; whoever has either one can act on your account and spend your credits.
- **You can rotate or cut off access anytime.** Minting a fresh MCP URL for a key (the same action behind the mint and reveal buttons in **API Keys & MCP**), or clicking **Revoke** on the key outright, immediately retires the old one; reconnect your assistant with the new link whenever you like.
- **Checking on a video needs no key at all.** Once a video exists, its own id is enough to check its progress, so an assistant can watch a video finish without holding your credentials.
- **Exporting always needs your yes.** Even fully connected, an assistant has to ask you directly before it renders a final video, and can only do it right after you clearly say yes to that specific export, not from something you agreed to earlier in the conversation. See [Exporting the final video](guide/export-video.html) for the full export flow.
- **You hear the cost before it is spent.** WideCast's own instructions tell a connected assistant to say what something will cost and let you decide, rather than spending credits silently.

## For developers

Integrating WideCast straight into your own code instead of through a chat assistant uses the same endpoints, documented in full in the [developer docs](docs.html), with request and response details, error codes, and SDKs. Try any of them immediately in the [interactive playground](playground.html) before writing a line of code.

## Q&A

Q: How do I connect WideCast to Claude, ChatGPT, or another AI assistant?
A: Open widecast.ai/#setup and choose "API Keys & MCP", then click "Generate API key and MCP url" to get your personal MCP URL. Paste that URL into your assistant's connector settings (in Claude, that is Settings, then Connectors, then Add custom connector), give it a name, and click "Connect". Turn the connector on for your chat, then ask it to do something, like "Use WideCast to make a video about a topic you choose." Menu names differ slightly by assistant, so check the setup page for yours if the wording does not match.

Q: Which AI assistants can connect to WideCast?
A: Claude, ChatGPT, Gemini, Grok, and Antigravity all support pasting in an MCP connector URL, and WideCast has a short setup page for each: Claude Web and Desktop, ChatGPT and Codex, a combined page for Gemini and Antigravity, and one for Grok. Other tools that support custom MCP connectors, like Cursor, can use the same MCP URL even without a dedicated WideCast setup page.

Q: Where do I get a WideCast API key?
A: From "API Keys & MCP" in the Setup Center at widecast.ai/#setup. Click "Generate API key and MCP url" and WideCast gives you both an API key, which starts with wc_live_, for calling WideCast directly from your own code, and an MCP URL for connecting an AI assistant, in the same step. You do not need to choose between them ahead of time. Developers integrating directly can find the full request and response reference in the developer docs.

Q: What is the MCP connector URL?
A: It is a personal link that stands in for your account, similar to an API key but built for pasting into a chat assistant instead of code. WideCast creates it at the same time as your API key when you click "Generate API key and MCP url" in "API Keys & MCP", inside the Setup Center. Paste the whole link, unedited, into your assistant's connector settings, and it can then use WideCast on your account without you typing anything else in. Treat it as a secret: anyone who has it can use your account.

Q: What can my AI assistant actually do in WideCast?
A: Once connected, it can do almost anything you would do yourself: start a new video, blog post, or social caption from an idea, script, link, or file; list your video library; read a video's scenes and fix individual ones, like swapping a background or correcting on-screen text; search stock footage; upload a file for you; and publish, notify you, or send a client a review link. It only acts on your account, using your own credits and connected platforms, and only when you ask it to.

Q: Can my assistant fix or audit one scene in my video?
A: Yes. A connected assistant first reads the video's scene-by-scene data, checks how things are laid out if it needs to, then makes one focused change at a time, the same moves available in the scene editor: swap a background, reposition an overlay, fix on-screen text or a caption, correct the narration wording, and more. If it is changing several scenes in one pass, it groups them into a single session so the changes do not conflict with each other. None of this spends a credit.

Q: Do I have to teach my assistant how to write scripts or edit scenes?
A: No. WideCast ships its own writing method and its own editing method, and a connected assistant fetches whichever one it needs automatically, right when it needs it, the moment you ask for a new video or ask it to fix an existing one. Both are free to look up and need no key. You do not have to upload a guide, paste instructions, or explain WideCast's conventions yourself; connecting the assistant is the only setup step.

Q: Is it safe to give an AI assistant access to my WideCast account?
A: Yes, with normal care. Your API key and MCP URL work like a password: anyone who has one can act on your account, so only paste them into an assistant or tool you trust, and never share them publicly. WideCast also builds in limits: checking on a video needs no key at all, editing a scene never spends credits, and exporting a finished video always needs your direct yes before it happens. You can revoke a key immediately from "API Keys & MCP" in the Setup Center if you ever have doubts.

Q: Can my assistant spend my credits without asking me first?
A: WideCast's own instructions tell a connected assistant to tell you the cost before it generates something new, so you can decide first rather than being surprised afterward. Exporting a finished video goes further: the assistant must ask you directly and can only proceed after you clearly say yes to that specific export, not something you agreed to earlier in the chat. Editing scenes you already have, searching footage, and checking status never use credits at all, connected or not.

Q: Does connecting an AI assistant cost anything?
A: No. Generating an API key and MCP URL, connecting an assistant, checking on a video's status, and having your assistant read or audit scenes are all free. Credits are only spent the same way they would be if you were clicking through the studio yourself, by generating something new, like a video, an image, or a final export. Connecting more than one assistant, or reconnecting after rotating your link, does not cost anything extra either.

Q: Can I revoke my assistant's access to WideCast?
A: Yes. Open "API Keys & MCP" in the Setup Center and click "Revoke" next to the key your assistant is using. This shuts off both the API key and its MCP URL immediately, so the assistant can no longer act on your account. To reconnect later, click "Generate API key and MCP url" to create a new one, then connect your assistant again with the fresh link.

Q: My assistant lost access to WideCast. How do I reconnect it?
A: Open widecast.ai/#setup, go to "API Keys & MCP", and find the key your assistant was using. If it still shows as "Active", click "Show API key & MCP url" to see the MCP URL again and paste it back into your assistant's connector settings. If the key was revoked, or you no longer have the URL, click "Generate API key and MCP url" to create a new one, then reconnect your assistant with the fresh link the same way you did the first time.
