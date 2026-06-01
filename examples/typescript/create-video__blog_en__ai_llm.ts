/**
 * 📰 Blog / Article · English — 🤖 AI & LLM
 *
 * Auto-generated from widecast/docs/playgrounds/create-video.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard2" });

const resp = await client.create_video({
  "source": "blog",
  "language": "English",
  "output_type": "text",
  "video_length": "short",
  "callback_url": "",
  "blog_text": "Large language models make things up, and that includes the best ones on the market. GPT-4 and Claude both hallucinate factual claims somewhere in the range of five to ten percent of the time, and no amount of prompting eliminates the behavior entirely, because the cause is structural rather than a bug to be patched. These models are trained to predict the next likely word given everything before it, not the next true word. They have no internal database to check a claim against and no built-in sense of when they are guessing versus reciting. Understanding that single fact changes how you should build with them. The goal is not to chase zero errors, which is not achievable today, but to make errors visible and recoverable. Three techniques do most of the work in practice. The first is retrieval grounding: instead of asking the model to recall a fact from training, give it the relevant source documents and ask it to answer from that text. The second is lowering the temperature to zero for factual tasks, which strips out the randomness that produces creative but unreliable answers. The third is forcing the model to cite or quote its source, because the act of pointing at specific text makes the model far more likely to self-correct when it cannot actually find support for a claim. None of these turn a language model into an oracle, and treating one as if it were is the real risk. The durable solution is architectural: build a review step into every workflow so that when the model is wrong, a human or a second check catches it before it ships."
});
console.log(resp);
