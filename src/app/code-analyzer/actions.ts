'use server';

import { z } from 'zod';
import { analyzeCodeSnippet } from '@/ai/domains/research/analyze-code-snippet';
import { filterUserInput } from '@/ai/domains/safety/filter-user-input';
import { adminDb } from '@/lib/firebaseAdmin';

const CodeAnalysisSchema = z.object({
  code: z
    .string({ required_error: 'Code snippet is required.' })
    .min(10, { message: 'Code snippet must be at least 10 characters long.' }),
  language: z
    .string({ required_error: 'Please select a language.' })
    .min(1, { message: 'Please select a language.' }),
});

export type CodeAnalysisState = {
  message?: string | null;
  errors?: {
    code?: string[];
    language?: string[];
  };
  data?: {
    complexity: string;
    bugs: string;
    vulnerabilities: string;
    suggestedFixes: string;
  } | null;
};

export async function performCodeAnalysis(
  prevState: CodeAnalysisState,
  formData: FormData
): Promise<CodeAnalysisState> {
  const validatedFields = CodeAnalysisSchema.safeParse({
    code: formData.get('code'),
    language: formData.get('language'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please check your input.',
      data: null,
    };
  }

  const { code, language } = validatedFields.data;

  try {
    // 🛡️ Safety: Filter User Input
    const filterResult = await filterUserInput({ text: code });
    if (!filterResult.isAppropriate) {
      return {
        message: `SIGNAL_REJECTED: ${filterResult.reason || 'Input violates safety protocols.'}`,
        errors: {},
        data: null,
      };
    }

    // 🔍 Analysis: Execute Inspector Flow
    const analysisResult = await analyzeCodeSnippet({ code, language });

    if (analysisResult) {
      // 📚 LIBRARIAN HANDSHAKE
      try {
        await adminDb.collection('internal_comms').add({
          agent: 'Code Inspector',
          action: 'security_audit',
          language,
          timestamp: new Date().toISOString(),
          status: 'SUCCESS'
        });
      } catch (dbError) {
        console.error("Librarian logging failed:", dbError);
      }

      // Return strictly plain strings
      return { 
        message: 'Analysis successful.',
        data: {
          complexity: String(analysisResult.complexity || 'N/A'),
          bugs: String(analysisResult.bugs || 'NONE'),
          vulnerabilities: String(analysisResult.vulnerabilities || 'NONE'),
          suggestedFixes: String(analysisResult.suggestedFixes || '')
        }, 
        errors: {}
      };
    } else {
      return { message: 'Analysis failed: Inspector offline.', data: null, errors: {} };
    }
  } catch (error: any) {
    console.error('Code analysis error:', error);
    return { 
      message: `SYSTEM_ERROR: ${error?.message || "Unknown error."}`, 
      data: null, 
      errors: {} 
    };
  }
} // <--- This last brace closes the whole function
