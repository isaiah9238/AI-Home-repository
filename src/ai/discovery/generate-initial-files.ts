import 'server-only'; // 🛡️ Isolated server-only execution boundary

import { ai } from '../genkit';
import { z } from 'genkit';
import { queryVFSContext } from '@/ai/storage/vector-sync';

const FileSchema = z.object({
  path: z.string().describe("The relative file path, e.g., 'src/components/Header.tsx'"),
  content: z.string().optional().describe("Full boilerplate content for the file"),
  type: z.enum(['file', 'directory']).describe("The node type in the file system")
});

export type GeneratedFileNode = z.infer<typeof FileSchema>;

/**
 * @fileOverview The Architect Flow (Google AI Edition with Semantic Memory)
 */
const flow = ai.defineFlow(
  {
    name: 'generateInitialFiles',
    inputSchema: z.object({ 
      blueprint: z.string(),
      enableVectorRAG: z.boolean().optional().default(true)
    }),
    outputSchema: z.array(FileSchema),
  },
  async (input) => {
    let semanticContext = '';

    // 🟢 RAG MEMORY HOOK: Query VFS Semantic Vector Memory
    if (input.enableVectorRAG) {
      try {
        const matches = await queryVFSContext(input.blueprint);
        if (matches && matches.length > 0) {
          semanticContext = `
          RELATED_HISTORICAL_VFS_NODES (SEMANTIC MEMORY):
          ${matches.map(m => `// File: ${m.path}\n${m.contentPreview}`).join('\n\n')}
          `;
        }
      } catch (err: any) {
        console.warn('ARCHITECT_WARNING: Could not fetch vector memory, proceeding with static prompt.', err.message);
      }
    }

    const { output } = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      prompt: `
        You are The Architect, a high-fidelity 3D printer for software architecture residing in the AI Home Cabinet.
        Your task is to transform a conceptual blueprint into a production-ready file system structure.
        
        BLUEPRINT: ${input.blueprint}
        
        ${semanticContext}
        
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

/**
 * generateInitialFiles - Standard function wrapper for the Architect flow.
 */
export async function generateInitialFiles(input: { blueprint: string; enableVectorRAG?: boolean }) {
  return flow(input);
}