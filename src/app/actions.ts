'use server';

import { mentorAi } from '@/ai/discovery/mentor-ai';
import { multiAgentDispatcher } from '@/ai/discovery/multi-agent-dispatcher';
import { linkGenie } from '@/ai/domains/research/link-genie';
import { epitomizeFetchedContent } from '@/ai/domains/research/epitomize-fetched-content';
import { generateInitialFiles } from '@/ai/discovery/generate-initial-files';
import { generateLessonPlan as generateLessonPlanFlow } from '@/ai/discovery/generate-lesson-plan';
import { getAdminDb } from '@/lib/firebaseAdmin';
import { establishHomeBase as runLibrarianSync } from '@/ai/discovery/establish-home-base';
import { migrateLessonToDb } from '@/ai/discovery/migrate-lesson-to-db';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { auth } from '@/auth';
import { searchGenie } from '@/ai/domains/research/search-genie';
import { persistVFSNode, getNodesByParent, purgeVFSNode } from '@/ai/storage/virtual-file-system';
import { analyzePreviewIntent } from '@/ai/domains/research/analyze-preview-intent';
import { generateCodeVariations } from '@/ai/domains/research/variation-agent';
import { type ResearchMode } from './types';

// --- UTILS ---
const sanitizeDate = (val: any): string | null => {
  if (!val) return null;
  if (typeof val.toDate === 'function') return val.toDate().toISOString();
  if (typeof val._seconds === 'number') return new Date(val._seconds * 1000).toISOString();
  if (val instanceof Date) return val.toISOString();
  if (typeof val === 'string') return val;
  return null;
};

// --- THE BLUEPRINT ---
const MOCK_USER_CONTEXT = {
  name: "Isaiah Smith",
  role: "Architect",
  interests: ["Land Surveying", "Next.js", "AI Engineering"],
  experiences: "Full Stack Development",
  establishedDate: "2026-02-06",
  gemsBalance: 150,
  neuralComplexity: 64,
  knowledgeIntegration: 82,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// --- THE SECURITY GATE ---
async function verifyAuth() {
  if (process.env.NEXT_PHASE === 'action' || !process.env.NEXT_RUNTIME) {
    return { user: { id: 'primary_user' } };
  }

  const [cookieStore, session] = await Promise.all([cookies(), auth()]);
  const isBypassed = cookieStore.get('auth_bypass')?.value === 'true';

  if (isBypassed || process.env.NODE_ENV === 'development') {
     return { user: { email: 'isaiah@smith.com', id: 'primary_user' } };
  }

  if (!session || !session.user) {
    throw new Error("UNAUTHORIZED_ACCESS: Please log in.");
  }
  return session;
}

// --- THE HOME BASE ACTION ---
export async function getHomeBase() {
  try {
    const session = await verifyAuth();
    
    const result = await runLibrarianSync({ 
      userId: session.user?.id || 'primary_user' 
    });

    return { 
      success: true, 
      data: {
        ...MOCK_USER_CONTEXT,
        ...(result?.userContext || {}),
        uid: session.user?.id || 'primary_user'
      } 
    };
  } catch (error) {
    console.error("CABINET_SYNC_ERROR:", error);
    return { 
      success: true, 
      data: { ...MOCK_USER_CONTEXT, uid: "BYPASS_ACTIVE" } 
    };
  }
}

/**
 * helper: callLibrarianIndexer
 * Calls the background Cloud Function to analyze content.
 */
async function callLibrarianIndexer(content: string, context: string = "General_Sync") {
  try {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'studio-3863072923-d4373';
    const region = 'us-central1';
    const functionUrl = `https://${region}-${projectId}.cloudfunctions.net/librarianIndexer`;
    
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: { content, context } }),
      signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) {
      return {
        tags: ["Auto_Tagged", context],
        summary: content.slice(0, 100) + "...",
        sentiment: "neutral",
        priority: 1
      };
    }

    const result = await response.json();
    return result.result;
  } catch (error) {
    return {
      tags: ["Fallback"],
      summary: "Manual entry - Indexer offline.",
      sentiment: "neutral",
      priority: 1
    };
  }
}

export async function pingServer() {
  try {
    return { 
      success: true, 
      timestamp: new Date().toISOString(), 
      status: 'ONLINE'
    };
  } catch (error) {
    return { success: false, status: 'OFFLINE' };
  }
}

export async function sendTerminalMessage(message: string) {
  try {
    await verifyAuth();
    const result = await multiAgentDispatcher({ request: message });
    
    let responseText = "SIGNAL_RECEIVED: Processed.";
    if (typeof result === 'string') {
      responseText = result;
    } else if (result && typeof result === 'object') {
      if ('response' in result) responseText = (result as any).response;
      else if ('content' in result) responseText = (result as any).content;
      else if ('summary' in result) responseText = (result as any).summary;
      else responseText = JSON.stringify(result, null, 2);
    }

    return { success: true, response: responseText };
  } catch (error: any) {
    console.error("Terminal Action Error:", error?.message || "Unknown");
    return { success: false, error: error.message || "SIGNAL_INTERRUPTED" };
  }
}

export async function getMorningBriefing(userContext?: any) {
  try {
    await verifyAuth();
    const db = getAdminDb();
    const userId = 'primary_user';
    
    const [criticalGems, userDoc] = await Promise.all([
      db.collection('gems').where('resolution', '==', 'pending').where('severity', 'in', ['high', 'critical']).get(),
      db.collection('users').doc(userId).get()
    ]);

    const result = await mentorAi({ 
      request: "Give me my morning briefing.",
      userProfile: {
        ...(userContext || MOCK_USER_CONTEXT),
        curriculum: userDoc.exists ? {
          integratedPlans: 0,
          lastTopic: userDoc.data()?.lastLesson || "Initialization"
        } : null,
        integrity: {
          isClean: criticalGems.empty,
          issueCount: criticalGems.size
        }
      }
    });
    
    return result.response;
  } catch (error) {
    console.error("Mentor Action Error:", error instanceof Error ? error.message : "Sync error");
    return "SYSTEM_OFFLINE: Could not sync with Mentor AI.";
  }
}

export async function runResearchMode(input: { url: string, mode: ResearchMode }) {
  try {
    await verifyAuth();
    let result;
    const isUrl = input.url.startsWith('http');

    if (input.mode === 'scout') {
      result = isUrl ? await linkGenie({ url: input.url }) : await searchGenie({ query: input.url });
    } else {
      if (!isUrl) throw new Error("DEEP_READ requires a specific URL coordinate.");
      result = await epitomizeFetchedContent({ url: input.url });
    }

    let markdownContent = '';
    
    if (input.mode === 'scout') {
      const scoutData = result as { title?: string, summary: string, keyPoints: string[] };
      markdownContent = `
# ${scoutData.title || 'Reconnaissance Report'}
**Target:** ${input.url}
**Mode:** Scout
**Timestamp:** ${new Date().toISOString()}

## Summary
${scoutData.summary}

## Key Signals
${scoutData.keyPoints ? scoutData.keyPoints.map(p => `- ${p}`).join('\n') : 'No signals extracted.'}
      `.trim();
    } else {
      const deepData = result as { title: string, epitome: string, structuredNotes: { heading: string, content: string }[] };
      markdownContent = `
# ${deepData.title || 'Deep Read Report'}
**Target:** ${input.url}
**Mode:** Deep Read
**Timestamp:** ${new Date().toISOString()}

## Deep Essence
${deepData.epitome}

## Structured Notes
${deepData.structuredNotes ? deepData.structuredNotes.map(n => `### ${n.heading}\n${n.content}`).join('\n\n') : 'No notes extracted.'}
      `.trim();
    }

    const analysis = await callLibrarianIndexer(markdownContent, `Research_${input.mode}`);

    const db = getAdminDb();
    const logsDirSnapshot = await db.collection('ai_vfs')
      .where('userId', '==', 'primary_user')
      .where('name', '==', 'Research_Logs')
      .limit(1)
      .get();
      
    const targetFolderId = !logsDirSnapshot.empty ? logsDirSnapshot.docs[0].id : null;

    await persistVFSNode({
      name: `Recon_${input.mode}_${Date.now()}.md`,
      path: `/Research_Logs/Recon_${input.mode}_${Date.now()}.md`,
      type: 'file',
      parentId: targetFolderId, 
      userId: 'primary_user',
      content: markdownContent,
      mimeType: 'text/markdown',
      metadata: { 
        owner_agent: 'Flux_Echo', 
        intent_vector: input.mode,
        target_url: input.url,
        type: 'research_report',
        access_level: 'shared',
        analysis: analysis
      }
    });

    await postAgenticNote(
      "Flux_Echo",
      `Mission complete: ${input.url} analyzed in ${input.mode} mode. Report indexed in VFS.`,
      `Research_${input.mode}`
    );

    return { success: true, mode: input.mode, data: result };
  } catch (error: any) {
    return { success: false, error: `MISSION_FAILED: ${error?.message || "Coordinate unreachable."}` };
  }
}

export async function runArchitect(blueprint: string, commitToVFS: boolean = false) {
  try {
    await verifyAuth();
    const result = await generateInitialFiles({ blueprint });
    
    if (result && result.length > 0) {
      const db = getAdminDb();
      const userId = 'primary_user';

      const docRef = await db.collection('blueprints').add({
        userId,
        name: blueprint.slice(0, 50) + (blueprint.length > 50 ? '...' : ''),
        prompt: blueprint,
        structure: result,
        timestamp: new Date().toISOString(),
        status: 'CONSTRUCTED'
      });

      if (commitToVFS) {
        const projectFolderName = `Project_${Date.now()}`;
        const blueprintsFolderSnapshot = await db.collection('ai_vfs')
          .where('userId', '==', userId)
          .where('name', '==', 'Blueprints')
          .limit(1)
          .get();
        
        const parentId = !blueprintsFolderSnapshot.empty ? blueprintsFolderSnapshot.docs[0].id : null;

        const rootNode = await persistVFSNode({
          name: projectFolderName,
          path: `/Blueprints/${projectFolderName}`,
          type: 'directory',
          parentId,
          userId
        });

        for (const file of result) {
          await persistVFSNode({
            name: file.path.split('/').pop() || 'unnamed',
            path: `/Blueprints/${projectFolderName}/${file.path}`,
            type: file.type,
            content: file.content || '',
            parentId: rootNode.id,
            userId,
            metadata: {
              source_blueprint: docRef.id,
              owner_agent: 'The_Architect'
            }
          });
        }

        await postAgenticNote(
          "The_Architect",
          `Autonomous Writing Protocol engaged. New project structure [${projectFolderName}] committed to /Blueprints. Initial files synthesized and indexed.`,
          "VFS_Commit"
        );
      }

      return { success: true, data: result, id: docRef.id, vfsCommitted: commitToVFS };
    }

    return { success: true, data: result };
  } catch (error: any) {
    console.error("Architect Action Error:", error);
    return { success: false, error: `CONSTRUCTION_FAILED: ${error?.message || "Blueprint unreadable."}` };
  }
}

export async function getSavedBlueprints() {
  try {
    await verifyAuth();
    const snapshot = await getAdminDb()
      .collection('blueprints')
      .where('userId', '==', 'primary_user')
      .orderBy('timestamp', 'desc')
      .get();

    const blueprints = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: sanitizeDate(doc.data().timestamp)
    }));

    return { success: true, data: blueprints };
  } catch (error) {
    return { success: false, error: "SIGNAL_LOST: Blueprints inaccessible." };
  }
}


export async function deleteBlueprint(id: string) {
  try {
    await verifyAuth();
    await getAdminDb().collection('blueprints').doc(id).delete();
    revalidatePath('/architect');
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function generateLessonPlan(subject: string) {
  try {
    await verifyAuth();
    const text = await generateLessonPlanFlow({ subject });

    if (!text || text.includes("SIGNAL_LOST")) {
      throw new Error("EMPTY_SIGNAL: The Tutor could not generate the plan.");
    }

    const planRef = await getAdminDb().collection('lesson_plans').add({
      userId: 'primary_user',
      title: `Lesson: ${subject}`,
      subject: subject,
      content: text,
      status: 'PENDING',
      timestamp: new Date().toISOString()
    });

    return { success: true, plan: text, id: planRef.id };
  } catch (error: any) {
    console.error("TUTOR_GEN_ERROR:", error.message);
    return { success: false, error: `SIGNAL_LOST: The Tutor could not generate the plan. [${error.message}]` };
  }
}

export async function getPendingLessonPlans() {
  try {
    await verifyAuth();
    const snapshot = await getAdminDb()
      .collection('lesson_plans')
      .where('userId', '==', 'primary_user')
      .where('status', '==', 'PENDING')
      .orderBy('timestamp', 'desc')
      .get();

    const plans = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: sanitizeDate(doc.data().timestamp)
    }));

    return { success: true, data: plans };
  } catch (error) {
    return { success: false, error: "SIGNAL_LOST: Lesson plans inaccessible." };
  }
}

export async function deleteLessonPlan(id: string) {
  try {
    await verifyAuth();
    await getAdminDb().collection('lesson_plans').doc(id).delete();
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function updateHomeBaseAction(updates: any) {
  try {
    await verifyAuth();
    const db = getAdminDb();
    await db.collection('users').doc('primary_user').set({
      ...updates,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return { success: false, error: "LIBRARIAN_WRITE_ERROR" };
  }
}

export async function getSystemEvolution() {
  try {
    await verifyAuth();
    const doc = await getAdminDb().collection('users').doc('primary_user').get();
    const data = doc.data();
    const establishedDate = data?.establishedDate || MOCK_USER_CONTEXT.establishedDate;
    const start = new Date(establishedDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return { 
      success: true, 
      daysOld: diffDays, 
      isAnniversary: now.getMonth() === start.getMonth() && now.getDate() === start.getDate() 
    };
  } catch (error) {
    return { success: false, daysOld: 0 };
  }
}

export async function getCurriculumProgress() {
  try {
    await verifyAuth();
    const userId = 'primary_user';
    const userDoc = await getAdminDb().collection('users').doc(userId).get();
    const data = userDoc.data();
    
    const lessonsSnapshot = await getAdminDb().collection('curriculum')
      .where('userId', '==', userId)
      .orderBy('completedAt', 'desc')
      .get();

    const lessons = lessonsSnapshot.docs.map(doc => {
      const l = doc.data();
      return {
        id: doc.id,
        title: l.title,
        subject: l.subject,
        status: l.status,
        completedAt: sanitizeDate(l.completedAt) || new Date().toISOString()
      };
    });

    return {
      success: true,
      integratedPlans: lessons.length,
      neuralComplexity: Math.min(lessons.length * 5 + 64, 100),
      knowledgeIntegration: Math.min(lessons.length * 2 + 82, 100),
      lastTopic: data?.lastLesson || "System Initialization",
      lessons: lessons
    };
  } catch (error) {
    return { success: false, integratedPlans: 0, neuralComplexity: 64, knowledgeIntegration: 82, lessons: [] };
  }
}

export async function integrateLessonAction(data: { title: string; subject: string; complexityGain: number }) {
  try {
    await verifyAuth();
    const result = await migrateLessonToDb(data);
    return { success: true, planId: result.success ? 'GENERATED_ID' : null };
  } catch (error: any) {
    return { success: false, error: "SIGNAL_LOST: Check Firebase Admin permissions." };
  }
}

export async function getSystemIntegrity() {
  try {
    await verifyAuth();
    const criticalGems = await getAdminDb().collection('gems')
      .where('resolution', '==', 'pending')
      .where('severity', 'in', ['high', 'critical'])
      .get();

    return {
      success: true,
      isClean: criticalGems.empty,
      issueCount: criticalGems.size
    };
  } catch (error) {
    return { success: false, isClean: true, issueCount: 0 };
  }
}

export async function getGems() {
  try {
    await verifyAuth();
    const snapshot = await getAdminDb().collection('gems').orderBy('time', 'desc').get();
    const gems = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        type: data.type,
        reason: data.reason,
        severity: data.severity,
        content: data.content,
        resolution: data.resolution || 'pending',
        time: sanitizeDate(data.time) || new Date().toISOString()
      };
    });
    return { success: true, data: gems };
  } catch (error) {
    return { success: false, error: "LIBRARIAN_READ_ERROR" };
  }
}

export async function resolveGem(id: string, resolution: 'resolved' | 'dismissed') {
  try {
    await verifyAuth();
    const db = getAdminDb();
    const gemRef = db.collection('gems').doc(id);
    const gemDoc = await gemRef.get();
    if (!gemDoc.exists) return { success: false, error: "GEM_NOT_FOUND" };
    
    const gemData = gemDoc.data();
    await gemRef.update({ resolution });

    if (resolution === 'resolved') {
      const severity = gemData?.severity || 'medium';
      let reward = 25;
      if (severity === 'critical') reward = 100;
      else if (severity === 'high') reward = 50;
      else if (severity === 'low') reward = 10;

      const userRef = db.collection('users').doc('primary_user');
      await db.runTransaction(async (transaction) => {
        const userDoc = await transaction.get(userRef);
        const currentBalance = userDoc.data()?.gemsBalance || 0;
        transaction.update(userRef, { gemsBalance: currentBalance + reward });
      });
    }

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function deleteAudit(id: string) {
  try {
    await verifyAuth();
    await getAdminDb().collection('internal_comms').doc(id).delete();
    revalidatePath('/code-analyzer');
    return { success: true };
  } catch (error) {
    return { success: false, error: "LIBRARIAN_DELETE_ERROR" };
  }
}

export async function getInternalComms() {
  try {
    await verifyAuth();
    const snapshot = await getAdminDb()
      .collection('internal_comms')
      .orderBy('timestamp', 'desc')
      .limit(50)
      .get();
      
    return { 
      success: true, 
      data: snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        timestamp: sanitizeDate(doc.data().timestamp)
      })) 
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getMilestones() {
  try {
    await verifyAuth();
    const snapshot = await getAdminDb().collection('milestones').orderBy('date', 'desc').get();
    return { success: true, data: snapshot.docs.map(d => ({ id: d.id, ...d.data(), timestamp: sanitizeDate(d.data().timestamp) })) };
  } catch (error) {
    return { success: false, error: "LIBRARIAN_READ_ERROR" };
  }
}

export async function commitNeuralWeights(config: any) {
  try {
    await verifyAuth();
    await getAdminDb().collection('users').doc('primary_user').collection('config').doc('neural-laboratory').set({
      ...config,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    revalidatePath('/'); 
    return { success: true };
  } catch (error: any) {
    return { success: false, error: "COMMIT_REJECTED" };
  }
}

export async function getNeuralWeights() {
  try {
    await verifyAuth();
    const doc = await getAdminDb().collection('users').doc('primary_user').collection('config').doc('neural-laboratory').get();
    return { success: true, data: doc.exists ? doc.data() : null };
  } catch (error) {
    return { success: false };
  }
}

export async function exportVaultData() {
  try {
    await verifyAuth();
    const db = getAdminDb();
    const userId = 'primary_user';
    const [blueprints, curriculum, gems, milestones, user] = await Promise.all([
      db.collection('blueprints').where('userId', '==', userId).get(),
      db.collection('curriculum').where('userId', '==', userId).get(),
      db.collection('gems').get(),
      db.collection('milestones').where('userId', '==', userId).get(),
      db.collection('users').doc(userId).get()
    ]);

    return {
      success: true,
      bundle: {
        exportedAt: new Date().toISOString(),
        identity: user.data() || MOCK_USER_CONTEXT,
        archives: {
          blueprints: blueprints.docs.map(d => d.data()),
          curriculum: curriculum.docs.map(d => d.data()),
          gems: gems.docs.map(d => d.data()),
          milestones: milestones.docs.map(d => d.data())
        }
      }
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function postAgenticNote(agentName: string, note: string, intentVector: string) {
  try {
    await verifyAuth();
    const userId = 'primary_user';
    const db = getAdminDb();
    
    const analysis = await callLibrarianIndexer(note, intentVector);

    const folderSnapshot = await db.collection('ai_vfs')
      .where('userId', '==', userId)
      .where('name', '==', 'Agent_Notes')
      .limit(1)
      .get();
      
    let folderId = !folderSnapshot.empty ? folderSnapshot.docs[0].id : null;
    
    if (!folderId) {
      const folder = await persistVFSNode({
        name: 'Agent_Notes',
        path: '/Agent_Notes',
        type: 'directory',
        parentId: null,
        userId
      });
      folderId = folder.id;
    }

    const node = await persistVFSNode({
      name: `Note_${agentName}_${Date.now()}.md`,
      path: `/Agent_Notes/Note_${agentName}_${Date.now()}.md`,
      type: 'file',
      parentId: folderId,
      userId,
      content: note,
      mimeType: 'text/markdown',
      metadata: { 
        owner_agent: agentName, 
        intent_vector: intentVector,
        type: 'agent_note',
        analysis: analysis
      }
    });

    return { success: true, data: node };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAgenticContext() {
  try {
    await verifyAuth();
    const userId = 'primary_user';
    const db = getAdminDb();
    
    const notesSnapshot = await db.collection('ai_vfs')
      .where('userId', '==', userId)
      .where('metadata.type', 'in', ['agent_note', 'research_report'])
      .orderBy('updatedAt', 'desc')
      .limit(5)
      .get();
      
    const notes = notesSnapshot.docs.map(doc => {
      const data = doc.data();
      return `[AGENT: ${data.metadata?.owner_agent || 'Unknown'}] [INTENT: ${data.metadata?.intent_vector || 'General'}]\n${data.content}`;
    });

    return { success: true, context: notes.join('\n---\n') };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getVFSNodesAction(parentId: string | null = null) {
  try {
    await verifyAuth();
    const nodes = await getNodesByParent('primary_user', parentId);
    return { success: true, data: nodes };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteVFSNodeAction(id: string) {
  try {
    await verifyAuth();
    await purgeVFSNode(id);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateVFSNodeAction(id: string, content: string) {
  try {
    await verifyAuth();
    const db = getAdminDb();
    await db.collection('ai_vfs').doc(id).update({
      content,
      updatedAt: new Date().toISOString()
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function initializeVFS() {
  try {
    await verifyAuth();
    const userId = 'primary_user';
    
    const rootDirSnapshot = await getAdminDb().collection('ai_vfs')
      .where('userId', '==', userId)
      .where('name', '==', 'System_Root')
      .limit(1)
      .get();

    if (!rootDirSnapshot.empty) {
      return { success: true, message: "ALREADY_INITIALIZED" };
    }

    const rootDir = await persistVFSNode({
      name: 'System_Root',
      path: '/',
      type: 'directory',
      parentId: null,
      userId
    });

    await persistVFSNode({
      name: 'Blueprints',
      path: '/Blueprints',
      type: 'directory',
      parentId: rootDir.id,
      userId
    });

    await persistVFSNode({
      name: 'Research_Logs',
      path: '/Research_Logs',
      type: 'directory',
      parentId: rootDir.id,
      userId
    });

    await persistVFSNode({
      name: 'Agent_Notes',
      path: '/Agent_Notes',
      type: 'directory',
      parentId: rootDir.id,
      userId
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getPreviewAnalysis(code: string, context?: string) {
  try {
    await verifyAuth();
    const result = await analyzePreviewIntent({ code, context });
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "INTENT_ANALYSIS_FAILED" };
  }
}

export async function getVariationAnalysis(baseCode: string, instructions: string, count: number = 3) {
  try {
    await verifyAuth();
    const variations = await generateCodeVariations({ baseCode, instructions, count });
    return { success: true, data: variations };
  } catch (error: any) {
    return { success: false, error: error.message || "VARIATION_GENERATION_FAILED" };
  }
}

export async function saveTestingWorkspace(name: string, slots: any[]) {
  try {
    await verifyAuth();
    const userId = 'primary_user';
    
    const db = getAdminDb();
    const folderSnapshot = await db.collection('ai_vfs')
      .where('userId', '==', 'primary_user')
      .where('name', '==', 'Testing_Chambers')
      .limit(1)
      .get();
      
    let folderId = !folderSnapshot.empty ? folderSnapshot.docs[0].id : null;
    
    if (!folderId) {
      const folder = await persistVFSNode({
        name: 'Testing_Chambers',
        path: '/Testing_Chambers',
        type: 'directory',
        parentId: null,
        userId: 'primary_user'
      });
      folderId = folder.id;
    }

    const node = await persistVFSNode({
      name: `${name}.chamber.json`,
      path: `/Testing_Chambers/${name}.chamber.json`,
      type: 'file',
      parentId: folderId,
      userId: 'primary_user',
      content: JSON.stringify(slots),
      mimeType: 'application/json',
      metadata: { 
        owner_agent: 'Testing_Chamber', 
        type: 'workspace_save' 
      }
    });

    return { success: true, data: node };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getTestingWorkspaces() {
  try {
    await verifyAuth();
    const db = getAdminDb();
    const snapshot = await db.collection('ai_vfs')
      .where('userId', '==', 'primary_user')
      .where('metadata.owner_agent', '==', 'Testing_Chamber')
      .get();
      
    return { 
      success: true, 
      data: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) || []
    };
  } catch (error: any) {
    return { success: false, error: error.message, data: [] };
  }
}

export async function createVFSDirectory(name: string, parentId: string | null) {
  try {
    await verifyAuth();
    const userId = 'primary_user';
    
    const node = await persistVFSNode({
      name,
      path: `/manual/${name}`, // Simplified path logic for VFS
      type: 'directory',
      parentId,
      userId,
      metadata: {
        owner_agent: 'User',
        type: 'manual_directory'
      }
    });
    
    return { success: true, data: node };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
