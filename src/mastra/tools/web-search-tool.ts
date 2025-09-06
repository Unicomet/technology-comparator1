import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { tavily } from "@tavily/core";

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

export const webSearchTool = createTool({
	id: "web-search-tool",
	description: "Search the web for information.",
	inputSchema: z.object({
		query: z.string().describe("A well defined query for web search."),
	}),
	outputSchema: z.array(
		z.object({
			title: z.string().describe("The title of the web result."),
			content: z.string().describe("The content snippet of the web result."),
		}),
	),
	execute: async ({ context }) => {
		const response = await tvly.search(context.query);

		const webResults = response.results.map((result) => ({
			title: result.title,
			content: result.content,
		}));

		return webResults;
	},
});
