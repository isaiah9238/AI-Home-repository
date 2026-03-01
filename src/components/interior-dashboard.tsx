'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Activity, 
  Cpu, 
  ShieldCheck, 
  Database,
  Search,
  BookOpen,
  MessageSquareCode,
  Terminal as TerminalIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AIChat } from '@/components/ui/chat';
import { PortalInterface } from '@/components/portal-interface';
import { Badge } from '@/components/ui/badge';
import { getHomeBase } from '@/app/actions';

/**
 * The "Interior" of the AI Home. 
 * Designed as a cybernetic HUD that surrounds the user with system data.
 */
export function InteriorDashboard() {
  const [time, setTime] = useState('');
  const [uptime, setUptime] = useState('00:00:00');
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    // Clock Implementation
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour12: false }));
    }, 1000);

    // Uptime Simulation
    let seconds = 0;
    const uptimeTimer = setInterval(() => {
      seconds++;
      const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
      const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
      const s = (seconds % 60).toString().padStart(2, '0');
      setUptime(`${h}:${m}:${s}`);
    }, 1000);

    // Fetch User Profile (Librarian)
    getHomeBase().then(res => {
      if (res.success) setProfile(res.data);
    });

    return () => {
      clearInterval(timer);
      clearInterval(uptimeTimer);
    };
  }, []);

  return (
    <div className="flex flex-col h-screen p-4 gap-4 overflow-hidden relative">
      {/* Scanline Effect */}
      <div className="hud-scanline" />

      {/* Global HUD Header */}
      <header className="flex justify-between items-center px-4 py-2 border border-white/10 bg-black/40 backdrop-blur-xl rounded-lg z-20 shadow-2xl">
        <div className="flex items-center gap-8">
          <div className="flex flex-col">
            <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-mono">System_Clock</span>
            <span className="text-sm font-mono text-green-400 tabular-nums">{time}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-mono">Uptime_Metric</span>
            <span className="text-sm font-mono text-blue-400 tabular-nums">{uptime}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-mono">Librarian_Link</span>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
              <span className="text-sm font-mono text-white/70">Online</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="border-white/10 text-white/40 bg-white/5 font-mono text-[10px] tracking-widest px-3">
            AUTH_STATE: ISAIAH_S
          </Badge>
          <div className="h-8 w-[1px] bg-white/10 mx-2" />
          <h1 className="text-lg font-light tracking-[0.5em] uppercase text-white/80 font-mono">AI_Home_Interior</h1>
        </div>
      </header>

      {/* Main Operational Grid */}
      <div className="flex-1 grid grid-cols-12 gap-4 min-h-0 overflow-hidden z-20">
        
        {/* Left Column: Home Base (Identity) */}
        <div className="col-span-3 flex flex-col gap-4 overflow-hidden">
          <Card className="bg-black/60 border-white/5 backdrop-blur-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-mono text-white/40 uppercase tracking-widest flex items-center gap-2">
                <User className="w-3 h-3 text-green-500" /> Identity_Matrix
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded border border-green-500/20 bg-green-500/5 flex items-center justify-center text-green-500 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-lg font-mono text-white/90 uppercase tracking-tighter">
                    {profile?.name || "AWAIT_INIT"}
                  </div>
                  <div className="text-[9px] text-white/30 font-mono uppercase">Lvl_01_Architect</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[9px] font-mono">
                  <span className="text-white/20 uppercase">Neural_Sync</span>
                  <span className="text-green-500">OPTIMAL</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500/60 w-[94%] shadow-[0_0_10px_rgba(34,197,94,0.3)]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/60 border-white/5 backdrop-blur-md flex-1 min-h-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-mono text-white/40 uppercase tracking-widest flex items-center gap-2">
                <Activity className="w-3 h-3 text-blue-500" /> Core_Interests
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 font-mono pr-2 overflow-y-auto custom-scrollbar h-full">
              {(profile?.interests || ["Next.js", "AI", "UI Design"]).map((interest: string) => (
                <div key={interest} className="flex items-center justify-between p-2 rounded bg-white/5 border border-white/5 group hover:bg-white/10 transition-all cursor-crosshair">
                  <span className="text-[10px] text-white/60 group-hover:text-blue-400 uppercase tracking-tight">{interest}</span>
                  <div className="w-1 h-1 rounded-full bg-blue-500/50 group-hover:animate-ping" />
                </div>
              ))}
              <div className="pt-4 mt-4 border-t border-white/5 text-[9px] text-white/20 italic text-center">
                AWAITING_NEW_VECTORS...
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Center Column: The Portal (Gateway) */}
        <div className="col-span-6 flex flex-col relative overflow-hidden bg-black/40 rounded-xl border border-white/10 shadow-[inset_0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-sm group">
          <div className="absolute top-4 left-4 z-30 opacity-40 group-hover:opacity-100 transition-opacity">
            <Badge className="bg-white/5 border-white/10 text-[8px] font-mono tracking-widest uppercase">
              Operational_Visualizer
            </Badge>
          </div>
          <PortalInterface />
        </div>

        {/* Right Column: Librarian Activity Feed */}
        <div className="col-span-3 flex flex-col gap-4 overflow-hidden">
          <Card className="bg-black/60 border-white/5 backdrop-blur-md flex-1 min-h-0 flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-mono text-white/40 uppercase tracking-widest flex items-center gap-2">
                <Database className="w-3 h-3 text-purple-500" /> Librarian_Stream
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 overflow-y-auto font-mono text-[9px] space-y-4 pr-2 custom-scrollbar">
              <div className="space-y-1">
                <div className="text-green-500/70">[14:30:01] FLUX_ECHO: RECON_COMPLETE</div>
                <div className="text-white/40 pl-3 leading-relaxed border-l border-green-500/20 ml-1">Target link analyzed. Vectors stored in Home Base.</div>
              </div>
              <div className="space-y-1">
                <div className="text-blue-500/70">[14:28:45] MENTOR_AI: BRIEFING_READY</div>
                <div className="text-white/40 pl-3 leading-relaxed border-l border-blue-500/20 ml-1">Synthetic brief prepared for primary owner.</div>
              </div>
              <div className="space-y-1">
                <div className="text-purple-500/70">[14:25:12] SYSTEM: STORAGE_SYNC</div>
                <div className="text-white/40 pl-3 leading-relaxed border-l border-purple-500/20 ml-1">Primary profile synchronized with Librarian core.</div>
              </div>
              <div className="text-white/10 animate-pulse mt-8 text-center uppercase tracking-widest">
                Listening_For_Changes...
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/60 border-white/5 backdrop-blur-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-mono text-white/40 uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck className="w-3 h-3 text-red-500" /> Matrix_Security
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              <div className="bg-white/5 p-2 rounded border border-white/5 flex flex-col gap-1">
                <span className="text-[8px] text-white/20 uppercase font-mono">Input</span>
                <span className="text-[10px] text-green-500 font-mono">SECURE</span>
              </div>
              <div className="bg-white/5 p-2 rounded border border-white/5 flex flex-col gap-1">
                <span className="text-[8px] text-white/20 uppercase font-mono">Output</span>
                <span className="text-[10px] text-green-500 font-mono">CLEAN</span>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

      {/* Bottom Interface: Terminal Input */}
      <footer className="h-[35%] flex-shrink-0 z-20 border border-white/10 bg-black/60 backdrop-blur-xl rounded-xl p-4 shadow-2xl relative">
        <div className="absolute top-2 right-4 text-[9px] font-mono text-white/20 flex items-center gap-2">
           <TerminalIcon className="w-3 h-3" /> MENTOR_TERMINAL_V2.0.4
        </div>
        <AIChat />
      </footer>
    </div>
  );
}
