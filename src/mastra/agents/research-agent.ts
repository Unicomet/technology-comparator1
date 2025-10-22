import { Agent } from "@mastra/core/agent";

import { LibSQLStore } from "@mastra/libsql";
import { Memory } from "@mastra/memory";
import { PROMPTS } from "../prompts/reflectTechSelected";
import { webSearchTool } from "../tools/web-search-tool";

export const researchAgent = new Agent({
  name: "researchAgent",
  instructions: async ({ runtimeContext }) => {
    return PROMPTS.webSearchBasedOnInput({
      userRequest: runtimeContext.get("userRequest"),
    });
  },
  model: "anthropic/claude-haiku-4-5-20251001",
  tools: { webSearchTool },
  memory: new Memory({
    storage: new LibSQLStore({
      url: "file:../mastra.db", // path is relative to the .mastra/output directory
    }),
  }),
});
