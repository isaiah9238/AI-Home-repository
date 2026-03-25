import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { analyzeCodeSnippet } from '@/ai/domains/research/analyze-code-snippet';
import { generateInitialFiles } from '@/ai/discovery/generate-initial-files';
import { mentorAiFlow } from '@/ai/discovery/mentor-ai';
import { webIntel } from '@/ai/discovery/web-intel';

/**
 * @fileOverview The Multi-Agent Dispatcher
 * 
 * Classifies user intent and routes the request to the specialized domain agent.
 */

const DispatcherInputSchema = z.object({
  request: z.string(),
});

const AgentChoiceSchema = z.object({
  agent: z
    .enum(['architect', 'code_inspector', 'web_intel', 'general_mentor'])
    .describe('The specialized agent to route the request to.'),
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
        You are a multi-agent dispatcher for the AI Home Cabinet. 
        Analyze the request and route it to the best agent:
        - 'architect': used for creating new files, app architecture, or project scaffolding.
        - 'code_inspector': used to analyze, audit, find bugs, or review code snippets.
        - 'web_intel': used for fetching and summarizing content from a URL coordinate.
        - 'general_mentor': used for general questions, profile updates, or conversation.

        User Request: ${input.request}
      `,
      output: {
        schema: AgentChoiceSchema,
      },
    });

    const agent = response.output?.agent || 'general_mentor';

    // 2. Direct routing to the selected flow
    switch (agent) {
      case 'architect':
        return await generateInitialFiles({ blueprint: input.request });
      case 'code_inspector':
        return await analyzeCodeSnippet({ code: input.request, language: 'typescript' });
      case 'web_intel':
        // Ensure the request is passed as a URL object if likely a URL
        const isUrl = input.request.startsWith('http');
        return await webIntel({ url: isUrl ? input.request : 'https://google.com' });
      case 'general_mentor':
      default:
        return await mentorAiFlow({ request: input.request });
    }
  }
);
