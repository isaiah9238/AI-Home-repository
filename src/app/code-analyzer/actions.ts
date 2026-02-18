'use server';

import { z } from 'zod';
import { analyzeCodeSnippet } from '@/ai/domains/research/analyze-code-snippet';
import { filterUserInput } from '@/ai/domains/surveying/filter-user-input';
import { fluxEcho } from '@/ai/discovery/flux-echo';
import { mentorAiFlow } from '@/ai/discovery/mentor-ai';

const CodeAnalysisSchema = z.object({
  code: z
    .string({ required_error: 'Code snippet is required.' })
    .min(20, { message: 'Code snippet must be at least 20 characters long.' }),
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
    const filterResult = await filterUserInput({ text: code });
    if (!filterResult.isAppropriate) {
      return {
        message: `Input contains inappropriate content: ${filterResult.reason || 'Not allowed.'}`,
        errors: {},
        data: null,
      };
    }

    const analysisResult = await analyzeCodeSnippet({ code, language });

    if (analysisResult && analysisResult.analysis) {
        return { message: 'Analysis successful.', data: analysisResult.analysis, errors: {} };
    } else {
        return { message: 'Analysis failed to produce a result.', data: null, errors: {} };
    }
  } catch (error) {
    console.error('Code analysis error:', error);
    return { message: 'An unexpected error occurred during analysis.', data: null, errors: {} };
  }
}

// --- 1. Flux Echo Action ---
export async function performLinkSearch(prevState: any, formData: FormData) {
  const query = formData.get('query') as string;
  try {
    const result = await fluxEcho(query);
    return { message: 'Search successful', data: result };
  } catch (_error) {
    return { message: 'Search failed', data: null };
  }
}

// --- 2. Mentor AI Action ---
export async function getMentorResponse(prevState: any, formData: FormData) {
  const request = formData.get('request') as string;
  try {
    const result = await mentorAiFlow({ request });
    return { response: result.response };
  } catch (_error) {
    return { response: 'Error fetching mentor advice.' };
  }
}
