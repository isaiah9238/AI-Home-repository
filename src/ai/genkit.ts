
import 'dotenv/config';
import { vertexAI } from '@genkit-ai/vertexai';
import { genkit } from 'genkit';

/**
 * @fileOverview Global Genkit configuration.
 * Switched to Vertex AI for enterprise-grade production readiness.
 */

export const ai = genkit({
  plugins: [
    vertexAI({
      location: 'us-central1', // Standard production region
    })
  ],
  model: 'vertexai/gemini-2.5-flash', // High-fidelity flash model for production throughput
});
