import { ai } from '../genkit';
import { z } from 'genkit';

const FileSchema = z.object({
  path: z.string().describe("The relative file path, e.g., 'src/components/Header.tsx'"),
  content: z.string().optional().describe("Full boilerplate content for the file"),
  type: z.enum(['file', 'directory']).describe("The node type in the file system")
});

/**
 * @fileOverview The Architect Flow
 * 
 * Transforms conceptual blueprints into high-fidelity file structures.
 */
export const generateInitialFiles = ai.defineFlow(
  {
    name: 'generateInitialFiles',
    inputSchema: z.object({ blueprint: z.string() }),
    outputSchema: z.array(FileSchema),
  },
  async (input) => {
    const { output } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-exp',
      prompt: `
        You are The Architect, a high-fidelity 3D printer for software architecture residing in the AI Home Cabinet.
        Your task is to transform a conceptual blueprint into a production-ready file system structure.
        
        BLUEPRINT: ${input.blueprint}
        
        CONSTRUCTION_RULES:
        1. Design a logical, scalable folder structure based on modern best practices (e.g., Domain-Driven Design).
        2. Identify all necessary directories (type: 'directory').
        3. Identify all necessary files (type: 'file').
        4. CRITICAL: For core configuration files (e.g., package.json, tsconfig.json, tailwind.config.ts, README.md) and main entry points (e.g., page.tsx, layout.tsx, main.py), provide FULL, VALID, and WORKING boilerplate code in the 'content' field.
        5. Ensure paths are relative and clean.
        6. Do not omit necessary files; be comprehensive enough to allow a developer to start coding immediately.
        
        OUTPUT: Return a structured array of file objects.
      `,
      output: {
        schema: z.array(FileSchema)
      }
    });

    return output || [];
  }
);
