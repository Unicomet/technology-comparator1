import { createScorer } from "@mastra/core/scores";

const whiteListDomains = ["pcmag.com", "cnet.com", "rtings.com"];

export const webSearchScorer = createScorer({
  name: "Quality Scorer",
  description: "Evaluates response quality",
})
  .preprocess(({ run }) => {
    // Extract key information
    console.log("Scorer output", run.output);

    const domainsWebResults: string[] = run.output.searchResults.map(
      (webResult: { title: string; content: string; url: string }) => {
        const domain = new URL(webResult.url).hostname;
        return domain;
      }
    );

    return { domainsWebResults };
  })
  .analyze(({ run, results }) => {
    // Analyze the response

    const domainsWebResults = results.preprocessStepResult.domainsWebResults;

    const domainsMatching = [];

    console.log(domainsWebResults);

    for (const domain of domainsWebResults) {
      for (const whiteListDomain of whiteListDomains) {
        if (
          domain === whiteListDomain ||
          domain.endsWith(`${whiteListDomain}`)
        ) {
          domainsMatching.push(domain);
        } else {
          console.log("Domain:", domain);
        }
      }
    }

    console.log("Matching domains:", domainsMatching);

    return { domainsMatching };
  })
  .generateScore(({ results }) => {
    // Calculate score
    const matchingCount = results.analyzeStepResult.domainsMatching.length;
    const totalWebResults =
      results.preprocessStepResult.domainsWebResults.length;
    return matchingCount / totalWebResults;
  })
  .generateReason(({ score, results }) => {
    // Explain the score
    const matchingCount = results.analyzeStepResult.domainsMatching.length;
    return `Score: ${score}. Response has ${matchingCount} matching domains of ${results.preprocessStepResult.domainsWebResults.length}.`;
  });
