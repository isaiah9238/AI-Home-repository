import { ai } from '@/ai/genkit';
import { run } from 'genkit/flow';
import { z } from 'zod';

import { analyzeCodeSnippet } from '@/ai/domains/research/analyze-code-snippet';
import { generateInitialFiles } from './generate-initial-files';
import { mentorAiFlow } from './mentor-ai';
import { webIntel } from './web-intel';

// Define the schema for the user's request.
const DispatcherInputSchema = z.object({
  request: z.string(),
  // We might need more context later, like the full user profile.
});

// Define the schema for the classification output.
const AgentChoiceSchema = z.object({
  agent: z
    .enum(['architect', 'code_inspector', 'web_intel', 'general_mentor'])
    .describe('The specialized agent to route the request to.'),
  // In a more advanced system, we'd extract parameters for each agent here.
  // For example: `code` and `language` for the code_inspector.
});

export const multiAgentDispatcherFlow = ai.defineFlow(
  {
    name: 'multiAgentDispatcherFlow',
    inputSchema: DispatcherInputSchema,
    outputSchema: z.any(), // The output will be the result of the dispatched flow.
  },
  async (input) => {
    // 1. Classify the user's intent to choose an agent.
    const { agent } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-exp', // Using the same model as other flows for consistency.
      prompt: `
        You are a multi-agent dispatcher. Your role is to analyze a user's request and route it to the most appropriate specialized agent.

        Here are the available agents and their capabilities:
        - 'architect': Use for requests related to creating new files, software architecture, project structure, or scaffolding. The user will provide a blueprint or description.
        - 'code_inspector': Use for requests to analyze, review, audit, or find bugs in a code snippet. The user will provide a piece of code.
        - 'web_intel': Use for requests that involve fetching and summarizing content from a URL. The user will provide a web address.
        - 'general_mentor': Use for all other requests, including general questions, conversation, or when the intent does not clearly match any other agent.

        User Request:
        ---
        ${input.request}
        ---

        Based on the user's request, choose the most appropriate agent.
      `,
      output: {
        schema: AgentChoiceSchema,
      },
    });

    // 2. Dispatch the request to the chosen agent.
    switch (agent) {
      case 'architect':
        return await run(generateInitialFiles, { blueprint: input.request });
      case 'code_inspector':
        // This is a simplification. A more robust solution would parse code and language from the request.
        return await run(analyzeCodeSnippet, { code: input.request, language: 'typescript' });
      case 'web_intel':
        // This is a simplification. A more robust solution would extract the URL.
        return await run(webIntel, { url: input.request });
      case 'general_mentor':
      default:
        return await run(mentorAiFlow, { request: input.request });
    }
  }
);