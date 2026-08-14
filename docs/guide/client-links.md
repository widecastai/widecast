---
slug: client-links
title: Share your workspace with clients
group: sharing
order: 1
summary: "How to send a no-login Client Magic Link so a client can edit one video, when to use the client setup link instead, and how your AI agent can send either one for you."
updated: 2026-08-12
covers:
  - api:POST /v1/client_link/send
  - mcp:widecast_send_client_link
  - ui:client_links
sources:
  - gubo-remotion-player/js/editor_main.js (Client Magic Link panel: heading, expiry dropdown, Copy link and Send to client buttons, Project tab)
  - gubo-remotion-player/js/editor_extracted.js (Settings gear icon label)
  - gubo-remotion-player/js/setup.js (Setup Center title, sections, client setup link generator)
  - gubo-remotion-player/css/participant.css (what is hidden from a magic-link client)
  - widecast/docs/endpoints/client-link-send.md (POST /v1/client_link/send: link types, server-resolved recipients, no credit charged)
  - widecast/mcp-server/src/index.ts (widecast_send_client_link tool description)
---

Sometimes you want someone outside your account, like a client or a teammate, to see or work on part of your WideCast account without creating a login for them. WideCast has two kinds of no-login links for that: a Client Magic Link that opens one video's editor for hands-on editing, and a client setup link that opens only the Setup Center. You can send either one by hand, or let your connected AI agent send it for you.

## Send a Client Magic Link

Open a video in the [scene editor](guide/scene-editor-basics.html), click the gear icon labeled **Settings**, then choose the **Project** tab. Under **Client Magic Link**, set **Link valid for** to anywhere from 1 to 30 days (7 by default).

Click **Copy link** to grab the link yourself and send it however you like, or click **Send to client** to deliver it right away through the notification channels connected to your account, such as Telegram or email. See [Notifications](guide/notifications.html) if you have not connected any of those yet.

## What your client can and cannot do

Once your client opens the link, they land straight inside a simplified version of that video's scene editor, no account or sign-in required. From there they can edit much like you can: change scenes, swap backgrounds, adjust text, and use the everyday editing tools.

A few things stay out of their reach:

- **Leaving the editor.** The button that would normally exit back to your dashboard is hidden, so your client stays inside that one project.
- **The Project tab.** The same tab that generated their link, including **Export Project**, **Import Project**, and **Clone Project**, is hidden, so a client cannot re-share, download, or copy the project, or create another magic link of their own.
- **Billing.** "Subscription & Credits" does not appear in their menu.
- **Team management.** "Users", "Team", and "Send Newsletter" are all removed too.

Everything a client does inside their session applies to your account, since it is your project they are editing.

## The client setup link

A different link exists for a different job. From the Setup Center, you can generate a client setup link that opens only the Setup Center, with no video-editing access at all. It is meant for handing off account configuration, like connecting notification channels or filling in your content strategy, to a client or teammate. Anything they fill in, and any credits their changes use, belong to your account, not theirs. See [The Setup Center](guide/setup-center.html) for how to create one and choose how long it lasts.

## Send links through your AI agent

If you use WideCast through a connected AI agent or the API, it can create and send these same kinds of links for you, at no cost in credits. It can point a link at:

- A specific video's editor
- Your content plan, see [Find ideas and plan your production](guide/ideas-and-production-plan.html)
- The Setup Center, see [The Setup Center](guide/setup-center.html)
- Your Social Dashboard
- Your Publish Schedule

Just like the manual **Send to client** button, your agent cannot pick a one-off phone number or email address. Every link it sends goes out only through the notification channels already connected to your account. If you have not connected an AI agent yet, see [API and MCP access](guide/api-and-mcp.html) to set one up.

## Q&A

Q: How do I let my client review or edit a video without giving them an account?
A: Send them a Client Magic Link. Open the video in the scene editor, click the gear icon for "Settings", choose the "Project" tab, and look under "Client Magic Link". Click "Copy link" to grab it yourself, or "Send to client" to deliver it right away through your connected notification channels. Your client opens the link and lands straight inside a simplified version of that project's editor, no account required.

Q: How long does a Client Magic Link last?
A: You choose, from 1 to 30 days, when you create it, with 7 days as the default. Set it with "Link valid for" next to "Client Magic Link" in the Project tab of the scene editor's Settings panel. Once it expires, your client needs a fresh link to get back in.

Q: What can my client actually do with a Client Magic Link?
A: They land inside a simplified version of the scene editor for that one project and can edit it much like you can: change scenes, swap backgrounds, adjust text, and use the everyday editing tools. They cannot leave that project, reach your dashboard, or touch anything outside it. It is full editing access to one workspace, with the rest of your account locked away.

Q: Can my client accidentally see my billing or subscription through a Client Magic Link?
A: No. "Subscription & Credits" is removed from their menu entirely, along with "Users", "Team", and "Send Newsletter". The Project tab that generated their link is hidden too, so they cannot reach export, import, clone, or generate another link for themselves. A Client Magic Link only ever exposes the one project's editor.

Q: Can my client leave the shared project and browse the rest of my account?
A: No. The button that would normally exit the editor and return to your dashboard is hidden for anyone using a Client Magic Link, so they stay inside that one project for as long as the link is active.

Q: What is a client setup link, and how is it different from a Client Magic Link?
A: A Client Magic Link opens one video's editor for hands-on editing. A client setup link, generated from the Setup Center, opens only the Setup Center, with no video-editing access, so a client or teammate can fill in things like your notification channels or content strategy instead. Anything they configure, and any credits it uses, belong to your account. See "The Setup Center" guide for how to create one.

Q: Can my AI assistant send a client link to my client for me?
A: Yes. If you use WideCast through a connected AI agent or the API, it can create and send a client link on its own, pointed at a specific video's editor, your content plan, the Setup Center, your Social Dashboard, or your Publish Schedule. It works the same as sending one yourself, using no credits, and you can also have it hand you the link to send instead.

Q: Can my AI assistant text or email the link to any address it chooses?
A: No. Every client link, whether you send it yourself or your AI agent sends it, goes out only through the notification channels already connected to your account, such as Telegram or email. Nobody, including your AI agent, can type in a one-off phone number or address, which keeps the link from being used to message people who never connected with your account.

Q: Does creating or sending a client link cost credits?
A: No. Creating and sending either kind of client link, the Client Magic Link or the client setup link, is free, whether you do it yourself or your AI agent does it for you.

Q: My client says their link stopped working. What do I do?
A: It likely expired. A Client Magic Link lasts 1 to 30 days, whichever you chose when you created it, and a client setup link expires sooner. Open the video's Project tab, or the Setup Center, and create a fresh link to send them.
