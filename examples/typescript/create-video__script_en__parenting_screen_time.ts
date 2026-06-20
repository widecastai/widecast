/**
 * 📜 Script · English — 👶 Parenting
 *
 * Auto-generated from widecast/docs/playgrounds/create-video.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard" });

const resp = await client.create_video({
  "source": "text",
  "output_type": "scene",
  "faceless": false,
  "callback_url": "",
  "script_text": "A toddler who watches over two hours of screen daily has a thirty percent higher chance of language delay at age three. The mechanism is real. Language develops through back-and-forth conversation, not one-way listening. When a parent reads, points, and waits for a response, neural pathways form for both comprehension and production. A screen plays at the child but never responds. Six months of two-plus hours daily can set development back another six months in vocabulary. Two changes flip the trajectory. Replace one hour of passive screen with one hour of \"serve and return\" conversation. Use any screen time as a starting point: pause, ask \"what do you see?\", wait. The brain wires what you practice. Choose what to practice."
});
console.log(resp);
