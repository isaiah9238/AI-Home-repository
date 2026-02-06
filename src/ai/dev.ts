import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-code-snippet.ts';
import '@/ai/flows/link-genie.ts'
import '@/ai/flows/generate-initial-files.ts';
import '@/ai/flows/filter-ai-output.ts';
import '@/ai/flows/mentor-ai.ts';
import '@/ai/flows/summarize-fetched-content.ts';
import '@/ai/flows/integrate-lesson-plans.ts';
import '@/ai/flows/filter-user-input.ts';