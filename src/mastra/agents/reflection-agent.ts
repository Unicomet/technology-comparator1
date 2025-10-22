import { google } from "@ai-sdk/google";
import { Agent } from "@mastra/core/agent";

import { LibSQLStore } from "@mastra/libsql";
import { Memory } from "@mastra/memory";
import { webSearchTool } from "../tools/web-search-tool";
import { PROMPTS } from "../prompts/reflectTechSelected";

export const reflectionAgent = new Agent({
  name: "reflectionAgent",
  instructions: async ({ runtimeContext }) => {
    const userRequest: string = runtimeContext.get("userRequest");
    const comparisonTable: string = runtimeContext.get("comparisonTable");
    const conclusion: string = runtimeContext.get("conclusion");

    return PROMPTS.reflectTechSelected({
      comparisonTable,
      conclusion,
      userRequest,
    });
  },
  model: "anthropic/claude-haiku-4-5",
  tools: {},
  memory: new Memory({
    storage: new LibSQLStore({
      url: "file:../mastra.db", // path is relative to the .mastra/output directory
    }),
  }),
});
