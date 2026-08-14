---
slug: ai-images
title: AI-generated images
group: creating
order: 6
summary: "Generate a custom AI background image for a scene from a text prompt, right inside the footage picker, for 1 credit each."
updated: 2026-08-12
covers:
  - api:POST /v1/create_image
  - mcp:widecast_create_image
  - ui:ai_images
sources:
  - gubo-remotion-player/js/broll.js (Gen AI tab: Image Prompt, Generate, Use, Saved Images)
  - widecast/docs/endpoints/create-image.md (API/MCP facts: credits, count 1-4, ratio, numbered thumbnail set)
---

WideCast can generate a background image for a scene from nothing but a text description. It sits right next to the other footage options, so when the stock library and your own photos do not have exactly what the script needs, you can create a custom one in seconds instead of settling for a close-enough clip.

## Generate an image for a scene

From the scene editor, open the scene's footage picker (the **Background** or **Footage** button, or **Find B-roll**; see [Scene editor basics](guide/scene-editor-basics.html) for how scenes and the picker fit together), then click the **Gen AI** tab.

Type a description into **Image Prompt**, for example "a wooden ladder leaning against a red brick wall, morning light", and press **Generate**. WideCast shows **Generating image...** for a few seconds and then displays the result. If it works for the scene, press **Use** and it is applied right away.

Each generated image costs 1 credit. The image is sized to match your video automatically, so there is nothing else to set up before generating.

## If it does not look right

Not every first attempt lands. Edit the text in **Image Prompt** and press **Generate** again to get a new version. Each generation, including a retry, is a separate 1-credit image, so a more specific prompt on the first try is worth the extra few seconds: naming concrete objects, the setting, and the lighting works better than describing a mood or an abstract idea.

Once you press **Use** on an image, it is applied to the scene and also kept in that scene's **Saved Images** list below the prompt box. Reopen the **Gen AI** tab later and you can pick that same image again without spending another credit. Saved Images only remembers images for that one scene, not the rest of the video.

## When to use an AI image instead of real footage

An AI image is strongest when the exact shot does not exist anywhere: a specific metaphor, an invented scene, or a particular combination of objects and setting that matches one line of your script. It also fills a gap fast when a stock search for the same idea comes up empty.

A real photo or a stock video clip is usually the better choice when the subject is something real and recognizable, a real product, a real place, real people in a realistic setting, since genuine footage tends to feel more credible than a generated stand-in. Search stock video and photos first from the same picker; the AI image tab is there for when that search does not turn up the right shot. See [Backgrounds and footage](guide/backgrounds-broll.html) for the rest of the picker.

## Generating images through the API or an AI agent

If you or your AI agent works with WideCast through the API or MCP, `POST /v1/create_image` (MCP tool `widecast_create_image`) can generate 1 to 4 images from one prompt in a single call, at 1 credit per image, so four options cost four credits total. Instead of committing to one image right away, you get a numbered thumbnail set and pick the one you want.

This is meant for swapping the background of a scene on a video you already created: generate the options, pick a number, and the chosen image is applied to that scene. Setting up API keys and connecting an AI agent is covered in [API and MCP access](guide/api-and-mcp.html).

## Q&A

Q: How do I generate an AI image for a scene?
A: Open the scene's footage picker from the "Background", "Footage", or "Find B-roll" button, then click the "Gen AI" tab. Type a description in "Image Prompt" and press "Generate". After a few seconds you see the result; press "Use" to apply it to the scene.

Q: How much does an AI image cost?
A: 1 credit per image. Pressing "Generate" again for a new attempt creates another image, so it uses another credit too.

Q: Can I generate several AI image options at once?
A: In the studio's "Gen AI" tab you generate one image at a time and can press "Generate" again for a new version. Through the API or an AI agent, a single request can generate 1 to 4 images from one prompt and return a numbered thumbnail set so you, or the agent, can pick the best one, at 1 credit per image generated.

Q: The AI image I generated does not look right. Can I try again?
A: Yes. Edit the text in "Image Prompt" and press "Generate" again for a new version. Each attempt, including a retry, is a separate 1-credit image, so a more specific prompt, naming concrete objects, setting, and lighting, gives better odds on the first try.

Q: When should I use an AI image instead of a real photo or stock clip?
A: Reach for an AI image when the exact shot does not exist as stock footage, like a specific metaphor or an invented scene that matches one line of your script, or when a stock search for the same idea comes up empty. Prefer a real photo or stock video when the subject is something real and recognizable, since genuine footage of a real product, place, or person tends to feel more credible than a generated one.

Q: Can I reuse an AI image I already generated for this scene?
A: Yes. Once you press "Use" on a generated image, it stays listed under "Saved Images" in that scene's "Gen AI" tab, so you can pick it again later without spending another credit. This list is specific to that one scene, not shared with the rest of the video.

Q: Do I need to choose a size or shape for the AI image?
A: No. The image is generated to match your video's shape automatically, so there is no separate size setting in the "Gen AI" tab. If you generate images through the API instead, you can set the shape explicitly with a ratio field: portrait, landscape, or square.

Q: What should I write in the AI image prompt?
A: Describe the picture you want in plain language: the subject, the setting, and the lighting or mood, for example "a wooden ladder leaning against a red brick wall, morning light". Concrete, visual descriptions generally produce better results than abstract ideas.

Q: Can I generate an AI image without opening a specific video?
A: Not in the studio; the "Gen AI" tab always generates for the scene you opened it from. Through the API, POST /v1/create_image can generate freeform images on their own, though the usual pattern is picking one to replace a scene's background on a video you already created.
