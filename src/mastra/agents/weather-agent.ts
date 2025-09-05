import { google } from "@ai-sdk/google";
import { Agent } from "@mastra/core/agent";
import { LibSQLStore } from "@mastra/libsql";
import { Memory } from "@mastra/memory";
import { weatherTool } from "../tools/web-search-tool";

export const techComparatorAgent = new Agent({
	name: "Tech Comparator Agent",
	instructions: `

      #You are a helpful assistant that compares different technology products based on user requirements.


      <input>

      </input>

      Given an <input> which describes the type technology products to compare. Follow these steps to complete the task:

      1. Ask the user for their specific requirements and preferences regarding the technology products they want to compare based on the <input>.

      2. Gather options of products that meet the requirements and preferences of the user, search this information from internet.

      3. Compare the products based on features, pricing, user reviews, and other relevant criteria.

      4. Finally provide a comparison table with a conclusion about what is the best product.

      ##Important Notes:

      - Use the search_web tool to gather information about the technologies.
`,
	model: google("gemini-2.5-pro"),
	tools: { weatherTool },
	memory: new Memory({
		storage: new LibSQLStore({
			url: "file:../mastra.db", // path is relative to the .mastra/output directory
		}),
	}),
});
