---
slug: setup-center
title: The Setup Center
group: getting-started
order: 2
summary: "What the Setup Center is, what its six sections do, and how to generate a no-login setup link for a client."
updated: 2026-08-12
covers:
  - ui:setup_center
sources:
  - gubo-remotion-player/js/setup.js (setup sections list, Setup Center title and progress bar, client setup link generator)
  - gubo-remotion-player/record2.html (Setup AI Agent home card)
---

The Setup Center is where WideCast keeps everything about how your account works: what your business does, how you want to hear from WideCast, which outside tools can reach your account, and how you look and sound in your videos. Open it any time to fill in a section or check what is already configured.

## Opening the Setup Center

Click the **Setup AI Agent** card on the home screen ("Personalize automation."), or go straight to [widecast.ai/#setup](https://widecast.ai/#setup) while you are signed in. Both open the same **Setup Center** panel.

A progress bar at the top shows how many of the six sections you have finished, for example "3/6 completed · 50%". Nothing has to be done all at once: fill in one section, close the panel, and come back for the rest later.

## What each section does

The Setup Center lists six sections, in this order:

- **Content Strategy**: Tell WideCast what your business does. This is what personalizes the daily video topic ideas WideCast suggests for you.
- **Notification**: Connect Telegram, email, SMS, or Live Chat so WideCast can reach you with updates and reports. This is an overview only; see [Notifications](guide/notifications.html) for the full setup steps for each channel.
- **API Keys & MCP**: Generate API keys and MCP URLs so an AI agent or another AI tool can create and manage videos in your account on your behalf. Keep any key or URL you generate secret, since anyone who has it can spend your credits. See [API and MCP access](guide/api-and-mcp.html) for the full detail.
- **Face Cloning**: Upload a reference photo of your face so WideCast can use your likeness in personalized videos.
- **Voice Cloning**: Clone your own voice for narration.
- **Connect Social Account**: Connect the social platforms you publish to. See [Connecting social platforms](guide/connect-platforms.html) for the full walkthrough.

Voice Cloning and Connect Social Account each show a "Requires paid account" badge until you are on a paid plan. The other four sections are available on every plan.

## Client setup link

Instead of filling in the Setup Center yourself, you can hand the job to someone else, like a client or a teammate, without sharing your login.

Click **Generate setup link** to open the **Client setup link** panel. Choose how long the link should stay active (1, 3, or 7 days), then click **Create link**. WideCast creates the link and copies it to your clipboard right away; a **Copy link** button is there if you need to copy it again.

The link opens only the Setup Center, with no sign-in required. Whoever uses it can fill in sections like Notification or Content Strategy with their own details, but any changes they make, and any credits those changes use, belong to your account, not theirs.

This is different from the magic link you can send from the scene editor's Project tab so a client can review and edit one specific video. See [Client links](guide/client-links.html) for that one.

## Q&A
Q: What is the Setup Center?
A: The Setup Center is where you configure how WideCast works with your business: your content strategy, notification channels, API keys for AI agents, your face and voice for personalized videos, and your connected social accounts. Open it from the home screen or by going straight to widecast.ai/#setup.

Q: How do I open the Setup Center?
A: Click the "Setup AI Agent" card on the home screen, or go to widecast.ai/#setup while you are signed in. Both open the same panel, with a progress bar showing how many of the six sections you have completed.

Q: What is Content Strategy used for?
A: Content Strategy is where you tell WideCast what your business does. WideCast uses this to personalize the daily video topic ideas it suggests for you, so you spend less time coming up with what to make next.

Q: What does the Notification section do?
A: Notification is where you connect Telegram, email, SMS, or Live Chat so WideCast can reach you with updates and reports. This is an overview only; see [Notifications](guide/notifications.html) for the full setup steps for each channel.

Q: What is API Keys & MCP for?
A: API Keys & MCP is where you generate API keys and MCP URLs so an AI agent or another AI tool can create and manage videos in your account on your behalf. Keep any key or URL you generate secret, since anyone who has it can spend your credits. See [API and MCP access](guide/api-and-mcp.html) for details.

Q: What is Face Cloning?
A: Face Cloning is where you upload a reference photo of your face so WideCast can use your likeness in personalized videos, such as an AI avatar reading your script.

Q: Is Voice Cloning free?
A: No. Voice Cloning, which clones your own voice for narration, shows a "Requires paid account" badge in the Setup Center until you are on a paid plan.

Q: What does Connect Social Account do?
A: Connect Social Account is where you link the social platforms you publish videos to. It shows a "Requires paid account" badge until you are on a paid plan. See [Connecting social platforms](guide/connect-platforms.html) for the full walkthrough.

Q: Can my client fill in the setup for me?
A: Yes. In the Setup Center, click "Generate setup link" to create a link that opens the Setup Center only, with no sign-in required. Send it to your client and they can fill in sections like Notification or Content Strategy themselves. Any changes they make, and any credits used, belong to your account.

Q: How long does a client setup link stay active?
A: You choose 1, 3, or 7 days when you create it, from the "Client setup link" panel in the Setup Center. After that time, the link stops working.

Q: Is the client setup link the same as the magic link used for editing videos?
A: No. The client setup link only opens the Setup Center, for filling in account configuration. A separate link, sent from the scene editor's Project tab, lets a client review and edit one specific video. See [Client links](guide/client-links.html) for that one.
