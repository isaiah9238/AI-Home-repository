'use client';

import { useState } from 'react';
import { runResearchMode } from '@/app/actions';
import { type ResearchMode } from '@/app/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search, Zap, Book, ArrowRight } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function FluxEchoPage() {
  const [url, setUrl] = useState('');
  const [mode, setMode] = useState<ResearchMode>('scout');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    setError(null);
    setResult(null);
    
    const res = await runResearchMode({ url, mode });
    if (res.success) {
      setResult(res);
    } else {
      setError(res.error || "An unknown error occurred during reconnaissance.");
    }
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 font-headline uppercase tracking-tighter">
          Flux_Echo_Intelligence
        </h1>
        <p className="text-slate-400 font-mono text-sm tracking-widest uppercase opacity-60">
          Advanced Web Reconnaissance &amp; Global Search
        </p>
      </div>

      <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Tabs 
              value={mode} 
              onValueChange={(v) => setMode(v as ResearchMode)}
              className="bg-slate-800/50 p-1 rounded-lg border border-slate-700"
            >
              <TabsList className="bg-transparent border-0 gap-2">
                <TabsTrigger value="scout" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400 font-mono text-[10px] uppercase tracking-widest px-4">
                  <Zap className="w-3 h-3 mr-2" /> Scout_Mode
                </TabsTrigger>
                <TabsTrigger value="deep" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400 font-mono text-[10px] uppercase tracking-widest px-4">
                  <Book className="w-3 h-3 mr-2" /> Deep_Read
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest bg-slate-800/30 px-3 py-1 rounded-full border border-slate-700/50">
              System_Status: <span className="text-green-500 animate-pulse">Optimal</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAction} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="ENTER_URL_OR_RESEARCH_QUERY..."
                className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-600 font-mono text-sm h-11"
                required
              />
            </div>
            <Button 
              type="submit" 
              disabled={loading} 
              className={`h-11 px-8 ${mode === 'scout' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-purple-600 hover:bg-purple-700'} transition-all`}
            >
              {loading ? <Loader2 className="animate-spin" /> : <ArrowRight className="w-5 h-5" />}
            </Button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-900/20 border border-red-500/30 text-red-400 rounded-lg font-mono text-xs animate-in slide-in-from-top-2">
              <span className="font-bold mr-2">{"[!]"}</span> {error}
            </div>
          )}
        </CardContent>
      </Card>

      {result && (
        <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Card className={`bg-slate-900/40 border-slate-800 backdrop-blur-md overflow-hidden ${result.mode === 'deep' ? 'ring-1 ring-purple-500/20' : 'ring-1 ring-blue-500/20'}`}>
            <CardHeader className="bg-slate-800/30 border-b border-slate-800 py-4">
              <CardTitle className="text-xs font-mono text-slate-400 uppercase tracking-[0.3em] flex justify-between items-center">
                <span>{result.mode === 'deep' ? 'Mission_Deep_Read_Report' : result.url?.startsWith('http') ? 'Mission_Scout_Summary' : 'General_Reconnaissance_Report'}</span>
                <span className="text-white font-bold">{result.data?.title || 'Unknown_Stream'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="text-slate-200 leading-relaxed font-mono text-sm whitespace-pre-wrap max-w-3xl mx-auto italic border-l-2 border-slate-700 pl-6 py-2">
                {result.mode === 'deep' ? result.data?.epitome : result.data?.summary}
              </div>
            </CardContent>
          </Card>

          {result.mode === 'scout' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.data?.keyPoints?.map((point: string, i: number) => (
                <div key={i} className="p-5 rounded-xl border border-slate-800 bg-slate-900/30 text-xs font-mono text-slate-400 flex items-start gap-4 group hover:bg-blue-500/5 hover:border-blue-500/20 transition-all cursor-default">
                  <div className="bg-blue-500/10 p-2 rounded-lg text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                    <Zap className="w-3 h-3" />
                  </div>
                  <span className="pt-1 leading-relaxed">{point}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {result.data?.structuredNotes?.map((note: any, i: number) => (
                <div key={i} className="p-6 rounded-xl border border-slate-800 bg-slate-900/30 space-y-3 group hover:bg-purple-500/5 hover:border-purple-500/20 transition-all cursor-default">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-500/10 p-2 rounded-lg text-purple-400 group-hover:bg-purple-500/20 transition-colors">
                      <Book className="w-3 h-3" />
                    </div>
                    <h4 className="text-xs font-mono text-purple-400 uppercase tracking-[0.2em] font-bold">{note.heading}</h4>
                  </div>
                  <p className="text-sm font-mono text-slate-400 leading-relaxed pl-11">{note.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
