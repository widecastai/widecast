/**
 * 📜 Script → Scenes · English — 🗳 Politics
 *
 * Auto-generated from widecast/docs/playgrounds/create-video.yaml.
 */
import Widecast from "@widecast/sdk";

const client = new Widecast({ apiKey: "wc_live_REPLACE_ME", baseUrl: "https://widecast.ai/app/dashboard2" });

const resp = await client.create_video({
  "source": "text",
  "output_type": "scene",
  "script_text": "The electoral college exists because the founders didn't trust voters directly. In seventeen eighty-seven, the United States had no telephones, no national newspapers, and no party machinery. The Constitution gave states electors instead of a popular vote. Each state gets electors equal to its house seats plus two senators. Wyoming with six hundred thousand people gets three. California with thirty-nine million gets fifty-four. That ratio means a vote in Wyoming weighs three point seven times more than a vote in California. Five times in US history the popular vote loser won the presidency. Most recently in twenty-sixteen. Abolishing the electoral college needs a constitutional amendment, and two-thirds of states. The math means it stays."
});
console.log(resp);
