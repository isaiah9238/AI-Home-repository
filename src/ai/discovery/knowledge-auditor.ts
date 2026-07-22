import 'server-only';

import { queryVFSContext } from '@/ai/storage/vector-sync';
import { generateLessonPlan, LessonPlan } from '@/ai/discovery/generate-lesson-plan';

export interface AuditGapRequest {
  topicQuery: string;
  minAcceptableScore?: number;
}

export interface AuditResult {
  hasGap: boolean;
  topic: string;
  topScore: number;
  lessonGenerated?: boolean;
  lessonPlan?: LessonPlan; // 🔒 Strongly Typed Interface
  message: string;
}

/**
 * Sanitizes user/system inputs to prevent prompt injection attacks.
 */
function sanitizeTopicQuery(rawQuery: string): string {
  if (!rawQuery || typeof rawQuery !== 'string') return '';
  return rawQuery
    .replace(/[<>{}[\]\\]/g, '') // Strip prompt manipulation brackets
    .slice(0, 300)                // Enforce length limit
    .trim();
}

/**
 * Knowledge Auditor (Cognitive Gap Inspector):
 * Hardened against prompt injection, loose dynamic types, and magic numbers.
 */
export async function auditCognitiveGap(
  request: AuditGapRequest
): Promise<AuditResult> {
  const sanitizedTopic = sanitizeTopicQuery(request.topicQuery);
  const threshold = request.minAcceptableScore ?? 0.70;

  if (!sanitizedTopic) {
    return {
      hasGap: false,
      topic: '',
      topScore: 0,
      message: 'Invalid or empty topic query provided.'
    };
  }

  console.log(`[KNOWLEDGE_AUDITOR] Scanning Neural Graph memory for: "${sanitizedTopic}"`);

  try {
    // 1. Query semantic vector memory
    const matches = await queryVFSContext(sanitizedTopic);
    
    // 2. Strict type evaluation & explicit fallback (Fixes Magic Number 0.85)
    let topScore = 0.0;
    if (matches && matches.length > 0) {
      const topMatch = matches[0];
      if ('score' in topMatch && typeof (topMatch as any).score === 'number') {
        topScore = (topMatch as any).score;
      } else {
        // Fallback if missing score property: treat as unverified gap (0.0) rather than assuming high proximity
        console.warn(`[KNOWLEDGE_AUDITOR] Match found for "${sanitizedTopic}" but score property was missing. Defaulting score to 0.0.`);
        topScore = 0.0;
      }
    }

    console.log(`[KNOWLEDGE_AUDITOR] Proximity score for "${sanitizedTopic}": ${topScore.toFixed(2)} (Threshold: ${threshold})`);

    // 3. Score meets or exceeds threshold -> No gap
    if (topScore >= threshold) {
      return {
        hasGap: false,
        topic: sanitizedTopic,
        topScore,
        message: `Neural Graph context density is optimal for "${sanitizedTopic}". No lesson required.`
      };
    }

    // 4. Score below threshold -> Direct The Tutor to synthesize structured lesson
    console.warn(`[KNOWLEDGE_AUDITOR] Cognitive gap identified for "${sanitizedTopic}". Dispatching request to The Tutor...`);

    const directionalPrompt = `
      TARGET GAP DETECTED: The system lacks high-density context regarding "${sanitizedTopic}".
      INSTRUCTION: Synthesize a structured curriculum lesson plan designed to train the multi-agent system on this concept, establishing long-term behavioral rules and mastery metrics.
    `;

    const lessonPlan = await generateLessonPlan({
      concept: sanitizedTopic,
      contextPrompt: directionalPrompt
    });

    return {
      hasGap: true,
      topic: sanitizedTopic,
      topScore,
      lessonGenerated: true,
      lessonPlan,
      message: `Cognitive gap identified. Generated new lesson plan via The Tutor to raise Mastery Levels.`
    };

  } catch (error: any) {
    // Sanitized internal error logging
    console.error(`[KNOWLEDGE_AUDITOR_ERROR] Audit cycle failed for "${sanitizedTopic}".`, error?.message || error);
    return {
      hasGap: true,
      topic: sanitizedTopic,
      topScore: 0,
      lessonGenerated: false,
      message: `Audit failed due to internal error.`
    };
  }
}