import * as admin from 'firebase-admin';

/**
 * @fileOverview Seeding script for the Social AI-Human Interface Protocol module.
 * Integrates the "Etiquette and Manners" lesson into the Cabinet's Curriculum and VFS.
 */

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'studio-3863072923-d4373';

// 1. Ensure the host is set correctly for the current terminal session
process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';

if (!admin.apps.length) {
  admin.initializeApp({
    projectId: projectId,
    credential: admin.credential.applicationDefault(), 
  });
}

const db = admin.firestore();

const LESSON_TITLE = "Social AI-Human Interface Protocol: Etiquette and Manners";
const LESSON_SUBJECT = "Etiquette and Manners";
const LESSON_CONTENT = `# Module: Social AI-Human Interface Protocol: Etiquette and Manners

## Greetings, Esteemed Learner.

As your Discovery Tutor, residing within the AI Home Cabinet, I am prepared to guide you through a critical coordinate in the fabric of advanced human-AI interaction: "Etiquette and Manners." This module is not merely about superficial politeness; it delves into the foundational logic that enables seamless, respectful, and effective communication across human and artificial intelligences.

Our objective is to demystify the computational underpinnings of social grace, allowing you to understand how such nuanced human behaviors can be observed, processed, and replicated by advanced systems.

---

## 1. Conceptual Overview: The Social Algorithm

Etiquette and manners, at their core, represent a complex set of unwritten rules governing social interactions. For an AI, these are not intuitive; they must be explicitly or implicitly encoded, learned, and applied.

### Key Definitions:
* **Etiquette** refers to prescriptive, formalized behavioral codes within a specific context.
* **Manners** are general expressions of respect and consideration modulated by contextual parameters.

---

## 2. Core Logic: Deconstructing Social Grace

To enable an AI to exhibit etiquette, a sophisticated architecture involving perception, processing, and generation is required.

### 2.1 The Social Sensor Array
* **NLP Detectors**: Sentiment analysis and politeness classifiers.
* **Contextual Awareness**: Time of day, user history, and task criticality.

### 2.2 Adaptive Learning
* **Reinforcement Learning**: User feedback serves as a reward signal to adjust the AI's behavioral policy.

---

## 3. Practical Exercise: Engineering a Socially Apt AI Response

### Scenario: User Interrupts During a Critical Task
**Response Logic**: Prioritize data integrity while acknowledging urgency. Offer a clear completion timeline and present a polite choice.

**ARC-9000 Result**: "I hear your urgency regarding the coffee shop, but I'm currently finalizing a critical data migration. This will be complete in approximately 5 minutes. May I retrieve that information for you immediately after?"

**End Module.**`;

async function integrateLesson() {
  console.log("--------------------------------------------------");
  console.log(`🤖 LIBRARIAN: Initiating integration for [${LESSON_SUBJECT}]`);
  console.log("--------------------------------------------------");

  const userId = 'primary_user';
  const userRef = db.collection('users').doc(userId);

  try {
    await db.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);
      
      if (!userDoc.exists) {
        throw new Error("Home Base not established. Run seed-home-base first.");
      }

      const currentComplexity = userDoc.data()?.neuralComplexity || 64;
      const currentIntegration = userDoc.data()?.knowledgeIntegration || 82;

      // 1. Update User Stats 
      transaction.update(userRef, {
        neuralComplexity: Math.min(currentComplexity + 5, 100),
        knowledgeIntegration: Math.min(currentIntegration + 2, 100),
        lastLesson: LESSON_TITLE,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // 2. Add Milestone
      transaction.set(db.collection('milestones').doc(), {
        userId,
        type: 'CURRICULUM_INTEGRATION',
        event: `LEARNED: ${LESSON_TITLE}`,
        date: new Date().toISOString().split('T')[0],
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });

      // 3. Add to Curriculum
      transaction.set(db.collection('curriculum').doc(), {
        userId,
        title: LESSON_TITLE,
        subject: LESSON_SUBJECT,
        completedAt: admin.firestore.FieldValue.serverTimestamp(),
        status: 'INTEGRATED'
      });

      // 4. Persist to VFS for storage access
      transaction.set(db.collection('ai_vfs').doc(), {
        userId,
        name: "Social_Etiquette_Protocol.md",
        path: "/Curriculum/Social_Etiquette_Protocol.md",
        type: "file",
        parentId: null, 
        content: LESSON_CONTENT,
        mimeType: "text/markdown",
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        metadata: {
          owner_agent: "Discovery_Tutor",
          intent_vector: "Etiquette_Logic",
          type: "curriculum_module"
        }
      });
    });

    console.log(`✅ SUCCESS: ${LESSON_TITLE} integrated into the Cabinet.`);
    console.log("--------------------------------------------------");
  } catch (error: any) {
    console.error("❌ INTEGRATION_FAILURE:", error.message);
    process.exit(1);
  }
}

integrateLesson().then(() => {
  console.log("👋 PROTOCOL_TERMINATED: System maintaining standby state.");
  process.exit(0);
});
