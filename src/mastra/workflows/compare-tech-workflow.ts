import { createStep, createWorkflow } from "@mastra/core";
import { agentToStep } from "@mastra/core/workflows/legacy";
import z from "zod";
import { mastra } from "..";
import { techComparatorAgent } from "../agents/tech-comparator-agent";

const researchAndCompare = createStep({
  id: "research-and-compare",
  inputSchema: z.object({
    userRequest: z
      .string()
      .describe(
        "The user's request describing the type of technology products to compare."
      ),
  }),
  outputSchema: z.object({
    comparisonTable: z
      .string()
      .describe("A table comparing the different technology products."),
    conclusion: z.string().describe("A conclusion based on the comparison."),
  }),
  execute: async ({ runtimeContext, inputData }) => {
    if (!inputData) {
      throw new Error("No input data provided");
    }

    const response = await techComparatorAgent.generate(inputData.userRequest, {
      structuredOutput: {
        schema: z.object({
          comparisonTable: z
            .string()
            .describe("The comparison table in Markdown format."),
          conclusion: z.string().describe("The conclusion."),
        }),
      },
    });

    return {
      comparisonTable: response.object.comparisonTable,
      conclusion: response.object.conclusion,
    };
  },
});

const compareTechWorkflow = createWorkflow({
  id: "compare-tech-workflow",
  description:
    "A workflow to compare different technology products based on user requirements.",
  inputSchema: z.object({
    userRequest: z
      .string()
      .describe(
        "The user's request describing the type of technology products to compare."
      ),
  }),
  outputSchema: z.object({
    comparisonTable: z
      .string()
      .describe("A table comparing the different technology products."),
    conclusion: z.string().describe("A conclusion based on the comparison."),
  }),
})
  .then(researchAndCompare)
  .commit();

export { compareTechWorkflow };
