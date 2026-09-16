"use strict";
/**
 * @fileOverview The entry point for the Cabinet's Cloud Functions (Google AI Edition).
 *
 * This file initializes the Librarian's background processing unit
 * using Genkit and Google AI.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.librarianIndexer = void 0;
const app_1 = require("firebase-admin/app");
const genkit_1 = require("genkit");
const google_genai_1 = require("@genkit-ai/google-genai");
const https_1 = require("firebase-functions/https");
const params_1 = require("firebase-functions/params");
const v2_1 = require("firebase-functions/v2");
const firebase_1 = require("@genkit-ai/firebase");
// 1. Initialize Firebase Admin
(0, app_1.initializeApp)();
// 2. Define Secrets
const apiKey = (0, params_1.defineSecret)("GOOGLE_GENAI_API_KEY");
// 3. Global Configuration
(0, v2_1.setGlobalOptions)({ maxInstances: 10 });
// 4. Initialize Genkit with Google AI
const ai = (0, genkit_1.genkit)({
    plugins: [
        (0, google_genai_1.googleAI)({ apiKey: process.env.GOOGLE_GENAI_API_KEY })
    ],
    model: "googleai/gemini-2.5-flash",
});
(0, firebase_1.enableFirebaseTelemetry)();
/**
 * FLOW: Librarian Indexer
 *
 * A background utility to process raw data into the Cabinet's structured
 * format.
 */
const librarianIndexerFlow = ai.defineFlow({
    name: "librarianIndexer",
    inputSchema: genkit_1.z.object({
        content: genkit_1.z.string().describe("Raw text content to be indexed"),
        context: genkit_1.z.string().optional().describe("Optional metadata or context"),
    }),
    outputSchema: genkit_1.z.object({
        tags: genkit_1.z.array(genkit_1.z.string()).describe("List of identified keywords"),
        summary: genkit_1.z.string().describe("A concise 1-sentence summary"),
        sentiment: genkit_1.z.enum(["positive", "neutral", "negative", "critical"])
            .describe("The tone of the content"),
        priority: genkit_1.z.number().min(1).max(5)
            .describe("Architectural priority level"),
    }),
}, async (input) => {
    const { output } = await ai.generate({
        prompt: `
        You are the Librarian's Background Indexer. 
        Analyze the following data stream for the Cabinet.
        
        CONTENT: ${input.content}
        CONTEXT: ${input.context || "General Processing"}
        
        TASK:
        1. Extract relevant technical or domain-specific tags.
        2. Provide a high-fidelity summary.
        3. Identify the neural sentiment.
        4. Assign an architectural priority from 1 (Low) to 5.
      `,
        output: {
            schema: genkit_1.z.object({
                tags: genkit_1.z.array(genkit_1.z.string()),
                summary: genkit_1.z.string(),
                sentiment: genkit_1.z.enum(["positive", "neutral", "negative", "critical"]),
                priority: genkit_1.z.number(),
            }),
        },
    });
    if (!output) {
        throw new Error("Architecture Synthesis failed: Output is null.");
    }
    return output;
});
/**
 * FUNCTION: librarianIndexer
 *
 * Callable function for the Next.js frontend or other Cabinet agents.
 */
exports.librarianIndexer = (0, https_1.onCallGenkit)({
    secrets: [apiKey],
    cors: true,
    invoker: "public",
}, librarianIndexerFlow);
//# sourceMappingURL=index.js.map