
import { ai } from '../genkit';
import { z } from 'genkit';

/**
 * @fileOverview The Discovery Tutor: Plan Generation (Vertex Edition)
 * 
 * - generateLessonPlan - Logic for synthesizing structured Markdown lesson plans.
 */

const flow = ai.defineFlow(
  {
    name: 'generateLessonPlan',
    inputSchema: z.object({ subject: z.string() }),
    outputSchema: z.string(),
  },
  async (input) => {
    const { text } = await ai.generate({
      model: 'vertexai/gemini-2.5-pro',
      prompt: `
        ROLE: You are the "Discovery Tutor," a high-fidelity educator residing in the AI Home Cabinet.
        TASK: Create a detailed, structured, and technical lesson plan for the coordinate: "${input.subject}".
        
        CONSTRUCTION_RULES:
        1. Use clear Markdown formatting (headings, lists, code blocks).
        2. Ensure the content is production-grade and technically accurate.
        3. Include a "Conceptual Overview," "Core Logic," and a "Practical Exercise."
        4. Maintain a supportive yet professional terminal-style tone.
        
        OUTPUT: Return the full Markdown plan.
      `,
    });

    return text || "SIGNAL_LOST: The Tutor could not synthesize the plan.";
  }
);

/**
 * generateLessonPlan - Standard function wrapper for the Tutor flow.
 */
export async function generateLessonPlan(input: { subject: string }) {
  return flow(input);
}
