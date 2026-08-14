---
slug: roadmap-and-foundation-videos
title: The content roadmap and Foundation Videos
group: creating
order: 8
summary: "How the Authority Roadmap tracks your 60-video, 20-week content calendar, and how Foundation Videos gives you ready-made industry scripts to start from."
updated: 2026-08-12
covers:
  - api:GET /v1/roadmap
  - api:GET /v1/foundation_videos
  - mcp:widecast_foundation_videos
  - ui:roadmap
  - ui:foundation_videos
sources:
  - gubo-remotion-player/js/roadmap.js (Authority Roadmap screen: overview road, week detail view, progress count)
  - gubo-remotion-player/js/foundation_videos.js (Foundation Videos library: industries, categories, phases, template cards)
  - gubo-remotion-player/js/kara.js (home-screen "Foundation Videos" button entry point)
  - gubo-remotion-player/js/data.js (roadmap auto-opens after onboarding)
  - widecast/docs/endpoints/library.md (GET /v1/roadmap and GET /v1/foundation_videos)
---

WideCast gives you two tools that turn "what should I make next" into a plan you can actually follow. The Authority Roadmap is your content calendar: it plans out 60 videos across a 20-week cycle and tracks how many you have finished. Foundation Videos is a library of ready-made scripts for your industry, so you always have a starting point instead of a blank page. This guide covers both screens, plus how an AI agent connected to WideCast can use them for you.

## Your Authority Roadmap

Open your Authority Roadmap and you land on the overview: your 20-week cycle laid out as a road. A flag marks **START YOUR JOURNEY** at the beginning, each stop is labeled by week number, **THIS WEEK** marks where you are right now, and a trophy marks **AUTHORITY ACHIEVED** once you finish all 60 videos. Near the top, a running count tracks your progress, such as "4 / 60", with the label **videos completed** underneath it.

WideCast opens your Authority Roadmap for you automatically as part of getting started, and it reopens whenever you follow a roadmap link WideCast sends you, such as a reminder.

## Weekly progress and week views

Tap any stop on the road to open that week's own view, which lists the videos and ideas planned for that specific week. A **Roadmap** link at the top takes you back to the full overview. You cannot open a week that has not started yet; WideCast shows a message like "Week 9 is not available yet" if you try.

Your weekly quota is simply your 60-video goal divided evenly across the 20-week cycle, which works out to about three videos a week. This week-by-week view is separate from the general idea-browsing backlog covered in [Find ideas and plan your production](guide/ideas-and-production-plan.html); it only shows the plan for the single week you tapped.

## Foundation Videos

Foundation Videos is a library of ready-made video scripts built for your industry: Real Estate, Insurance, Loan & Mortgage, Immigration, and Nail (salons and technicians). Instead of starting from a blank page, you pick a topic your clients already ask about and record it in your own words.

Once your account's industry is one of those five, a **Foundation Videos** button with a trophy icon appears on your home screen. Opening it shows your industry's templates grouped into categories, like "First-Time Home Buyers" or "Refinancing", plus a summary line showing how much content is available, such as "60 videos · ~20 weeks · 4 phases".

The templates are also grouped into four phases that match how your audience grows as you keep posting: **Break the Ice** (your first 15 videos, just about getting comfortable on camera), **Your Circle Notices** (videos 16 to 30, as people who already know you start watching), **Strangers Find You** (31 to 45, once new people start finding you), and **Leads Come to You** (46 to 60, once viewers start reaching out). Work through them in order, or jump to whichever topic fits this week.

## Using a Foundation Video as your starting point

Open a template card and tap **Show script** to read it before committing (tap **Hide script** to collapse it again). When you are ready, tap **Try this video** to start recording. WideCast splits the script into short segments you read one at a time from the built-in teleprompter, the same way as any other self-recorded video (see [Record yourself with the teleprompter](guide/record-yourself.html)). If you make a mistake, you only need to redo that one segment.

If you already started a template, its button changes to **Edit now** so you can pick up where you left off. Once you have exported that video, WideCast marks the card **Exported** instead.

## AI agents and the WideCast connector

If you connect an AI assistant to WideCast, it can read your Authority Roadmap and browse your Foundation Video library the same way you would in the app, then use a template as the starting point for a new video. See [Connect an AI agent to WideCast](guide/api-and-mcp.html) for how to set that up.

## Q&A
Q: What is the 60-Video Authority Roadmap?
A: It is WideCast's built-in content calendar. It plans out 60 videos across a 20-week cycle so you always know what to record next, and tracks how many you have finished. Inside the app the screen is titled "Your Authority Roadmap".

Q: How does the weekly quota work?
A: The Authority Roadmap divides your 60-video goal evenly across a 20-week cycle, which works out to about three videos a week. The overview marks your current stretch with a "THIS WEEK" label on the road, and shows a running count of videos completed so far, such as "4 / 60".

Q: What are Foundation Videos?
A: Foundation Videos are ready-made scripts built for your industry, covering topics your clients already ask about. Each one comes as a full script split into short segments you read on camera, grouped into categories and four phases so you can find a relevant topic fast.

Q: How do I use a Foundation Video for my industry?
A: Open the "Foundation Videos" button on your home screen, browse the templates, and tap "Show script" to preview one. When you are ready, tap "Try this video" to start recording it in your own words using the built-in teleprompter. If you already started that template, the button changes to "Edit now" so you can continue.

Q: Which industries have Foundation Video templates?
A: Real Estate, Insurance, Loan & Mortgage, Immigration, and Nail. If your account's industry matches one of these, the "Foundation Videos" button appears on your home screen automatically.

Q: What do the phases in Foundation Videos mean?
A: WideCast groups the 60 templates into four phases that match how your audience grows: "Break the Ice" for your first 15 videos, "Your Circle Notices" for people who already know you, "Strangers Find You" once new viewers start finding you, and "Leads Come to You" for turning viewers into leads.

Q: How do I open my Authority Roadmap?
A: WideCast opens it for you automatically as part of getting started, and it reopens whenever you follow a roadmap link WideCast sends you, such as a reminder.

Q: Does browsing the roadmap or Foundation Videos use credits?
A: No, browsing both is always free. You only spend credits once you actually generate something, like turning a Foundation Video script into finished video scenes. See [Credits, plans, and billing](guide/credits-and-billing.html) for what that costs.

Q: What happens when I tap a week on the roadmap?
A: It opens that week's own view, listing the videos and ideas planned for that specific week. A "Roadmap" link at the top takes you back to the full overview. You cannot open a week that has not started yet.

Q: How many videos are in the roadmap, and how long does the cycle take?
A: The Authority Roadmap plans for 60 videos in total, spread across a 20-week cycle. Each stop on the road is labeled by week number, from the "START YOUR JOURNEY" flag at the beginning to the "AUTHORITY ACHIEVED" trophy once you finish all 60.

Q: Can an AI agent read my roadmap or browse Foundation Videos for me?
A: Yes. An AI assistant connected to WideCast can read your Authority Roadmap progress and browse your Foundation Video library the same way the app does, then use a template as the starting point for a new video.
