---
slug: team-users
title: Team and sub-users
group: sharing
order: 2
summary: "How to give someone else access to your WideCast account with a sub-user, what the Team menu's Organization Program does, and when a client link fits better."
updated: 2026-08-12
covers:
  - ui:team_users
sources:
  - gubo-remotion-player/js/subuser.js (Manage Users modal, Add Sub-User flow, switch/remove, Organization Program modal)
  - gubo-remotion-player/js/kara.js (profile menu Users/Team entries and click routing, lines 8037-8171)
  - gubo-remotion-player/css/participant.css (Users/Team hidden from magic-link client sessions)
---

WideCast lets someone else sign in and work inside your account instead of setting up a separate one of their own. The profile menu in the top corner has two entries for this: **Users**, where you add and manage sub-users, and **Team**, which opens a different feature entirely. This guide covers both, plus how they compare to sending an outside client a magic link.

## Add a sub-user

Open the profile menu and choose **Users**. This opens the **Manage Users** window, which lists two things: **Accounts I Can Access** (accounts other people have shared with you) and **People Who Can Access My Account** (the sub-users you have added).

To add someone, click **Add Sub-User** below the second list. Enter their **Email Address** and click **Add User**. They need to already have a WideCast account under that email; this window grants access to an existing account, it does not invite someone to sign up. A confirmation appears once it goes through. WideCast also shows a reminder here that adding a sub-user "grants WideCast access only" and does not touch your Google sign-in.

You cannot add your own email address, and the form requires a valid email.

## What a sub-user can do

Once you add someone, your account shows up under **Accounts I Can Access** in their own **Manage Users** window. They click **Switch** to enter your account and work inside it: creating videos, editing scenes, publishing, all the same things you can do. A **Current** badge marks whichever account they are actively working in, and they switch back to their own account the same way.

A sub-user gets full account access; there is no separate role or permission level to choose when you add them. While someone is switched into your account, they cannot open the **Users** window there until they switch back first.

## Remove a sub-user

In the **Manage Users** window, click the remove icon on a sub-user's row under **People Who Can Access My Account**. Confirm in the **Remove Sub-User** prompt, which shows the email you are removing, then click **Remove**. This immediately revokes their access to your account.

## The "Team" menu: Organization Program

The **Team** entry in the profile menu is not for adding people to help run your account; that is what **Users** is for. **Team** opens the **Organization Program**, a referral tool. You can set an **Organization Name**, then switch to the **Send Invitations** tab to invite people by email, with an optional personal message. The **Members** tab tracks who you have invited and their status. Unlike sub-users, people you invite here do not need an existing WideCast account; they can sign up after receiving your invitation.

## Sub-users vs client magic links

Adding a sub-user hands over your whole account, so it fits a coworker or assistant who needs ongoing access. If an outside client only needs to review or edit a single video, a magic link is a better fit: it scopes them to that one project and hides account-admin controls entirely, including the **Users** and **Team** menu entries. See [Client links](guide/client-links.html) for how to send one.

## Q&A

Q: How do I add a team member to my WideCast account?
A: Open the profile menu and choose "Users". In the "Manage Users" window, click "Add Sub-User" under "People Who Can Access My Account", enter their email address, and click "Add User". They need to already have a WideCast account under that email. Once added, your account appears under their own "Manage Users" window, and they click "Switch" to work inside it.

Q: What is the difference between a sub-user and a client link?
A: A sub-user gets full access to your account, the same as you have, across every video. A client link is scoped to one specific video and hides account-admin controls, including the "Users" and "Team" menus. Add someone as a sub-user when they need ongoing access to help run your account, like a coworker or assistant. Use a client link when an outside client only needs to review or edit a single project.

Q: Where do I manage my team?
A: Open the profile menu in the top corner. "Users" opens the "Manage Users" window, where you add, view, and remove sub-users who can access your account. "Team" is a different feature: it opens the "Organization Program", a referral tool, not account access. If you want to give someone access to help make videos, choose "Users".

Q: What does the "Team" menu item actually do?
A: It opens the "Organization Program", a referral feature, not team-member access. You set an "Organization Name", then invite people by email from the "Send Invitations" tab. The "Members" tab tracks who you invited and their status. It does not give anyone access to your account; for that, use "Users" instead.

Q: Can I remove a sub-user later?
A: Yes. Open the profile menu, choose "Users", and find their row under "People Who Can Access My Account" in the "Manage Users" window. Click the remove icon, confirm in the "Remove Sub-User" prompt, and click "Remove". This immediately revokes their access to your account.

Q: What can a sub-user see and do once I add them?
A: A sub-user gets full access to your account, the same as you have. From their own "Manage Users" window, they see your account under "Accounts I Can Access" and click "Switch" to enter it and work inside it, including creating and editing videos. There is no separate role or permission level. While switched into your account, they cannot open their "Manage Users" window until they switch back.

Q: Do I need a paid plan to add a sub-user?
A: No. Adding a sub-user only requires you to be signed in; there is no separate plan requirement or limit on how many sub-users you can add.

Q: Will a sub-user need their own WideCast account?
A: Yes. Sub-users are matched by an existing email address, so the person needs a WideCast account of their own before you can add them. This is different from the "Team" menu's invitations, which can go to people who have not signed up yet. Once added as a sub-user, they work inside your account whenever they switch into it.

Q: How do I switch into another account after someone adds me as a sub-user?
A: Open the profile menu and choose "Users". In the "Manage Users" window, under "Accounts I Can Access", find the account and click "Switch". A "Current" badge marks whichever account you are actively working in, and you switch back to your own account the same way. You cannot open "Manage Users" again until you switch back first.
