/**
 * @fileOverview The entry point for the Cabinet's Cloud Functions.
 * 
 * This file initializes the Librarian's background processing unit using Genkit.
 */

import { initializeApp } from "firebase-admin/app";
import { genkit, z } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";
import { onCallGenkit } from "firebase-functions/https";
import { defineSecret } from "firebase-functions/params";
import { setGlobalOptions } from "firebase-functions/v2";

// 1. Initialize Firebase Admin
initializeApp();

// 2. Define Secrets
// The API key is stored securely in Cloud Secret Manager.
const apiKey = defineSecret("GOOGLE_GENAI_API_KEY");

// 3. Global Configuration
// Limit instances to maintain cost control and performance stability.
setGlobalOptions({ maxInstances: 10 });

// 4. Initialize Genkit
const ai = genkit({
  plugins: [
    googleAI()
  ],
  model: 'googleai/gemini-2.5-flash', // Flash is preferred for serverless latency
});

/**
 * FLOW: Librarian Indexer
 * 
 * A background utility to process raw data into the Cabinet's structured format.
 */
const librarianIndexerFlow = ai.defineFlow(
  {
    name: "librarianIndexer",
    inputSchema: z.object({
      content: z.string().describe("Raw text content to be indexed"),
      context: z.string().optional().describe("Optional metadata or context")
    }),
    outputSchema: z.object({
      tags: z.array(z.string()).describe("List of identified keywords"),
      summary: z.string().describe("A concise 1-sentence summary"),
      sentiment: z.enum(["positive", "neutral", "negative", "critical"]).describe("The tone of the content"),
      priority: z.number().min(1).max(5).describe("Architectural priority level")
    }),
  },
  async (input) => {
    const { output } = await ai.generate({
      prompt: `
        You are the Librarian's Background Indexer. 
        Analyze the following data stream for the Cabinet.
        
        CONTENT: ${input.content}
        CONTEXT: ${input.context || 'General Processing'}
        
        TASK:
        1. Extract relevant technical or domain-specific tags.
        2. Provide a high-fidelity summary.
        3. Identify the neural sentiment.
        4. Assign an architectural priority from 1 (Low) to 5 (System Critical).
      `,
      output: {
        schema: z.object({
          tags: z.array(z.string()),
          summary: z.string(),
          sentiment: z.enum(["positive", "neutral", "negative", "critical"]),
          priority: z.number()
        })
      }
    });

    return output!;
  }
);

/**
 * FUNCTION: librarianIndexer
 * 
 * Callable function for the Next.js frontend or other Cabinet agents.
 */
export const librarianIndexer = onCallGenkit(
  {
    secrets: [apiKey],
    cors: true, // Allows cross-origin requests from the Portal
    invoker: 'public', // Change to 'authenticated' once Auth is fully mapped
  },
  librarianIndexerFlow
);
