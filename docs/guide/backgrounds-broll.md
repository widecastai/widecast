---
slug: backgrounds-broll
title: Backgrounds and footage
group: editing
order: 2
summary: "Search stock video and real photos, browse curated grids and UGC clips, upload your own file, or pull in a TikTok or Facebook link, and apply any of them as a scene's background in the footage picker."
updated: 2026-08-12
covers:
  - api:POST /v1/search_broll
  - mcp:widecast_search_broll
  - ui:broll_picker
sources:
  - gubo-remotion-player/js/broll.js (source tabs, search boxes, upload, URL, UGC categories)
  - gubo-remotion-player/js/editor_main.js (Background/Footage buttons, Find B-roll trigger)
  - widecast/docs/endpoints/search-broll.md (search_broll API/MCP fields, kind modes, numbered thumbnail list)
---

Every scene in your video has a background: footage or an image behind you, or filling the whole frame if the narrator is off. The footage picker is where you find and swap that background, with several different sources to pull from depending on what the scene needs.

## Open the footage picker

From the scene editor, open a scene's footage picker with the **Background** button (on narrator scenes) or the **Footage** button (on footage-only scenes), or press **Find B-roll** on a scene that does not have one set yet. All three lead to the same picker, laid out as tabs across the top for each source. See [Scene editor basics](guide/scene-editor-basics.html) for how scenes and the rest of the editor fit together.

## The source tabs

The picker offers seven tabs:

- **Stock**: licensed video clips from Pexels, Pixabay, and Shutterstock. Search by keyword to find a clip that moves.
- **Photos**: real still photos pulled from a Google image search, labeled "Real Images (Google)" inside the tab.
- **Grid**: a curated set of ready-made background videos picked by WideCast, for when you want a good-looking motion background without searching.
- **UGC**: user-generated content, everyday clips that feel like something a real person filmed rather than polished studio stock. Browse by category, including **Home tour**, **Construction**, **Car accident**, **Nail**, **Tattoo**, **Hair salon**, **Spa**, **Restaurant**, **Gym**, and **Yoga**, or search it by keyword.
- **URL**: paste a direct TikTok or Facebook video link and press **Load Video** to pull in that clip, up to 5 minutes long.
- **Gen AI**: type a text prompt and generate a custom background image for 1 credit; see [AI-generated images](guide/ai-images.html) for the full walkthrough.
- **Upload**: press **Browse File** to add your own video or image from your device. WideCast accepts MP4 and MOV video, and JPG and PNG images, up to 100MB each.

## Search by keyword

The **Stock**, **Photos**, and **UGC** tabs each have their own search box. Type in what the scene needs, for example "coffee shop morning" or "family cooking dinner," and press **Search**. Short, specific searches of one to three words tend to bring back the best matches. Because **Stock** and **Photos** search different libraries, video clips versus real photos, the same keyword can turn up different results on each tab, so it is worth checking both.

## Replace a scene's background

Once you find a clip, photo, or image you like, click **Use** (it may read "Use this image" or "Use this video" depending on the tab) to apply it to the scene right away, replacing whatever background was there before. You can reopen the picker and swap again any time. Need to shorten or split the new footage once it is in place? See [Scene editor basics](guide/scene-editor-basics.html) for trimming and splitting.

## Search B-roll through the API or an AI agent

If you or your AI agent works with WideCast through the API or MCP connector, `POST /v1/search_broll` (MCP tool `widecast_search_broll`) searches the same stock library as the **Stock** and **Photos** tabs. Set `kind` to "video" for stock clips or "image" for real photos, add a short keyword, and WideCast returns a numbered thumbnail list so you, or the agent, can pick a result by number. This is for changing the background of a scene on a video you already created, not for starting a brand new one. See [API and MCP access](guide/api-and-mcp.html) for connecting an agent, or the [developer docs](docs.html) for the full reference.

## Q&A

Q: Where does the stock footage come from?
A: The "Stock" tab searches licensed video clips from Pexels, Pixabay, and Shutterstock. The "Photos" tab searches real still photos from a Google image search. Both are searched by keyword and neither costs credits.

Q: What is the difference between the Stock and Photos tabs?
A: "Stock" searches video clips, so the background stays in motion. "Photos" searches real still images pulled from a Google image search. Use "Stock" when you want movement in the scene, and "Photos" when a still image fits better, for example a product shot or a portrait.

Q: How do I search for a specific kind of footage?
A: Open the footage picker and go to the "Stock", "Photos", or "UGC" tab. Type a keyword into the search box, for example "city skyline" or "coffee shop," and press "Search". Short, specific searches of one to three words tend to work best.

Q: Can I upload my own video or photo as a background?
A: Yes. Open the footage picker, click the "Upload" tab, and press "Browse File" to choose a file from your device. WideCast accepts MP4 and MOV video files and JPG and PNG images, up to 100MB each.

Q: Can I use part of a YouTube video as my background footage?
A: Not by pasting a YouTube link directly. The "URL" tab currently accepts direct video links from TikTok and Facebook only, up to 5 minutes long. For other footage, search the "Stock" tab for something similar, or upload your own file on the "Upload" tab.

Q: Can I paste a video link instead of searching?
A: Yes, for TikTok and Facebook. Open the footage picker, click the "URL" tab, paste a direct video link from either site, and press "Load Video". The clip can be up to 5 minutes long.

Q: What is UGC footage?
A: UGC stands for user-generated content: everyday clips that feel like something a real person filmed, rather than polished studio stock. The "UGC" tab in the footage picker lets you browse by category, like "Home tour," "Car accident," "Spa," or "Gym," or search it by keyword.

Q: What is the Grid tab for?
A: It shows a curated set of ready-made background videos picked by WideCast. Use it when you want a good-looking motion background fast, without typing a search.

Q: Does picking new background footage cost credits?
A: No, not for the "Stock", "Photos", "Grid", "UGC", "Upload", or "URL" tabs; searching and using any of them is free. Only the "Gen AI" tab costs credits, at 1 credit each time you generate a custom image.

Q: Can I trim the new clip after I pick it?
A: The footage picker itself does not trim your pick. Once you have applied it with "Use", open that scene's "Scene Action" menu and choose "Trim Scene" to shorten it, or "Split Scene" to cut it into parts.

Q: Can my AI assistant search for B-roll on its own?
A: Yes. An AI assistant connected through the WideCast API or MCP connector can search stock B-roll for a video you already created, and show you a numbered thumbnail list of clips or real photos to choose from by number. This updates a scene's background; it does not start a new video.
