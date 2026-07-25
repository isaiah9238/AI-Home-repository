import { z } from "genkit";

/**
 * Zod Schema for File Nodes
 * Requires path, strict 'file' discriminator type, and full code content payload.
 */
export const FileNodeSchema = z.object({
  path: z.string().describe("Relative file path, e.g., src/components/Button.tsx"),
  type: z.literal("file"),
  content: z.string().describe("Full, executable source code content. Never leave empty."),
});

/**
 * Zod Schema for Directory Nodes
 * Omits 'content' entirely to enforce schema-level directory boundaries.
 */
export const DirectoryNodeSchema = z.object({
  path: z.string().describe("Relative directory path, e.g., src/components"),
  type: z.literal("directory"),
});

/**
 * Discriminated Union Schema preventing directories from having content
 */
export const GeneratedFileSchema = z.discriminatedUnion("type", [
  FileNodeSchema,
  DirectoryNodeSchema,
]);

/**
 * Input Schema for Architect File Generation
 */
export const GenerateFilesInputSchema = z.object({
  blueprint: z
    .string()
    .max(10000, "Blueprint exceeds maximum allowed length of 10,000 characters."),
  enableVectorRAG: z.boolean().default(true),
});

// TypeScript Types Derived from Zod Schemas
export type FileNode = z.infer<typeof FileNodeSchema>;
export type DirectoryNode = z.infer<typeof DirectoryNodeSchema>;
export type GeneratedFile = z.infer<typeof GeneratedFileSchema>;
export type GenerateFilesInput = z.infer<typeof GenerateFilesInputSchema>;