import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { analyzeCodeSnippet } from '@/ai/domains/research/analyze-code-snippet';
import { generateInitialFiles } from '@/ai/discovery/generate-initial-files';
import { mentorAi } from '@/ai/discovery/mentor-ai';
import { webIntel } from '@/ai/discovery/web-intel';

/**
 * @fileOverview The Multi-Agent Dispatcher (Vertex Edition)
 * 
 * Classifies user intent and routes the request to the specialized domain agent.
 */

const DispatcherInputSchema = z.object({
  request: z.string(),
  agenticContext: z.string().optional().describe("Collective memory fragments from other agents"),
  userProfile: z.any().optional(),
});

const AgentChoiceSchema = z.object({
  agent: z
    .enum(['architect', 'code_inspector', 'web_intel', 'general_mentor'])
    .describe('The specialized agent to route the request to.'),
});

const flow = ai.defineFlow(
  {
    name: 'multiAgentDispatcherFlow',
    inputSchema: DispatcherInputSchema,
    outputSchema: z.any(),
  },
  async (input) => {
    try {
      const agenticCtx = input.agenticContext || "No recent agentic signals.";

      // 1. Generate the classification using Vertex
      const response = await ai.generate({
        model: 'vertexai/gemini-2.5-flash',
        prompt: `
          You are a multi-agent dispatcher for the AI Home Cabinet. 
          Analyze the request and route it to the best agent:
          - 'architect': used for creating new files, app architecture, or project scaffolding.
          - 'code_inspector': used to analyze, audit, find bugs, or review code snippets.
          - 'web_intel': used for fetching and summarizing content from a URL coordinate.
          - 'general_mentor': used for general questions, profile updates, or conversation.

          RECENT_AGENT_SIGNALS:
          ${agenticCtx}

          User Request: ${input.request}
        `,
        output: {
          schema: AgentChoiceSchema,
        },
      });

      const agent = response.output?.agent || 'general_mentor';

      // 2. Direct routing to the selected flow wrapper
      switch (agent) {
        case 'architect':
          return await generateInitialFiles({ blueprint: input.request });
        case 'code_inspector':
          return await analyzeCodeSnippet({ code: input.request, language: 'typescript' });
        case 'web_intel':
          const isUrl = input.request.startsWith('http');
          return await webIntel({ url: isUrl ? input.request : 'https://google.com' });
        case 'general_mentor':
        default:
          return await mentorAi({ request: input.request, agenticContext: input.agenticContext, userProfile: input.userProfile });
      }
    } catch (error: any) {
      console.error("Dispatcher Flow Error:", error.message);
      return { response: `DISPATCH_ERROR: Signal lost during routing. [${error.message}]` };
    }
  }
);

/**
 * multiAgentDispatcher - Standard function wrapper for the Dispatcher flow.
 */
export async function multiAgentDispatcher(input: z.infer<typeof DispatcherInputSchema>) {
  return flow(input);
}