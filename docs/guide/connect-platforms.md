---
slug: connect-platforms
title: Connect your social accounts
group: publishing
order: 1
summary: "How to connect the 11 social platforms WideCast can publish to, the publish settings you can save for each one, and channel groups for a second set of accounts."
updated: 2026-09-16
covers:
  - api:GET /v1/accounts
  - api:GET /v1/platform_settings
  - api:POST /v1/platform_settings
  - api:GET /v1/channel_groups
  - api:POST /v1/channel_groups
  - api:GET /v1/channel_groups/{channel_group}
  - api:PATCH /v1/channel_groups/{channel_group}
  - api:DELETE /v1/channel_groups/{channel_group}
  - mcp:widecast_accounts
  - mcp:widecast_platform_settings
  - mcp:widecast_channel_groups
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

## Channel groups: a second set of accounts

If you run more than one set of channels, for example Vietnamese channels and English channels, keep them in separate **channel groups**. Each group holds its own connections, one account per platform, with its own publish settings. Your existing accounts live in the **Primary** group, so nothing changes until you add a second group.

- Open **Connect Social Account** and click **Add channel group**. Give it a name such as "English channels".
- A tab bar appears above the platform list. Pick a tab, then connect platforms in that group exactly as before. The number on each tab is how many accounts are connected in it.
- When you publish, every group's accounts appear as separate chips labelled with the group name, so you always see which YouTube or TikTok account a post goes to. Select chips from several groups and WideCast posts to each group in turn.
- The Social Dashboard gets a group selector and opens on **All groups**, which adds the numbers of every group together and tags each account and post with its group name; pick one group to see just its numbers. The Publish Schedule shows the group name next to the platform.
- **Rename** changes the label. **Remove group** disconnects every account in that group and deletes its publishing profile; posts already published stay online.

Each group is a separate profile on the publishing provider, so the number of groups you can add depends on that plan. When it is full, WideCast tells you so instead of creating an empty group.

For the API and AI agents, every group has a number: 0 is Primary, and new groups get the next number, which is never reused. Reports show the whole picture unless you narrow them: `GET /v1/analytics` and `GET /v1/accounts` cover every group when `channel_group` is left out, and the daily Telegram report does the same, naming each group. Pass a group number only when you want to audit one group. Publishing works the other way round: `POST /v1/publish` and `POST /v1/platform_settings` use Primary when `channel_group` is left out, and one publish call always goes through one group. `GET /v1/channel_groups` lists the groups, and the AI tool `widecast_channel_groups` does the same. Creating, renaming and removing groups uses `POST /v1/channel_groups` and `PATCH` or `DELETE /v1/channel_groups/{channel_group}`; an AI agent can read groups but cannot create or remove them.

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

Q: I have Vietnamese channels and English channels. Can I connect two YouTube accounts?
A: Yes, with channel groups. Open "Connect Social Account", click "Add channel group" and name it, for example "English channels". A tab bar appears; pick the new tab and connect its YouTube account there. Your original accounts stay in the "Primary" group, and each group keeps its own publish settings. How many groups you can have depends on your plan: the entry plan includes the Primary group only, and higher plans add one or two more. When your plan has no room left, the screen shows "Upgrade to add a channel group" instead.

Q: When I publish, how do I choose which group's account a post goes to?
A: Once you have more than one channel group, the platform chips in the publish screen are grouped under the group name, so "YouTube" under "English channels" is a different account from "YouTube" under "Primary". Select the chips you want; WideCast posts to each selected group in turn and reports the result per group.

Q: Does the Social Dashboard show every channel group?
A: Yes. With more than one group, the dashboard opens on "All groups", which adds every group together and tags each account and post with its group name. A group selector next to the period selector lets you switch to one group to see just its numbers.

Q: What happens when I remove a channel group?
A: WideCast deletes that group's publishing profile, which disconnects every account connected in it. Posts that were already published stay online. The group's number is not reused, so nothing that referred to it can point at a different group later.

Q: Why does "Add channel group" say the plan is full?
A: Two limits apply. Your WideCast plan includes a set number of channel groups, and the Primary group counts as one: the entry plan has the Primary group only, and higher plans add one or two more. When they are all used, the Connect screen shows "Upgrade to add a channel group" instead of "Add channel group", and upgrading your plan unlocks the next one. Separately, every group is a profile on the publishing provider, whose plan also allows a fixed number of profiles; if that is what is full, remove a group you no longer use or upgrade the provider plan, then try again.

Q: Can my AI assistant publish through a specific channel group?
A: Yes. Ask it to list your channel groups first; each has a number, and 0 is Primary. It passes that number when it publishes or reads publish settings, since those always target one group. When it pulls analytics or lists accounts without naming a group, it gets every group at once, the same full picture the daily Telegram report shows. It can read groups but cannot create or remove them; that stays in the studio.

Q: I renamed my account on the platform, but WideCast still shows the old name. Why?
A: WideCast keeps a copy of each connected account's name and refreshes it from the publishing provider automatically: at most every 30 minutes while you use the studio, and right away whenever you open "Connect Social Account". Open that screen once and the new name appears; you do not need to reconnect. If the platform kept your old handle and only changed the display name, WideCast shows the display name.
