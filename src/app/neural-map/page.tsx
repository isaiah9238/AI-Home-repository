// src/app/neural-map/page.tsx
import { getVFSNodesAction } from '@/app/actions';
import { NeuralGraph } from '@/components/neural-graph';

export default async function NeuralMapPage() {
  // 1. Fetch the primary nodes from the Cabinet
  const response = await getVFSNodesAction(null); 
  const nodes = (response.success && response.data) ? response.data : []; // Force empty array if fail

  return (
    <main className="min-h-screen bg-[#050505] p-8 flex flex-col items-center">
      <h1 className="text-cyan-500 font-mono tracking-[0.3em] mb-12">
        SYSTEM_CORE_ORCHESTRATION
      </h1>
      
      {/* 2. The Visualizer Viewport */}
      <div className="w-full max-w-6xl aspect-video border border-cyan-500/20 rounded-2xl bg-black/50 backdrop-blur-xl relative overflow-hidden">
      <NeuralGraph 
        lessons={nodes} 
        neuralComplexity={94} 
        knowledgeIntegration={96} 
      />
        
        {/* 3. Real-time Status Pulses */}
        <div className="absolute bottom-4 left-4 font-mono text-[10px] text-cyan-800">
          INTEGRATION: {response.success ? '96%' : 'OFFLINE'}
        </div>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-4xl">
        {nodes.map((node: any, idx: number) => (
          <div 
            key={node.id || `vfs-node-${idx}`} 
            className="p-3 border border-cyan-900/30 bg-black/40 rounded text-cyan-500 font-mono text-xs"
          >
             NODE_ID: {node.name}
          </div>
        ))}
      </div>
    </main>
  );
}
