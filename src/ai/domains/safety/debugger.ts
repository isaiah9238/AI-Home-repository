// Instructions: Create this file to capture telemetric pulses.
// This allows the Laboratory Drawer to see exactly where a node fails.

import { getAdminDb } from '@/lib/firebaseAdmin';
import * as admin from 'firebase-admin';

export interface DebugPulse {
  id: string;
  timestamp: string;
  origin: 'portal' | 'cabinet' | 'librarian';
  level: 'info' | 'warning' | 'critical';
  message: string;
  stack?: string;
  metadata?: any;
}

/**
 * Logs a diagnostic pulse to the Cabinet's central ledger.
 */
export async function logPulse(pulse: Omit<DebugPulse, 'id' | 'timestamp'>) {
  const db = getAdminDb();
  const docRef = db.collection('debug_ledger').doc();

  const newPulse = {
    ...pulse,
    id: docRef.id,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  };

  await docRef.set(newPulse);
  console.log(`📡 DEBUGGER: Pulse captured from ${pulse.origin}`);
  return newPulse;
}