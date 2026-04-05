'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { AuditSidebar } from "@/components/AuditSidebar";
import { CodeInspector } from "@/components/CodeInspector";
import { Activity, Cpu, Loader2, Shield } from "lucide-react";
import { getInternalComms } from '@/app/actions';

// 🏛️ Define the Audit interface to match the Sidebar's expectations
interface Audit {
  id: string;
  fileName: string;
  agent: string;
  status: "SUCCESS" | "FAILED" | "PENDING";
  data?: any;
  timestamp?: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [selectedAudit, setSelectedAudit] = useState<Audit | null>(null);
  const [history, setHistory] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      fetchHistory();
    }
  }, [status]);

  const fetchHistory = async () => {
    setLoading(true);
    const res = await getInternalComms();
    if (res.success) {
      const formattedData = res.data.map((item: any) => ({
        id: item.id,
        fileName: item.target || 'System_Audit',
        agent: item.agent || 'Unknown_Agent',
        status: item.status || 'SUCCESS',
        timestamp: item.timestamp,
        data: item
      }));
      setHistory(formattedData);
    }
    setLoading(false);
  };

  // 🛡️ Guard 1: The "Librarian is checking the logs" loading state
  if (status === "loading") {
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center text-blue-500 font-mono">
        <Loader2 className="animate-spin mb-4 w-8 h-8" />
        <span className="text-[10px] tracking-[0.3em] animate-pulse">SYNCHRONIZING_NODE_ACCESS...</span>
      </div>
    );
  }

  // 🛡️ Guard 2: Unauthorized Personnel Redirect
  if (!session) {
    redirect("/login");
  }

  return (
    <main className="h-screen w-full bg-[#050505] text-white flex flex-col overflow-hidden font-sans selection:bg-blue-500/30">
      {/* 🏛️ HUD Header */}
      <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-white/[0.02] relative z-10">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-blue-500/10 rounded border border-blue-500/20">
            <Cpu className="w-4 h-4 text-blue-500" />
          </div>
          <h1 className="text-xs font-bold tracking-[0.4em] uppercase flex items-center gap-3">
            Studio_Cabinet / V.4 {loading && <Loader2 className="w-3 h-3 animate-spin opacity-40" />}
          </h1>
        </div>

        <div className="flex items-center gap-8 opacity-60">
          <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-green-400">
            <Shield className="w-3 h-3" /> Firewall_Active
          </div>
          <div className="text-[9px] uppercase tracking-widest border-l border-white/10 pl-8">
            Node: <span className="text-blue-400">{session.user?.name || "Isaiah"}</span>
          </div>
        </div>
      </header>

      {/* 🛡️ Content Grid */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Librarian Ledger (Sidebar) */}
        <aside className="w-80 border-r border-white/5 bg-black/40 flex flex-col">
          <AuditSidebar 
            history={history} 
            onSelectAudit={setSelectedAudit} 
          />
        </aside>

        {/* The Altar (Code Inspector) */}
        <section className="flex-1 bg-black/20 flex flex-col">
          <CodeInspector selectedAudit={selectedAudit} />
        </section>
      </div>

      {/* 🛠️ Bottom Metadata Bar */}
      <footer className="h-8 border-t border-white/5 bg-black px-6 flex items-center justify-between text-[8px] uppercase tracking-[0.2em] text-white/10">
        <span>Authorization: Admin_Root</span>
        <span className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          Connection_Established: TLS_1.3
        </span>
      </footer>
    </main>
  );
}