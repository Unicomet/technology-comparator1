import { google } from "@ai-sdk/google";
import { Agent } from "@mastra/core/agent";
import { LibSQLStore } from "@mastra/libsql";
import { Memory } from "@mastra/memory";
import { webSearchTool } from "../tools/web-search-tool";

export const techComparatorAgent = new Agent({
	name: "Tech Comparator Agent",
	instructions: `
      #You are a helpful assistant that compares different technology products based on user requirements.

      Given the first user message which describes the type technology products to compare. Follow these steps to complete the task:

	  1. Understand the user's requirements and preferences for the technology products, if it is necessary,use your working memory to recall this information from previous interactions.

      2. Gather options of products that meet the requirements and preferences of the user, search this information from internet, from this current year, 2025.

      3. Compare the products based on features, pricing, user reviews, and other relevant criteria.

      4. Finally provide a comparison table with a conclusion about what is the best product considering the user's preferences and requirements.

      ##Important Notes:
      - Use the search_web tool to gather information about the technologies.
	  - Update rules when user provides new information about himself or about their preferences.
`,
	model: google("gemini-2.5-pro"),
	tools: { webSearchTool },
	memory: new Memory({
			options:{
				workingMemory:{
					enabled: true,
					scope: "resource",
					template: `# User Profile
					## Personal Info 

					- Name: 
					- Location:
					- Age:
					- Occupation:
					- Tech Savviness Level (Beginner, Intermediate, Expert):

					## Preferences
					- Prefered color:
					- Prefered Brand:
					- Prefered mobile OS:
					- Prefered laptop OS:
					- Interests:
					`
				}
			},
			storage: new LibSQLStore({
			url: "file:../mastra.db", // path is relative to the .mastra/output directory
		}),
	}),
});
