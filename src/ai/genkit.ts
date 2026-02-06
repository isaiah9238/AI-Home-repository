import { genkit, z } from 'genkit';
// @ts-ignore - The module is verified on disk via 'ls'
import { googleAI, gemini15Flash } from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI()],
  model: gemini15Flash,
});