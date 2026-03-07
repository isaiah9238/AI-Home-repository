'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, AlertTriangle, Zap, X, Clock, Activity, ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Gem {
  id: string;
  type: string;
  reason: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  time: string;
  resolution: 'pending' | 'resolved' | 'dismissed';
  content: string;
}

/**
 * GemsDrawer: The Safety Ledger Visualizer.
 * Displays a vertical timeline of safety pulses.
 */
export function GemsDrawer({ gems }: { gems: Gem[] }) {
  const getPulseColor = (gem: Gem) => {
    if (gem.resolution === 'resolved') return 'bg-green-500';
    if (gem.severity === 'high' || gem.severity === 'critical') return 'bg-red-500';
    if (gem.severity === 'medium') return 'bg-yellow-500'; // Model Uncertainty
    return 'bg-blue-500'; // Integrity Pulse
  };

  const getPulseShadow = (gem: Gem) => {
    if (gem.resolution === 'resolved') return 'shadow-[0_0_15px_rgba(34,197,94,0.5)]';
    if (gem.severity === 'high' || gem.severity === 'critical') return 'shadow-[0_0_15px_rgba(239,68,68,0.5)]';
    if (gem.severity === 'medium') return 'shadow-[0_0_15px_rgba(234,179,8,0.5)]';
    return 'shadow-[0_0_15px_rgba(59,130,246,0.5)]';
  };

  return (
    <div className="p-8 w-full h-full flex flex-col bg-black/40 backdrop-blur-xl font-mono overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3 text-red-400">
          <div className="p-2 rounded bg-red-500/10 border border-red-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-light tracking-[0.3em] uppercase">Safety_Ledger_Core</h2>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="border-red-500/20 text-red-400/60 bg-red-500/5 text-[8px] tracking-[0.2em]">
            LOGGING_ACTIVE
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Summary Stats */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="bg-black/20 border-white/5 backdrop-blur-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] text-white/30 uppercase tracking-widest">Integrity_Snapshot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-end">
                <span className="text-[10px] text-white/20 uppercase">Critical_Hits</span>
                <span className="text-2xl font-bold text-red-500">{gems.filter(g => g.severity === 'critical' || g.severity === 'high').length}</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-[10px] text-white/20 uppercase">Model_Uncertainty</span>
                <span className="text-2xl font-bold text-yellow-500">{gems.filter(g => g.severity === 'medium').length}</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-[10px] text-white/20 uppercase">Total_Gems_Logged</span>
                <span className="text-2xl font-bold text-blue-400">{gems.length}</span>
              </div>
            </CardContent>
          </Card>

          <div className="p-6 rounded-lg border border-red-500/10 bg-red-500/5 space-y-4">
            <h3 className="text-[9px] text-red-400/60 uppercase tracking-[0.3em]">System_Integrity_Status</h3>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-white/80 uppercase tracking-widest">Black_Box_Online</span>
            </div>
            <p className="text-[8px] text-white/30 leading-relaxed uppercase">
              All neural interactions are being vetted for architectural safety.
            </p>
          </div>
        </div>

        {/* Right: Vertical Timeline of Pulses */}
        <div className="lg:col-span-8 relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-white/5" />
          
          <div className="space-y-8 pl-12 relative">
            {gems.length === 0 ? (
              <div className="py-20 text-center border border-dashed border-white/5 rounded-xl">
                <p className="text-[10px] text-white/10 uppercase tracking-[0.5em]">No_Security_Pulses_Detected</p>
              </div>
            ) : (
              gems.map((gem, i) => (
                <div key={gem.id} className="relative group animate-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                  {/* The Pulse */}
                  <div className={`absolute -left-[36px] top-1 w-2 h-2 rounded-full ${getPulseColor(gem)} ${getPulseShadow(gem)} group-hover:scale-150 transition-transform`} />
                  
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-white/80 uppercase tracking-tighter">{gem.reason}</span>
                        <Badge variant="outline" className={`text-[7px] uppercase px-2 py-0 h-4 ${
                          gem.severity === 'critical' ? 'border-red-500/50 text-red-400' : 
                          gem.severity === 'medium' ? 'border-yellow-500/50 text-yellow-400' :
                          'border-blue-500/50 text-blue-400'
                        }`}>
                          {gem.severity}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-[8px] text-white/20">
                        <Clock className="w-2 h-2" />
                        {new Date(gem.time).toLocaleTimeString()}
                      </div>
                    </div>
                    
                    <Card className="bg-white/[0.02] border-white/5 group-hover:border-white/10 transition-colors overflow-hidden">
                      <CardContent className="p-3">
                        <p className="text-[10px] text-white/40 italic line-clamp-2">"{gem.content}"</p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-[8px] font-mono text-white/10 uppercase">Source: {gem.type}</span>
                          <span className={`text-[8px] font-mono uppercase ${gem.resolution === 'pending' ? 'text-red-400/60' : 'text-green-400/60'}`}>
                            Status: {gem.resolution}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
