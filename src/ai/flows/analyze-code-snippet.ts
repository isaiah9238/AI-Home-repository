'use server';
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const analyzeCodeSnippet = ai.defineFlow(
  {
    name: 'analyzeCodeSnippet',
    inputSchema: z.object({
      code: z.string(),
      language: z.string(),
    }),
    // ... your schema ...
  },
  async (input) => {
    // The logic stays, but it uses 'ai.generate' now
    const response = await ai.generate({
       prompt: `Analyze this ${input.language} code: ${input.code}`
    });
    return { analysis: response.text };
  }
);