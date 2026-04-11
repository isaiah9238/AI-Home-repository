import 'dotenv/config';
import { googleAI } from '@genkit-ai/google-genai';
import { genkit } from 'genkit';

// 1. Explicitly pull the key to verify it exists
const apiKey = process.env.GOOGLE_GENAI_API_KEY || process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("⚠️ CABINET_OFFLINE: No API Key found. Gemini will fail.");
}

export const ai = genkit({
  plugins: [
    googleAI({ apiKey: apiKey })
  ],
  model: 'googleai/gemini-1.5-pro', // Using the stable 1.5 Pro for multi-agent reasoning
});