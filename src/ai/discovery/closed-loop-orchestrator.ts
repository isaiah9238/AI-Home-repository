import 'server-only';

import { analyzeCodeSnippet } from '@/ai/domains/research/analyze-code-snippet';
import { generateInitialFiles } from '@/ai/discovery/generate-initial-files';
import { persistVFSNode, getVFSNode } from '@/ai/storage/virtual-file-system';

export interface AutonomousRefactorPayload {
  vfsNodeId: string;
  triggerSource: 'SCOUT' | 'PROVOCATEUR' | 'ADVERSARY' | 'MANUAL';
  refactorGoal?: string;
}

export interface OrchestrationResult {
  success: boolean;
  stage: 'INSPECTION' | 'ARCHITECT_DRAFT' | 'SANDBOX_VALIDATION' | 'VFS_COMMIT' | 'FAILED';
  nodeId: string;
  inspectionSummary?: any;
  refactoredFiles?: any[];
  error?: string;
}

export async function executeClosedLoopRefactor(
  payload: AutonomousRefactorPayload
): Promise<OrchestrationResult> {
  console.log(`⚡ CLOSED_LOOP: Initializing refactor cycle for VFS Node: ${payload.vfsNodeId}`);

  try {
    // 1. Fetch Target Node
    const existingNode = await getVFSNode(payload.vfsNodeId);
    if (!existingNode) {
      return { success: false, stage: 'FAILED', nodeId: payload.vfsNodeId, error: 'Target VFS Node not found.' };
    }

    // 2. Stage 1: Code Inspector Audit
    console.log(`🔍 STAGE 1: Code Inspector auditing [${existingNode.path}]...`);
    const inspection = await analyzeCodeSnippet({
      code: existingNode.content,
      language: existingNode.type || 'typescript',
      context: payload.refactorGoal || 'Analyze for performance optimizations and code clarity.'
    });

    // 3. Stage 2: Architect Draft via generateInitialFiles
    console.log(`🏗️ STAGE 2: Architect generating updated file variations...`);
    const architectBlueprint = `
      REFACTOR TASK FOR FILE: ${existingNode.path}
      REFACTOR GOAL: ${payload.refactorGoal || 'Optimize and refactor code based on inspection audit.'}
      CODE INSPECTOR AUDIT: ${JSON.stringify(inspection)}
      ORIGINAL CONTENT:
      ${existingNode.content}
    `;

    const generatedFiles = await generateInitialFiles({
      blueprint: architectBlueprint,
      enableVectorRAG: true // Employs semantic RAG search across VFS
    });

    if (!generatedFiles || generatedFiles.length === 0) {
      return { success: false, stage: 'ARCHITECT_DRAFT', nodeId: payload.vfsNodeId, error: 'Architect produced no files.' };
    }

    // 4. Stage 3 & 4: Commit refactored nodes to VFS
    console.log(`📚 STAGE 3/4: Librarian committing ${generatedFiles.length} nodes to VFS...`);
    for (const file of generatedFiles) {
      await persistVFSNode({
        id: file.path,
        path: file.path,
        type: file.type,
        content: file.content || '',
        metadata: {
          lastRefactoredBy: 'CLOSED_LOOP_ORCHESTRATOR',
          triggerSource: payload.triggerSource,
          inspectionSummary: inspection
        }
      });
    }

    console.log(`✅ CLOSED_LOOP: Successfully refactored and updated VFS for [${existingNode.path}]`);

    return {
      success: true,
      stage: 'VFS_COMMIT',
      nodeId: payload.vfsNodeId,
      inspectionSummary: inspection,
      refactoredFiles: generatedFiles
    };

  } catch (error: any) {
    console.error(`💥 CLOSED_LOOP_ERROR: Orchestration failed.`, error.message);
    return {
      success: false,
      stage: 'FAILED',
      nodeId: payload.vfsNodeId,
      error: error.message || 'ORCHESTRATION_FAILED'
    };
  }
}