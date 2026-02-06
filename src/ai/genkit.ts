'use server';

import { googleAI } from '@genkit-ai/google-genai'; // Updated plugin
import { genkit } from 'genkit';

export const ai = genkit({
  plugins: [
    googleAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY })
  ],
  model: 'googleai/gemini-1.5-flash-latest', // The 'latest' tag you suggested
});