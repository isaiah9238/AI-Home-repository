'use server';

import { z } from 'zod';
import { analyzeCodeSnippet } from '@/ai/domains/research/analyze-code-snippet';
import { filterUserInput } from '@/ai/domains/safety/filter-user-input';
import { getAdminDb } from '@/lib/firebaseAdmin';
import { type CodeAnalysisState } from '../types';

// 1. SCHEMAS (Keep these at the top)
const CodeAnalysisSchema = z.object({
  code: z.string().min(10),
  language: z.string().min(1),
});

// 2. THE LIBRARIAN'S ARCHIVE ACTION (Standalone)
export async function getAuditHistory(limitCount = 10) {
  try {
    const db = getAdminDb();
    const snapshot = await db.collection('internal_comms')
      .where('agent', '==', 'Code Inspector')
      .orderBy('timestamp', 'desc')
      .limit(limitCount)
      .get();

    const history = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return { success: true, data: history };
  } catch (error: any) {
    console.error("LIBRARIAN_ERROR: Could not retrieve archives.", error.message);
    return { success: false, data: [], error: error.message };
  }
}

// 3. THE INSPECTOR'S ANALYSIS ACTION
export async function performCodeAnalysis(
  prevState: CodeAnalysisState,
  formData: FormData
): Promise<CodeAnalysisState> {
  const validatedFields = CodeAnalysisSchema.safeParse({
    code: formData.get('code'),
    language: formData.get('language'),
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors, message: 'Validation failed.', data: null };
  }

  const { code, language } = validatedFields.data;

  try {
    const filterResult = await filterUserInput({ text: code });
    if (!filterResult.isAppropriate) {
      return { message: `SIGNAL_REJECTED: ${filterResult.reason}`, errors: {}, data: null };
    }

    const analysisResult = await analyzeCodeSnippet({ code, language });

    if (analysisResult) {
      try {
        const db = getAdminDb();
        await db.collection('internal_comms').add({
          agent: 'Code Inspector',
          action: 'security_audit',
          language,
          timestamp: new Date().toISOString(),
          status: 'SUCCESS'
        });
      } catch (dbError) {
        console.error("Librarian logging failed:", dbError);
      }

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
    }
    return { message: 'Analysis failed: Inspector offline.', data: null, errors: {} };
  } catch (error: any) {
    return { message: `SYSTEM_ERROR: ${error?.message}`, data: null, errors: {} };
  }
}
