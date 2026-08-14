---
slug: analytics
title: Track how your content performs
group: publishing
order: 3
summary: "Open the Social Dashboard to see followers, views, and engagement across every platform you have connected, pick a time period, and let an AI agent pull the same numbers."
updated: 2026-08-12
covers:
  - api:GET /v1/analytics
  - mcp:widecast_analytics
  - ui:social_dashboard
sources:
  - gubo-remotion-player/js/widecast.js (Social Dashboard modal, including metrics, period selector, and sections)
  - gubo-remotion-player/js/kara.js (Statistics entry in the profile menu)
  - widecast/docs/endpoints/library.md (GET /v1/analytics reference)
  - widecast/mcp-server/src/index.ts (widecast_analytics tool description)
---

WideCast keeps a live scoreboard of how your content is doing once it is out in the world: followers, views, likes, and more, pulled from the platforms you have connected. This is the Social Dashboard. Here is how to open it, what each number means, and how to change the time period you are looking at.

## Open the Social Dashboard

Open the profile menu in the top corner and choose **Statistics**. This opens the **Social Dashboard**, a full-screen view of how your connected accounts and posts are performing.

## What the numbers mean

The top of the Social Dashboard shows eight totals for whatever time period you have selected:

- **Accounts**: how many social accounts you currently have connected to WideCast.
- **Followers**: total followers added up across every connected account.
- **Views/Reach**: combined views and reach reported by your connected platforms.
- **Content**: how many pieces of content WideCast counted across your connected accounts for that period.
- **Posts via WideCast**: how many of those posts you actually published from inside WideCast, rather than content that was already on the platform.
- **Likes**, **Comments**, **Shares**: total engagement on your content for that period.

Scroll down for more: an **Engagement Trend** chart, a **Connected Accounts** breakdown of followers, views, and content per account, an **Upload Stats (via WideCast)** table of successful and failed uploads by platform, and a **Recent Posts** list.

## Choose a time period

Use the dropdown near the top of the Social Dashboard to change the window: **Today**, **Last 7 days**, **Last 30 days**, **Last 90 days**, **Last 365 days**, or **Custom range**. Choosing **Custom range** reveals a start date and an end date field; set both and press **Apply** to load that window.

## Where the numbers come from

Every number on the Social Dashboard comes from platforms you have connected to WideCast, so an account you have not connected yet will not show up, and most stats read zero until you connect your first platform. See [Connect your social accounts](guide/connect-platforms.html) for how to link an account.

The dashboard does not have a separate filter to show just one platform at a time either; the top stats always combine every connected account. The **Connected Accounts** and **Upload Stats (via WideCast)** sections mentioned above are where those same numbers get broken out account by account and platform by platform, inside the same view.

## Checking analytics through the API or an AI agent

If you connect an AI agent, like Claude or ChatGPT, to your WideCast account, it can pull the same numbers for you: ask it how a recent video performed or what your follower growth looks like, and it can call the analytics tool directly. Developers integrating directly can call `GET /v1/analytics` with the same time period options shown in the dashboard. Both ways of checking are read-only and free, though they can take a little while to respond since they gather live numbers from each connected platform. Connect an agent from **API Keys & MCP** in the Setup Center at [widecast.ai/#setup](https://widecast.ai/#setup); see [API and MCP access](guide/api-and-mcp.html) for the full walkthrough, or the [developer docs](docs.html) for the endpoint reference.

## Q&A

Q: Where do I see views and likes for my posts?
A: Open the profile menu in the top corner and choose "Statistics" to open the Social Dashboard. It shows Views/Reach, Likes, Comments, and Shares totals across every platform you have connected, for whatever time period you pick.

Q: What metrics does the Social Dashboard show?
A: Eight totals for your chosen time period: Accounts, Followers, Views/Reach, Content, Posts via WideCast, Likes, Comments, and Shares. Scroll down for an Engagement Trend chart, a Connected Accounts breakdown, an Upload Stats table, and a Recent Posts list.

Q: What does "Posts via WideCast" mean on the Social Dashboard?
A: It counts how many of your posts were actually published from inside WideCast. That is different from "Content," which counts everything WideCast can see across your connected accounts for the selected period, including posts made outside WideCast.

Q: How do I change the time period on the Social Dashboard?
A: Use the dropdown near the top: "Today," "Last 7 days," "Last 30 days," "Last 90 days," "Last 365 days," or "Custom range." Picking "Custom range" reveals a start date and an end date field; set both and press "Apply."

Q: Why are my Social Dashboard numbers all zero?
A: The Social Dashboard only counts platforms you have connected to WideCast. If you have not connected any social accounts yet, most numbers read zero. Connect one, then reopen "Statistics" to see real numbers.

Q: Can I see analytics for one platform only?
A: The Social Dashboard does not have a dedicated single-platform filter; the top numbers always combine every connected account. Scroll down to the "Connected Accounts" and "Upload Stats" sections, though, where the same numbers are broken out account by account and platform by platform.

Q: Why do my follower numbers look behind?
A: The Social Dashboard asks each connected platform for its current numbers every time you open it, instead of keeping its own separate count. If a number looks behind, that usually means the platform itself has not finished updating its own stats yet, not a problem with WideCast.

Q: Does checking my Social Dashboard use credits?
A: No. Opening the Social Dashboard, switching time periods, and pulling the same numbers through the API or an AI agent are all free.

Q: Can my AI assistant read my analytics?
A: Yes. Once you connect an AI assistant, like Claude or ChatGPT, through the WideCast connector, you can ask it things like how your last video performed or what your follower growth looks like, and it can pull the same numbers shown on your Social Dashboard. Connect one from "API Keys & MCP" in the Setup Center at widecast.ai/#setup.
