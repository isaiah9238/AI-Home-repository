import { CodeAnalyzerClient } from './code-analyzer-client';
import type { Metadata } from 'next';
import { Cpu } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Code Inspector | AI Home',
    description: 'Specialized security and performance auditor within the Cabinet.',
};

export default function CodeAnalyzerPage() {
  return (
    <div className="w-full p-8 bg-[#050505] min-h-screen text-white font-mono">
      <div className="mb-8 border-l-4 border-purple-500 pl-6 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-light tracking-[0.2em] uppercase flex items-center gap-4">
            <Cpu className="w-8 h-8 text-purple-500" /> Code_Inspector
          </h1>
          <p className="text-white/40 mt-2 uppercase tracking-widest text-xs">
            Specialized security and performance auditor. Analyzing neural logic streams.
          </p>
        </div>
        <div className="hidden md:block text-right">
          <div className="text-[10px] text-purple-500/50 uppercase tracking-[0.3em]">Module: RESEARCH_DEVELOPMENT</div>
          <div className="text-[10px] text-white/20 uppercase tracking-[0.3em]">Status: READY_FOR_SYNC</div>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto">
        <CodeAnalyzerClient />
      </div>
    </div>
  );
}
