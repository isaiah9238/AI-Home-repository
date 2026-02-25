'use server';

/**
 * @fileOverview A flow to analyze code snippets for bugs, vulnerabilities, and performance.
 *
 * - analyzeCodeSnippet - A function that handles the code analysis process.
 * - AnalyzeCodeSnippetInput - The input type for the analyzeCodeSnippet function.
 * - AnalyzeCodeSnippetOutput - The return type for the analyzeCodeSnippet function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeCodeSnippetInputSchema = z.object({
  code: z.string().describe('The source code to analyze.'),
  language: z.string().describe('The programming language of the code.'),
});
export type AnalyzeCodeSnippetInput = z.infer<typeof AnalyzeCodeSnippetInputSchema>;

const AnalyzeCodeSnippetOutputSchema = z.object({
  complexity: z.string().describe('Analysis of the code complexity.'),
  bugs: z.string().describe('Identification of potential bugs.'),
  vulnerabilities: z.string().describe('Analysis of security vulnerabilities.'),
  suggestedFixes: z.string().describe('Recommended fixes for identified issues.'),
});
export type AnalyzeCodeSnippetOutput = z.infer<typeof AnalyzeCodeSnippetOutputSchema>;

export async function analyzeCodeSnippet(input: AnalyzeCodeSnippetInput): Promise<AnalyzeCodeSnippetOutput> {
  return analyzeCodeSnippetFlow(input);
}

const analyzePrompt = ai.definePrompt({
  name: 'analyzeCodeSnippetPrompt',
  input: {schema: AnalyzeCodeSnippetInputSchema},
  output: {schema: AnalyzeCodeSnippetOutputSchema},
  prompt: `You are an expert senior software engineer and security researcher.
Analyze the following {{{language}}} code for complexity, potential bugs, security vulnerabilities, and provide suggested fixes.

Code:
\`\`\`{{{language}}}
{{{code}}}
\`\`\`

Provide a detailed and constructive analysis for each field in the output schema.`,
});

const analyzeCodeSnippetFlow = ai.defineFlow(
  {
    name: 'analyzeCodeSnippetFlow',
    inputSchema: AnalyzeCodeSnippetInputSchema,
    outputSchema: AnalyzeCodeSnippetOutputSchema,
  },
  async input => {
    const {output} = await analyzePrompt(input);
    return output!;
  }
);