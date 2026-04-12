
import { ai } from '../../genkit';
import { z } from 'genkit';
import { filterAIOutput } from '../safety/filter-ai-output';

/**
 * @fileOverview SearchGenie Flow (Vertex Edition)
 * Simulates a scouting mission for general topics using Vertex AI.
 */
const flow = ai.defineFlow(
  {
    name: 'searchGenie',
    inputSchema: z.object({ query: z.string() }),
    outputSchema: z.object({ 
      summary: z.string(), 
      keyPoints: z.array(z.string()),
      title: z.string().optional()
    }),
  },
  async (input) => {
    try {
      const { output } = await ai.generate({
        model: 'vertexai/gemini-1.5-flash',
        prompt: `
          You are Flux Echo, conducting a "General Reconnaissance" mission.
          The user is scouting for intelligence on: "${input.query}".
          
          Use your internal knowledge to provide a high-impact scouting report.
          
          TASK:
          1. Provide a concise, high-impact summary of the current state of this topic (max 3 sentences).
          2. Extract exactly 5 key signals or trends.
          3. Provide a mission title.
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
          keyPoints: ["REASON: Sensitive material detected", "STATUS: Redacted", "ACTION: Re-verify coordinates", "SIGNAL: Neutralized", "COORD: Maintained"]
        };
      }

      return output;

    } catch (e: any) {
      return {
        title: "Reconnaissance Failed",
        summary: `The scouting mission for [${input.query}] failed to materialize.`,
        keyPoints: ['Signal lost', 'Sync interrupted', 'Coordinates unstable', 'System maintaining state', 'Awaiting new input']
      };
    }
  }
);

/**
 * searchGenie - Standard function wrapper for the General Recon flow.
 */
export async function searchGenie(input: { query: string }) {
  return flow(input);
}
