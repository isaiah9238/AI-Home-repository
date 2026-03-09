// src/components/AuditSidebar.tsx
'use client';

import { useState, useEffect } from 'react';
import { getAuditHistory } from '@/app/code-analyzer/actions';

export default function AuditSidebar({ onSelectAudit }: { onSelectAudit: (audit: any) => void }) {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      const response = await getAuditHistory();
      
      // 🛡️ Only set history if the Librarian successfully found the data
      if (response.success && response.data) {
        setHistory(response.data); 
      } else {
        console.error("LIBRARIAN_ERROR:", response.error);
      }
      
      setLoading(false);
    };
    loadHistory();
  }, []);
  
  return (
    <div className="w-64 bg-black border-r border-cyber-blue p-4 h-full overflow-y-auto">
      <h3 className="text-greenish-yellow uppercase tracking-widest text-xs mb-6">
        _LIBRARIAN_ARCHIVE
      </h3>
      
      {loading ? (
        <div className="animate-pulse text-cyber-blue text-xs">SYNCING...</div>
      ) : (
        <div className="space-y-4">
          {history.map((audit) => (
            <button
              key={audit.id}
              onClick={() => onSelectAudit(audit)}
              className="w-full text-left group border-l-2 border-transparent hover:border-greenish-yellow pl-2 transition-all"
            >
              <div className="text-cyber-blue text-[10px] font-mono opacity-70">
                {new Date(audit.timestamp).toLocaleDateString()}
              </div>
              <div className="text-white text-xs truncate group-hover:text-greenish-yellow">
                {audit.fileName || 'Untitled_Logic'}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}