import { Mastra } from "@mastra/core/mastra";
import { LibSQLStore } from "@mastra/libsql";
import { PinoLogger } from "@mastra/loggers";
import { techComparatorAgent } from "./agents/tech-comparator-agent";
import { compareTechWorkflow } from "./workflows/compare-tech-workflow";

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
});
