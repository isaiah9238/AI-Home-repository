
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  User, 
  Activity, 
  Cpu, 
  Globe, 
  ShieldCheck, 
  Database,
  Search,
  BookOpen,
  Bot
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AIChat } from '@/components/ui/chat';
import { PortalInterface } from '@/components/portal-interface';
import { Badge } from '@/components/ui/badge';

export function InteriorDashboard() {
  const [time, setTime] = useState('');
  const [uptime, setUptime] = useState('00:00:00');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour12: false }));
    }, 1000);

    // Simulated uptime counter
    let seconds = 0;
    const uptimeTimer = setInterval(() => {
      seconds++;
      const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
      const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
      const s = (seconds % 60).toString().padStart(2, '0');
      setUptime(`${h}:${m}:${s}`);
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(uptimeTimer);
    };
  }, []);

  return (
    <div className="flex flex-col h-screen p-4 gap-4 overflow-hidden relative">
      {/* HUD Overlay - Scanlines & Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] z-10" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%]" />

      {/* Top Header Stats */}
      <header className="flex justify-between items-center px-4 py-2 border-b border-white/5 bg-white/5 backdrop-blur-md rounded-lg z-20">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] text-white/30 uppercase tracking-widest font-mono">System Time</span>
            <span className="text-sm font-mono text-green-400">{time}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-white/30 uppercase tracking-widest font-mono">Uptime</span>
            <span className="text-sm font-mono text-blue-400">{uptime}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-white/30 uppercase tracking-widest font-mono">Librarian Status</span>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-mono text-white/70">Online</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="border-white/10 text-white/50 bg-black/50">
            PROT_LEVEL: 04
          </Badge>
          <div className="h-8 w-[1px] bg-white/10 mx-2" />
          <h1 className="text-xl font-light tracking-[0.4em] uppercase text-white/90">AI Home Interior</h1>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="flex-1 grid grid-cols-12 gap-4 min-h-0 overflow-hidden z-20">
        
        {/* Left Column: Home Base (User Profile) */}
        <div className="col-span-3 flex flex-col gap-4 overflow-hidden">
          <Card className="bg-black/40 border-white/5 flex-shrink-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-mono text-white/40 uppercase tracking-widest flex items-center gap-2">
                <User className="w-3 h-3" /> Home_Base_Identity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-lg font-mono text-white/90">ISAIAH_SMITH</div>
                  <div className="text-[10px] text-white/40 font-mono">ID: AIH-0932-DELTA</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-white/30">NEURAL_SYNC</span>
                  <span className="text-green-500">98%</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[98%] shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-white/5 flex-1 min-h-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-mono text-white/40 uppercase tracking-widest flex items-center gap-2">
                <Activity className="w-3 h-3" /> Active_Interests
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 font-mono text-sm">
              {['NEXTJS_AI', 'WEB_DEVELOPMENT', 'AI_ENGINEERING', 'UI_UX_DESIGN', 'LAND_SURVEYING'].map((interest) => (
                <div key={interest} className="flex items-center gap-3 group cursor-pointer hover:bg-white/5 p-1 rounded transition-colors">
                  <div className="w-1 h-1 rounded-full bg-blue-500 group-hover:bg-green-400" />
                  <span className="text-white/60 group-hover:text-white transition-colors uppercase">{interest}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Middle Column: The Portal Orb */}
        <div className="col-span-6 flex flex-col relative overflow-hidden bg-black/20 rounded-xl border border-white/5">
          <div className="absolute top-4 left-4 z-30">
            <Badge className="bg-white/5 hover:bg-white/10 text-white/40 border-white/10 text-[8px] tracking-widest uppercase">
              Core_Visualizer_Active
            </Badge>
          </div>
          <PortalInterface />
        </div>

        {/* Right Column: Librarian Logs */}
        <div className="col-span-3 flex flex-col gap-4 overflow-hidden">
          <Card className="bg-black/40 border-white/5 flex-1 min-h-0 flex flex-col">
            <CardHeader className="pb-2 flex-shrink-0">
              <CardTitle className="text-xs font-mono text-white/40 uppercase tracking-widest flex items-center gap-2">
                <Database className="w-3 h-3" /> Librarian_Activity_Log
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 overflow-y-auto font-mono text-[10px] space-y-4 pr-2 custom-scrollbar">
              <div className="space-y-1">
                <div className="text-green-500/70">[12:44:01] FLUX_ECHO_SCANNED_URL</div>
                <div className="text-white/40 pl-3">Target: https://nextjs.org/docs</div>
              </div>
              <div className="space-y-1">
                <div className="text-blue-500/70">[12:43:22] MENTOR_AI_RESPONSE_GENERATED</div>
                <div className="text-white/40 pl-3">Context: User query regarding "App Router"</div>
              </div>
              <div className="space-y-1">
                <div className="text-yellow-500/70">[12:42:10] SECURITY_GATEKEEPER_ENGAGED</div>
                <div className="text-white/40 pl-3">Status: Pass (Input validation verified)</div>
              </div>
              <div className="space-y-1">
                <div className="text-purple-500/70">[12:41:55] LESSON_PLAN_SYNTHESIZED</div>
                <div className="text-white/40 pl-3">Topic: Advanced React Patterns</div>
              </div>
              <div className="space-y-1 text-white/20 animate-pulse">
                <div>[12:45:00] AWAITING_NEW_VECTOR_INPUT...</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-white/5 flex-shrink-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-mono text-white/40 uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck className="w-3 h-3" /> Safety_Matrix
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              <div className="bg-white/5 p-2 rounded flex items-center justify-between">
                <span className="text-[8px] font-mono text-white/30 uppercase">Inbound</span>
                <span className="text-[10px] font-mono text-green-500">CLEAN</span>
              </div>
              <div className="bg-white/5 p-2 rounded flex items-center justify-between">
                <span className="text-[8px] font-mono text-white/30 uppercase">Outbound</span>
                <span className="text-[10px] font-mono text-green-500">SAFE</span>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

      {/* Bottom Terminal: Mentor AI Interface */}
      <footer className="h-1/3 flex-shrink-0 z-20">
        <AIChat />
      </footer>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
