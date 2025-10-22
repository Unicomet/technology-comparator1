import { google } from "@ai-sdk/google";
import { Agent } from "@mastra/core/agent";

import { LibSQLStore } from "@mastra/libsql";
import { Memory } from "@mastra/memory";
import { webSearchTool } from "../tools/web-search-tool";
import { PROMPTS } from "../prompts/reflectTechSelected";

export const techComparatorAgent = new Agent({
  name: "techComparatorAgent",
  instructions: async ({ runtimeContext }) => {
    return PROMPTS.analyzeAndCompare({
      searchResults: runtimeContext.get("searchResults"),
    });
  },
  model: "anthropic/claude-sonnet-4-5",
  memory: new Memory({
    options: {
      workingMemory: {
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
					`,
      },
    },
    storage: new LibSQLStore({
      url: "file:../mastra.db", // path is relative to the .mastra/output directory
    }),
  }),
});
