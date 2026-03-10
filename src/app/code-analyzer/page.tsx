'use client';

import { useState } from 'react';
import { Cpu } from 'lucide-react';
import { CodeAnalyzerClient } from '@/app/code-analyzer/code-analyzer-client';
import { AuditSidebar } from '@/components/AuditSidebar';

interface Audit {
  id: string;
  fileName: string;
  agent: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  data?: any; 
}

export default function CodeAnalyzerPage() {
  const [selectedAudit, setSelectedAudit] = useState<Audit | null>(null);

  const handleSelect = (audit: Audit) => {
    setSelectedAudit(audit);
    // Integration: Pass this to the client or log it
    console.log('Recalling:', audit);
  };

  return (
    <div className="flex w-full min-h-screen bg-[#050505] text-white font-mono overflow-hidden">
      
      {/* 1. THE LIBRARIAN SIDEBAR */}
      <div className="hidden lg:block">
        <AuditSidebar 
          history={[]} // Initialize with empty history to prevent errors
          onSelectAudit={handleSelect} 
        />
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
