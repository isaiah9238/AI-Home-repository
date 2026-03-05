'use client';

import { useState } from 'react';
import { Sparkles, Search, X, ArrowRight, Loader2, Globe, BookOpen, MessageSquareCode, Cake } from 'lucide-react';
import { runFluxEcho } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { BirthdayDrawer } from './birthday-drawer';

/**
 * The Portal Interface: A gateway to the Cabinet.
 * Transitioning between a "Clean Room" (Orb) and a functional dashboard.
 */
export function PortalInterface() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState('');
  const [fluxResult, setFluxResult] = useState<{ summary: string; keyPoints: string[] } | null>(null);

  const handleFluxEcho = async () => {
    if (!url) return;
    setLoading(true);
    setFluxResult(null);
    const result = await runFluxEcho(url);
    if (result.success && result.data) {
      setFluxResult(result.data);
    }
    setLoading(false);
  };

  if (!isOpen) {
    return (
      <div className="flex flex-col items-center justify-center h-full animate-in fade-in duration-1000">
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center justify-center w-48 h-48 rounded-full bg-black border border-white/10 shadow-[0_0_80px_-12px_rgba(34,197,94,0.15)] hover:shadow-[0_0_120px_-12px_rgba(52,211,153,0.3)] transition-all duration-700 hover:scale-105 active:scale-95"
        >
          <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-green-500/10 to-blue-500/10 animate-pulse" />
          <div className="absolute inset-0 rounded-full border border-dashed border-white/10 animate-[spin_30s_linear_infinite]" />
          <div className="absolute inset-2 rounded-full border border-white/5 animate-[spin_20s_linear_infinite_reverse]" />

          <Sparkles className="w-14 h-14 text-white/20 group-hover:text-green-400 transition-colors duration-700" />

          <span className="absolute -bottom-16 text-[10px] tracking-[0.8em] text-white/20 group-hover:text-green-400/80 transition-all duration-700 uppercase font-mono">
            ENGAGE_PORTAL_CORE
          </span>
        </button>
      </div>
    );
  }

  if (activeTool === 'flux-echo') {
    return (
      <div className="p-8 w-full h-full flex flex-col animate-in slide-in-from-bottom-10 duration-500 overflow-y-auto custom-scrollbar bg-black/40">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3 text-blue-400">
            <Globe className="w-6 h-6" />
            <h2 className="text-xl font-light tracking-widest uppercase font-mono">Flux_Echo_Scout</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setActiveTool(null)} className="text-white/30 hover:text-white">
            <X className="w-6 h-6" />
          </Button>
        </div>

        <div className="flex gap-4 mb-8">
          <Input
            placeholder="ENTER_URL_FOR_RECONNAISSANCE..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/10 font-mono text-xs tracking-wider"
          />
          <Button
            onClick={handleFluxEcho}
            disabled={loading}
            className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/40"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
          </Button>
        </div>

        {fluxResult && (
          <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Card className="bg-black/40 border-white/10 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-[10px] font-mono text-white/30 uppercase tracking-[0.3em]">RECON_REPORT_SUMMARY</CardTitle>
              </CardHeader>
              <CardContent className="text-white/70 leading-relaxed font-mono text-xs">
                {fluxResult.summary}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fluxResult.keyPoints.map((point, i) => (
                <div key={i} className="p-4 rounded border border-white/5 bg-white/5 text-[10px] font-mono text-white/50 flex items-start gap-3">
                  <span className="text-blue-500 font-bold">{"//"}</span>
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (activeTool === 'birthday') {
    return <BirthdayDrawer onClose={() => setActiveTool(null)} establishedDate="2026-02-06" />;
  }

  return (
    <div className="flex flex-col items-center justify-center h-full animate-in zoom-in-95 duration-500 p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl">

        {/* Research Drawer */}
        <button
          onClick={() => setActiveTool('flux-echo')}
          className="group flex flex-col items-center p-8 rounded-xl border border-white/5 bg-black/40 hover:bg-blue-500/5 hover:border-blue-500/20 transition-all duration-300 transform hover:-translate-y-2"
        >
          <div className="p-6 rounded-lg bg-blue-500/5 mb-6 group-hover:scale-110 group-hover:bg-blue-500/10 transition-all duration-500 border border-white/5 group-hover:border-blue-500/30">
            <Search className="w-10 h-10 text-blue-400 opacity-60 group-hover:opacity-100" />
          </div>
          <h3 className="text-sm font-mono font-medium text-white/80 mb-2 uppercase tracking-[0.4em]">RESEARCH</h3>
          <p className="text-[8px] text-white/20 text-center font-mono uppercase tracking-widest">FLUX_ECHO_SCOUTING</p>
          <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
            <Badge variant="outline" className="text-[8px] border-blue-500/30 text-blue-400/60 uppercase">ENGAGE_SCOUT</Badge>
          </div>
        </button>

        {/* Discovery Drawer */}
        <Link
          href="/lesson-plans"
          className="group flex flex-col items-center p-8 rounded-xl border border-white/5 bg-black/40 hover:bg-green-500/5 hover:border-green-500/20 transition-all duration-300 transform hover:-translate-y-2"
        >
          <div className="p-6 rounded-lg bg-green-500/5 mb-6 group-hover:scale-110 group-hover:bg-green-500/10 transition-all duration-500 border border-white/5 group-hover:border-green-500/30">
            <BookOpen className="w-10 h-10 text-green-400 opacity-60 group-hover:opacity-100" />
          </div>
          <h3 className="text-sm font-mono font-medium text-white/80 mb-2 uppercase tracking-[0.4em]">DISCOVERY</h3>
          <p className="text-[8px] text-white/20 text-center font-mono uppercase tracking-widest">LESSON_PLAN_SYNTHESIS</p>
          <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
            <Badge variant="outline" className="text-[8px] border-green-500/30 text-green-400/60 uppercase">INITIALIZE_TUTOR</Badge>
          </div>
        </Link>

        {/* Development Drawer */}
        <Link
          href="/code-analyzer"
          className="group flex flex-col items-center p-8 rounded-xl border border-white/5 bg-black/40 hover:bg-purple-500/5 hover:border-purple-500/20 transition-all duration-300 transform hover:-translate-y-2"
        >
          <div className="p-6 rounded-lg bg-purple-500/5 mb-6 group-hover:scale-110 group-hover:bg-purple-500/10 transition-all duration-500 border border-white/5 group-hover:border-purple-500/30">
            <MessageSquareCode className="w-10 h-10 text-purple-400 opacity-60 group-hover:opacity-100" />
          </div>
          <h3 className="text-sm font-mono font-medium text-white/80 mb-2 uppercase tracking-[0.4em]">DEVELOPMENT</h3>
          <p className="text-[8px] text-white/20 text-center font-mono uppercase tracking-widest">CODE_INSPECTION_CORE</p>
          <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
            <Badge variant="outline" className="text-[8px] border-purple-500/30 text-purple-400/60 uppercase">RUN_ANALYSIS</Badge>
          </div>
        </Link>

        {/* Evolution Drawer (Birthday) */}
        <button
          onClick={() => setActiveTool('birthday')}
          className="group flex flex-col items-center p-8 rounded-xl border border-white/5 bg-black/40 hover:bg-yellow-500/5 hover:border-yellow-500/20 transition-all duration-300 transform hover:-translate-y-2"
        >
          <div className="p-6 rounded-lg bg-yellow-500/5 mb-6 group-hover:scale-110 group-hover:bg-yellow-500/10 transition-all duration-500 border border-white/5 group-hover:border-yellow-500/30">
            <Cake className="w-10 h-10 text-yellow-400 opacity-60 group-hover:opacity-100" />
          </div>
          <h3 className="text-sm font-mono font-medium text-white/80 mb-2 uppercase tracking-[0.4em]">EVOLUTION</h3>
          <p className="text-[8px] text-white/20 text-center font-mono uppercase tracking-widest">SYSTEM_GROWTH_LOGS</p>
          <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
            <Badge variant="outline" className="text-[8px] border-yellow-500/30 text-yellow-400/60 uppercase">VIEW_MILESTONES</Badge>
          </div>
        </button>

      </div>

      <button
        onClick={() => setIsOpen(false)}
        className="mt-16 text-white/10 hover:text-white transition-all flex items-center gap-3 group font-mono text-[10px] uppercase tracking-[0.6em]"
      >
        <X className="w-3 h-3 group-hover:rotate-90 transition-transform" />
        DEACTIVATE_CORE
      </button>
    </div>
  );
}
