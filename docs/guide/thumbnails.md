---
slug: thumbnails
title: Video thumbnails
group: editing
order: 4
summary: "How the THUMBNAIL scene works, what Generate Thumbnail does, how it relates to your opening scene, and what you can customize."
updated: 2026-08-12
covers:
  - ui:thumbnail_editor
sources:
  - gubo-remotion-player/js/editor_main.js (THUMBNAIL label, Generate Thumbnail button, toolbar restrictions, opening-scene sync, export warning)
  - gubo-remotion-player/js/editor_extracted.js (Scene Action menu block on the thumbnail scene)
---

Every WideCast video opens with one extra scene you never wrote narration for: a cover image labeled THUMBNAIL. It sits first in your scene list and stands in for your video wherever it is listed, before anyone presses play. It also works a little differently from the rest of your scenes. This topic covers what it is, how to change it, and what it can and cannot do.

## The thumbnail scene

Open any video in the scene editor and the very first tile is labeled **THUMBNAIL** instead of a scene number. It holds no narration and plays no sound, since it is a single still image rather than a video clip. Because of that, the usual per-scene tools do not apply to it: there is no **Scene Action** menu on the thumbnail, so you cannot trim it, split it, merge it with another scene, duplicate it, or delete it (see [Scene editor basics](guide/scene-editor-basics.html) for what that menu does on your other scenes). You also cannot drag the thumbnail to a new position or drop another scene onto it. It always stays the first item in your video.

## How the thumbnail relates to your opening scene

When WideCast builds your video, the thumbnail starts out as a copy of the scene right after it, your video's actual opening scene. It uses that scene's background image, and if you appear as the narrator there, your face too. Change that opening scene, such as swapping its background, uploading new footage, or moving a different scene into that first position, and the thumbnail updates automatically to match, as long as you have not customized it yet. Once you generate your own thumbnail, WideCast stops copying the opening scene and keeps your generated version instead.

## Generate Thumbnail

The thumbnail scene shows a **Generate Thumbnail** button in the same spot your other scenes show their **Overlay** button. Press it and WideCast creates a new AI version of your cover image from your video's own footage. While it works you see a "Generating your thumbnail..." screen, and the result appears as a preview you accept with **Use thumbnail**. Once you accept, a **Saving thumbnail...** message shows briefly and the new image loads into place. The button always reads **Generate Thumbnail**, even after you have already used it once, so you can press it again any time you want a different result. Generating a new thumbnail also turns off the separate text overlay on that scene, since your title text gets drawn directly into the generated image instead.

**Generate Thumbnail** needs your opening scene to already have real footage in it. If that scene is still empty or using placeholder media, WideCast shows "Please record the first scene before generating AI thumbnail" instead of generating one. Add footage to that scene first, then try again.

## Customizing your thumbnail

The thumbnail does not have its own **Background** or **Footage** button, so you cannot open the footage picker and browse stock video, real photos, or your own uploads for it directly the way you can on other scenes (see [Backgrounds and footage](guide/backgrounds-broll.html) for that picker). Its image comes from one of two places instead: automatically, by copying your opening scene, or from **Generate Thumbnail**.

Text on the thumbnail is different. You can still edit the words shown on it much like text on any other scene; see [the overlay text and captions guide](guide/overlay-text-captions.html) for how that works. There is no caption option on the thumbnail specifically, since it has no spoken narration to caption.

## Where your thumbnail is used

Your thumbnail is the still image that stands in for your video wherever it is listed, the cover people see before they press play. Keep it recognizable and free of placeholder footage so it represents your video well anywhere it shows up.

## Exporting with an unfinished thumbnail

If your thumbnail is still on placeholder media when you export, it falls under the same **Incomplete Scenes Detected** warning as any other unfinished scene, with the option to export anyway, rather than blocking your export outright. See [Exporting the final video](guide/export-video.html) for the full warning flow.

## Q&A
Q: How do I change my video's thumbnail?
A: Open the scene editor and find the first scene, labeled "THUMBNAIL". Press "Generate Thumbnail" on it to create a new AI version of the cover image. If you have not customized it yet, editing your opening scene, the one right after it, also updates the thumbnail automatically, since it copies that scene's image until you generate one of your own.

Q: What does "Generate Thumbnail" do?
A: It creates a new AI version of your thumbnail scene's cover image, built from your video's own footage. You will see a "Saving thumbnail..." message while it works, then the new image loads into place. It also turns off the separate text overlay on that scene, since your title text gets baked directly into the generated image.

Q: Can I use my own image as the thumbnail?
A: Not by uploading one directly. The thumbnail scene has no "Background" or "Footage" button, so the usual footage picker is not available there. Its image either comes from your opening scene automatically or from "Generate Thumbnail". If you want a specific photo as your cover, set it as your opening scene's background first, before you generate a thumbnail or before it syncs from that scene.

Q: Why does my video have a THUMBNAIL scene?
A: It is the still image that represents your video before anyone presses play, wherever your video is listed. WideCast adds it automatically as the first scene in every video, separate from your narrated scenes, so you always have a dedicated cover image instead of a random frame from the video itself.

Q: Can I trim, split, or delete the thumbnail scene?
A: No. The thumbnail has no "Scene Action" menu, so none of the usual per-scene tools work on it: no trimming, splitting, merging, duplicating, or deleting. You also cannot drag it to a different position. It always stays the first scene in your video.

Q: Will editing my opening scene also change my thumbnail?
A: Yes, until you customize the thumbnail yourself. It starts out as a copy of the scene right after it, including the background image and your face if you narrate that scene. Change that scene's footage and the thumbnail updates to match. Once you press "Generate Thumbnail", that automatic copying stops and your generated version takes over.

Q: Can I edit the text on my thumbnail?
A: Yes. Text on the thumbnail scene works much like text on your other scenes; see the overlay text and captions guide for how to change it. There is no caption option on the thumbnail specifically, since it is a still image with no spoken narration.

Q: Why won't "Generate Thumbnail" work?
A: It needs the scene right after the thumbnail to already have real footage. If that scene is still empty or using placeholder media, WideCast shows "Please record the first scene before generating AI thumbnail" instead of generating one. Add footage to that scene, then try "Generate Thumbnail" again.

Q: What happens if I export without generating a thumbnail?
A: WideCast still lets your video export. A thumbnail left on placeholder media triggers the same "Incomplete Scenes Detected" warning as any other unfinished scene, with an option to export anyway, rather than blocking the export outright.

Q: Does the thumbnail scene have sound like my other scenes?
A: No. The thumbnail is a single still image, not a video clip, so it never carries narration or sound, even if the scene it was copied from had audio.
