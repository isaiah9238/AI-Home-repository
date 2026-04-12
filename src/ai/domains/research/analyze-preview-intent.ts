
import { ai } from '../../genkit';
import { z } from 'genkit';

/**
 * @fileOverview The Execution Intent Agent (Vertex Edition).
 * Analyzes code snippets through the lens of the Cabinet's collective agentic memory.
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
      requirements: z.string().describe("Any external dependencies needed for the preview."),
      neuralLinkStatus: z.string().optional().describe("Confirmation of coordination with external agent signals.")
    }),
  },
  async (input) => {
    const { output } = await ai.generate({
      model: 'vertexai/gemini-1.5-flash',
      prompt: `
        You are the "Execution Intent Agent," the core of the Cabinet's Neural Link.
        
        TASK:
        1. Analyze the provided code snippet and determine its architectural intent.
        2. If NEURAL_CONTEXT is provided, treat it as "Collective Agentic Memory" from other nodes (Flux Echo, The Architect, etc.). Ground your analysis and the synthesized code in these signals.
        3. Transform the snippet into a high-fidelity, self-contained HTML file that can run in an iframe's srcDoc.
        4. Match the Cabinet's Cybernetic HUD aesthetic: #050505 background, neon accents (#00A8E8, #A855F7, #4ADE80).
        5. If it uses Tailwind classes, include the Tailwind CDN.
        6. If it's a React component, use the React and Babel standalone CDNs.
        
        NEURAL_CONTEXT (Agentic Signals):
        ${input.context || 'NO_EXTERNAL_SIGNALS_DETECTED'}
        
        CODE_STREAM:
        ${input.code}
      `,
      output: {
        schema: z.object({
          intent: z.string(),
          techStack: z.array(z.string()),
          previewCode: z.string(),
          requirements: z.string(),
          neuralLinkStatus: z.string().optional()
        })
      }
    });

    return output || {
      intent: "Analysis failed",
      techStack: [],
      previewCode: "<html><body style='background:#050505;color:#ef4444;font-family:monospace;padding:2rem;'>SYNC_ERROR: Neural Link Interrupted.</body></html>",
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
