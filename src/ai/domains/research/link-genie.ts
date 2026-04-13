
import { ai } from '../../genkit';
import { z } from 'genkit';
import { filterAIOutput } from '../safety/filter-ai-output';

/**
 * @fileOverview Flux Echo Flow (Vertex Edition)
 */
const flow = ai.defineFlow(
  {
    name: 'linkGenie',
    inputSchema: z.object({ url: z.string().url() }),
    outputSchema: z.object({ 
      summary: z.string(), 
      keyPoints: z.array(z.string()),
      title: z.string().optional()
    }),
  },
  async (input) => {
    console.log(`[Scout] Flux Echo fetching: ${input.url}`);
    
    try {
      const response = await fetch(input.url);
      if (!response.ok) throw new Error(`Failed to fetch ${input.url}: ${response.statusText}`);
      
      const html = await response.text();
      const cleanText = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
        .replace(/<[^>]*>?/gm, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 20000);

      const { output } = await ai.generate({
        model: 'vertexai/gemini-2.5-flash',
        prompt: `
          You are Flux Echo, a high-speed research scout. 
          Analyze the following web page content from ${input.url}.
          
          TASK:
          1. Provide a concise, high-impact summary (max 3 sentences).
          2. Extract exactly 5 key points or "signals".
          3. Extract the page title if possible.
          
          CONTENT:
          ${cleanText}
        `,
        output: {
          schema: z.object({
            title: z.string(),
            summary: z.string(),
            keyPoints: z.array(z.string()).length(5)
          })
        }
      });

      if (!output) throw new Error("No intelligence generated.");

      // 🛡️ Safety Check: AI Output
      const combinedText = `${output.title} ${output.summary} ${output.keyPoints.join(' ')}`;
      const outputSafety = await filterAIOutput({ text: combinedText });
      
      if (!outputSafety.isSafe) {
        return {
          title: "Intelligence Redacted",
          summary: "The reconnaissance report triggered a safety protocol and was redacted.",
          keyPoints: ["REASON: Sensitive material detected in stream", "STATUS: Redacted", "ACTION: Manual review required", "SIGNAL: Neutralized", "COORD: Maintained"]
        };
      }

      return output;

    } catch (e: any) {
      console.error(`[Scout Error] ${e.message}`);
      return {
        title: "Reconnaissance Failed",
        summary: `Targeted URL [${input.url}] is unreachable or protected by counter-intelligence (bots).`,
        keyPoints: [
          'Error: Connection refused or timeout',
          'Potential: Bot detection active',
          'Action: Verify URL accessibility manually',
          'Signal: System integrity maintained',
          'Status: Awaiting new coordinates'
        ]
      };
    }
  }
);

/**
 * linkGenie - Standard function wrapper for the Flux Echo flow.
 */
export async function linkGenie(input: { url: string }) {
  return flow(input);
}
