---
slug: scene-editor-basics
title: Scene editor basics
group: editing
order: 1
summary: "Open a video, rearrange scenes, use the Scene Action menu to trim, split, and merge, and export the final MP4."
updated: 2026-08-12
covers:
  - ui:scene_editor
sources:
  - gubo-remotion-player/js/editor_main.js (toolbar, reorder, project settings, export)
  - gubo-remotion-player/js/editor_extracted.js (Scene Action menu, Exported dialog)
  - gubo-remotion-player/js/video_trim.js (trim/split limits)
  - gubo-remotion-player/js/data.js (autosave)
---

Every WideCast video is a stack of short scenes. Each scene owns its slice of narration, one background visual, and any text shown on screen. The scene editor is where you fine-tune all of that before exporting the final video.

## Open the editor

1. Go to [widecast.ai](https://widecast.ai) and sign in. Your videos are listed under **Recent** on the home screen.
2. Click a video with the **Ready to Edit** badge. Its script screen opens first; press **Video** there and the editor opens with every scene laid out in order, each showing a live preview.

A video that still shows **Generating** is not ready yet. The badge updates by itself, so check back in a few minutes.

## Rearrange scenes

Drag a scene and drop it where you want it. The narration belongs to the scene, so it moves along with it and the story follows your new order.

## The Scene Action menu

Every scene has a **Scene Action** button. It opens the full list of per-scene operations:

- **Trim Scene**: cut the clip down. A trimmed scene keeps between 3 and 20 seconds.
- **Split Scene**: cut one scene into parts. Each part needs at least 2 seconds. The split dialog shows both part lengths before you press **Split & Save**.
- **Merge with Previous** and **Merge with Next**: join neighboring scenes into one.
- **Insert Scene Before** and **Insert Scene After**: add a new scene next to this one.
- **Duplicate Scene**, **Download Scene**, and **Delete Scene**. The last remaining scene cannot be deleted.

## Show or hide the narrator

Each scene has a **NARRATOR** switch. Leave it on to keep your face (or your AI avatar) in the scene, or switch it off to let the background footage fill the whole frame. Mixing the two keeps videos lively: narrator on for key points, off for illustration shots.

## Change a background

Narrator scenes show a **Background** button and footage scenes show a **Footage** button; there is also **Find B-roll** for searching new material. All of them open the footage picker, where you choose stock videos, real photos, AI-generated images, your own uploads, or a clip from a video link you paste. The picker has [its own guide topic](guide/backgrounds-broll.html).

## Music, languages, and project settings

The gear icon opens the project settings with three tabs:

- **BG Music**: pick or change the background track for the whole video.
- **Languages**: add a translated version and regenerate the voice.
- **Project**: share links, client links, and export or clone the project.

## Export the final video

Each scene shows its own live preview while you edit; the complete MP4 is produced by exporting. Press **Export**, confirm **Start Export?**, and WideCast renders the video. If some scenes are incomplete you get a warning first, with an **Export Anyway** option. When rendering finishes, the **Exported** dialog offers **Download**, **Publish**, and **Share**. Everything you change in the editor is saved automatically, so you can close the tab and come back any time.

## Q&A

Q: How do I open the scene editor?
A: Sign in at widecast.ai, find your video under "Recent" on the home screen, and click it once its badge says "Ready to Edit". Press "Video" on the script screen that opens, and the scene editor shows all scenes in order.

Q: How do I reorder scenes in my video?
A: Drag a scene and drop it in the new position. The narration belongs to the scene, so it moves along with it.

Q: How do I trim a scene?
A: Press the scene's "Scene Action" button and choose "Trim Scene". Drag the selection handles and save. A trimmed scene keeps between 3 and 20 seconds of footage.

Q: Can I split one scene into two?
A: Yes. Press "Scene Action" on the scene and choose "Split Scene". Pick the split point, check the two part lengths shown, and press "Split & Save". Each part must be at least 2 seconds long.

Q: Can I merge two scenes into one?
A: Yes. Open the scene's "Scene Action" menu and choose "Merge with Previous" or "Merge with Next".

Q: Can I add, duplicate, or delete a scene?
A: Yes. The "Scene Action" menu has "Insert Scene Before", "Insert Scene After", "Duplicate Scene", and "Delete Scene". The only limit: the last remaining scene cannot be deleted.

Q: How do I hide myself or my avatar from one scene?
A: Turn off the NARRATOR switch on that scene. The background footage then fills the whole frame. Turn it back on any time.

Q: How do I change the background footage of a scene?
A: Click the scene's "Background" button (narrator scenes) or "Footage" button (footage scenes), or use "Find B-roll". The picker offers stock videos, real photos, AI-generated images, your own uploads, and clips from pasted video links.

Q: How do I add or change background music?
A: Open the gear icon in the scene editor and choose the BG Music tab. Preview tracks by category and press "Use This" on the one you want.

Q: Are my edits saved automatically?
A: Yes. The editor saves as you work. You can close the tab and continue later from where you left off.

Q: How do I export the final video?
A: Press "Export" in the scene editor and confirm "Start Export?". If scenes are incomplete you can review the warning or choose "Export Anyway". When rendering finishes, the "Exported" dialog lets you Download, Publish, or Share the MP4.
