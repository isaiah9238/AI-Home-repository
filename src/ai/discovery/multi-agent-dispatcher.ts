'use client';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { analyzeCodeSnippet } from '@/ai/domains/research/analyze-code-snippet';
import { generateInitialFiles } from '@/ai/discovery/generate-initial-files';
import { mentorAi } from '@/ai/discovery/mentor-ai';
import { webIntel } from '@/ai/discovery/web-intel';

const DispatcherInputSchema = z.object({
  request: z.string(),
  agenticContext: z.string().optional().describe("Collective memory fragments from other agents"),
  userProfile: z.any().optional(),
});

const AgentChoiceSchema = z.object({
  agent: z.enum(['architect', 'code_inspector', 'web_intel', 'general_mentor']),
  detectedLanguage: z.string().optional().describe('Extracted language dimension if parsing a raw code segment.'),
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

      // 1. Generate classification using high-fidelity vector checks
      const response = await ai.generate({
        model: 'googleai/gemini-2.5-flash',
        prompt: `
          You are the central multi-agent dispatcher for the AI Home Cabinet. 
          Analyze the request payload and isolate the objective destination node:
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
      const lang = response.output?.detectedLanguage || 'typescript';

      // 2. Direct routing to the selected flow wrapper
      switch (agent) {
        case 'architect':
          return await generateInitialFiles({ blueprint: input.request });
        case 'code_inspector':
          // Enhanced: Feeds extracted language dimensions directly down to the auditor
          return await analyzeCodeSnippet({ code: input.request, language: lang });
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

export async function multiAgentDispatcher(input: z.infer<typeof DispatcherInputSchema>) {
  return flow(input);
}