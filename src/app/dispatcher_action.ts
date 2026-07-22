'use server';

export async function handleClosedLoopExecution(payload: { vfsNodeId: string; refactorGoal?: string }) {
  try {
    const { executeClosedLoopRefactor } = await import('@/ai/discovery/closed-loop-orchestrator');
    const result = await executeClosedLoopRefactor({
      vfsNodeId: payload.vfsNodeId,
      triggerSource: 'MANUAL',
      refactorGoal: payload.refactorGoal
    });
    return { success: true, data: result };
  } catch (error: any) {
    console.error("GATEWAY_ERROR: Closed loop execution failed.", error.message);
    return { success: false, error: error.message || "ORCHESTRATION_FAILED" };
  }
}