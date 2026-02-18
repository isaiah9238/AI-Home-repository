'use server';

import { z } from 'genkit';
// @ts-ignore - The module is verified on disk via 'ls'
import { ai } from '@/ai/genkit';

export const webIntel = ai.defineFlow(
  {
    name: 'webIntel',
    // 1. New Input Schema: accepts a URL AND an optional question
    inputSchema: z.object({
      url: z.string().url({ message: "Invalid URL provided." }),
      query: z.string().optional().describe("Optional question to ask about the content")
    }),
    outputSchema: z.object({
      content: z.string(),
      suggestedActions: z.array(z.string()),
    }),
  },
  async ({ url, query }) => {
    let htmlContent: string;
    
    // 2. Fetch with a "Real" Browser Header
    try {
      const pageResponse = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      });
      
      if (!pageResponse.ok) {
        throw new Error(`Request failed with status: ${pageResponse.statusText}`);
      }
      htmlContent = await pageResponse.text();
    } catch (error: any) {
      console.error(`Error fetching URL ${url}:`, error);
      throw new Error(`Failed to fetch URL. ${error.message || ''}`);
    }

    // 3. Dynamic Prompting
    // If the user asked a question, we change the instructions.
    const systemInstruction = query 
      ? `You are WebIntel. The user has provided a URL (${url}) and a specific question. Answer the question based ONLY on the provided HTML content.` 
      : `You are WebIntel, a web content summarizer. Extract the main article from the HTML, ignoring navigation/ads. Epitomize it into 3 concise, high-impact bullet points.`;

    const userPrompt = query 
      ? `Question: ${query}\n\nRaw HTML:\n---\n${htmlContent}\n---`
      : `URL: ${url}\n\nRaw HTML:\n---\n${htmlContent}\n---`;

    const response = await ai.generate({
      prompt: `${systemInstruction}\n\n${userPrompt}`,
    });

    return {
      content: response.text,
      suggestedActions: ["Share", "Save", "Ask Follow-up"],
    };
  }
);