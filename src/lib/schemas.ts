import { z } from 'zod';

export const AuditSchema = z.object({
  agent: z.literal('Code_Inspector'),
  timestamp: z.string().datetime(),
  fileName: z.string().min(1),
  originalCode: z.string(),
  fixedCode: z.string(),
  analysis: z.record(z.any()).optional(),
  status: z.enum(['SUCCESS', 'FAILED', 'PENDING']),
});

export type AuditEntry = z.infer<typeof AuditSchema>;