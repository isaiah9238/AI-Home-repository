import React from 'react';
import { Trash2 } from 'lucide-react'; // Removed FileCode since it's unused
import { deleteAudit } from '@/app/actions';

// 🏛️ 1. Define the shape of the Audit for TypeScript
interface Audit {
  id: string;
  fileName: string;
  agent: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
}

interface AuditSidebarProps {
  history: Audit[];
  onSelectAudit: (item: Audit) => void;
}

export function AuditSidebar({ history, onSelectAudit }: AuditSidebarProps) {
  return (
    <div className="flex flex-col w-64 h-full bg-black/20 border-r border-white/5 p-4 overflow-y-auto">
      <h2 className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-6 font-bold">
        Librarian Archive
      </h2>
      
      <div className="space-y-2">
        {/* Added a check to ensure history exists before mapping */}
        {history?.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectAudit(item)}
            className="group flex w-full items-center justify-between p-3 rounded-lg border border-transparent hover:border-white/10 hover:bg-white/5 transition-all cursor-pointer min-w-0"
          >
            {/* TEXT SECTION */}
            <div className="flex items-center gap-3 min-w-0 mr-2">
              {/* The Status Dot */}
              <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                item.status === 'SUCCESS' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 
                item.status === 'FAILED' ? 'bg-red-500' : 'bg-yellow-500'
              }`} />
      
              <div className="flex flex-col min-w-0">
                <span className="truncate text-xs font-mono text-white/80 group-hover:text-green-400 transition-colors">
                  {item.fileName}
                </span>
                <span className="text-[9px] text-white/30 uppercase tracking-widest font-medium">
                  {item.agent}
                </span>
              </div>
            </div>

            {/* TRASH CAN */}
            <button
              onClick={async (e) => {
                e.stopPropagation(); 
                if (confirm(`Wipe ${item.fileName} from Ledger?`)) {
                  await deleteAudit(item.id);
                }
              }}
              className="opacity-0 group-hover:opacity-100 p-2 text-white/20 hover:text-red-500 transition-all shrink-0"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}