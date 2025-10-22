import { Mastra } from "@mastra/core/mastra";
import { LibSQLStore } from "@mastra/libsql";
import { PinoLogger } from "@mastra/loggers";
import { techComparatorAgent } from "./agents/tech-comparator-agent";
import { compareTechWorkflow } from "./workflows/compare-tech-workflow";
import { LangfuseExporter } from "@mastra/langfuse";

export const mastra = new Mastra({
  agents: { techComparatorAgent },
  workflows: { compareTechWorkflow },
  storage: new LibSQLStore({
    // stores telemetry, evals, ... into memory storage, if it needs to persist, change to file:../mastra.db
    url: ":memory:",
  }),
  logger: new PinoLogger({
    name: "Mastra",
    level: "info",
  }),
  observability: {
    configs: {
      langfuse: {
        serviceName: "langfuse-service",
        exporters: [
          new LangfuseExporter({
            publicKey: process.env.LANGFUSE_PUBLIC_KEY!,
            secretKey: process.env.LANGFUSE_SECRET_KEY!,
            baseUrl: process.env.LANGFUSE_BASE_URL,
            options: {
              environment: process.env.NODE_ENV,
            },
          }),
        ],
      },
    },
  },
});
