---
slug: social-captions
title: Social posts and captions
group: creating
order: 5
summary: "How WideCast writes standalone Facebook, X, and LinkedIn posts and blog articles from a link, an idea, or text, plus how the caption field works whenever you publish."
updated: 2026-08-12
covers:
  - api:POST /v1/create_content
  - mcp:widecast_create_content
sources:
  - widecast/docs/endpoints/create-content.md (POST /v1/create_content fields, content types, async flow)
  - gubo-remotion-player/js/widecast.js (caption field placeholder, text-only platform list)
  - gubo-remotion-player/js/script_review_screen.js (in-studio post generator: Article button, Type picker, Write now, result actions)
---

WideCast can write your words as well as your videos. The same content generator that researches and drafts video scripts can turn a link, an idea, or your own notes into a standalone Facebook, X, or LinkedIn post, or a longer blog article. Publishing anything, from a finished video to a generated post, also gives you a caption box to write exactly what goes out with it.

## What the content generator writes

WideCast's content generator turns a URL, an idea, or your own text into a piece of ready-to-use writing. You only need to supply one of the three; the generator researches the topic and writes the rest. Pick what you want it to produce:

- A standalone social post, sized and worded for the platform on its own, separate from any video. In the studio the picker offers Facebook, X, LinkedIn, Instagram, Reddit, and Quora; through an AI assistant you can request Facebook, X, or LinkedIn posts.
- A longer **blog article**: article-specific writing and editing is covered in [Blog posts](guide/blog-posts.html).

Writing a post or article uses credits, the same way creating a video does. See [Credits, plans, and billing](guide/credits-and-billing.html) for how your balance works.

## Generate a post inside the studio

While reviewing your video's script, look for the **Article** button next to the **Video** button at the bottom of the screen. Tapping it opens a short panel with a "Type" field offering **Facebook Post**, **Twitter/X Post**, **LinkedIn Post**, **Instagram Post**, **Reddit**, and **Quora**, plus a language choice, then press **Write now**. WideCast writes the piece for you while a progress screen titled "Creating your content" tracks the run. When it finishes, use **Edit** to change the wording, **Copy Content** to paste it elsewhere, or **Publish** to send it straight to a connected account, following the same flow covered in [Publish and schedule](guide/publish-and-schedule.html).

## Captions when you publish

Publishing works separately from the content generator above. Whenever you publish a video, a photo, or a generated post, WideCast shows a "Title / Caption" box (placeholder "Enter title or caption...") and an optional description field. What you type there is the exact text that goes out with your content.

Some platforms need nothing more than that text: **X**, **LinkedIn**, **Facebook**, **Threads**, **Reddit**, **Bluesky**, and **Google Business** all accept a text-only post, so a caption alone is enough to publish to them, with no video or image required. Other platforms expect the caption to accompany a video or image.

One caption applies to every platform you select together in a single publish action. If you want different wording for different platforms, publish to each platform separately with its own caption. The rest of the publish flow, including connecting accounts and scheduling for later, is covered in [Publish and schedule](guide/publish-and-schedule.html).

## Let your AI assistant write posts for you

If your business uses an AI assistant connected to WideCast, it can request the same posts and articles for you: give it a link, an idea, or text, and tell it which platform to write for. Connect it from **API Keys & MCP** in the Setup Center at [widecast.ai/#setup](https://widecast.ai/#setup). See [API and MCP](guide/api-and-mcp.html) for the full setup walkthrough.

## Q&A

Q: Can WideCast write my social media posts?
A: Yes. WideCast's content generator can turn a link, an idea, or your own notes into a ready-to-use Facebook, X, or LinkedIn post. Trigger it from inside the studio while reviewing a script, or have a connected AI assistant request it for you.

Q: Which platforms can WideCast write a standalone post for?
A: In the studio, the post generator's "Type" picker offers Facebook Post, Twitter/X Post, LinkedIn Post, Instagram Post, Reddit, and Quora. Through a connected AI assistant you can request Facebook, X, and LinkedIn posts. WideCast can also write a longer blog article from the same input; see "Blog posts" (guide/blog-posts.html) for how articles work.

Q: How do I turn a link or an idea into a social post?
A: Give WideCast a URL, a short idea or topic, or text you already wrote. You only need one of the three: the content generator researches the topic and writes the post from whichever one you provide.

Q: Where do I generate a post inside the WideCast studio?
A: While reviewing your video's script, look for the "Article" button next to the "Video" button at the bottom of the screen. Tap it, choose a post type such as "Facebook Post", "Twitter/X Post", or "LinkedIn Post", pick a language, and press "Write now".

Q: Does writing a social post or article use credits?
A: Yes. Generating written content draws from your monthly credit allowance, the same way creating a video does. See "Credits, plans, and billing" (guide/credits-and-billing.html) for how your balance works.

Q: What happens after WideCast finishes writing my post?
A: A progress screen titled "Creating your content" tracks the run. When it finishes, you can use "Edit" to change the wording, "Copy Content" to paste it elsewhere, or "Publish" to send it straight to a connected account.

Q: What is the caption field I see when I publish?
A: Whenever you publish a video, a photo, or a generated post, WideCast shows a "Title / Caption" box with the placeholder "Enter title or caption...", plus an optional description field. Whatever you type there is the exact text that goes out with your content.

Q: Which platforms only need a caption, with no video or image?
A: X, LinkedIn, Facebook, Threads, Reddit, Bluesky, and Google Business all accept a text-only post, so a caption alone is enough to publish to them, with no video or image required.

Q: Do captions differ per platform, or is it the same text everywhere?
A: One caption applies to every platform you select together in a single publish action. If you want different wording for different platforms, publish to each platform separately with its own caption.

Q: Can I edit the caption before it goes out?
A: Yes. The caption box is a plain text field, so you can rewrite, shorten, or replace whatever is already there before you publish.

Q: Can my AI assistant write posts for me?
A: Yes. Once your AI assistant is connected through "API Keys & MCP" in the Setup Center, you can ask it to write a Facebook, X, or LinkedIn post, or a blog article, from a link, an idea, or text, the same way the studio does. See "API and MCP" (guide/api-and-mcp.html) for setup.
