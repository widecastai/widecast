---
slug: publish-and-schedule
title: Publish now or schedule for later
group: publishing
order: 2
summary: "Publish your finished video to your connected platforms right away or schedule it for later, then check the Publish Schedule calendar to see what has gone out."
updated: 2026-08-12
covers:
  - api:POST /v1/publish
  - mcp:widecast_publish
  - ui:publish_schedule
sources:
  - gubo-remotion-player/js/editor_extracted.js (Exported dialog Publish button, Publish Video screen)
  - gubo-remotion-player/js/widecast.js (platform selection, Post Now/Schedule toggle, success messages, Publish Schedule calendar)
  - gubo-remotion-player/js/kara.js (Publish Schedule entry in the profile menu)
  - widecast/docs/endpoints/publish.md (POST /v1/publish reference)
  - widecast/mcp-server/src/index.ts (widecast_publish tool description)
---

With your accounts connected, publishing itself is one screen: pick which platforms this post goes to, decide whether it goes out now or later, and confirm. This page walks through that screen, plus the separate Publish Schedule calendar where you can see everything you have already queued or sent, and how an AI agent can do the same for you. For connecting a platform for the first time, see [Connect your social accounts](guide/connect-platforms.html); for what to type in the caption box itself, see [Social posts and captions](guide/social-captions.html).

## Open Publish from your exported video

Once a video finishes rendering, WideCast shows the **Exported** dialog described in [Exporting the final video](guide/export-video.html). Click **Publish** there to open the **Publish Video** screen. It has two parts: **Video Details**, the shared title and description that goes out with your post, and **Publish to Social Media**, where you pick platforms and timing.

## Choose which platforms to post to

Under **Publish to Social Media**, WideCast lists the platforms you have already connected. Select as many or as few as you want this post to reach: pick a single platform, or select every connected platform to post everywhere in one action. Nothing goes out to a platform you did not select. If you have not connected any accounts yet, WideCast prompts you to do that first; see [Connect your social accounts](guide/connect-platforms.html).

Each platform's own defaults, like YouTube's privacy setting or which Facebook Page to use, come from what you saved when you connected it; you do not set those again here. If one of those defaults is still missing, like which Pinterest board to pin to, WideCast stops you and tells you what to add before it will publish.

## Post now or schedule for later

Below the platform list, a toggle sets the timing. **Post Now** sends your post as soon as you confirm. **Schedule** reveals a date field and a time field so you can pick exactly when it should go out instead.

The button at the bottom follows your choice: **Publish to Social** for an immediate post, or **Schedule to Social** once you switch to Schedule. Press it and WideCast confirms right there, either "Published successfully to" the platforms you picked, or "Scheduled successfully!" once it is queued.

## See what is scheduled or already published

Every post you schedule, and everything WideCast has already published for you, is tracked in one place. Click **Account** in the top corner, then **Publish Schedule** to open it.

It opens on **This month**; use the arrows on either side to move to an earlier or later month. Each entry shows one of four statuses: **Scheduled**, **Publishing**, **Published**, or **Failed**. If nothing happened in the month you are looking at, WideCast shows "Nothing published or scheduled this month."

Once a post actually goes out, its entry gets a **View post** link. Click it to open that exact post, live on the platform, in a new tab, so you can see precisely what your audience sees.

## Publishing through AI agents and the API

If you connect an AI agent to WideCast through the API or an MCP connector, it can publish for you the same way: choosing the content, the platforms, and whether to post now or on a specific date and time, just like you can in the studio. Before it does, it has to confirm the exact content and the exact platforms with you in that conversation; a request you made earlier, or an assumption the agent makes on its own, is not enough, since publishing is public and cannot be undone.

The publish request does not wait for every platform to finish before responding: WideCast hands back a tracking id right away, and your agent checks that id for progress, the same way it would check on a video that is still generating. Once it is done, the result lists each platform's outcome, including a link to the live post wherever it succeeded. See [API and MCP access](guide/api-and-mcp.html) for how to connect an agent to your account, or the [developer docs](docs.html) for the full endpoint reference.

## Q&A

Q: How do I publish my video after I export it?
A: Open the "Exported" dialog that appears once rendering finishes and click "Publish". That opens the "Publish Video" screen, where you pick which connected platforms to post to and choose "Post Now" or "Schedule" before confirming.

Q: How do I post my video to all my platforms at once?
A: On the "Publish Video" screen, select every platform you have connected under "Publish to Social Media", then press "Publish to Social". WideCast posts to all of them together in one action. Through the API or an AI agent, leave the platforms list blank and it defaults to every platform you have connected.

Q: Can I publish the same video to some platforms only?
A: Yes. Select only the platforms you want this particular post to reach before you press "Publish to Social" or "Schedule to Social". WideCast does not post to any platform you did not select.

Q: How do I schedule my video to publish at a later time?
A: On the "Publish Video" screen, switch the toggle from "Post Now" to "Schedule". A date field and a time field appear so you can pick exactly when it should go out, then press "Schedule to Social" to queue it.

Q: Where do I see what I have scheduled or already published?
A: Click "Account" in the top corner, then "Publish Schedule". It opens a calendar of everything you have scheduled or published, month by month, with a status on each entry: "Scheduled", "Publishing", "Published", or "Failed".

Q: How do I find the link to my published post?
A: Open "Publish Schedule" from the "Account" menu and find the post. Once it has actually gone out, its entry shows a "View post" link that opens the live post on that platform in a new tab.

Q: What is the difference between "Schedule" on the publish screen and "Publish Schedule" in the Account menu?
A: "Schedule" is the choice you make while publishing one post, so it goes out later instead of right away. "Publish Schedule" is the separate calendar where you can see every post you have scheduled or already published, across your whole account, browsable by month.

Q: What do the statuses in Publish Schedule mean?
A: "Scheduled" means the post is queued and waiting for its time. "Publishing" means it is going out right now. "Published" means it is live, with a "View post" link to see it. "Failed" means WideCast could not post it; try publishing that content again.

Q: Can an AI agent publish or schedule my video for me?
A: Yes, if you have connected one through the API or an MCP connector. It must confirm the exact content and the exact platforms with you in that conversation first, since publishing is public and cannot be undone. Once you confirm, it can post right away or schedule it for a specific date and time, the same choice you get in the studio.

Q: Does publishing or scheduling a video use credits?
A: Yes, publishing uses credits, whether you post it right away or schedule it for later; both cost the same. Check your balance under "Subscription & Credits" in the profile menu.
