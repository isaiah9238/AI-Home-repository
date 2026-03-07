'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Activity, 
  Cpu, 
  ShieldCheck, 
  Database,
  Terminal as TerminalIcon,
  Zap,
  Globe,
  Lock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AIChat } from '@/components/ui/chat';
import { PortalInterface } from '@/components/portal-interface';
import { Badge } from '@/components/ui/badge';
import { getHomeBase, getCurriculumProgress, getSystemEvolution, getSystemIntegrity } from '@/app/actions';

interface InteriorDashboardProps {
  initialUserData?: any;
}

/**
 * The "Interior" of the AI Home. 
 * Designed as a high-fidelity cybernetic HUD.
 */
export function InteriorDashboard({ initialUserData }: InteriorDashboardProps) {
  const [time, setTime] = useState('');
  const [uptime, setUptime] = useState('00:00:00');
  const [profile, setProfile] = useState<any>(initialUserData || null);
  const [curriculum, setCurriculum] = useState<any>(null);
  const [evolution, setEvolution] = useState<any>(null);
  const [integrity, setIntegrity] = useState<any>(null);
  const [isWelcomeActive, setIsWelcomeActive] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour12: false }));
    }, 1000);

    let seconds = 0;
    const uptimeTimer = setInterval(() => {
      seconds++;
      const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
      const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
      const s = (seconds % 60).toString().padStart(2, '0');
      setUptime(`${h}:${m}:${s}`);
    }, 1000);

    // Replace your Promise.all block with this:
    const loadData = async () => {
    // 1. Fetch the other three (Curriculum, Evolution, Integrity)
      const [curriculumRes, evolutionRes, integrityRes] = await Promise.all([
        getCurriculumProgress(),
        getSystemEvolution(),
        getSystemIntegrity()
      ]);

      if (curriculumRes.success) setCurriculum(curriculumRes);
      if (evolutionRes.success) setEvolution(evolutionRes);
      if (integrityRes.success) setIntegrity(integrityRes);

      // 2. Only fetch the profile if the server didn't give it to us
      if (!initialUserData) {
        const profileRes = await getHomeBase();
        if (profileRes.success) setProfile(profileRes.data);
      }
    };

  loadData();

    // Welcome sequence
    const welcomeTimer = setTimeout(() => setIsWelcomeActive(false), 3000);

    return () => {
      clearInterval(timer);
      clearInterval(uptimeTimer);
      clearTimeout(welcomeTimer);
    };
  }, [initialUserData]);

  return (
    <div className="flex flex-col w-full gap-4 relative pb-12 animate-in fade-in duration-1000">
      
      {/* Welcome Overlay */}
      {isWelcomeActive && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505] animate-out fade-out fill-mode-forwards duration-1000 delay-2000 pointer-events-none">
          <div className="flex flex-col items-center gap-4 animate-in zoom-in-95 duration-700">
            <Zap className="w-12 h-12 text-blue-500 animate-pulse" />
            <h2 className="text-2xl font-mono tracking-[0.8em] uppercase text-white/80">Welcome_Home</h2>
            <div className="text-[10px] font-mono text-blue-500/40 uppercase tracking-widest">Neural_Sync_Initialzing...</div>
          </div>
        </div>
      )}

      {/* CRT Scanline Effect */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,118,0.06))] bg-[length:100%_2px,3px_100%]" />

      {/* Global HUD Header */}
      <header className="flex justify-between items-center px-6 py-4 border border-white/5 bg-black/60 backdrop-blur-2xl rounded-2xl z-20 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-10">
          <div className="flex flex-col">
            <span className="text-[9px] text-white/20 uppercase tracking-[0.3em] font-mono mb-1">Local_Node_Time</span>
            <span className="text-sm font-mono text-blue-400 tabular-nums tracking-wider">{time}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-white/20 uppercase tracking-[0.3em] font-mono mb-1">Session_Uptime</span>
            <span className="text-sm font-mono text-blue-400 tabular-nums tracking-wider">{uptime}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-white/20 uppercase tracking-[0.3em] font-mono mb-1">System_Status</span>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]" />
              <span className="text-xs font-mono text-white/60 tracking-widest uppercase">Stable_Core</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <Badge variant="outline" className="border-blue-500/20 text-blue-400/60 bg-blue-500/5 font-mono text-[9px] tracking-widest px-4 py-1">
              AUTH: {profile?.name ? profile.name.split(' ')[0].toUpperCase() : 'USER'}
            </Badge>
            <span className="text-[7px] text-white/10 uppercase tracking-[0.4em] mt-1">Cabinet_V4.2.0</span>
          </div>
          <div className="h-10 w-[1px] bg-white/5" />
          <div className="flex items-center gap-3 group cursor-help">
            <div className="p-2 rounded-lg bg-white/5 border border-white/5 group-hover:border-blue-500/30 transition-all">
              <Globe className="w-5 h-5 text-blue-500/60 group-hover:text-blue-400" />
            </div>
            <h1 className="text-base font-light tracking-[0.6em] uppercase text-white/70 font-mono hidden md:block">The_Cabinet</h1>
          </div>
        </div>
      </header>

      {/* Main Operational Grid */}
      <div className="grid grid-cols-12 gap-4 z-20">
        
        {/* Left Column: Stats & Identity */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
          <Card className="bg-black/60 border-white/5 backdrop-blur-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
              <Cpu className="w-20 h-20 text-blue-500" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-mono text-white/30 uppercase tracking-widest flex items-center gap-2">
                <User className="w-3 h-3 text-blue-500" /> Neural_Identity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl border border-blue-500/20 bg-blue-500/5 flex items-center justify-center text-blue-400 shadow-[0_0_20px_rgba(0,168,232,0.1)] group-hover:scale-105 transition-transform">
                  <Activity className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-xl font-mono text-white font-bold tracking-tighter">
                    {profile?.name || "Isaiah Smith"}
                  </div>
                  <div className="text-[9px] text-blue-500/40 font-mono uppercase tracking-[0.2em]">{profile?.role || "Primary User"}</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-[8px] font-mono uppercase tracking-widest text-white/40">
                    <span>Neural_Complexity</span>
                    <span className="text-blue-400">{curriculum?.neuralComplexity || 64}%</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500/60 transition-all duration-1000" 
                      style={{ width: `${curriculum?.neuralComplexity || 64}%` }} 
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[8px] font-mono uppercase tracking-widest text-white/40">
                    <span>Knowledge_Integration</span>
                    <span className="text-green-400">{curriculum?.knowledgeIntegration || 82}%</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500/60 transition-all duration-1000" 
                      style={{ width: `${curriculum?.knowledgeIntegration || 82}%` }} 
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/60 border-white/5 backdrop-blur-md flex-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-mono text-white/30 uppercase tracking-widest flex items-center gap-2">
                <Zap className="w-3 h-3 text-yellow-500" /> Active_Interests
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 font-mono">
              {(profile?.interests || ["Next.js", "AI Engineering", "UI/UX", "Land Surveying"]).map((interest: string) => (
                <div key={interest} className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/5 group hover:border-blue-500/30 hover:bg-blue-500/5 transition-all cursor-crosshair">
                  <span className="text-[10px] text-white/50 group-hover:text-blue-400 uppercase tracking-widest">{interest}</span>
                  <div className="w-1 h-1 rounded-full bg-blue-500/20 group-hover:bg-blue-500 animate-pulse" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Center Column: The Visualizer (Portal) */}
        <div className="col-span-12 lg:col-span-6 flex flex-col relative min-h-[600px] bg-black/40 rounded-2xl border border-white/5 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] backdrop-blur-sm group overflow-hidden">
          <div className="absolute top-6 left-6 z-30 opacity-20 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
              <Badge className="bg-blue-500/10 border-blue-500/20 text-blue-400 text-[8px] font-mono tracking-[0.3em] uppercase px-3 py-1">
                Visualizer_Active
              </Badge>
            </div>
          </div>
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_rgba(0,168,232,0.1)_0%,_transparent_70%)]" />
          <PortalInterface />
        </div>

        {/* Right Column: Feeds & Security */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
          <Card className="bg-black/60 border-white/5 backdrop-blur-md flex-1 flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-mono text-white/30 uppercase tracking-widest flex items-center gap-2">
                <Database className="w-3 h-3 text-purple-500" /> Librarian_Stream
              </CardTitle>
            </CardHeader>
            <CardContent className="font-mono text-[9px] space-y-5 px-4 overflow-y-auto custom-scrollbar">
              <div className="space-y-1 group">
                <div className="text-blue-400/70 group-hover:text-blue-400 transition-colors">[{time}] MENTOR_AI: BRIEFING_READY</div>
                <div className="text-white/30 pl-3 leading-relaxed border-l border-blue-500/20 ml-1">Contextual briefing generated based on recent progress.</div>
              </div>
              <div className="space-y-1 group">
                <div className="text-purple-400/70 group-hover:text-purple-400 transition-colors">[{evolution?.daysOld || 0}D] EVOLUTION: MILESTONE_SYNC</div>
                <div className="text-white/30 pl-3 leading-relaxed border-l border-purple-500/20 ml-1">System operational for {evolution?.daysOld || 0} cycles. Growth steady.</div>
              </div>
              <div className="space-y-1 group">
                <div className="text-green-400/70 group-hover:text-green-400 transition-colors">[GLOBAL] LIBRARIAN: MEMORY_SYNC</div>
                <div className="text-white/30 pl-3 leading-relaxed border-l border-green-500/20 ml-1">Universal template initialized. Personal context mapped.</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/60 border-white/5 backdrop-blur-md relative overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-mono text-white/30 uppercase tracking-widest flex items-center gap-2">
                <Lock className="w-3 h-3 text-red-500" /> Security_HUD
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 p-3 rounded-lg border border-white/5 flex flex-col gap-1 hover:bg-white/10 transition-all">
                  <span className="text-[8px] text-white/20 uppercase font-mono tracking-widest">Input</span>
                  <span className="text-[10px] text-green-500 font-mono font-bold tracking-widest">CLEAN</span>
                </div>
                <div className="bg-white/5 p-3 rounded-lg border border-white/5 flex flex-col gap-1 hover:bg-white/10 transition-all">
                  <span className="text-[8px] text-white/20 uppercase font-mono tracking-widest">Output</span>
                  <span className="text-[10px] text-green-500 font-mono font-bold tracking-widest">SAFE</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/10 flex items-center justify-between group">
                <div className="flex flex-col gap-1">
                  <span className="text-[8px] text-white/20 uppercase font-mono tracking-widest">Integrity_Risk</span>
                  <span className={`text-[10px] font-mono font-bold tracking-widest ${integrity?.isClean ? 'text-green-500' : 'text-red-500'}`}>
                    {integrity?.isClean ? 'NULL_ISSUES' : `${integrity?.issueCount || 0}_PENDING`}
                  </span>
                </div>
                <ShieldCheck className={`w-5 h-5 ${integrity?.isClean ? 'text-green-500/40' : 'text-red-500/60 group-hover:animate-bounce'}`} />
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

      {/* Bottom Interface: Terminal Input */}
      <footer className="z-20 border border-white/5 bg-black/60 backdrop-blur-2xl rounded-2xl p-6 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] relative mt-4 group">
        <div className="absolute top-3 right-6 text-[9px] font-mono text-white/10 flex items-center gap-2 group-hover:text-blue-500/40 transition-colors">
           <TerminalIcon className="w-3 h-3" /> MENTOR_TERMINAL_V4.2.0
        </div>
        <div className="max-w-4xl mx-auto">
          <AIChat />
        </div>
      </footer>
    </div>
  );
}
