
import { googleAI } from '@genkit-ai/google-genai';
import { genkit } from 'genkit';

/**
 * @fileOverview Core Genkit configuration for the Cabinet.
 * 
 * This file initializes the AI engine with the Gemini 2.5 Pro model.
 * It uses the GOOGLE_GENAI_API_KEY for server-side authentication.
 */
export const ai = genkit({
  plugins: [
    googleAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY })
  ],
  model: 'googleai/gemini-2.5-pro', 
});
