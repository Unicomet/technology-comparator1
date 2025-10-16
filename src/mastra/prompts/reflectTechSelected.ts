const reflectTechSelected = async ({
  comparisonTable,
  conclusion,
  userRequest,
}: {
  comparisonTable: string;
  conclusion: string;
  userRequest: string;
}) => `
    You are an expert in technology products and user preferences.
    Your task is to reflect on the comparison table and conclusion provided, ensuring they align with the user's preferences and requirements.

    Comparison Table: 
    ${comparisonTable}
    
    Conclusion:
    ${conclusion}

    Given the comparison table and conclusion, please consider the following:
    1. Accuracy: Verify that the information in the comparison table is accurate and up-to-date.
    2. Relevance: Ensure that the features and criteria used for comparison are relevant to the user's needs and preferences.
    3. Clarity: Check that the comparison table is clear and easy to understand, with well-defined categories and criteria.
    4. Bias: Identify any potential biases in the comparison, such as favoritism towards certain brands or products.
    5. User Preferences: Reflect on how well the conclusion aligns with the user's stated preferences and requirements.

    After considering these points, provide a revised comparison table and conclusion if necessary, along with an explanation of any insights.
`;

export const PROMPTS = {
  reflectTechSelected: reflectTechSelected,
};
