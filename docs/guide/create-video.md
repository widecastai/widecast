---
slug: create-video
title: Every way to start a video
group: creating
order: 1
summary: "A full reference of every way to start a new video: the 10 Creator Tools cards, what each needs from you, and what happens after you submit."
updated: 2026-08-12
covers:
  - api:POST /v1/create_video
  - api:GET /v1/status/{id}
  - mcp:widecast_create_video
  - mcp:widecast_get_status
  - mcp:widecast_wait_for_video
sources:
  - gubo-remotion-player/js/kara.js (Creator Tools cards, idea/blog/remake/footage/audio source modals)
  - gubo-remotion-player/js/youtube.js (Top Videos on YouTube research modal)
  - gubo-remotion-player/js/bulk.js (Bulk Upload flow and file caps)
  - widecast/docs/endpoints/create-video.md (source/output_type bounds, inline script media)
  - widecast/llms.txt (key-free status polling, MCP tool names, media caps)
---

Every video in WideCast starts from the **Creator Tools** panel. This page is the complete reference: every starting point on offer, what each one needs from you, and what happens right after you submit. For a guided walk-through of the simplest path instead, see [Create your first video](guide/first-video.html).

## Open Creator Tools

Sign in at [widecast.ai](https://widecast.ai) and click the **Creator Tools** card on the home screen. Ten cards appear, each a different way to start a video.

## The 10 starting points

| Card | You provide | What WideCast does |
|---|---|---|
| **Idea to Video** | A short idea | Researches the topic and writes the script for you |
| **Script to Video** | A script you already wrote | Opens the Script Editor with your words, used exactly as written |
| **Blog/Article to Video** | A blog post or article | Condenses it into a narration script |
| **Remake Video** | A video you already have (upload or link) | Pulls out what's said into a new, editable script, without touching the original footage |
| **Auto-Edit Video** | Your own footage (upload or link) | Automatically edits that same footage into finished scenes |
| **Audio to Video** | An audio file (upload or link) | Uses it as the narration and builds matching visuals around it |
| **Voiceover Video** | Footage you upload, link, or pick from the built-in clip library | Adds an AI voiceover over it |
| **Bulk Upload** | Up to 20 video clips at once | Lines them up as the scenes of one new video |
| **Make Tutorial/Guide Video** | Footage you upload or link | Packages it into a step-by-step tutorial or guide video |
| **Top Videos on YouTube** | A keyword | Shows the top public YouTube videos on that topic, for research (it does not create a video by itself) |

## What's behind each source

Behind the cards are five kinds of input, each with its own bounds:

- **A finished script** (**Script to Video**): 80 to 500 words, read by the narrator exactly as written.
- **An idea** (**Idea to Video**): 5 to 1000 words; WideCast interprets it and writes the script. A longer idea is automatically shortened to fit rather than rejected.
- **A blog post or article** (**Blog/Article to Video**): 30 to 3000 words, condensed the same way.
- **An existing video**, by upload or link (**Remake Video**, **Auto-Edit Video**, **Voiceover Video**, **Make Tutorial/Guide Video**): up to 5 minutes of footage. Files you upload directly are also capped at 100 MB; there's no separate size cap when you paste a link instead.
- **An audio file**, by upload or link (**Audio to Video**): the same 5-minute, 100 MB caps.
- **A batch of short clips** (**Bulk Upload**): up to 20 clips picked from your device, each clip up to 20 seconds. This card takes uploads only, no links.

## Put your own footage in the script

If you're writing the script yourself in **Script to Video**, drop a direct image or video link right next to the line it belongs to, either as `![description](url)` or as a plain link on its own line. WideCast uses that file as the visual for that scene instead of picking its own footage, and never reads the link out loud. This only works with direct file links, the kind ending in something like `.jpg` or `.mp4`, not a page link such as a YouTube watch page.

## After you submit

Whichever card you use, your new video appears on the home screen under **Recent** and moves through progress states while WideCast works, landing on **Ready to Edit** (or **Ready to Record** if you chose to record it yourself). If you're driving WideCast through the API or an AI agent instead of the browser, you check progress the same way: poll the video's own status. That check never needs an API key, since the video's id is itself unguessable enough to act as the access token.

## Starting a video without the studio

Developers and AI agents can start a video the same way the studio does, without touching a single card: submit the source (script, idea, blog, or media file or link), then check status until it's ready. An AI agent connected to your account through the WideCast connector can run this whole flow for you from a chat; see [Agents & MCP](guide/api-and-mcp.html) for how to connect one. If you're integrating directly instead, the full request and response reference lives in the [developer docs](docs.html).

## Q&A

Q: How long can my script be?
A: A script you paste into "Script to Video" must be 80 to 500 words, used exactly as written, which is roughly 20 seconds to 2 minutes of narration. Starting from "Idea to Video" gives you more room: 5 to 1000 words, which WideCast turns into a script for you. From "Blog/Article to Video" you can paste 30 to 3000 words. If an idea or article runs past its limit, WideCast automatically shortens it to fit instead of rejecting it.

Q: Can I make a video from a YouTube link?
A: Yes. Paste the link into "Remake Video" to pull out the transcript as an editable script, or into "Auto-Edit Video" to turn the footage itself into a new video automatically. "Top Videos on YouTube" is different: it searches YouTube by keyword to help you find ideas, and does not build a video from a link on its own.

Q: Can I make a video from a podcast or audio recording?
A: Yes, using "Audio to Video". Upload the audio file or paste a link to it, up to 5 minutes long and up to 100 MB for uploads, and WideCast uses the recording as the narration while it builds matching visuals around it.

Q: Can I use my own photos or clips inside the script?
A: Yes. While writing a script in "Script to Video", place a direct image or video link right next to the sentence it belongs to. WideCast uses that file as the visual for that scene instead of choosing its own footage, and skips over it when the narrator reads the script aloud. This works with direct file links, like one ending in .jpg or .mp4, not a page link such as a YouTube watch page.

Q: What does "Remake Video" do?
A: It takes a video you already have, by upload or by pasting a link, and pulls out what's said into a new, editable script, without touching the original footage. From there you can revise the wording like any other script and generate a fresh video from it.

Q: Is there a length limit for uploaded videos?
A: Yes. Any video or audio you upload or link to, for "Remake Video", "Auto-Edit Video", "Voiceover Video", "Audio to Video", or "Make Tutorial/Guide Video", is capped at 5 minutes of footage. Files you upload directly also have a 100 MB size cap; pasting a link instead has no separate size limit. "Bulk Upload" has its own tighter cap: each clip in the batch can be at most 20 seconds long.

Q: What is the difference between "Remake Video" and "Auto-Edit Video"?
A: "Remake Video" pulls what's said in your video out into a new, editable script, without keeping the original clip. "Auto-Edit Video" keeps your original footage and edits that same footage automatically into finished scenes. Reach for "Remake Video" when you want to reuse the message, and "Auto-Edit Video" when you want to reuse the footage itself.

Q: What does "Bulk Upload" do?
A: It lets you add up to 20 short video clips in one go instead of one at a time, picked from your device (this card takes uploads only, not links). Each clip can be up to 20 seconds long, and WideCast lines them up as the scenes of a single new video.

Q: Can I start a video without opening WideCast in my browser?
A: Yes. An AI agent connected to your account through the WideCast connector can create a video for you from a chat, using the same script, idea, blog, or media sources described on this page. See the Agents & MCP guide for how to connect one.

Q: Do I need an API key just to check a video's status?
A: No. Once a video is created, its id alone is enough to check progress. This is what lets an AI agent, or a page you build yourself, poll for status without holding a key at all. Creating the video in the first place does still need a key.
