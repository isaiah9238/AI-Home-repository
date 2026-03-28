import { config } from 'dotenv';
config();

/**
 * @fileOverview Local development entry point for Genkit flows.
 * This file registers all Cabinet flows for use with the Genkit Dev UI.
 */

// Domain: Research
import '@/ai/domains/research/analyze-code-snippet';
import '@/ai/domains/research/link-genie';
import '@/ai/domains/research/epitomize-fetched-content';

// Domain: Discovery
import '@/ai/discovery/generate-initial-files';
import '@/ai/discovery/mentor-ai';
import '@/ai/discovery/integrate-lesson-plans';
import '@/ai/discovery/generate-lesson-plan';
import '@/ai/discovery/establish-home-base';

// Domain: Safety
import '@/ai/domains/safety/filter-ai-output';
import '@/ai/domains/safety/filter-user-input';