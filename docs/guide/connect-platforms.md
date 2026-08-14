---
slug: connect-platforms
title: Connect your social accounts
group: publishing
order: 1
summary: "How to connect the 11 social platforms WideCast can publish to, and the publish settings you can save for each one."
updated: 2026-08-12
covers:
  - api:GET /v1/accounts
  - api:GET /v1/platform_settings
  - api:POST /v1/platform_settings
  - mcp:widecast_accounts
  - mcp:widecast_platform_settings
  - ui:platform_connect
sources:
  - gubo-remotion-player/js/widecast.js (platform list, per-platform publish settings, connect/disconnect actions)
  - gubo-remotion-player/js/setup.js (Connect Social Account section in the Setup Center)
  - gubo-remotion-player/js/kara.js (Connected Accounts entry in the profile menu)
  - widecast/docs/endpoints/connections.md (GET /v1/accounts, GET/POST /v1/platform_settings)
---

WideCast can publish your videos, blog posts, and social captions straight to your own social accounts. Before any of that works, you connect each platform once. WideCast remembers the connection, plus any publish preferences you save for it, so you do not have to redo the setup every time you publish.

## Where to connect your accounts

There are two doors into the same connect panel:

- From the Setup Center: click the **Setup AI Agent** card on the home screen, or go to widecast.ai/#setup, then choose **Connect Social Account**. See [The Setup Center](guide/setup-center.html) for what else that panel covers.
- From your profile menu: click **Account** in the top corner, then **Connected Accounts**.

Both open the same list of platforms. **Connect Social Account** shows a "Requires paid account" badge in the Setup Center; on a free plan, clicking **Connect** next to a platform shows an upgrade prompt instead of connecting it.

## The platforms you can connect

WideCast supports 11 platforms: **YouTube**, **TikTok**, **Instagram**, **Facebook**, **LinkedIn**, **X**, **Threads**, **Pinterest**, **Reddit**, **Bluesky**, and **Google Business**. If you do not have an account on a platform yet, a **Register** link next to it opens that platform's own site so you can create one.

## Connecting a platform

Click **Connect** next to any platform. A window opens where you sign in to that platform and approve WideCast's access. Once you finish, the window closes on its own and the platform shows as connected.

If that platform has its own publish settings, a settings window pops up right after you connect it, so you can set your defaults immediately. You can always come back and change them later; see the next section.

## Saving how each platform publishes

Most platforms have their own publish preferences you set once and reuse from then on. After connecting a platform, click its **Settings** button to open them:

- **YouTube**: **Privacy** (**Public**, **Unlisted**, or **Private**) and **Made for Kids**.
- **TikTok**: **Privacy** (**Public**, **Friends Only**, **Followers Only**, or **Only Me**).
- **Facebook**: **Video State** (**Published (Public)** or **Draft**) and which **Facebook Page** to post to.
- **Instagram**: **Post Type** (**Reels** or **Stories**).
- **LinkedIn**: **Visibility** (**Public** or **Connections Only**) and an optional **LinkedIn Page**.
- **Pinterest**: which **Pinterest Board** to pin to.
- **Reddit**: the **Subreddit** to post to, plus an optional flair.
- **Google Business**: which **Location** to post from, and **Post Type** (**Standard**, **Event**, or **Offer**).

**Threads**, **X**, and **Bluesky** have nothing extra to configure: once connected, they are ready to post to.

Change any of these and click **Save** (or **Save Settings** on the window that opens right after connecting) to keep them. WideCast reuses your saved choice automatically every time you publish or schedule a post to that platform. Choosing what to post and when happens in [Publish and schedule](guide/publish-and-schedule.html); this page is just about the defaults.

## Letting an AI agent manage your connections

If you use WideCast through an AI agent or another AI tool connected with your API key, it can check which platforms you have connected and read the same publish settings described above. Through the AI connector this access is read-only; changing settings happens in the studio. Connecting a brand-new platform still needs a person: that first sign-in and approval happens in your own browser at widecast.ai/#setup, so your login for YouTube, Facebook, and the rest is never shared with an AI agent. See [API and MCP access](guide/api-and-mcp.html) for how to get an API key, or the [developer docs](docs.html) for the full endpoint reference.

## Disconnecting a platform

Open **Connect Social Account** in the Setup Center, or **Connected Accounts** in your profile menu, find the connected platform, and click **Disconnect**. Confirm when asked, and WideCast stops publishing to that account until you connect it again.

## Q&A
Q: Which social platforms can I connect to WideCast?
A: Eleven: YouTube, TikTok, Instagram, Facebook, LinkedIn, X, Threads, Pinterest, Reddit, Bluesky, and Google Business. Connect any of them from the Setup Center's "Connect Social Account" section, or from "Connected Accounts" in your profile menu.

Q: How do I connect my YouTube channel to WideCast?
A: Open the Setup Center at widecast.ai/#setup and choose "Connect Social Account" (or click "Connected Accounts" in your profile menu). Find YouTube in the list and click "Connect". A window opens where you sign in to YouTube and approve access; once you finish, the window closes and YouTube shows as connected.

Q: Do I need a paid plan to connect a social account?
A: Yes. "Connect Social Account" is marked "Requires paid account" in the Setup Center. On a free plan, clicking "Connect" next to a platform shows an upgrade prompt instead of connecting it. See [Credits, plans, and billing](guide/credits-and-billing.html) for plan details.

Q: Can I make my YouTube uploads private by default?
A: Yes. After connecting YouTube, click its "Settings" button and set "Privacy" to "Public", "Unlisted", or "Private", plus whether each video is "Made for Kids". Click "Save" and every video you publish to YouTube afterward uses that setting until you change it again.

Q: Can I set a default privacy level for my TikTok posts?
A: Yes. Open TikTok's "Settings" after connecting it and choose "Privacy": "Public", "Friends Only", "Followers Only", or "Only Me". WideCast saves your choice and reuses it automatically every time you publish to TikTok.

Q: Can I post to Facebook as a draft instead of publishing right away?
A: Yes. In Facebook's connected-account settings, set "Video State" to "Draft" instead of "Published (Public)". The same settings panel is also where you choose which Facebook Page WideCast posts to.

Q: Which platforms have extra publish settings I can configure?
A: YouTube, TikTok, Facebook, Instagram, LinkedIn, Pinterest, Reddit, and Google Business each get a "Settings" button once connected, covering things like privacy, page, board, or subreddit. Threads, X, and Bluesky have nothing extra to set up: connect them and you are ready to post.

Q: How do I disconnect a social account?
A: Open "Connect Social Account" in the Setup Center, or "Connected Accounts" in your profile menu, find the connected platform, and click "Disconnect". Confirm when asked, and WideCast stops publishing to that account until you connect it again.

Q: Can my AI assistant see which accounts I have connected?
A: Partly. An AI agent connected to your account can list your connected platforms and read your saved publish settings, but through the AI connector it cannot change them; updating settings happens in the studio. It also cannot connect a brand-new platform for you, since that first sign-in has to happen in your own browser at widecast.ai/#setup.

Q: Does connecting or setting up a social account use credits?
A: No. Connecting a platform, disconnecting it, and saving its publish settings are all free. Credits are only used for things like generating scenes, AI images, or dubbing, not for managing your platform connections.

Q: Where do I connect accounts if I do not want to open the Setup Center?
A: Click "Account" in the top corner of the home screen, then "Connected Accounts". It opens the same connect panel as "Connect Social Account" in the Setup Center, just from a shorter path.
