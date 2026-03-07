import { ai } from '../../genkit';
import { z } from 'genkit';

export const epitomizeFetchedContent = ai.defineFlow(
  {
    name: 'epitomizeFetchedContent',
    inputSchema: z.object({ url: z.string().url() }),
    outputSchema: z.object({
      title: z.string(),
      epitome: z.string(),
      structuredNotes: z.array(z.object({
        heading: z.string(),
        content: z.string()
      }))
    }),
  },
  async (input) => {
    console.log(`[Epitomizer] Deep reading: ${input.url}`);
    
    try {
      const response = await fetch(input.url);
      if (!response.ok) throw new Error(`Failed to deep read ${input.url}`);
      
      const html = await response.text();
      const cleanText = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
        .replace(/<[^>]*>?/gm, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 30000); // Allow more context for deep read

      const { output } = await ai.generate({
        model: 'googleai/gemini-2.0-flash-exp',
        prompt: `
          You are the Librarian's expert Epitomizer. 
          Deep read the following content from ${input.url} and transform it into high-quality, epitomized notes.
          
          TASK:
          1. Provide a "Deep Essence" (epitome) of the entire content.
          2. Break the content down into 3-5 logical sections with headings and detailed notes.
          3. Extract the primary title of the work.
          
          CONTENT:
          ${cleanText}
        `,
        output: {
          schema: z.object({
            title: z.string(),
            epitome: z.string(),
            structuredNotes: z.array(z.object({
              heading: z.string(),
              content: z.string()
            }))
          })
        }
      });

      return output || { 
        title: "Deep Read Failed", 
        epitome: "The Epitomizer could not process the depth of this content.", 
        structuredNotes: [] 
      };

    } catch (e: any) {
      console.error(`[Epitomizer Error] ${e.message}`);
      return {
        title: "Deep Read Interrupted",
        epitome: "Structural noise or access restrictions prevented a deep read of this coordinate.",
        structuredNotes: [
          { heading: "Interference Detected", content: "The targeted data stream is either encrypted or heavily guarded." },
          { heading: "Action Required", content: "Verification of the coordinate's manual accessibility is advised." }
        ]
      };
    }
  }
);
