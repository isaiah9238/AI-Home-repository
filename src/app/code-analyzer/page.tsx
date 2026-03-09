// src/app/code-analyzer/page.tsx
import { Cpu } from 'lucide-react'; // Assuming lucide-react for the icon
import { CodeAnalyzerClient } from '@/app/code-analyzer/code-analyzer-client';
import AuditSidebar from '@/components/AuditSidebar';

export default function CodeAnalyzerPage() {
  return (
    // changed to flex to allow sidebar and main content to sit side-by-side
    <div className="flex w-full min-h-screen bg-[#050505] text-white font-mono overflow-hidden">
      
      {/* 1. THE LIBRARIAN SIDEBAR */}
      <div className="hidden lg:block">
        <AuditSidebar onSelectAudit={(audit) => console.log('Recalling:', audit)} />
      </div>

      {/* 2. THE MAIN INSPECTOR PANEL */}
      <div className="flex-1 overflow-y-auto p-8">
        {/* Header Section */}
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
        
        {/* Main Content Area */}
        <div className="max-w-6xl">
          <CodeAnalyzerClient />
        </div>
      </div>
    </div>
  );
}