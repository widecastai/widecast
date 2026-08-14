---
slug: record-yourself
title: Record yourself with the teleprompter
group: creating
order: 3
summary: "Turn on your camera, frame up in the oval guide, and read your script from the built-in teleprompter to record your video yourself."
updated: 2026-08-12
covers:
  - ui:recording
sources:
  - gubo-remotion-player/record2.html (camera preview, oval guide, record button and timer, retake/done controls)
  - gubo-remotion-player/js/gubo.js (recording flow, teleprompter mode toggle, camera/microphone permission messages)
  - gubo-remotion-player/js/kara.js ("Ready to Record" status badge)
  - gubo-remotion-player/js/editor_basic.js (per-scene "Record Your Voice" option in the scene editor)
---

When you want to appear on camera yourself, WideCast opens a simple recording screen: your camera, a framing guide, and a built-in teleprompter that shows your script as you talk. Here is how to use it.

## Get to the recording screen

You land here one of two ways: while creating a video you chose **Full recording** instead of **Scene by scene** (see [Create your first video](guide/first-video.html)), or you opened a video from your home screen whose status badge reads **Ready to Record**. Either way, your script is already written and waiting for you to read on camera.

## Allow camera and microphone access

The first time you open the recording screen, your browser asks permission to use your camera and microphone. Allow both so WideCast can show your live preview and capture sound.

If access was blocked, the screen shows **Camera Permission Required** with your browser's steps to turn access back on, plus a **Refresh Page** button to reload and try again.

## Frame yourself in the oval guide

Once your camera turns on, you see a live preview of yourself with an oval outline over it and the instruction **Position your head within the oval guide**. Move yourself or your camera until your face sits inside the oval before you start recording.

## Read from the teleprompter

Your script scrolls on screen while you record, so you never have to memorize it or look away from the camera to read notes. Tap the teleprompter to switch between two modes:

- **Talking Points**: a condensed, cue-style version of your line instead of full sentences. You cannot edit the text in this mode.
- **Full Script**: your complete script, word for word. You can edit the text right there before or while you record.

The button's tooltip tells you which mode tapping it switches to: **Talking Points (tap for full script)** or **Full Script (tap for talking points)**. If a scene has no condensed version written for it, you only see the full script, with no toggle to switch.

## Record, review, and retake

Press the round record button, marked with a **00:00** timer, to start recording. Press the same button again to stop.

After you stop, WideCast plays back what you recorded so you can check it. Not happy with it? Press **Retake** to record that segment again. Happy with it? Press **Done** to keep it and move on.

## Redo a single scene later

Once your video is built, you do not have to redo the whole recording to fix one scene. Open the scene editor and use its per-scene recording option, labeled **Record Your Voice** for voice-over scenes or **Record with Camera** for on-camera scenes, to re-record just that scene using the same camera and teleprompter screen. See [Scene editor basics](guide/scene-editor-basics.html) for the rest of the scene editor.

## Q&A
Q: How does the teleprompter work?
A: While you record, your script scrolls on screen in front of the camera so you can read it without memorizing it or looking away. Tap the teleprompter itself to switch between the condensed "Talking Points" view and the full word-for-word "Full Script" view.

Q: What is the difference between "Talking Points" and "Full Script" mode?
A: "Talking Points" shows a short, condensed, cue-style version of your line rather than full sentences, and you cannot edit it. "Full Script" shows your complete script exactly as written, and you can edit the text right there before or during recording. If a scene has no condensed version, only "Full Script" is available for it.

Q: Why can't WideCast see my camera?
A: Your browser needs your permission for both camera and microphone before the recording screen can show your preview. Look for your browser's permission prompt and allow access. If you already blocked it, WideCast shows "Camera Permission Required" with steps to turn access back on, plus a "Refresh Page" button to reload and try again.

Q: Do I have to memorize my script?
A: No. The recording screen includes a teleprompter that scrolls your script on screen while the camera records, so you can read it naturally instead of memorizing it.

Q: Can I redo my recording?
A: Yes. Right after you stop recording, WideCast plays it back and shows a "Retake" button to record that segment again, and a "Done" button to keep it. Later, from the scene editor, you can also re-record the voice or on-camera footage for a single scene without redoing the whole video.

Q: How do I start and stop recording?
A: Press the round record button, marked with a "00:00" timer, to start. Press the same button again when you are finished to stop.

Q: Why do I need to fit inside the oval guide?
A: The oval guide, labeled "Position your head within the oval guide", shows the framing your video will use. Keeping your face inside it keeps you properly centered and visible in the finished video.

Q: How do I get to the recording screen?
A: You get there by choosing "Full recording" instead of "Scene by scene" while creating a video, or by opening a video from your home screen whose status badge reads "Ready to Record".

Q: Can I edit my script while I'm recording?
A: Only in "Full Script" mode, which shows your complete script and lets you edit the text directly. "Talking Points" mode shows a condensed, cue-only version that cannot be edited.

Q: Can I redo just one scene later without re-recording the whole video?
A: Yes. Open the scene editor and use its per-scene recording option, such as "Record Your Voice" or "Record with Camera", to re-record only that scene. It opens the same camera and teleprompter screen used for full recordings. See [Scene editor basics](guide/scene-editor-basics.html) for more on the scene editor.
