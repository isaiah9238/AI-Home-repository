import 'dotenv/config';
import { googleAI } from '@genkit-ai/google-genai';
import { genkit } from 'genkit';

/**
 * @fileOverview Global Genkit configuration.
 * Migrated to Google GenAI for Gemini 2.0 Flash support.
 */

export const ai = genkit({
  plugins: [
    googleAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY }),
  ],
  // UPDATED: Moving from deprecated 2.0 to the current 2.5 Flash
  model: 'googleai/gemini-2.5-flash', 
});