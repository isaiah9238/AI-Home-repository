import { ai } from '@/ai/genkit';
import { z } from 'zod';
// REMOVE: import { run } from 'genkit/flow';

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
    outputSchema: z.any(),
  },
  async (input) => {
    // 1. Generate the classification
    const response = await ai.generate({
      model: 'googleai/gemini-2.5-pro',
      prompt: `
        You are a multi-agent dispatcher. Route the request to the best agent.
        - 'architect': creating new files, architecture, or scaffolding.
        - 'code_inspector': analyze, audit, or find bugs in code.
        - 'web_intel': fetching/summarizing content from a URL.
        - 'general_mentor': general questions or conversation.

        User Request: ${input.request}
      `,
      output: {
        schema: AgentChoiceSchema,
      },
    });

    // FIX 1: Extract the agent from response.output (this fixes error 2339)
    const agent = response.output?.agent || 'general_mentor';

    // We cast the ai instance to 'any' just for the 'run' call 
    // to bypass the strict string-vs-action mismatch.
    const dispatcher = ai as any;

    switch (agent) {
      case 'architect':
        return await dispatcher.run(generateInitialFiles, { blueprint: input.request });
      case 'code_inspector':
        return await dispatcher.run(analyzeCodeSnippet, { code: input.request, language: 'typescript' });
      case 'web_intel':
        return await dispatcher.run(webIntel, { url: input.request });
      case 'general_mentor':
      default:
        return await dispatcher.run(mentorAiFlow, { request: input.request });
    }
  } // Ensure this closing brace exists!
);