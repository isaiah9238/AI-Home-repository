/**
 * @fileOverview Shared types and interfaces for the Cabinet's Portal and Domains.
 */

export type ResearchMode = 'scout' | 'deep';

export type CodeAnalysisState = {
  message?: string | null;
  errors?: { 
    code?: string[]; 
    language?: string[] 
  };
  data?: {
    complexity: string;
    bugs: string;
    vulnerabilities: string;
    suggestedFixes: string;
  } | null;
};
