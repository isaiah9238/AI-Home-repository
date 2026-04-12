import { ai } from '../../genkit';
import { z } from 'genkit';

/**
 * @fileOverview The Variation Agent.
 * Generates multiple variations of a base code snippet based on instructions.
 */

const flow = ai.defineFlow(
  {
    name: 'generateCodeVariations',
    inputSchema: z.object({ 
      baseCode: z.string(),
      instructions: z.string().describe("What changes or variations to apply to the base code."),
      count: z.number().default(3).describe("Number of variations to generate.")
    }),
    outputSchema: z.array(z.object({
      id: z.string(),
      code: z.string().describe("The modified code snippet."),
      intent: z.string().describe("What this specific variation is trying to achieve."),
      techStack: z.array(z.string()).describe("Any new libraries or frameworks introduced.")
    })),
  },
  async (input) => {
    const { output } = await ai.generate({
      model: 'googleai/gemini-1.5-flash',
      prompt: `
        You are the "Variation Agent," a specialist in exploratory code branching within the AI Home Cabinet.
        
        TASK:
        1. Take the PROVIDED BASE CODE and generate exactly ${input.count} variations.
        2. Follow these instructions for the variations: ${input.instructions}
        3. For each variation, provide a unique ID (e.g., var_1, var_2).
        4. Ensure each variation is structurally sound and follows the intent.
        5. Return a clean array of variations.
        
        BASE CODE:
        ${input.baseCode}
      `,
      output: {
        schema: z.array(z.object({
          id: z.string(),
          code: z.string(),
          intent: z.string(),
          techStack: z.array(z.string())
        }))
      }
    });

    return output || [];
  }
);

/**
 * generateCodeVariations - Asynchronous wrapper for the Variation Agent flow.
 */
export async function generateCodeVariations(input: { baseCode: string, instructions: string, count?: number }) {
  return flow(input);
}
