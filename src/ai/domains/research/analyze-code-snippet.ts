
import { ai } from '../../genkit';
import { z } from 'genkit';

/**
 * @fileOverview Code Inspector Flow (Vertex Edition)
 */
const flow = ai.defineFlow(
  {
    name: 'analyzeCodeSnippet',
    inputSchema: z.object({ 
      code: z.string(),
      language: z.string().optional()
    }),
    outputSchema: z.object({
      complexity: z.string(),
      bugs: z.string(),
      vulnerabilities: z.string(),
      suggestedFixes: z.string(),
    }),
  },
  async (input) => {
    const { output } = await ai.generate({
      model: 'vertexai/gemini-2.5-pro',
      prompt: `
        You are the "Code Inspector," a specialized security and performance auditor within the AI Home Cabinet.
        
        TASK:
        Analyze the provided ${input.language || 'source'} code for:
        1. Logical bugs and edge cases.
        2. Security vulnerabilities (OWASP, memory leaks, etc.).
        3. Complexity and performance bottlenecks.
        4. Clear, actionable fixes.
        
        CODE:
        ${input.code}
      `,
      output: {
        schema: z.object({
          complexity: z.string(),
          bugs: z.string(),
          vulnerabilities: z.string(),
          suggestedFixes: z.string(),
        })
      }
    });

    return output || {
      complexity: "Analysis failed",
      bugs: "Analysis failed",
      vulnerabilities: "Analysis failed",
      suggestedFixes: "No fixes available"
    };
  }
);

/**
 * analyzeCodeSnippet - Standard function wrapper for the CodeInspector flow.
 */
export async function analyzeCodeSnippet(input: { code: string, language?: string }) {
  return flow(input);
}
