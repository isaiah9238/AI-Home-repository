import { getAdminDb } from '@/lib/firebaseAdmin';
import * as admin from 'firebase-admin';

export type GemType = 'user_input' | 'ai_output';
export type GemSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface GemRecord {
  type: GemType;
  reason: string;
  severity: GemSeverity;
  content: string;
  time: admin.firestore.FieldValue;
  resolution: string; // "pending", "resolved", "dismissed"
}

/**
 * Records a flagged content incident as a "Gem" in Firestore.
 */
export async function recordGem(data: {
  type: GemType;
  reason: string;
  content: string;
  severity?: GemSeverity;
}) {
  const gem: GemRecord = {
    type: data.type,
    reason: data.reason,
    severity: data.severity || 'medium',
    content: data.content,
    time: admin.firestore.FieldValue.serverTimestamp(),
    resolution: 'pending',
  };

  try {
    const docRef = await getAdminDb().collection('gems').add(gem);
    console.log(`💎 Gem Recorded: [${docRef.id}] - Severity: ${gem.severity}`);
    return docRef.id;
  } catch (error) {
    console.error('🚨 Failed to record Gem:', error);
    return null;
  }
}
