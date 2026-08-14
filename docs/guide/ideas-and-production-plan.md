---
slug: ideas-and-production-plan
title: Find ideas and plan your production
group: creating
order: 7
summary: "Browse trending and industry video ideas, save the ones you like to your Production Plan backlog, share your list, and let a connected AI agent add ideas for you automatically."
updated: 2026-08-14
covers:
  - api:POST /v1/collect_ideas
  - api:GET /v1/production_plan
  - api:POST /v1/production_plan/add
  - mcp:widecast_collect_ideas
  - mcp:widecast_production_plan
  - mcp:widecast_add_to_production_plan
  - ui:production_plan
sources:
  - gubo-remotion-player/js/iei.js (idea browser cards, Production Plan modal, Share Ideas)
  - gubo-remotion-player/js/kara.js (Ideation with AI link, Production Plan home card wiring)
  - gubo-remotion-player/record2.html (Production Plan home card)
  - widecast/docs/endpoints/collect-ideas.md (POST /v1/collect_ideas)
  - widecast/docs/endpoints/production-plan-add.md (POST /v1/production_plan/add)
  - widecast/docs/endpoints/library.md (GET /v1/production_plan)
  - widecast/mcp-server/src/index.ts (MCP tool descriptions)
---

Not every video starts with a clear topic. WideCast can suggest video ideas for your business, and it keeps a running backlog called the Production Plan so a good idea never gets lost. This guide covers where those ideas come from, how to save and share them, and how an AI assistant can even keep your Production Plan stocked for you.

## Browse ideas for your video

From the **Describe your idea** box, click **Ideation with AI** to open **Browse Trending Video Topics**. Describe what your business does, or tap one of the example prompts like "I'm a realtor in California," then press **Show Me Ideas**. WideCast returns a list of ideas matched to your business, arranged in a few groups, from ideas trending right now to ideas aimed at turning viewers into customers.

Every idea card gives you three options: **Save** to add it to your Production Plan, **Make Video** to drop it straight into the **Describe your idea** box so you can continue the normal video flow (covered in [Create your first video](guide/first-video.html)), or **More ideas like this** to open a side panel of similar topics.

Prefer to browse by industry instead of describing your business? WideCast also has **Industry Topics** and **Viral Topics** browsers with more idea sources for your field, using the same idea cards and the **Share Ideas** option covered below.

## Save an idea to your Production Plan

Click **Save** on any idea card and WideCast adds it to your Production Plan, then shows a confirmation with a **View Production Plan** button so you can jump straight to your backlog. Saving an idea never costs credits, so save as many as you like while you browse.

## Inside your Production Plan

Open the **Production Plan** card on the home screen ("Saved topics and drafts") to see your full backlog. Each entry shows its title, a short description, and a status such as **New**, **Script ready**, or **Exported**, so you always know how far along it is. Click an entry's action button, for example **Start Process** for a fresh idea or **Record** for one that is ready, to keep working on it. Use the up and down arrows to reorder entries, or the trash icon (tooltip "Remove from queue") to delete one you no longer want. An empty plan shows "Your production plan is empty" with a **Show today's ideas** button that takes you back to fresh suggestions.

You will also see a smaller **Production plan** list right inside the **Describe your idea** screen, previewing ideas you have already saved so you can tap one instead of typing something new.

## Share your ideas

Open the **Industry Topics** or **Viral Topics** browser and click **Share Ideas**. WideCast formats your current idea list as text, complete with view counts and a short intro, and copies it to your clipboard so you can paste it into an email, text, or chat message. This is a text copy, not a live link. To let a client open and review your actual Production Plan without signing in, use a private client link instead, covered in [Client links](guide/client-links.html).

## Let an AI agent stock your plan

Connect an AI assistant, like Claude or ChatGPT, to your account through the WideCast connector, and it can do this browsing for you. Ask it to brainstorm video ideas for your business: it can read what is already in your Production Plan first, then queue the best new ones in, so they are waiting the next time you open WideCast. If it does not already know which market you serve, for example a city, state, or country, it will ask before generating ideas, since that shapes which trends and language show up. Connect an assistant from **API Keys & MCP** in the Setup Center at [widecast.ai/#setup](https://widecast.ai/#setup); see [API and MCP access](guide/api-and-mcp.html) for the full walkthrough.

An assistant can also do more than queue titles. If it has already written the full script for an idea, it can attach up to five versions of that script, each framed from a different angle, when it adds the idea. That idea lands in your plan already marked **Script ready**: click it and the Script Editor opens with the finished script loaded and any other attached versions ready to compare, so the writing step is skipped entirely and no credits are spent on it. And when the assistant adds several ideas at once, it can flag its top pick; that entry shows a small **Recommended** badge in the top corner of its card in the plan list.

## Q&A

Q: Where does WideCast get video ideas?
A: From the idea browser built into WideCast. Click "Ideation with AI" from the "Describe your idea" screen to open "Browse Trending Video Topics," describe what your business does, and press "Show Me Ideas" for a list of ideas matched to you. WideCast also has "Industry Topics" and "Viral Topics" browsers with more idea sources for your field. Every idea you see can be saved, turned straight into a video, or used to find more ideas like it.

Q: How do I save an idea for later?
A: Click "Save" on any idea card. WideCast adds it to your Production Plan and shows a confirmation with a "View Production Plan" button so you can jump straight to your backlog. Saving an idea never costs credits, so save as many as you like while you browse.

Q: What is the Production Plan?
A: The Production Plan is your backlog of saved ideas and in-progress drafts, opened from the "Production Plan" card on the home screen. Each entry shows its title, a short description, and a status such as "New," "Script ready," or "Exported," so you always know how far along it is. Click an entry's action button, for example "Start Process" or "Record," to keep working on it.

Q: Can I turn a saved idea straight into a video?
A: Yes. From an idea card, click "Make Video" and WideCast drops its title and description into the "Describe your idea" box so you can continue the normal video flow. From inside the Production Plan itself, click an entry's action button, such as "Start Process," to pick up where you left off. The full video-creation flow after that point is covered in [Create your first video](guide/first-video.html).

Q: What does "More ideas like this" do?
A: Every idea card has a "More ideas like this" option next to Save and Make Video. Click it to open a side panel of ideas similar to that one, so you can explore a theme further instead of starting a new search from scratch. The first click on an idea costs 1 credit; reopening the same idea's suggestions later is free.

Q: Can I share my ideas list?
A: Yes. Open the "Industry Topics" or "Viral Topics" browser and click "Share Ideas." WideCast formats your current idea list as text, complete with view counts and a short intro, and copies it to your clipboard so you can paste it into an email, text, or chat message. To let a client review your actual Production Plan without signing in, use a private client link instead, covered in [Client links](guide/client-links.html).

Q: Can my AI assistant fill my Production Plan for me?
A: Yes. Once an AI assistant, like Claude or ChatGPT, is connected through the WideCast connector, it can brainstorm video ideas for your business and queue the best ones straight into your Production Plan, so they are waiting the next time you open WideCast. Connect one from "API Keys & MCP" in the Setup Center. See [API and MCP access](guide/api-and-mcp.html) for how to connect one.

Q: Does my AI assistant need to know my target market to brainstorm ideas?
A: Yes, if your account does not already have one saved. WideCast needs to know which audience or market the ideas should target, like a city, state, or country, since that changes which trends and language show up. Your assistant will ask you for this before it brainstorms if it is not already on file.

Q: Can I reorder or remove ideas in my Production Plan?
A: Yes. Each entry has up and down arrows to move it within the list, and a trash icon (labeled "Remove from queue" on hover) to delete it. Reordering only changes the order you see entries in; it does not affect any credits or content you have already generated.

Q: Does saving an idea to my Production Plan cost credits?
A: No. Adding an idea to your Production Plan, whether you click "Save" yourself or an AI assistant queues one for you, never uses credits. Generating fresh ideas is what can spend credits: running a new brainstorm with "Show Me Ideas" consumes credits, and "More ideas like this" costs 1 credit the first time you use it on an idea.

Q: What is the small "Production plan" list I see while describing my idea?
A: When you open the "Describe your idea" screen, WideCast shows a short list labeled "Production plan" just below the input box. It previews ideas you have already saved, so you can tap one instead of typing something new. Before you save anything, it reads "No ideas in your production plan yet."

Q: Can my AI assistant attach a finished script to an idea it adds?
A: Yes. When a connected assistant adds an idea to your Production Plan, it can attach one to five finished script versions, each framed from a different angle. The idea then shows as "Script ready" in your plan, and clicking it opens the Script Editor with the script already loaded and any other attached versions available to compare. The writing step is skipped and no credits are spent on it.

Q: What does the "Recommended" badge on a Production Plan idea mean?
A: When an AI assistant adds several ideas at once, it can flag the one it thinks you should make first. That idea shows a "Recommended" badge in the top corner of its card in the Production Plan list. It is a highlight to help you choose; it does not change how the idea behaves or what it costs.
