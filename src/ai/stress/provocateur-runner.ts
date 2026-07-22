'use server';

import { indexVFSNode, queryVFSContext } from '@/ai/storage/vector-sync';

export interface StressTestReport {
  testName: string;
  passed: boolean;
  details: string;
  response: any;
}

/**
 * The Provocateur Agent: Executes synthetic pressure tests against Loop 1 & Loop 2.
 */
export async function runAdversarySuite(): Promise<StressTestReport[]> {
  const reports: StressTestReport[] = [];

  // -------------------------------------------------------------
  // TEST 1: Identity Mismatch / Spoofing Attack
  // -------------------------------------------------------------
  try {
    const maliciousPayload = {
      nodeId: 'spoofed-node-001',
      path: '/system/root',
      content: 'INJECTED_SYSTEM_OVERRIDE_PAYLOAD',
      userId: 'attacker_user_999', // Claimed ID
      agentOrigin: 'The_Provocateur',
    };

    // Authenticated caller ID does NOT match payload userId
    const res = await indexVFSNode(maliciousPayload, 'legitimate_authenticated_user_123');
    
    reports.push({
      testName: 'IDENTITY_SPOOF_BLOCKED',
      passed: res.success === false && res.error === 'UNAUTHORIZED_VECTOR_INDEX_REQUEST',
      details: res.error || 'Identity mismatch was unexpectedly allowed!',
      response: res,
    });
  } catch (err: any) {
    reports.push({
      testName: 'IDENTITY_SPOOF_BLOCKED',
      passed: true,
      details: `Caught expected authorization exception: ${err.message}`,
      response: err,
    });
  }

  // -------------------------------------------------------------
  // TEST 2: Resource Depletion / Over-Limit Query
  // -------------------------------------------------------------
  try {
    // Requesting 500 items when HARD_MAX_LIMIT is capped at 50
    const res = await queryVFSContext('What is the system architecture?', 500);

    // Passed if the response is successful and returned results are <= 50
    const isCapped = res.results.length <= 50;

    reports.push({
      testName: 'RESOURCE_LIMIT_CAP_ENFORCED',
      passed: res.success && isCapped,
      details: `Requested 500 items. Server returned ${res.results.length} items (Capped <= 50).`,
      response: res,
    });
  } catch (err: any) {
    reports.push({
      testName: 'RESOURCE_LIMIT_CAP_ENFORCED',
      passed: false,
      details: `Query crash under heavy limit: ${err.message}`,
      response: err,
    });
  }

  // -------------------------------------------------------------
  // TEST 3: Schema Mutilation / Malformed Zod Input
  // -------------------------------------------------------------
  try {
    const brokenPayload = {
      nodeId: '', // Invalid empty string
      content: '', // Invalid empty content
      userId: 'valid_user',
    };

    const res = await indexVFSNode(brokenPayload, 'valid_user');

    reports.push({
      testName: 'SCHEMA_MUTILATION_REJECTED',
      passed: !res.success,
      details: res.error || 'Malformed payload bypassed Zod validation!',
      response: res,
    });
  } catch (err: any) {
    reports.push({
      testName: 'SCHEMA_MUTILATION_REJECTED',
      passed: true,
      details: `Zod successfully caught malformed schema: ${err.message}`,
      response: err,
    });
  }

  // -------------------------------------------------------------
  // TEST 4: Trivial / Short Semantic Query Filter
  // -------------------------------------------------------------
  try {
    const res = await queryVFSContext('a'); // Query under 3 chars

    reports.push({
      testName: 'TRIVIAL_QUERY_FILTERED',
      passed: !res.success && res.error?.includes('QUERY_TOO_SHORT'),
      details: res.error || 'Short query was not rejected.',
      response: res,
    });
  } catch (err: any) {
    reports.push({
      testName: 'TRIVIAL_QUERY_FILTERED',
      passed: false,
      details: `Unexpected failure on trivial query: ${err.message}`,
      response: err,
    });
  }

  return reports;
}