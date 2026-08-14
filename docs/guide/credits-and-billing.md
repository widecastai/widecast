---
slug: credits-and-billing
title: Credits, plans, and billing
group: help
order: 2
summary: "How credits are spent, where to check your balance, and how upgrades, downgrades, cancellations, and pauses work."
updated: 2026-08-12
covers:
  - ui:billing
  - api:GET /v1/account
  - mcp:widecast_account
sources:
  - gubo-remotion-player/js/generic.js (subscription + cancel retention flow)
  - gubo-remotion-player/js/workflow.js (Your Subscription dialog)
  - gubo-remotion-player/js/script_editor.js (scene generation credit cost)
  - dashboard2.py (402 credit_exhausted / account_expired / free_tier_limit_exceeded)
---

WideCast plans include a monthly allowance of credits. Credits are spent when WideCast generates something for you; reviewing, editing, and rearranging what you already made is free.

## What uses credits

- Creating a new video, blog post, or social post. Generating a video scene by scene, including its B-roll footage, uses 2 credits.
- Generating AI images (1 credit per image).
- Exporting the final MP4 of a video.
- Publishing to a connected platform (1 credit per publish action).

Editing scenes, swapping backgrounds from the picker, rewriting text, and previewing never cost credits.

## Check your balance and plan

Open the profile menu in the top corner and choose **Subscription & Credits**. The **Your Subscription** dialog shows a credit ring with your remaining credits, your plan, and the **Valid until** date, plus **Upgrade** and **Share to Earn Credits** buttons. If you use WideCast through the API or an AI agent, the same numbers come back from your account endpoint.

## Free plan vs paid plans

Free accounts can make videos up to **60 seconds** long. Paid accounts can make videos up to **5 minutes**. Most other features work the same, so you can try the flow end to end before upgrading; a few features are paid-only, such as connecting social accounts and voice cloning.

## Upgrade or downgrade

Open **Subscription & Credits** and pick the plan you want:

- **Upgrades** take effect immediately. You are charged the pro-rated difference for the rest of the billing cycle.
- **Downgrades** take effect at your next renewal. Your current plan stays active until the end of the billing cycle you already paid for.

## Cancel or pause

Choosing **Cancel Subscription** walks through a short flow that shows what you would lose (remaining AI credits and your access-until date) and offers alternatives before the final step:

- **Keep My Plan**: change your mind at any step.
- **Downgrade instead?**: move to a cheaper plan rather than leaving.
- **Pause for 1 month?**: skip the next payment and come back later. Nothing is deleted while paused.

After canceling you keep full access until the end of the period you already paid for.

## When credits run out

Generation is blocked until your credits reset at the next renewal, or immediately after an upgrade. Anything you already generated stays available for editing and publishing.

## Q&A

Q: What do credits pay for in WideCast?
A: Credits are spent when WideCast generates something new: creating a video or written post (scene-by-scene video generation uses 2 credits), generating AI images (1 credit per image), exporting the final MP4, and publishing to a connected platform (1 credit). Editing existing scenes is free.

Q: Where can I see how many credits I have left?
A: Open the profile menu and choose "Subscription & Credits". The "Your Subscription" dialog shows your remaining credits, your plan, and its "Valid until" date.

Q: I ran out of credits. What do I do?
A: Your monthly credit allowance is used up, so new generation is blocked. Upgrade to a bigger plan to get more credits immediately, or wait until your plan renews and the allowance resets. Your existing videos remain fully editable in the meantime.

Q: What are the limits of the free plan?
A: Free accounts can make videos up to 60 seconds long; paid accounts can make videos up to 5 minutes. If your script runs past the free limit, WideCast asks you to upgrade before generating. Connecting social accounts and voice cloning also need a paid plan.

Q: How do I upgrade my plan?
A: Open the profile menu, choose "Subscription & Credits", and pick the plan you want. Upgrades take effect immediately and you are charged the pro-rated difference for the rest of the cycle.

Q: If I downgrade, when does the cheaper plan start?
A: At your next renewal. Your current plan stays active until the end of the billing cycle you already paid for.

Q: How do I cancel my subscription?
A: Open "Subscription & Credits" and choose "Cancel Subscription". The flow shows what you lose, offers a downgrade or a pause instead, and you can pick "Keep My Plan" at any step. After canceling you keep access until the end of the period you paid for.

Q: Can I pause my subscription instead of canceling it?
A: Yes. The cancel flow offers "Pause for 1 month?", which skips your next payment. Nothing is deleted, and you will not be charged for the next cycle.

Q: My account says it is expired. What does that mean?
A: Your subscription period has ended, so generation is blocked until you renew. Open "Subscription & Credits" in the profile menu to renew. Your videos and projects are still there.

Q: Can I earn free credits?
A: Yes. The "Your Subscription" dialog has a "Share to Earn Credits" button that rewards you for sharing WideCast.
