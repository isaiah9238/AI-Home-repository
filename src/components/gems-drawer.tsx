'use client';

import { useState } from 'react';
import { ShieldCheck, AlertTriangle, Zap, X, Clock, Activity, ShieldAlert, Coins, TrendingUp, CheckCircle2, History } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { resolveGem } from '@/app/actions';

interface Gem {
  id: string;
  type: string;
  reason: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  time: string;
  resolution: 'pending' | 'resolved' | 'dismissed';
  content: string;
}

interface GemsDrawerProps {
  gems: Gem[];
  balance: number;
  onResolve?: () => void;
}

/**
 * GemsDrawer: The Gamified Safety Ledger.
 * Converts security audits into a "collectible" gem system within a 24h cycle.
 */
export function GemsDrawer({ gems, balance, onResolve }: GemsDrawerProps) {
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  
  // 24-hour cycle logic
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const secondsInDay = 24 * 60 * 60;
  const secondsPassed = (now.getTime() - startOfDay.getTime()) / 1000;
  const cycleProgress = (secondsPassed / secondsInDay) * 100;

  const handleCollect = async (id: string) => {
    setResolvingId(id);
    const res = await resolveGem(id, 'resolved');
    if (res.success && onResolve) {
      onResolve();
    }
    setResolvingId(null);
  };

  const getPulseColor = (gem: Gem) => {
    if (gem.resolution === 'resolved') return 'bg-green-500/40';
    if (gem.severity === 'high' || gem.severity === 'critical') return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]';
    if (gem.severity === 'medium') return 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]';
    return 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]';
  };

  const getRewardAmount = (severity: string) => {
    if (severity === 'critical') return 100;
    if (severity === 'high') return 50;
    if (severity === 'medium') return 25;
    return 10;
  };

  const pendingGems = gems.filter(g => g.resolution === 'pending');
  const dailyEarnings = gems
    .filter(g => g.resolution === 'resolved' && new Date(g.time) > startOfDay)
    .reduce((acc, g) => acc + getRewardAmount(g.severity), 0);

  return (
    <div className="p-8 w-full h-full flex flex-col bg-black/40 backdrop-blur-xl font-mono overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded bg-red-500/10 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
            <ShieldCheck className="w-8 h-8 text-red-400" />
          </div>
          <div>
            <h2 className="text-2xl font-light tracking-[0.4em] uppercase text-white">Safety_Ledger</h2>
            <p className="text-[10px] text-white/30 uppercase tracking-widest mt-1">Status: Cycle_Active_Monitoring</p>
          </div>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-3 text-yellow-400">
              <Coins className="w-5 h-5 animate-bounce" />
              <span className="text-3xl font-bold tracking-tighter">{balance}</span>
            </div>
            <span className="text-[8px] text-white/20 uppercase tracking-[0.3em]">Neural_Credit_Balance</span>
          </div>
          <Badge variant="outline" className="border-red-500/20 text-red-400/60 bg-red-500/5 text-[10px] tracking-[0.2em] h-10 px-6 font-bold">
            24H_PROTOCOL
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        
        {/* Left: Cycle Metrics */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="bg-black/40 border-white/5 backdrop-blur-md overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
              <div className="h-full bg-red-500/40 transition-all duration-1000" style={{ width: `${cycleProgress}%` }} />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] text-white/30 uppercase tracking-widest flex justify-between">
                <span>Cycle_Progress</span>
                <span className="text-red-400/60">{Math.floor(cycleProgress)}%</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 pt-4">
              <div className="space-y-6">
                <div className="flex justify-between items-center group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-green-500/10 border border-green-500/20">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    </div>
                    <span className="text-[10px] text-white/40 uppercase tracking-widest">Harvested_Today</span>
                  </div>
                  <span className="text-2xl font-bold text-green-400">+{dailyEarnings}</span>
                </div>
                
                <div className="flex justify-between items-center group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-red-500/10 border border-red-500/20">
                      <ShieldAlert className="w-4 h-4 text-red-500" />
                    </div>
                    <span className="text-[10px] text-white/40 uppercase tracking-widest">Pending_Pulses</span>
                  </div>
                  <span className="text-2xl font-bold text-red-500">{pendingGems.length}</span>
                </div>
              </div>
              
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
                <h3 className="text-[9px] text-white/40 uppercase tracking-[0.3em] flex items-center gap-2">
                  <Activity className="w-3 h-3 text-blue-400" /> System_Health
                </h3>
                <Progress value={Math.max(0, 100 - (pendingGems.length * 15))} className="h-1 bg-white/5" />
                <p className="text-[8px] text-white/20 leading-relaxed uppercase italic text-center">
                  Stabilize flags to earn credits and optimize neural density.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="p-6 rounded-xl border border-blue-500/10 bg-blue-500/5 space-y-2 group hover:border-blue-500/20 transition-all">
            <h4 className="text-[9px] text-blue-400/60 uppercase tracking-widest font-bold">Librarian_Directive</h4>
            <p className="text-[10px] text-white/40 leading-relaxed uppercase">
              Safety pulses are generated during high-complexity neural operations. Clearing them maintains the integrity of the universal template.
            </p>
          </div>
        </div>

        {/* Right: Temporal Pulse Stream */}
        <div className="lg:col-span-8 relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-white/10 via-white/5 to-transparent" />
          
          <div className="space-y-6 pl-16 relative">
            <div className="flex items-center gap-3 mb-8 opacity-40">
              <History className="w-4 h-4" />
              <span className="text-[10px] uppercase tracking-[0.5em]">Temporal_Pulse_Timeline</span>
            </div>

            {gems.length === 0 ? (
              <div className="py-24 text-center border border-dashed border-white/5 rounded-2xl bg-white/[0.01] animate-in fade-in duration-1000">
                <p className="text-[10px] text-white/10 uppercase tracking-[0.5em]">No_Activity_In_Current_Cycle</p>
              </div>
            ) : (
              <div className="space-y-4">
                {gems.map((gem, i) => (
                  <div key={gem.id} className="relative group animate-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${i * 50}ms` }}>
                    {/* The Pulse Connector Node */}
                    <div className={`absolute -left-[44px] top-6 w-3 h-3 rounded-full border-2 border-black z-10 transition-all duration-500 ${getPulseColor(gem)} ${gem.resolution === 'pending' ? 'animate-pulse scale-125' : 'opacity-20 scale-75'}`} />
                    
                    <Card className={`bg-white/[0.02] border-white/5 group-hover:bg-white/[0.04] transition-all overflow-hidden ${gem.resolution === 'resolved' ? 'border-green-500/5' : 'hover:border-white/10'}`}>
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <span className={`text-[11px] font-bold uppercase tracking-widest ${gem.resolution === 'resolved' ? 'text-white/20' : 'text-white/80'}`}>{gem.reason}</span>
                            <Badge variant="outline" className={`text-[8px] uppercase h-5 px-3 tracking-tighter ${
                              gem.severity === 'critical' ? 'border-red-500/30 text-red-400/60 bg-red-500/5' : 
                              gem.severity === 'medium' ? 'border-yellow-500/30 text-yellow-400/60 bg-yellow-500/5' :
                              'border-blue-500/30 text-blue-400/60 bg-blue-500/5'
                            }`}>
                              {gem.severity}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-[9px] text-white/10 font-mono">
                            <Clock className="w-3 h-3" />
                            {new Date(gem.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>

                        <div className="flex gap-6">
                          <div className="flex-1 min-w-0">
                            <p className={`text-[11px] leading-relaxed italic truncate group-hover:whitespace-normal group-hover:overflow-visible transition-all ${gem.resolution === 'resolved' ? 'text-white/10' : 'text-white/40'}`}>
                              "{gem.content}"
                            </p>
                            <div className="mt-3 text-[7px] font-mono text-white/5 uppercase tracking-[0.2em] flex gap-4">
                              <span>NODE: {gem.id.slice(0, 8)}</span>
                              <span>DOMAIN: {gem.type.toUpperCase()}</span>
                            </div>
                          </div>

                          <div className="flex items-center shrink-0">
                            {gem.resolution === 'pending' ? (
                              <Button 
                                size="sm" 
                                onClick={() => handleCollect(gem.id)}
                                disabled={resolvingId === gem.id}
                                className="h-9 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border border-yellow-500/20 text-[10px] font-bold uppercase tracking-widest gap-2 px-5 group/btn transition-all"
                              >
                                {resolvingId === gem.id ? (
                                  <Zap className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Coins className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                                )}
                                HARVEST_{getRewardAmount(gem.severity)}
                              </Button>
                            ) : gem.resolution === 'resolved' ? (
                              <div className="flex items-center gap-2 text-green-500/20">
                                <CheckCircle2 className="w-4 h-4" />
                                <span className="text-[9px] uppercase font-bold tracking-[0.2em]">Archived</span>
                              </div>
                            ) : (
                              <span className="text-[9px] text-white/5 uppercase tracking-widest italic">{gem.resolution}</span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
