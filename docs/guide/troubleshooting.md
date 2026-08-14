---
slug: troubleshooting
title: Troubleshooting common problems
group: help
order: 3
summary: "What each video status badge means, and how to fix the most common blocks: exports, publishing, uploads, client links, notifications, and word-count limits."
updated: 2026-08-12
covers:
  - api:GET /v1/status/{id}
sources:
  - gubo-remotion-player/js/kara.js (status badges, "Failed to generate script" alert, Live Support menu item)
  - gubo-remotion-player/js/editor_main.js (export warning modal - Incomplete Scenes Detected, B-roll missing, Find B-roll)
  - gubo-remotion-player/js/widecast.js ("No accounts connected." / "Connect your accounts first")
  - widecast/docs/endpoints/create-video.md (status and error-code tables - video_not_found, unsupported_media_url, media_too_long, file_too_large, word-count errors)
  - widecast/docs/endpoints/client-link-send.md (1-30 day link expiry)
  - widecast/docs/endpoints/notification-send.md (60/hour notification rate limit)
  - dashboard2.py (media_too_long, file_too_large, free_tier_limit_exceeded, magic link expiry)
  - widecast/widecast.html (Support link)
---

Most things that go wrong in WideCast show up as a plain status, not a cryptic error: a badge on your video, a warning before you export, or a short message when something is blocked. This page walks through the most common ones and what to do about each. If nothing here solves it, open the Account menu in the top corner and choose "Live Support" to talk to the WideCast team directly.

## Reading your video's status

Every video on your home screen's Recent list carries a status badge:

- **Generating** - shown with a percentage that climbs as each step finishes.
- **Ready to Edit** - scenes and footage are done and waiting for you in the scene editor.
- **Ready to Record** - your script is ready, but the video needs you on camera.
- **Failed** - that specific run hit a problem.

Building with the API or an AI agent instead of the browser? The same status, pending, processing, completed, or failed, is available by checking the video's id directly, and it works without an API key. See the [developer docs](docs.html) for the exact fields it returns.

## Q&A
Q: My video has been stuck on "Generating" for over an hour. Is something wrong?
A: Generating a video almost always takes just a few minutes. The workflow screen shows its own estimate and says "Feel free to do other tasks," so closing the tab and coming back later is fine; WideCast keeps working in the background regardless. If it has run far past that estimate, reopen WideCast and check the badge again; a badge that changed to "Failed" means that run hit a problem, not that it is still stuck. If it is still stuck on "Generating," reach out through "Live Support" in the Account menu with that video so the team can check the run.

Q: My video's badge says "Failed". Did I lose my work or credits?
A: A "Failed" badge means that specific run hit a problem; it does not affect your other videos. Sometimes it fails immediately with a popup starting "Failed to generate script:" followed by the reason; other times you only notice the "Failed" badge later on the home screen. Open Creator Tools and run it again first, since occasional runs do fail and a retry often succeeds. If the same input keeps failing, check that your plan and credit balance are current under [Credits, plans, and billing](guide/credits-and-billing.html), since an expired plan or empty balance can also show up as "Failed." Still stuck? Contact "Live Support" from the Account menu.

Q: I clicked "Export" but WideCast won't let me. What's wrong?
A: WideCast checks every scene first. If a scene is simply unfinished, using AI narration because you have not recorded your own voice, or still using placeholder media, an "Incomplete Scenes Detected" warning appears; press "Export Anyway" to render as-is, or fix those scenes first. If instead a B-roll scene has no image or video attached at all, export is blocked completely with no way around it until that scene is fixed; open it and use "Find B-roll" to add footage. See [Exporting the final video](guide/export-video.html) for the full walkthrough of both warnings.

Q: Why did publishing my video fail?
A: The most common reason is that the platform you picked is not connected yet. In the Publish panel, a platform with no connected account shows "No accounts connected." with a "Connect your accounts first" link; click it, sign in to that platform, and try publishing again. You can also connect ahead of time through "Connect Social Account" in the [Setup Center](https://widecast.ai/#setup), or "Connected Accounts" in the Account menu. See [Connect your social accounts](guide/connect-platforms.html) and [Publish and schedule](guide/publish-and-schedule.html) for the full flow.

Q: The client link I sent stopped working. Why?
A: A "Client Magic Link" from the scene editor's Project tab only stays valid for the window you chose when you created it, anywhere from 1 to 30 days. Once that window passes, it stops opening a working session for your client; there is no on-screen warning, the page just will not load properly for them. Open the Project tab in the scene editor, generate a fresh link with a new expiry, and resend it. This is different from the "Client setup link" created in the Setup Center, which expires on its own separate schedule. See [Client links](guide/client-links.html) for the full picture.

Q: I set up Telegram for WideCast notifications, but they are not arriving. Why?
A: Two common causes. First, the connection may not have actually finished: open the [Setup Center](https://widecast.ai/#setup)'s "Notification" section and confirm Telegram shows as connected, not just started. Second, WideCast limits automated notifications, including Telegram, to 60 per hour per account; if you or an automation go past that, further sends fail with a rate-limit error until the hour resets, so try again a little later. Either way, email still goes out as the default channel in the meantime, so check your inbox too. See [Notifications](guide/notifications.html) for the full setup.

Q: I pasted a video or audio link and WideCast could not use it. Why?
A: The link has to be a direct, public address WideCast can fetch on its own, not a page that requires you to be signed in, and not a file sitting only on your own network or computer. A share link that opens a player on someone else's site sometimes will not work either, even though it plays fine in your own browser. If a pasted link keeps failing, download the file yourself and upload it directly to WideCast instead of linking to it; direct uploads do not depend on WideCast being able to reach an outside address.

Q: WideCast rejected my uploaded video or audio. What are the limits?
A: Two caps apply. Video or audio you upload or link to can run up to 5 minutes; anything longer is rejected, so trim the clip or pick a shorter section. Files you upload directly are also capped at 100 MB; pasting a link instead has no separate size cap, only the 5-minute duration limit. If your file is over 100 MB, compress it or export a shorter or lower-resolution version before uploading again. Free plan accounts face a shorter duration cap on top of this; see [Credits, plans, and billing](guide/credits-and-billing.html) for plan limits.

Q: WideCast rejected my script as too short or too long. How do I fix it?
A: If it is too short, add real content: another example, more detail, or a closing call to action, until you clear the minimum. A full script you write or paste needs at least 80 words (500 words maximum); starting from an idea needs at least 5 words, and a blog article needs at least 30. If you are over the maximum on a full script, trim it down, since scripts are rejected for running too long. Ideas and blog articles work differently: go over their maximum, 1,000 words and 3,000 words, and WideCast just shortens them automatically instead of blocking you.

Q: WideCast blocked my video for being too long, even though it's under 5 minutes. Why?
A: The 5-minute cap is for paid plans. Free plan accounts have a separate, shorter limit of 60 seconds, whether the video is generated from a script or idea, or built from media you upload or link to directly. Go over that on a free account and WideCast blocks it and asks you to shorten it or upgrade. This is the same 60-second cap that limits how long a finished free-plan video can run; it just also applies on the way in, to whatever source you feed it. See [Credits, plans, and billing](guide/credits-and-billing.html) to check your plan or upgrade.

Q: I tried to check on a video by its id and WideCast says it cannot find it. Why?
A: The most common reason is a small typo or a dropped character when the id was copied; double-check it against wherever you got it from. Every video's id starts with "widecast," and checking its status only needs that id, nothing else, not even an API key, so this is not an access or login problem. If the id is exactly right and WideCast still cannot find it, that specific video genuinely does not exist under that id. Still stuck? Contact "Live Support" from the Account menu with the id you have.

Q: None of this fixed my problem. How do I talk to a real person at WideCast?
A: Open the Account menu in the top corner of WideCast and choose "Live Support" to start a live chat with the WideCast team without leaving the page. If you are signed out, or browsing widecast.ai itself, look for the "Support" link in the top navigation or footer instead; it opens WideCast's public support and discussion board in a new tab. Either way, mention the video's name or id and what you already tried, so the team can pick up where you left off.
