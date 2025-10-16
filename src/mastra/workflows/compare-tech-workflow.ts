import { createStep, createWorkflow } from "@mastra/core";
import z from "zod";
import { techComparatorAgent } from "../agents/tech-comparator-agent";
import { reflectionAgent } from "../agents/reflection-agent";
import { RuntimeContext } from "@mastra/core/runtime-context";

type CompareTechRuntimeContext = {
  userRequest: string;
  comparisonTable: string;
  conclusion: string;
};
const runtimeContext = new RuntimeContext<CompareTechRuntimeContext>();

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
  execute: async ({ inputData }) => {
    if (!inputData) {
      throw new Error("No input data provided");
    }

    console.log("RuntimeContext (Research):", runtimeContext);

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

    runtimeContext.set("userRequest", inputData.userRequest);
    runtimeContext.set("comparisonTable", response.object.comparisonTable);
    runtimeContext.set("conclusion", response.object.conclusion);

    return {
      comparisonTable: response.object.comparisonTable,
      conclusion: response.object.conclusion,
    };
  },
});

const reflection = createStep({
  id: "reflection",
  inputSchema: z.object({
    comparisonTable: z
      .string()
      .describe("A table comparing the different technology products."),
    conclusion: z.string().describe("A conclusion based on the comparison."),
  }),
  outputSchema: z.object({
    comparisonTable: z
      .string()
      .describe("A table comparing the different technology products."),
    conclusion: z.string().describe("A conclusion based on the comparison."),
  }),
  execute: async ({ inputData }) => {
    if (!inputData) {
      throw new Error("No input data provided");
    }

    console.log("RuntimeContext (Reflection):", runtimeContext);

    const response = await reflectionAgent.generate("Do reflection", {
      runtimeContext,
      structuredOutput: {
        schema: z.object({
          insights: z.string().describe("The insights from the reflection."),
          comparisonTable: z
            .string()
            .describe("The revised comparison table in Markdown format."),
          conclusion: z.string().describe("The revised conclusion."),
        }),
      },
    });

    return {
      comparisonTable: response.object.comparisonTable,
      conclusion: response.object.conclusion,
      insights: response.object.insights,
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
  .then(reflection)
  .commit();

export { compareTechWorkflow };
