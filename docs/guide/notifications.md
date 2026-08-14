---
slug: notifications
title: Notifications and alerts
group: sharing
order: 3
summary: "Connect Telegram, email, SMS, and Live Chat in the Setup Center, email yourself a project link with Send Notify, and let your AI agent push its own updates."
updated: 2026-08-12
covers:
  - api:POST /v1/notification/send
  - mcp:widecast_send_notification
  - ui:notifications
sources:
  - gubo-remotion-player/js/setup.js (Notification section modal with Telegram/Email/SMS/Live Chat ID rows + Save)
  - gubo-remotion-player/js/widecast.js (Telegram connect flow, notification type toggles, disconnect)
  - gubo-remotion-player/js/editor_main.js (Send Notify button location in the Project tab)
  - gubo-remotion-player/js/editor_extracted.js (Send Notify confirm and request behavior)
  - dashboard2.py (send_notify route, email-only, 10/hour; v1 notification/send route, email/Telegram delivery, 60/hour)
  - widecast/docs/endpoints/notification-send.md (POST /v1/notification/send reference with fields, delivery, errors)
  - widecast/mcp-server/src/index.ts (widecast_send_notification MCP tool)
---

WideCast can reach you three different ways: channels you connect once in the Setup Center, a one-click reminder email from inside the scene editor, and updates your own AI agent can push to you while it works. This topic covers all three, plus what to check when a notification does not arrive.

## Connecting Telegram, email, SMS, and Live Chat

Open the Setup Center (see [The Setup Center](guide/setup-center.html) if you have not been there yet) and click **Notification**. A panel lists four rows, **Telegram** first, then **Email**, **SMS**, and **Live Chat ID**.

**Telegram** is a real connection, not just a saved value. The row shows "Set up" until you connect, or "Connected" afterward. Click it to open the **Telegram Assistant** panel, then press **Connect**. That opens Telegram itself with a chat already started with WideCast's bot; press **Start** there and come back to WideCast. The row then shows your Telegram name, plus a "Receive notifications for:" list where you turn five kinds of updates on or off: **Video ready to record**, **Publish results**, **Daily summary**, **Weekly report**, and **Reminders**. Press **Save Preferences** after changing any of them. A refresh button re-checks your connection, and **Disconnect** is there if you want to stop.

**Email**, **SMS**, and **Live Chat ID** are simple fields underneath: type a value, for example a phone number under **SMS**, and press **Save**. WideCast checks the format of whatever you enter and shows a message if it is not valid. The **Email** field here is not your login email; it is a separate delivery address just for notifications, so leave it blank and WideCast falls back to your login email automatically. **Live Chat ID** is for your own LiveChatWithUs account; entering it shows that chat widget inside your scene editor.

## Send Notify: email yourself a project link

In the scene editor, open the gear icon's **Project** tab (see [Scene editor basics](guide/scene-editor-basics.html) for the rest of that tab). Under **Share Project**, next to the link you can copy, there is a **Send Notify** button. Press it, confirm, and WideCast emails a "ready for review" reminder, with a link back to that same project, to your WideCast login email. Use it as a note-to-self when you want a nudge in your inbox to come finish recording or reviewing a video later.

Send Notify only sends email; even though it lives in a notification-related part of the editor, it does not use Telegram. You can press it up to 10 times an hour.

Further down the same **Project** tab is **Client Magic Link**, a different feature for sending a client a link to edit the video itself; see [Client links](guide/client-links.html) for that one.

## Notifications from your AI agent

An AI agent connected to your account (see [API and MCP access](guide/api-and-mcp.html) for how to connect one) can send you its own updates with `POST /v1/notification/send`, or the MCP tool `widecast_send_notification`. This is meant for moments like "your video finished rendering" or "three scenes still need review" landing in your inbox, or on Telegram, even after you have closed WideCast.

Every notification needs a short `subject`, which becomes the email subject line and is also shown in bold above the message on Telegram, plus a `message` body. You can optionally attach one photo or one video by web address, never both in the same notification.

Email is the default channel: WideCast always sends there, using the Setup Center's notification **Email** address if you set one, or your login email otherwise. If you have also connected Telegram, the same notification goes there too. Without either one set up, the request fails and points back to [widecast.ai/#setup](https://widecast.ai/#setup) to fix that first. This only notifies you, the account owner; there is no way for an agent to message anyone else through this tool. Sending a notification never uses credits, but is capped at 60 notifications an hour per account.

## Q&A
Q: How do I get WideCast alerts on Telegram?
A: Open the Setup Center, click "Notification", then click the "Telegram" row. That opens the "Telegram Assistant" panel; press "Connect" to open Telegram with a chat already started with WideCast's bot, press "Start" there, then come back to WideCast. The row updates to show your Telegram name once you are connected.

Q: What kinds of updates can Telegram send me?
A: Once Telegram is connected, a "Receive notifications for:" list lets you turn five updates on or off: "Video ready to record", "Publish results", "Daily summary", "Weekly report", and "Reminders". Check or uncheck the ones you want, then press "Save Preferences".

Q: How do I disconnect Telegram from WideCast?
A: Open the Setup Center, click "Notification", then click the "Telegram" row to open the "Telegram Assistant" panel. Press "Disconnect" and confirm. WideCast stops sending you Telegram messages until you connect again.

Q: What does the "Send Notify" button do?
A: It sits in the scene editor's gear icon, under the "Project" tab's "Share Project" section. Pressing it, then confirming, emails a "ready for review" reminder to your WideCast login email, with a link back to that project. Use it as a note-to-self to come finish recording or reviewing a video later.

Q: Does "Send Notify" also message me on Telegram?
A: No. "Send Notify" only sends an email to your login email, even though it sits in a notification-related part of the editor. To also get updates on Telegram, connect it separately from the Setup Center's "Notification" section.

Q: Why did my Telegram notification fail?
A: The most common reason is that Telegram is not connected yet; connect it from the Setup Center's "Notification" section first. If an AI agent is sending your notifications, you may have hit the limit of 60 notifications an hour per account; wait for the hour to reset and try again.

Q: Will WideCast still notify me if I have not connected Telegram?
A: Yes, by email. Email is the default channel and goes out automatically whenever your account has an address on file. Telegram is an extra channel on top of email, not a replacement for it.

Q: Can my AI agent send me its own WideCast notifications?
A: Yes. An AI agent connected through the API or MCP can call "POST /v1/notification/send" (MCP tool "widecast_send_notification") with a subject and a message. WideCast emails you automatically, using the notification email from the Setup Center if you set one, or your login email otherwise, and also sends it to Telegram if you have connected that. This only notifies you, the account owner; there is no way to send it to anyone else.

Q: Can my AI agent attach a photo or video to a notification?
A: Yes, one or the other, not both in the same notification. Give it a public web address, a "photo_url" or "video_url", and WideCast shows the photo inline, or a link to the video, next to your message.

Q: Do WideCast notifications use credits?
A: No. Sending a notification, whether through "Send Notify" in the editor or through an AI agent, never uses credits.

Q: What is the Live Chat ID field for?
A: It is the fourth field in the Setup Center's "Notification" section, separate from Telegram, email, and SMS. Enter the ID from your own LiveChatWithUs account there to show that live chat widget inside your scene editor.

Q: How many notifications can an AI agent send me in an hour?
A: Up to 60 per account. Beyond that, WideCast responds with a rate-limit error and tells you how many seconds to wait before trying again.
