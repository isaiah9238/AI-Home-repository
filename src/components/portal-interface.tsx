'use client';

import { useState } from 'react';
import { Sparkles, Search, Shield, Brain, X, ArrowRight, Loader2, Globe } from 'lucide-react';
import { runFluxEcho } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
      <div className="flex flex-col items-center justify-center h-full animate-in fade-in duration-700">
        <button 
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center justify-center w-24 h-24 rounded-full bg-black border border-white/10 shadow-[0_0_50px_-12px_rgba(255,255,255,0.3)] hover:shadow-[0_0_80px_-12px_rgba(255,215,0,0.5)] transition-all duration-500"
        >
          <Sparkles className="w-8 h-8 text-white/50 group-hover:text-yellow-400 transition-colors duration-500" />
          <span className="absolute -bottom-12 text-xs tracking-[0.3em] text-white/30 group-hover:text-yellow-400/80 transition-colors duration-500 uppercase">
            Portal
          </span>
        </button>
      </div>
    );
  }

  // State 3: The Drawer (Active Tool)
  if (activeTool === 'flux-echo') {
    return (
      <div className="max-w-4xl mx-auto w-full h-full flex flex-col animate-in slide-in-from-bottom-10 duration-500">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3 text-yellow-400">
            <Globe className="w-6 h-6" />
            <h2 className="text-xl font-light tracking-wider">FLUX ECHO</h2>
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
            className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
          />
          <Button 
            onClick={handleFluxEcho} 
            disabled={loading}
            className="bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 border border-yellow-500/50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
          </Button>
        </div>

        {fluxResult && (
          <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Card className="bg-black/40 border-white/10 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-sm font-mono text-white/40 uppercase">Briefing</CardTitle>
              </CardHeader>
              <CardContent className="text-white/80 leading-relaxed">
                {fluxResult.summary}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fluxResult.keyPoints.map((point, i) => (
                <div key={i} className="p-4 rounded border border-white/5 bg-white/5 text-sm text-white/70">
                  {point}
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
    <div className="flex flex-col items-center justify-center h-full animate-in zoom-in-95 duration-300">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl px-6">
        
        {/* Research Domain */}
        <button 
          onClick={() => setActiveTool('flux-echo')}
          className="group flex flex-col items-center p-8 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-yellow-500/30 transition-all duration-300"
        >
          <div className="p-4 rounded-full bg-black/50 mb-4 group-hover:scale-110 transition-transform duration-300">
            <Search className="w-8 h-8 text-blue-400" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Research</h3>
          <p className="text-sm text-white/40 text-center">Flux Echo & Analysis</p>
        </button>

        {/* Discovery Domain */}
        <button className="group flex flex-col items-center p-8 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-green-500/30 transition-all duration-300">
          <div className="p-4 rounded-full bg-black/50 mb-4 group-hover:scale-110 transition-transform duration-300">
            <Brain className="w-8 h-8 text-green-400" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Discovery</h3>
          <p className="text-sm text-white/40 text-center">Memory & Growth</p>
        </button>

        {/* Safety Domain */}
        <button className="group flex flex-col items-center p-8 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-red-500/30 transition-all duration-300">
          <div className="p-4 rounded-full bg-black/50 mb-4 group-hover:scale-110 transition-transform duration-300">
            <Shield className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Safety</h3>
          <p className="text-sm text-white/40 text-center">Gatekeepers</p>
        </button>

      </div>
      
      <button onClick={() => setIsOpen(false)} className="mt-12 text-white/20 hover:text-white transition-colors">
        <X className="w-8 h-8" />
      </button>
    </div>
  );
}