'use server';

/**
 * @fileOverview Code analysis AI agent.
 *
 * - analyzeCodeSnippet - Analyzes code snippets for bugs, vulnerabilities, and performance bottlenecks.
 * - AnalyzeCodeSnippetInput - The input type for the analyzeCodeSnippet function.
 * - AnalyzeCodeSnippetOutput - The return type for the analyzeCodeSnippet function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeCodeSnippetInputSchema = z.object({
  code: z.string().describe('The code snippet to analyze.'),
  language: z.string().describe('The programming language of the code snippet.'),
});
export type AnalyzeCodeSnippetInput = z.infer<typeof AnalyzeCodeSnippetInputSchema>;

const AnalyzeCodeSnippetOutputSchema = z.object({
  analysis: z.object({
    complexity: z.string().describe('The complexity of the code snippet.'),
    bugs: z.string().describe('Potential bugs in the code snippet.'),
    vulnerabilities: z
      .string()
      .describe('Potential security vulnerabilities in the code snippet.'),
    suggestedFixes: z.string().describe('Suggested fixes for the code snippet.'),
  }),
});
export type AnalyzeCodeSnippetOutput = z.infer<typeof AnalyzeCodeSnippetOutputSchema>;

export async function analyzeCodeSnippet(
  input: AnalyzeCodeSnippetInput
): Promise<AnalyzeCodeSnippetOutput> {
  return analyzeCodeSnippetFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeCodeSnippetPrompt',
  input: {schema: AnalyzeCodeSnippetInputSchema},
  output: {schema: AnalyzeCodeSnippetOutputSchema},
  prompt: `You are a senior software engineer specializing in code analysis.

You will analyze the given code snippet for potential bugs, security vulnerabilities, and performance bottlenecks.

Language: {{{language}}}
Code:
```{{{code}}}```

Provide a detailed analysis including complexity, bugs, vulnerabilities, and suggested fixes.
`,
});

const analyzeCodeSnippetFlow = ai.defineFlow(
  {
    name: 'analyzeCodeSnippetFlow',
    inputSchema: AnalyzeCodeSnippetInputSchema,
    outputSchema: AnalyzeCodeSnippetOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
