import { createTool } from "@mastra/core/tools";
import { z } from "zod";
const { tavily } = require("tavily");

const tvly = tavily({ apiKey: "tvly-YOUR_API_KEY" });

export const webSearchTool = createTool({
	id: "web-search-tool",
	description: "Search the web for information.",
	inputSchema: z.object({
		query: z.string().describe("The search query."),
	}),
	outputSchema: z.array(
		z.object({
			productName: z.string().describe("Name of the product"),
			productDescription: z.string().describe("Description of the product"),
			price: z.string().describe("Price of the product"),
		}),
	),
	execute: async ({ context }) => {
		const response = await tvly.search(context.query);
		console.log(response);
		return response;
	},
});
