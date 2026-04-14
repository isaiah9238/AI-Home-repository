import 'dotenv/config';
import { googleAI } from '@genkit-ai/google-genai';
import { genkit } from 'genkit';

/**
 * @fileOverview Global Genkit configuration.
 * Retired @genkit-ai/vertexai in favor of @genkit-ai/google-genai for enhanced latency and Gemini 2.5 access.
 */

export const ai = genkit({
  plugins: [
    googleAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY }),
  ],
  // Defaulting to the high-speed Gemini 2.5 Flash model via Google AI
  model: 'googleai/gemini-2.5-flash', 
});