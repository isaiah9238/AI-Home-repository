// STATUS: DORMANT
// PROTOCOL: VERTEX_UPGRADE_ALPHA
// REQUIREMENT: Firebase App Check & Auth initialization.
// @ts-expect-error - Firebase and generative-ai SDKs might not have full type support in this environment yet.
import { getApp } from 'firebase/app';
import { getVertexAI, getGenerativeModel, GenerativeModel } from 'firebase/vertex-ai-preview';

/**
 * Represents the Vertex mentor, powered by the Vertex AI Gemini API.
 *
 * This mentor is ideal for scalable, enterprise-grade applications.
 * It leverages the Vertex AI backend for robust, production-ready performance.
 *
 * @see /home/user/studio/.agents/skills/firebase-ai-logic/SKILL.md
 */
export function getVertexMentor(): GenerativeModel {
  // Assumes firebase is initialized elsewhere, for example in `/src/lib/firebase.ts`
  const firebaseApp = getApp();

  const vertex = getVertexAI(firebaseApp);

  // As per the skill documentation, use 'gemini-2.5-pro'
  const model = getGenerativeModel(vertex, { model: 'gemini-2.5-pro' });

  return model;
}

/**
 * Creates a chat session with the Vertex mentor.
 * @param history - Optional chat history to start with.
 */
export function createVertexChatSession(history?: any[]) {
    const model = getVertexMentor();
    return model.startChat({ history: history || [] });
}