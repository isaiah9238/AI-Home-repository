'use server';

/**
 * @fileOverview A flow to generate initial files and folder structure for a new AI project.
 *
 * - generateInitialFiles - A function that handles the generation of initial files and folder structure.
 * - GenerateInitialFilesInput - The input type for the generateInitialFiles function.
 * - GenerateInitialFilesOutput - The return type for the generateInitialFiles function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInitialFilesInputSchema = z.object({
  projectName: z.string().describe('The name of the AI project.'),
});
export type GenerateInitialFilesInput = z.infer<typeof GenerateInitialFilesInputSchema>;

const GenerateInitialFilesOutputSchema = z.object({
  files: z.array(
    z.object({
      filePath: z.string().describe('The path of the file.'),
      content: z.string().describe('The content of the file.'),
    })
  ).describe('The generated files for the project.'),
});
export type GenerateInitialFilesOutput = z.infer<typeof GenerateInitialFilesOutputSchema>;

export async function generateInitialFiles(input: GenerateInitialFilesInput): Promise<GenerateInitialFilesOutput> {
  return generateInitialFilesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInitialFilesPrompt',
  input: {schema: GenerateInitialFilesInputSchema},
  output: {schema: GenerateInitialFilesOutputSchema},
  prompt: `You are an expert AI project initializer. Generate the initial files and folder structure for a new AI project named "{{{projectName}}}".

The files should include:
- next.config.js: Basic Next.js configuration.
- package.json: Basic package.json with dependencies like next, react, react-dom, and genkit.
- tsconfig.json: Basic TypeScript configuration.
- src/app/page.tsx: A basic Next.js page.
- src/ai/genkit.ts: Genkit initialization file.
- src/ai/flows/example-flow.ts: An example Genkit flow.

Ensure the output is a JSON array of file objects with "filePath" and "content" fields.`,
});

const generateInitialFilesFlow = ai.defineFlow(
  {
    name: 'generateInitialFilesFlow',
    inputSchema: GenerateInitialFilesInputSchema,
    outputSchema: GenerateInitialFilesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
