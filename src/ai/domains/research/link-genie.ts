import { ai } from '../../genkit';
import { z } from 'genkit';

export const linkGenie = ai.defineFlow(
  {
    name: 'linkGenie',
    inputSchema: z.object({ url: z.string() }),
    outputSchema: z.object({ summary: z.string(), keyPoints: z.array(z.string()) }),
  },
  async (input) => {
    console.log(`Flux Echo fetching: ${input.url}`);
    
    try {
      const response = await fetch(input.url);
      if (!response.ok) throw new Error(`Failed to fetch ${input.url}`);
      
      const html = await response.text();
      // Simple truncation to avoid token limits and strip HTML tags
      const cleanText = html.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').slice(0, 15000);

      const { output } = await ai.generate({
        prompt: `
          You are Flux Echo, a research scout. 
          Analyze the following web page content from ${input.url}.
          Provide a concise summary and extract key points.
          
          Content:
          ${cleanText}
        `,
        output: {
          schema: z.object({
            summary: z.string(),
            keyPoints: z.array(z.string())
          })
        }
      });

      return output || { summary: "No output generated", keyPoints: [] };

    } catch (e) {
      console.error(e);
      return {
        summary: `Failed to retrieve content from ${input.url}. It might be blocked or unavailable.`,
        keyPoints: ['Error: Could not fetch or process URL']
      };
    }
  }
);