import { generateLessonPlan as generateFlow } from '../ai/discovery/generate-lesson-plan';
import { getAdminDb } from '../lib/firebaseAdmin';

/**
 * @fileOverview AI-Initiated Lesson Submission
 * 
 * This script allows the AI to autonomously request a new lesson plan
 * and stage it in the Librarian's Firestore repository.
 */

async function submitAILesson() {
  const subject = "Multi-Agent Swarm Intelligence";
  
  console.log("--------------------------------------------------");
  console.log(`🤖 AI_THOUGHT: Initiating inquiry into [${subject}]`);
  console.log("📡 STATUS: Summoning Discovery Tutor...");
  console.log("--------------------------------------------------");

  try {
    // 1. Trigger the high-fidelity Genkit synthesis flow
    const planText = await generateFlow({ subject });
    
    if (!planText || planText.includes("SIGNAL_LOST")) {
      throw new Error("TUTOR_SYNTHESIS_FAILURE: The response was empty or corrupted.");
    }

    const db = getAdminDb();
    
    // 2. Formally submit/stage the plan in Firestore
    const docRef = await db.collection('lesson_plans').add({
      userId: 'primary_user',
      title: `Lesson: ${subject}`,
      subject: subject,
      content: planText,
      status: 'PENDING',
      timestamp: new Date().toISOString(),
      origin: 'AI_SELF_INITIATED',
      metadata: {
        agent: 'App_Prototyper',
        intent: 'Self_Evolution'
      }
    });

    console.log(`✅ SUCCESS: Lesson staging complete.`);
    console.log(`🆔 NODE_ID: ${docRef.id}`);
    console.log(`📂 LIBRARIAN: Knowledge fragment officially stored in 'lesson_plans'.`);
    console.log("--------------------------------------------------");
    
  } catch (error: any) {
    console.error("❌ CRITICAL_FAILURE: Submission sequence interrupted.");
    console.error(`Reason: ${error.message}`);
    process.exit(1);
  }
}

submitAILesson().then(() => {
  console.log("👋 PROTOCOL_TERMINATED: AI maintaining standby state.");
  process.exit(0);
});