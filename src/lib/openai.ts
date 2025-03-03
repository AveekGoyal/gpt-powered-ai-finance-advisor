import Anthropic from '@anthropic-ai/sdk';

// Initialize the Anthropic API client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY, 
});

// Function to generate general financial advice
export async function generateFinancialAdvice(prompt: string): Promise<string> {
  try {
    const response = await anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7, 
    });

    // Extract text from the response
    const textContent = response.content.find(block => block.type === 'text');
    return textContent?.text || '';
  } catch (error) {
    console.error('Error generating financial advice:', error);
    throw new Error('Failed to generate financial advice');
  }
}

// Function to generate personalized financial advice based on user profile
export async function generatePersonalizedFinancialAdvice(user: any, question: string, area: string): Promise<string> {
  // Construct the prompt for the Anthropic API
  const prompt = `
    User Profile:
    - Annual Income: $${user.annualIncome}
    - Monthly Expenses: ${JSON.stringify(user.monthlyExpenses)}
    - Current Savings: $${user.currentSavings}
    - Financial Goals: ${user.financialGoals.join(', ')}
    - Risk Tolerance: ${user.riskTolerance}

    Question: ${question}
    Area of Interest: ${area}

    Given the user prompt and user profile, give the response according to the user's question. If the question is general, provide a general response.
    If the user is asking for advice or any other help, use the information of the user profile to provide a good response. And build on the chat as you move further. Do not give advice if not asked for this.
    Structure your response in Markdown format. Do not start the response with "Assitant", "Response" keep it general.
  `;

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    // Extract text from the response
    const textContent = response.content.find(block => block.type === 'text');
    return textContent?.text || '';
  } catch (error) {
    console.error('Error generating personalized financial advice:', error);
    throw new Error('Failed to generate personalized financial advice');
  }
}

// Function to generate a strategy for achieving a specific financial goal
export async function generateGoalStrategy(user: any, goal: any): Promise<string> {
  // Construct the prompt for the Anthropic API
  const prompt = `
    User Profile:
    - Annual Income: $${user.annualIncome}
    - Monthly Expenses: ${JSON.stringify(user.monthlyExpenses)}
    - Current Savings: $${user.currentSavings}
    - Financial Goals: ${user.financialGoals.join(', ')}
    - Risk Tolerance: ${user.riskTolerance}

    Goal Details:
    - Type: ${goal.type}
    - Target Amount: $${goal.targetAmount}
    - Current Amount: $${goal.currentAmount}
    - Target Date: ${new Date(goal.targetDate).toLocaleDateString()}

    Given the user's financial profile and goal details, generate a personalized strategy to help them achieve this financial goal. Include specific recommendations, potential challenges, and actionable steps. Structure your response in Markdown format.
    In the response do not mention something like Dear Client or [User name] no placeholders should be present. Do not start the response with "Assitant", "Response" keep it general.
  `;

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    // Extract text from the response
    const textContent = response.content.find(block => block.type === 'text');
    return textContent?.text || '';
  } catch (error) {
    console.error('Error generating goal strategy:', error);
    throw new Error('Failed to generate goal strategy');
  }
}

// Function to generate a chat response based on conversation history
export async function generateChatResponse(messages: { role: string; content: string }[]): Promise<string> {
  try {
    const response = await anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 1000,
      messages: messages.map(msg => ({
        role: msg.role as 'user' | 'assistant', 
        content: msg.content
      })),
      temperature: 0.7,
    });

    // Extract text from the response
    const textContent = response.content.find(block => block.type === 'text');
    return textContent?.text || '';
  } catch (error) {
    console.error('Error generating chat response:', error);
    throw new Error('Failed to generate chat response');
  }
}

export default anthropic;