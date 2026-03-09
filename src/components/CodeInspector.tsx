import React from 'react';

// Use a simple JSON formatter to keep it "Zero-Cost" and light
export function CodeInspector({ selectedAudit }) {
  if (!selectedAudit) {
    return (
      <div className="flex-1 flex items-center justify-center text-white/10">
        <div className="text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em]">Waiting for Input</p>
          <p className="text-[10px] mt-2">Select an archive from the Librarian Ledger</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-black/40 overflow-hidden">
      {/* Header with File Info */}
      <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/5">
        <div className="flex flex-col">
          <h3 className="text-xs font-mono text-green-400">{selectedAudit.fileName}</h3>
          <span className="text-[10px] text-white/30 uppercase tracking-widest">
            Agent: {selectedAudit.agent}
          </span>
        </div>
        <div className="text-[10px] font-mono text-white/20">
          ID: {selectedAudit.id.slice(0, 8)}...
        </div>
      </div>

      {/* Scrollable JSON View */}
      <div className="flex-1 p-6 overflow-auto font-mono text-sm leading-relaxed">
        <pre className="text-white/70">
          {JSON.stringify(selectedAudit.data || selectedAudit, null, 2)}
        </pre>
      </div>
    </div>
  );
}