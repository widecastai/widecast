---
slug: avatar-and-voice
title: Avatars, voices, and dubbing
group: editing
order: 5
summary: "Update your AI avatar's reference photo, re-record a scene's voice, clone your own voice for narration, and dub your finished video into another language."
updated: 2026-08-12
covers:
  - ui:avatars_voice
sources:
  - gubo-remotion-player/js/setup.js (Face Cloning and Voice Cloning sections in the Setup Center, Setup/Manage action button)
  - gubo-remotion-player/js/voice_cloning.js (Voice Cloning window: Record Voice/Upload File tabs, Preview, Upload & Clone, paid-plan gate message)
  - gubo-remotion-player/js/editor_basic.js (per-scene voice panel: Record Your Voice/Record with Camera/Use AI Voice/Upload, current-voice status and Re-record)
  - gubo-remotion-player/js/editor_extracted.js (Regenerate Voice/Change flow into the voice picker; Exported dialog's Dubbing entry and Dubbed Versions list)
  - gubo-remotion-player/js/editor_dubbing.js (Dubbing window: language search, credit cost, Start Dubbing, progress, completion)
  - gubo-remotion-player/js/editor_main.js (per-scene voice button)
---

WideCast lets you control who and what your viewers see and hear: the reference photo behind your AI avatar, the voice narrating each scene, and even a fully translated copy of the finished video. This guide covers all three.

## Your avatar's reference photo

Your AI avatar's face comes from a single reference photo. Open [the Setup Center](guide/setup-center.html) and go to its **Face Cloning** section to upload or replace that photo; WideCast uses it to build your avatar wherever one appears in your videos.

## Re-record a scene's voice

Every scene in the scene editor has its own voice icon; its tooltip reads **Narrator** on an on-camera scene or **Voice** on a voice-only scene. Click it to open that scene's recording panel:

- On a voice-only scene, choose **Record Your Voice** to record fresh audio yourself, **Use AI Voice** to let WideCast narrate it, or **Upload** to use an existing audio file.
- On an on-camera scene, choose **Record with Camera** to re-record yourself on video, **Generate with AI** to have WideCast generate it, or **Upload** to use an existing video file.

Once a scene already has a recording, the same panel shows your current voice with a **Re-record** (or **Re-upload**) button, plus an option to switch to AI voice narration instead. Recording uses the same camera and teleprompter screen covered in [Record yourself with the teleprompter](guide/record-yourself.html).

## Clone your voice

Voice cloning lets WideCast narrate in a copy of your own voice instead of the default AI voice. It is a paid feature.

Open [the Setup Center](guide/setup-center.html) and go to its **Voice Cloning** section, then click **Setup** (this becomes **Manage** once your clone exists). That opens your voice picker; click **Setup Voice Cloning** inside it. On a free plan, WideCast shows an **Upgrade to clone your voice** message instead of the recording screen.

On a paid plan you get the Voice Cloning window, with two tabs: **Record Voice** and **Upload File**. If you record, aim for at least 30 seconds of clear audio. If you upload instead, the file must be MP3, WAV, M4A, MP4, or WebM, under 50MB, and no longer than 30 seconds. Either way, confirm the voice is yours (or that you have permission to use it), press **Preview** to listen back, then press **Upload & Clone** to save it.

Once your clone is ready, it becomes available as a voice option next to the default AI voice, so you can set it as the voice for any scene from that scene's voice panel.

## Dub your video into another language

Once a video is exported, you can create a fully narrated copy of it in another language. Export first (see [Scene editor basics](guide/scene-editor-basics.html)); in the **Exported** dialog, look for the **Dubbing** button, marked with a **20 Credits** badge.

Click it, search for and select your target language, then press **Start Dubbing**. It takes about 5 to 10 minutes, and WideCast emails you when the dubbed version is ready, so you do not need to keep the window open.

When it finishes, a **Dubbing Complete!** message lets you **View** or **Download** the new version, or **Add Another Language** to dub into a second one. Every language you have dubbed also stays listed under **Dubbed Versions** inside the **Exported** dialog, each with its own **Download** button, so you can come back for them anytime.

## Q&A
Q: How do I change my avatar's reference photo?
A: Open the Setup Center from widecast.ai/#setup and go to its "Face Cloning" section. Upload a new photo there and WideCast uses it to build your AI avatar going forward. See "The Setup Center" guide topic for more on that panel.

Q: How do I re-record a single scene's voice?
A: In the scene editor, click the scene's voice icon (its tooltip reads "Narrator" on an on-camera scene or "Voice" on a voice-only scene) to open its recording panel. Voice-only scenes show "Record Your Voice"; on-camera scenes show "Record with Camera" instead, since that one records video too. Both panels also offer an AI narration option and an "Upload" option for an existing file.

Q: Can I change my avatar's outfit or background?
A: Not as a standalone tool today. WideCast can style your avatar's outfit and background automatically as part of certain features, such as generating a video thumbnail, but there is no general-purpose outfit changer yet.

Q: Can I switch a scene back to an AI voice after recording my own?
A: Yes. Open that scene's voice panel and use the option to switch to AI voice narration. It replaces your recording with WideCast's AI narration for that scene only, without affecting any other scene.

Q: How do I clone my voice?
A: Open the Setup Center and go to its "Voice Cloning" section, then click "Setup" to open your voice picker and click "Setup Voice Cloning" inside it. Record at least 30 seconds of yourself talking, or upload an audio file instead, confirm the voice is yours, preview it, then click "Upload & Clone" to save it.

Q: What happens if I try to clone my voice without a paid plan?
A: WideCast shows an "Upgrade to clone your voice" message instead of opening the recording screen. Voice cloning is a paid feature; see the Setup Center guide topic for the "Requires paid account" details.

Q: Can I upload an audio file instead of recording my voice?
A: Yes. The Voice Cloning window has an "Upload File" tab alongside "Record Voice". Uploaded files must be MP3, WAV, M4A, MP4, or WebM, under 50MB, and up to 30 seconds long.

Q: How long should my voice recording be for cloning?
A: WideCast recommends at least 30 seconds of clear, uninterrupted audio. A longer, cleaner sample generally produces a more accurate clone.

Q: How do I use my cloned voice in a video?
A: Once your clone is ready, it becomes available as a voice option alongside WideCast's default AI voice. Set it as a scene's voice from that scene's voice panel in the scene editor, the same place you would choose "Record Your Voice" or an AI voice.

Q: Can WideCast translate my video into another language?
A: Yes, through dubbing. Export your video, then open the "Dubbing" option in the "Exported" dialog, choose a target language, and press "Start Dubbing". WideCast creates a fully narrated version of your video in that language.

Q: How much does dubbing cost?
A: Dubbing costs 20 credits for each language you dub into. The cost is shown right on the "Dubbing" button before you start.

Q: How long does dubbing take, and where do I find the result?
A: Dubbing takes about 5 to 10 minutes, and WideCast emails you when it is ready, so you do not have to wait on the page. Download it from the completion message, or anytime after from the "Dubbed Versions" list inside the "Exported" dialog.
