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
    // Force the plugin to use the key from your .env
    googleAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY })
  ],
  model: 'googleai/gemini-2.0-flash', 
});