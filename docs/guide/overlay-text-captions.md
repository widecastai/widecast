---
slug: overlay-text-captions
title: On-screen text and captions
group: editing
order: 3
summary: "Add or regenerate a scene's overlay graphic, edit the wording and color of poster and typography text, apply text style presets, and see how captions track your narration."
updated: 2026-08-12
covers:
  - ui:overlay_editor
sources:
  - gubo-remotion-player/js/editor_main.js (Overlay button and overlay menu)
  - gubo-remotion-player/js/vpreview.js (click-to-edit text and captions in the scene preview, caption word timing)
  - gubo-remotion-player/js/remotion_textdesign.js (pencil edit sheet, Color field, Save/Cancel)
  - gubo-remotion-player/js/text_presets.js (preset names, count, categories)
---

Every scene in the editor can carry more than footage: an overlay graphic, styled poster or typography text, and captions that keep pace with your narration. This guide covers where each of these lives on a scene (see [Scene editor basics](guide/scene-editor-basics.html) for how to open the editor) and how to change them.

## The Overlay button

Scenes built around a stat, fact, data point, key point, hook, or call to action show an **Overlay** button. Click it to open a short menu:

- **Generate Overlay** creates an animated overlay graphic from that scene's text. Once the scene already has one, the same button reads **Regenerate Overlay**, so you can roll a new version any time you want a different look.
- **Upload Overlay** lets you use your own image instead of an AI-generated one.

## Edit text on poster and typography scenes

Some scenes show their words as a designed text graphic instead of a plain caption bar. WideCast calls these poster and typography scenes. To edit that text, click it directly inside the scene's preview. A small pencil icon appears; click it to open a short edit sheet where you can retype the wording and pick a new **Color** for it. Press **Save** to apply your changes, or **Cancel** to leave things as they were. Editing text you already have never uses credits.

## Text style presets

While the edit sheet is open, scroll the row of style previews below your text. Each one shows a live "Aa" sample in its own font, color, and effect. WideCast ships 50 style presets for overlay text and 50 for captions, grouped into categories such as Popular, Bold, Minimal, Gaming, Vlog, Dramatic, Fun, and Professional. Click any preview to apply that whole look to the scene right away.

## Captions synced to your narration

Captions are timed to your narration automatically. As the video plays, each word highlights the moment it is spoken, so viewers can follow along even with the sound off. Captions have their own 50 style presets, separate from overlay text. Click the caption text directly in the scene's preview to open its style editor and pick a look the same way you would for overlay text.

## Q&A
Q: How do I change the words shown on a poster or typography scene?
A: Click the text directly inside the scene's preview. A small pencil icon appears; click it to open a short edit sheet with your current wording in a text box. Edit the words and press "Save". WideCast reflows the lines and keeps the current style, and no credits are used since you are editing text you already have.

Q: How do I change the color of the on-screen text?
A: Click the text in the scene's preview to open its edit sheet, then use the "Color" option next to your wording to pick a new one. Press "Save" to apply it. You can also change color along with font and effect all at once by applying a text style preset instead.

Q: What are text presets?
A: Text presets are ready-made looks for your on-screen text. WideCast ships 50 presets for overlay text and 50 for captions, grouped into categories such as Popular, Bold, Minimal, Gaming, Vlog, Dramatic, Fun, and Professional. Open a scene's text edit sheet and scroll the row of style previews, each showing a live "Aa" sample, then click one to apply it to that scene right away.

Q: Why does a pencil icon appear on some scenes only?
A: The pencil only appears on poster and typography scenes, where your on-screen text is a designed graphic rather than a plain caption bar. Click that text in the scene's preview and the pencil shows up so you can open the edit sheet. On other scenes, click the caption text instead to open its own style editor.

Q: What is the "Overlay" button on a scene?
A: It appears on scenes built around a stat, fact, data point, key point, hook, or call to action. Click it to open a menu for that scene's overlay graphic: generate one from the scene's text, regenerate a new version, or upload your own image.

Q: Can I use my own image as a scene's overlay instead of an AI-generated one?
A: Yes. Click the scene's "Overlay" button and choose "Upload Overlay" to use your own image instead of an AI-generated graphic.

Q: Can I generate a new version of an overlay graphic I do not like?
A: Yes. Click the scene's "Overlay" button and choose "Regenerate Overlay" to roll a new animated version from the same scene text. Before a scene has an overlay yet, the same button reads "Generate Overlay".

Q: Do the on-screen captions match what I actually say in the video?
A: Yes. Captions are timed to your narration word by word, and each word highlights as it is spoken. This sync happens automatically, so you never have to adjust caption timing by hand.

Q: Can I style the captions separately from the overlay text?
A: Yes. Captions have their own 50 style presets, separate from the 50 for overlay text. Click the caption text directly in the scene's preview to open its style editor, then pick a preset from the row of live previews the same way you would for overlay text.

Q: Does editing overlay text or its color use credits?
A: No. Changing the wording or color of text you already have on a scene does not use credits, the same as other editing in the scene editor. Credits are only spent when WideCast generates something new for you.
