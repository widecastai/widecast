---
slug: short-links
title: Short links
group: sharing
order: 4
summary: "Turn any long link into a short widecast.ai/s link, pick your own ID if you like, change where a link goes later, and let your AI agent do the same for you."
updated: 2026-10-20
covers:
  - api:POST /v1/short_links
  - api:GET /v1/short_links/{id}
  - api:PATCH /v1/short_links/{id}
  - mcp:widecast_create_short_link
  - mcp:widecast_get_short_link
  - mcp:widecast_update_short_link
  - ui:short_links
sources:
  - widecast/shorten.html (New link / Edit a link tabs, Long link and Custom ID fields, Shorten, Copy, Change destination, Find, Save, Edit another link)
  - widecast/docs/endpoints/short-links.md (POST /v1/short_links, GET and PATCH /v1/short_links/{id}, limits, error codes)
  - widecast/mcp-server/src/index.ts (widecast_create_short_link, widecast_get_short_link, widecast_update_short_link tool descriptions)
---

A short link is a tidy address like `widecast.ai/s/SALE2026` that sends anyone who opens it to a longer link of your choice: a landing page, a booking form, a video, a sign-up page. It is easier to say out loud, fits on a flyer or in a caption, and WideCast counts every time someone opens it.

## Make a short link

Go to `widecast.ai/shorten.html`. You sign in with the same email as your WideCast account; if you are already signed in on this browser, the page opens straight away.

On the **New link** tab, paste the address you want to share into **Long link** and click **Shorten**. You can paste it with or without `https://` in front. Your new link appears under **Your short link**, with a **Copy** button next to it and the address it opens shown underneath. Every link you make during the visit is also listed under **Made this visit**, each with its own **Copy** button.

## Choose your own ID

Leave **Custom ID** empty and WideCast picks a short random ID for you. Random IDs never use the number 0 or the letter O, so nobody mixes the two up when reading the link.

If you would rather choose the ID, type it into **Custom ID** before you click **Shorten**. It can be 6 to 32 letters or numbers, with no spaces, dashes or other symbols. Capitals do not matter: `Sale2026` is saved as `SALE2026`, and a visitor who types `widecast.ai/s/sale2026` still lands in the right place. Your own IDs may use 0 and O. Each ID can exist only once, so if someone already uses the one you want, the page asks you to pick another.

## Change where a link goes

A link that is already printed or shared can be pointed somewhere new without changing the link itself. Click **Change destination** under your new link, or **Edit** next to a link in **Made this visit**. You can also open the **Edit a link** tab, paste the short link (or just its ID) and click **Find**.

The page shows the link, how many times it has been opened so far, and its current destination. Paste the new address over the old one and click **Save**. From then on, everyone who opens the short link goes to the new address; the ID and the click count stay the same. Use **Edit another link** to look up a different one. You can only change links made with your own account.

## Limits

You can make up to 10 new short links per hour and change destinations up to 100 times per hour. If you reach a limit, wait a little and try again. Short links are free and never expire.

## Let your AI agent make short links

If you use WideCast through a connected AI agent or the API, it can make short links, look them up, and change where they go, all free and with the same rules and the same hourly limits as the page. Links your agent makes are yours: you can edit them on the page, and your agent can edit the ones you made. Before changing where a link goes, your agent should check the new address with you, since the link may already be out in the world. If you have not connected an AI agent yet, see [API and MCP access](guide/api-and-mcp.html).

## Q&A

Q: How do I make a short link with WideCast?
A: Go to widecast.ai/shorten.html and sign in with your WideCast email if asked. On the "New link" tab, paste your address into "Long link" and click "Shorten". Your link appears under "Your short link" with a "Copy" button next to it.

Q: Can I choose the letters in my short link?
A: Yes. Type your own ID into "Custom ID" before clicking "Shorten". It must be 6 to 32 letters or numbers, with no spaces, dashes or other symbols. Leave it empty and WideCast picks a random ID for you.

Q: Does it matter if I type my short link in capitals or small letters?
A: No. IDs are saved in capitals, so "Sale2026" becomes "SALE2026", and opening widecast.ai/s/sale2026 or widecast.ai/s/SALE2026 takes visitors to the same place.

Q: Why does a random short link never contain 0 or O?
A: So nobody confuses the number 0 with the letter O when reading or typing the link. If you choose your own ID, you may use both.

Q: The page says my custom ID is already taken. What do I do?
A: Each ID can exist only once across WideCast. Pick a different ID, add a number or a year to it, or leave "Custom ID" empty to get a random one.

Q: Can I change where a short link goes after I have shared it?
A: Yes. Click "Change destination" under the link, "Edit" next to it in "Made this visit", or open the "Edit a link" tab, paste the link and click "Find". Paste the new address and click "Save". The link itself and its click count stay the same.

Q: Can I change the ID of a short link?
A: No. The ID is permanent so that links you already shared keep working. Only the address it opens can change. If you want a different ID, make a new short link.

Q: How do I see how many people opened my short link?
A: Open the "Edit a link" tab, paste the short link or its ID and click "Find". The page shows how many times the link has been opened so far, next to its current destination.

Q: How many short links can I make?
A: Up to 10 new short links per hour and up to 100 destination changes per hour. If you reach a limit, wait a little and try again. Short links are free and do not expire.

Q: Can my AI agent make or edit short links for me?
A: Yes. A connected AI agent can make short links, look them up and change where they go, using the same rules and hourly limits as the page. It should confirm a new destination with you before changing an existing link.
