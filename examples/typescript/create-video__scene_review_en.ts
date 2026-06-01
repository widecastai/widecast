/**
 * Scene review · English (default)
 *
 * Auto-generated from widecast/docs/playgrounds/create-video.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard2" });

const resp = await client.create_video({
  "script_text": "Want to make a video in 60 seconds? Here's how — and why it actually works.\nFirst, draft your script in bullet points. Don't overthink it. Three to five\nbeats is plenty: a hook that grabs attention, a body that delivers one clear\nidea, and a call to action that tells the viewer exactly what to do next.\nSecond, paste it into WideCast and pick an aspect ratio that fits the\nplatform you're posting to. Vertical for TikTok and Reels, square for feed\nposts, landscape for YouTube. The same script, three different videos.\nThird, hit render and grab a coffee. The AI does the work — segments,\nvoice, B-roll. You come back to a video that's ready to publish.\nTry it free at widecast.ai and ship your first short-form video today.\n",
  "output_type": "scene",
  "wait_for_render": false
});
console.log(resp);
