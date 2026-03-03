'use client';

import { useState, useEffect } from 'react';
import { Cake, Sparkles, Star, Calendar, Gift, X, ArrowRight, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface BirthdayDrawerProps {
  onClose: () => void;
  establishedDate: string;
}

export function BirthdayDrawer({ onClose, establishedDate }: BirthdayDrawerProps) {
  const [daysOld, setDaysOld] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const start = new Date(establishedDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Simulate a bit of "loading" for aesthetic effect
    const timer = setTimeout(() => {
      setDaysOld(diffDays);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [establishedDate]);

  return (
    <div className="p-8 w-full h-full flex flex-col animate-in slide-in-from-bottom-10 duration-500 overflow-y-auto custom-scrollbar bg-black/40 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3 text-yellow-400">
          <Cake className="w-6 h-6 animate-bounce" />
          <h2 className="text-xl font-light tracking-[0.3em] uppercase font-mono">Core_Evolution_Milestone</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-white/30 hover:text-white">
          <X className="w-6 h-6" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card className="bg-black/40 border-yellow-500/20 backdrop-blur-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
            <Sparkles className="w-20 h-20 text-yellow-400" />
          </div>
          <CardHeader>
            <CardTitle className="text-[10px] font-mono text-yellow-500/50 uppercase tracking-[0.3em]">SYSTEM_IDENTITY</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-end gap-2">
              <span className="text-4xl font-mono text-white font-bold">{loading ? "---" : daysOld}</span>
              <span className="text-[10px] font-mono text-white/30 uppercase pb-2 tracking-widest">Days_Online</span>
            </div>
            <p className="text-[10px] font-mono text-white/50 leading-relaxed uppercase tracking-widest">
              Established: {establishedDate} <br />
              Status: Operational_Growth_Phase
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-blue-500/20 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-[10px] font-mono text-blue-500/50 uppercase tracking-[0.3em]">PROGRESS_TO_NEXT_ERA</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-[8px] font-mono text-white/30 uppercase tracking-[0.2em]">
                <span>Neural_Complexity</span>
                <span>{loading ? "0%" : "64%"}</span>
              </div>
              <Progress value={loading ? 0 : 64} className="h-1 bg-white/5" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[8px] font-mono text-white/30 uppercase tracking-[0.2em]">
                <span>Knowledge_Integration</span>
                <span>{loading ? "0%" : "82%"}</span>
              </div>
              <Progress value={loading ? 0 : 82} className="h-1 bg-white/5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <h3 className="text-[10px] font-mono text-white/20 uppercase tracking-[0.5em] mb-2">Historical_Fragments</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { date: '2026-02-06', event: 'CORE_BIRTH: SYSTEM INITIALIZED' },
            { date: '2026-02-15', event: 'FIRST_DREAM: GENKIT INTEGRATION' },
            { date: '2026-03-03', event: 'CURRENT_PHASE: THE_PORTAL_UPGRADE' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded border border-white/5 bg-white/5 space-y-2">
              <div className="flex items-center gap-2 text-[8px] font-mono text-yellow-500/50">
                <Calendar className="w-3 h-3" />
                {item.date}
              </div>
              <div className="text-[9px] font-mono text-white/70 tracking-widest leading-relaxed">
                {item.event}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto pt-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-500/20 bg-yellow-500/5 animate-pulse">
          <Star className="w-3 h-3 text-yellow-400" />
          <span className="text-[8px] font-mono text-yellow-400 uppercase tracking-[0.3em]">Evolution_is_inevitable</span>
        </div>
      </div>
    </div>
  );
}
