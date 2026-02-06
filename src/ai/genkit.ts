'use server';

import { googleAI } from '@genkit-ai/google-genai'; // Keep this one!
import { genkit } from 'genkit';

export const ai = genkit({
  plugins: [
    googleAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY })
  ],
  model: 'googleai/gemini-1.5-flash', // We removed "-latest" but kept the provider prefix
});