/**
 * 📰 Blog / Article · English — 🏠 Real Estate
 *
 * Auto-generated from widecast/docs/playgrounds/create-video.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard" });

const resp = await client.create_video({
  "source": "blog",
  "language": "English",
  "output_type": "text",
  "video_length": "short",
  "callback_url": "",
  "blog_text": "Most first-time buyers in the Bay Area give up before they even run the numbers, convinced that homeownership is permanently out of reach. The headline figures are genuinely intimidating: a median home price around 1.4 million dollars, mortgage rates near 7 percent, and a down payment expectation of at least 200 thousand. But fixating on those numbers in isolation misses the comparison that actually matters. Renting a two-bedroom in San Jose runs about 4,200 dollars a month, and every one of those dollars is gone for good. Buying the equivalent home, even after accounting for mortgage interest, property tax, and maintenance, converts roughly half of your monthly housing cost into equity over a ten-year horizon. That is the part the rent-versus-buy debate usually skips. There are three traps that genuinely sink first-time buyers in California, and none of them is the sticker price. The first is closing costs, which routinely hit 30 thousand dollars and catch buyers who budgeted only for the down payment. The second is property tax reassessment: your tax basis resets at purchase, so the number the previous owner paid tells you nothing about what you will owe. The third is HOA fees, which creep upward around 6 percent a year and can quietly erode affordability over a decade. Once you model all three honestly, a household earning above 180 thousand dollars usually comes out ahead by buying, not renting. The math is not the obstacle most people assume it is. The real obstacle is never sitting down to do it. Before you sign another twelve-month lease, talk to a local mortgage broker and run your actual numbers."
});
console.log(resp);
