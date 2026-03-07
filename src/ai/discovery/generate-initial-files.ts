import { ai } from '../genkit';
import { z } from 'genkit';

const FileSchema = z.object({
  path: z.string(),
  content: z.string().optional(),
  type: z.enum(['file', 'directory'])
});

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
        You are The Architect, a high-fidelity 3D printer for software architecture. 
        Your task is to transform a conceptual blueprint into a production-ready file system structure.
        
        BLUEPRINT: ${input.blueprint}
        
        CONSTRUCTION_RULES:
        1. Design a logical, scalable folder structure based on modern best practices.
        2. Identify all necessary directories (type: 'directory').
        3. Identify all necessary files (type: 'file').
        4. For core configuration files (e.g., package.json, tsconfig.json, tailwind.config.ts, README.md) and main entry points (e.g., page.tsx, main.py), provide full, valid boilerplate code in the 'content' field.
        5. Ensure paths are relative and clean (e.g., 'src/components/Button.tsx').
        
        OUTPUT: Return a structured array of file objects. Be comprehensive.
      `,
      output: {
        schema: z.array(FileSchema)
      }
    });

    return output || [];
  }
);
