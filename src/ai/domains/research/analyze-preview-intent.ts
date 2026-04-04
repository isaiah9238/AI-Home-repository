import { ai } from '../../genkit';
import { z } from 'genkit';

/**
 * @fileOverview The Preview Intent Agent.
 * Analyzes code snippets to determine their intent and provides a sanitized, 
 * previewable version wrapped in necessary CDNs and styles.
 */

const flow = ai.defineFlow(
  {
    name: 'analyzePreviewIntent',
    inputSchema: z.object({ 
      code: z.string(),
      context: z.string().optional()
    }),
    outputSchema: z.object({
      intent: z.string().describe("AI analysis of what the code is attempting to achieve."),
      techStack: z.array(z.string()).describe("Identified libraries or frameworks (e.g., Tailwind, React, Lucide)."),
      previewCode: z.string().describe("The full, self-contained HTML/CSS/JS code ready for srcDoc rendering."),
      requirements: z.string().describe("Any external dependencies needed for the preview.")
    }),
  },
  async (input) => {
    const { output } = await ai.generate({
      model: 'googleai/gemini-2.5-pro',
      prompt: `
        You are the "Execution Intent Agent," a specialist in synthesizing preview environments within the AI Home Cabinet.
        
        TASK:
        1. Analyze the provided code snippet and determine its architectural intent.
        2. Transform the snippet into a self-contained HTML file that can run in an iframe's srcDoc.
        3. If it's a React component, wrap it in a basic React/Babel setup using CDNs.
        4. If it uses Tailwind classes, include the Tailwind CDN.
        5. Ensure all icons (if lucide-react is used) are handled via Lucide CDN or SVG equivalents.
        6. Aesthetically match the Cabinet's Cybernetic HUD theme (Dark mode, neon accents).
        
        CODE:
        ${input.code}
        
        CONTEXT:
        ${input.context || 'General Preview'}
      `,
      output: {
        schema: z.object({
          intent: z.string(),
          techStack: z.array(z.string()),
          previewCode: z.string(),
          requirements: z.string()
        })
      }
    });

    return output || {
      intent: "Analysis failed",
      techStack: [],
      previewCode: "<html><body><p>SYNC_ERROR: Intent analysis failed.</p></body></html>",
      requirements: "None identified"
    };
  }
);

/**
 * analyzePreviewIntent - Asynchronous wrapper for the Preview Intent flow.
 */
export async function analyzePreviewIntent(input: { code: string, context?: string }) {
  return flow(input);
}
