'use client';

import { useState, useEffect } from 'react';
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
 * Converts security audits into a "collectible" gem system.
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
    if (gem.resolution === 'resolved') return 'bg-green-500';
    if (gem.severity === 'high' || gem.severity === 'critical') return 'bg-red-500';
    if (gem.severity === 'medium') return 'bg-yellow-500';
    return 'bg-blue-500';
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
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3 text-red-400">
          <div className="p-2 rounded bg-red-500/10 border border-red-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-light tracking-[0.3em] uppercase">Safety_Ledger_Gems</h2>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-2 text-yellow-400">
              <Coins className="w-4 h-4 animate-bounce" />
              <span className="text-xl font-bold tracking-widest">{balance}</span>
            </div>
            <span className="text-[8px] text-white/20 uppercase tracking-[0.2em]">CURRENT_GEM_BALANCE</span>
          </div>
          <Badge variant="outline" className="border-red-500/20 text-red-400/60 bg-red-500/5 text-[8px] tracking-[0.2em] h-8 px-4">
            CYCLE_ACTIVE
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Gamified Summary */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="bg-black/40 border-white/5 backdrop-blur-md overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
              <div className="h-full bg-red-500/40" style={{ width: `${cycleProgress}%` }} />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] text-white/30 uppercase tracking-widest flex justify-between">
                <span>24h_Cycle_Progress</span>
                <span className="text-red-400/60">{Math.floor(cycleProgress)}%</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-white/20 uppercase flex items-center gap-2"><TrendingUp className="w-3 h-3 text-green-500" /> Daily_Earnings</span>
                  <span className="text-lg font-bold text-green-400">+{dailyEarnings}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-white/20 uppercase flex items-center gap-2"><ShieldAlert className="w-3 h-3 text-red-500" /> Pending_Resolutions</span>
                  <span className="text-lg font-bold text-red-500">{pendingGems.length}</span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-white/5">
                <p className="text-[8px] text-white/20 leading-relaxed uppercase italic">
                  Resolve security flags to stabilize neural pathways and harvest gems.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="p-6 rounded-xl border border-red-500/10 bg-red-500/5 space-y-4 group hover:bg-red-500/10 transition-all">
            <h3 className="text-[9px] text-red-400/60 uppercase tracking-[0.3em] flex items-center gap-2">
              <Activity className="w-3 h-3" /> System_Integrity_Status
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
              <span className="text-xs text-white/80 uppercase tracking-widest">Architect_Shield_Online</span>
            </div>
            <Progress value={100 - (pendingGems.length * 10)} className="h-1 bg-white/5" />
          </div>
        </div>

        {/* Right: Gem Collection Timeline */}
        <div className="lg:col-span-8 relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-white/10 via-white/5 to-transparent" />
          
          <div className="space-y-6 pl-12 relative">
            <div className="flex items-center gap-2 mb-8">
              <History className="w-3 h-3 text-white/20" />
              <span className="text-[9px] text-white/20 uppercase tracking-[0.4em]">Temporal_Security_Stream</span>
            </div>

            {gems.length === 0 ? (
              <div className="py-24 text-center border border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
                <p className="text-[10px] text-white/10 uppercase tracking-[0.5em]">No_Security_Pulses_In_Current_Cycle</p>
              </div>
            ) : (
              gems.map((gem, i) => (
                <div key={gem.id} className="relative group animate-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${i * 50}ms` }}>
                  {/* The Pulse Connector */}
                  <div className={`absolute -left-[36px] top-4 w-2 h-2 rounded-full border border-black z-10 ${getPulseColor(gem)} ${gem.resolution === 'pending' ? 'animate-pulse scale-125' : 'opacity-40'}`} />
                  
                  <Card className={`bg-white/[0.02] border-white/5 group-hover:bg-white/[0.04] transition-all overflow-hidden ${gem.resolution === 'resolved' ? 'border-green-500/10' : 'hover:border-red-500/20'}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className={`text-[10px] font-bold uppercase tracking-tight ${gem.resolution === 'resolved' ? 'text-white/40' : 'text-white/80'}`}>{gem.reason}</span>
                          <Badge variant="outline" className={`text-[7px] uppercase h-4 px-2 ${
                            gem.severity === 'critical' ? 'border-red-500/30 text-red-400/60' : 
                            gem.severity === 'medium' ? 'border-yellow-500/30 text-yellow-400/60' :
                            'border-blue-500/30 text-blue-400/60'
                          }`}>
                            {gem.severity}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-[8px] text-white/10 font-mono">
                          <Clock className="w-2.5 h-2.5" />
                          {new Date(gem.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-1">
                          <p className="text-[10px] text-white/30 italic line-clamp-1 group-hover:line-clamp-none transition-all">"{gem.content}"</p>
                          <div className="mt-2 text-[7px] font-mono text-white/5 uppercase tracking-widest">
                            ID: {gem.id.slice(0, 8)}... | SOURCE: {gem.type}
                          </div>
                        </div>

                        <div className="flex items-center">
                          {gem.resolution === 'pending' ? (
                            <Button 
                              size="sm" 
                              onClick={() => handleCollect(gem.id)}
                              disabled={resolvingId === gem.id}
                              className="h-8 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border border-yellow-500/20 text-[8px] uppercase tracking-widest gap-2"
                            >
                              {resolvingId === gem.id ? (
                                <Zap className="w-3 h-3 animate-spin" />
                              ) : (
                                <Coins className="w-3 h-3" />
                              )}
                              Collect_{getRewardAmount(gem.severity)}
                            </Button>
                          ) : gem.resolution === 'resolved' ? (
                            <div className="flex items-center gap-2 text-green-500/40">
                              <CheckCircle2 className="w-4 h-4" />
                              <span className="text-[8px] uppercase font-bold tracking-widest">Harvested</span>
                            </div>
                          ) : (
                            <span className="text-[8px] text-white/10 uppercase tracking-widest italic">{gem.resolution}</span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
