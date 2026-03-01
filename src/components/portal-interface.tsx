'use client';

import { useState } from 'react';
import { Sparkles, Search, Shield, Brain, X, ArrowRight, Loader2, Globe, BookOpen, MessageSquareCode } from 'lucide-react';
import { runFluxEcho } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export function PortalInterface() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Flux Echo State
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

  // State 1: The Clean Room (Closed)
  if (!isOpen) {
    return (
      <div className="flex flex-col items-center justify-center h-full animate-in fade-in duration-1000">
        <button 
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center justify-center w-40 h-40 rounded-full bg-black border border-white/10 shadow-[0_0_80px_-12px_rgba(255,255,255,0.2)] hover:shadow-[0_0_120px_-12px_rgba(52,211,153,0.3)] transition-all duration-700 hover:scale-105 active:scale-95"
        >
          {/* Pulsing Core */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-green-500/20 to-blue-500/20 animate-pulse" />
          
          {/* Orbiting Ring */}
          <div className="absolute inset-0 rounded-full border border-dashed border-white/20 animate-[spin_20s_linear_infinite]" />
          
          <Sparkles className="w-12 h-12 text-white/40 group-hover:text-green-400 transition-colors duration-700" />
          
          <span className="absolute -bottom-16 text-xs tracking-[0.6em] text-white/30 group-hover:text-green-400/80 transition-all duration-700 uppercase">
            Initialize_Core
          </span>
        </button>
      </div>
    );
  }

  // State 3: The Drawer (Active Tool - Flux Echo)
  if (activeTool === 'flux-echo') {
    return (
      <div className="p-8 w-full h-full flex flex-col animate-in slide-in-from-bottom-10 duration-500 overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3 text-blue-400">
            <Globe className="w-6 h-6" />
            <h2 className="text-xl font-light tracking-wider uppercase font-mono">Flux Echo Scout</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setActiveTool(null)} className="text-white/50 hover:text-white">
            <X className="w-6 h-6" />
          </Button>
        </div>

        <div className="flex gap-4 mb-8">
          <Input 
            placeholder="Enter URL to scout..." 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/20 font-mono"
          />
          <Button 
            onClick={handleFluxEcho} 
            disabled={loading}
            className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
          </Button>
        </div>

        {fluxResult && (
          <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Card className="bg-black/40 border-white/10 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-xs font-mono text-white/40 uppercase">Extracted_Briefing</CardTitle>
              </CardHeader>
              <CardContent className="text-white/80 leading-relaxed font-mono text-sm">
                {fluxResult.summary}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fluxResult.keyPoints.map((point, i) => (
                <div key={i} className="p-4 rounded border border-white/5 bg-white/5 text-xs font-mono text-white/60">
                  <span className="text-blue-500 mr-2">{">>" }</span> {point}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // State 2: The Cabinet (Menu)
  return (
    <div className="flex flex-col items-center justify-center h-full animate-in zoom-in-95 duration-500 p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        
        {/* Research Drawer */}
        <button 
          onClick={() => setActiveTool('flux-echo')}
          className="group flex flex-col items-center p-8 rounded-xl border border-white/5 bg-black/40 hover:bg-blue-500/10 hover:border-blue-500/30 transition-all duration-300 transform hover:-translate-y-2"
        >
          <div className="p-5 rounded-lg bg-blue-500/10 mb-6 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-300">
            <Search className="w-10 h-10 text-blue-400" />
          </div>
          <h3 className="text-lg font-mono font-medium text-white mb-2 uppercase tracking-widest">Research</h3>
          <p className="text-[10px] text-white/40 text-center font-mono">Flux_Echo & Web_Intel</p>
          <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <Badge variant="outline" className="text-[8px] border-blue-500/30 text-blue-400 uppercase">Engage_Scout</Badge>
          </div>
        </button>

        {/* Discovery Drawer */}
        <Link 
          href="/lesson-plans"
          className="group flex flex-col items-center p-8 rounded-xl border border-white/5 bg-black/40 hover:bg-green-500/10 hover:border-green-500/30 transition-all duration-300 transform hover:-translate-y-2"
        >
          <div className="p-5 rounded-lg bg-green-500/10 mb-6 group-hover:scale-110 group-hover:bg-green-500/20 transition-all duration-300">
            <BookOpen className="w-10 h-10 text-green-400" />
          </div>
          <h3 className="text-lg font-mono font-medium text-white mb-2 uppercase tracking-widest">Discovery</h3>
          <p className="text-[10px] text-white/40 text-center font-mono">Lesson_Plans & Growth</p>
          <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <Badge variant="outline" className="text-[8px] border-green-500/30 text-green-400 uppercase">Initialize_Tutor</Badge>
          </div>
        </Link>

        {/* Development Drawer */}
        <Link 
          href="/code-analyzer"
          className="group flex flex-col items-center p-8 rounded-xl border border-white/5 bg-black/40 hover:bg-purple-500/10 hover:border-purple-500/30 transition-all duration-300 transform hover:-translate-y-2"
        >
          <div className="p-5 rounded-lg bg-purple-500/10 mb-6 group-hover:scale-110 group-hover:bg-purple-500/20 transition-all duration-300">
            <MessageSquareCode className="w-10 h-10 text-purple-400" />
          </div>
          <h3 className="text-lg font-mono font-medium text-white mb-2 uppercase tracking-widest">Development</h3>
          <p className="text-[10px] text-white/40 text-center font-mono">Code_Inspector & Architect</p>
          <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <Badge variant="outline" className="text-[8px] border-purple-500/30 text-purple-400 uppercase">Run_Analysis</Badge>
          </div>
        </Link>

      </div>
      
      <button 
        onClick={() => setIsOpen(false)} 
        className="mt-16 text-white/20 hover:text-white transition-all flex items-center gap-2 group font-mono text-xs uppercase tracking-widest"
      >
        <X className="w-4 h-4 group-hover:rotate-90 transition-transform" />
        Close_Cabinet
      </button>
    </div>
  );
}
