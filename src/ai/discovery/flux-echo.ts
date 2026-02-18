'use server';

import { z } from 'genkit';
import { ai } from '@/ai/genkit';

export const fluxEcho = ai.defineFlow(
  {
    name: 'fluxEcho',
    inputSchema: z.string().url({ message: "Invalid URL provided." }),
    outputSchema: z.object({
      summary: z.string(),
      suggestedActions: z.array(z.string()),
    }),
  },
  async (url: string) => {
    let htmlContent: string;
    try {
      const pageResponse = await fetch(url);
      if (!pageResponse.ok) {
        throw new Error(`Request failed with status: ${pageResponse.statusText}`);
      }
      htmlContent = await pageResponse.text();
    } catch (error: any) {
        console.error(`Error fetching URL ${url}:`, error);
        throw new Error(`Failed to fetch URL. ${error.message || ''}`);
    }

    const response = await ai.generate({
      prompt: `You are FluxEcho, a web content summarizer. I have fetched the raw HTML content of a webpage for you. Your task is to extract the main article or primary content from the HTML, ignoring navigation, ads, and footers. Once you have the main content, epitomize it into 3 concise, high-impact bullet points.

URL of the content: ${url}

Raw HTML:
---
${htmlContent}
---
`,
    });

    return {
      summary: response.text,
      suggestedActions: ["Share", "Save"],
    };
  }
);
