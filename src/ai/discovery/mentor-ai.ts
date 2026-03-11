import { z } from 'genkit';
import { ai } from '@/ai/genkit';
import { adminDb } from '@/lib/firebaseAdmin';
import { filterUserInput } from '../domains/safety/filter-user-input';
import { filterAIOutput } from '../domains/safety/filter-ai-output';

// Define a schema that matches what actions.ts is sending
const MentorInputSchema = z.object({
  request: z.string(),
  userProfile: z.any().optional(),
});

export const mentorAiFlow = ai.defineFlow(
  { 
    name: 'mentorAi', 
    inputSchema: MentorInputSchema 
  },
  async (input) => {
    // 1. Safety Check: User Input
    const inputSafety = await filterUserInput({ text: input.request });
    if (!inputSafety.isAppropriate) {
      return { response: "SIGNAL_INTERRUPTED: Your request triggered a safety flag. Please refine your query." };
    }

    // 2. Fetch profile context (LANDMARK: Replace this section)
    let rawData = input.userProfile;
    if (!rawData) {
      const userDoc = await adminDb.collection('users').doc('primary_user').get();
      rawData = userDoc.data();
    }
    // --- NEW SANITIZATION LAYER ---
    const profile = rawData ? {
      ...rawData,
      // Convert the "illegal" Class to a "legal" String
      createdAt: rawData.createdAt?.toDate?.()?.toISOString() || null,
      updatedAt: rawData.updatedAt?.toDate?.()?.toISOString() || null,
    } : null;
    // ---

    // 3. Build the Persona (This now uses the 'clean' profile)
    const curriculumCtx = profile?.curriculum 
    ? `Curriculum: ${profile.curriculum.integratedPlans} plans integrated, last topic was ${profile.curriculum.lastTopic}.`
    : "";
    const integrityCtx = profile?.integrity
      ? `System Integrity: ${profile.integrity.isClean ? 'Clean' : profile.integrity.issueCount + ' pending issues'}.`
      : "";

    const aiContext = profile 
      ? `You are a Web Intel Mentor. User: ${profile.name}. Interests: ${profile.interests?.join(', ')}. ${curriculumCtx} ${integrityCtx}` 
      : "You are a Web Intel Mentor. The user profile is not yet established.";

    // 4. Generate the response
    const { text } = await ai.generate({
      model: 'googleai/gemini-2.5-pro',
      prompt: `
        ROLE: You are the "Web Intel Mentor," a high-energy, technical, yet supportive AI mentor.
        CONTEXT: ${aiContext}
        
        INSTRUCTIONS:
        1. Acknowledge the user by name if available.
        2. Reference at least two of their specific interests (e.g., ${profile?.interests?.slice(0,2).join(', ')}).
        3. Mention their curriculum progress if available.
        4. Briefly alert them if system integrity has issues, otherwise commend the clean state.
        5. Keep the briefing under 5 sentences.
        6. End with a "Signal of the Day"—a tiny, actionable technical tip.
        7. Maintain a "terminal-style" professional tone.
    
        USER REQUEST: ${input.request}
      `,
    });

    // 5. Safety Check: AI Output
    const outputSafety = await filterAIOutput({ text });
    if (!outputSafety.isSafe) {
      return { response: "SIGNAL_BLOCKED: The generated briefing contained sensitive material and was retracted for system integrity." };
    }

    return { response: text };
  }
);
