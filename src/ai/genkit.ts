import 'dotenv/config';
import { vertexAI } from '@genkit-ai/vertexai';
import { genkit } from 'genkit';

/**
 * @fileOverview Global Genkit configuration.
 * Switched to Vertex AI for enterprise-grade performance and reliability.
 */

export const ai = genkit({
  plugins: [
    vertexAI({ location: 'us-central1' }),
  ],
  // Defaulting to the high-speed Gemini 2.5 Flash model
  model: 'vertexai/gemini-2.5-flash', 
});