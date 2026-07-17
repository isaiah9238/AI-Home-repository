'use client';

import React, { useState, useEffect } from 'react';
import { Cpu } from 'lucide-react';
import { CodeAnalyzerClient } from '@/app/code-analyzer/code-analyzer-client';
import { AuditSidebar } from '@/components/AuditSidebar';
import { getAuditHistory } from './actions';

interface Audit {
  id: string;
  fileName: string;
  agent: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  data?: any; 
  language?: string;
}

export default function CodeAnalyzerPage() {
  const [history, setHistory] = useState<Audit[]>([]);
  const [activeAuditData, setActiveAuditData] = useState<any | null>(null);

  // Sync historical audits directly from the Librarian's ledger
  useEffect(() => {
    async function syncArchives() {
      const res = await getAuditHistory(15);
      if (res.success && res.data) {
        // Map fields explicitly to align with the Audit UI typing
        const mappedHistory = res.data.map((doc: any) => ({
          id: doc.id,
          fileName: doc.language ? `SRC_LOG.${doc.language.toUpperCase()}` : 'SOURCE_LOG',
          agent: doc.agent || 'Code Inspector',
          status: doc.status || 'SUCCESS',
          data: doc.data || null
        }));
        setHistory(mappedHistory);
      }
    }
    syncArchives();
  }, []);

  const handleSelect = (audit: Audit) => {
    if (audit.data) {
      setActiveAuditData(audit.data);
    }
    console.log('Recalled neural logic vector:', audit.id);
  };

  return (
    <div className="flex w-full min-h-screen bg-[#050505] text-white font-mono overflow-hidden">
      
      {/* 1. THE LIBRARIAN SIDEBAR (Reactive Track) */}
      <div className="hidden lg:block">
        <AuditSidebar 
          history={history} 
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
          <CodeAnalyzerClient injectedHistoricalData={activeAuditData} />
        </div>
      </div>
    </div>
  );
}