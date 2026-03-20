'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Search, X, ArrowRight, Loader2, Globe, BookOpen, MessageSquareCode, Cake, GraduationCap, Zap, Book, Box, FileCode, Folder, Copy, Check, ShieldCheck, Beaker, Share2, History, Database } from 'lucide-react';
import { runResearchMode, getCurriculumProgress, getMilestones, getSystemEvolution, runArchitect, getGems, getSavedBlueprints, getHomeBase } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { BirthdayDrawer } from './birthday-drawer';
import { CurriculumDrawer } from './curriculum-drawer';
import { GemsDrawer } from './gems-drawer';
import { LaboratoryDrawer } from './laboratory-drawer';
import { NeuralGraph } from './neural-graph';

/**
 * The Portal Interface: A gateway to the Cabinet.
 * Manages specialized tools (Drawers) via a central state-driven visualizer.
 */
export function PortalInterface() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState('');
  const [blueprint, setBlueprint] = useState('');
  const [researchMode, setResearchMode] = useState<'scout' | 'deep'>('scout');
  const [researchResult, setResearchResult] = useState<any>(null);
  const [architectResult, setArchitectResult] = useState<any[] | null>(null);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [savedBlueprints, setSavedBlueprints] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);
  const [curriculumProgress, setCurriculumProgress] = useState<any>(null);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [systemEvolution, setSystemEvolution] = useState<any>(null);
  const [gems, setGems] = useState<any[]>([]);
  const [gemsBalance, setGemsBalance] = useState(0);
  const [architectTab, setArchitectTab] = useState('new');

  // Load contextual data based on active tool
  useEffect(() => {
    if (!activeTool) return;

    const loadToolData = async () => {
      if (activeTool === 'curriculum' || activeTool === 'graph') {
        const res = await getCurriculumProgress();
        if (res.success) setCurriculumProgress(res);
      }

      if (activeTool === 'birthday' || activeTool === 'safety') {
        const [milestonesRes, evolutionRes, curriculumRes, homeBaseRes] = await Promise.all([
          getMilestones(),
          getSystemEvolution(),
          getCurriculumProgress(),
          getHomeBase()
        ]);
        if (milestonesRes.success) setMilestones(milestonesRes.data ?? []);
        if (evolutionRes.success) setSystemEvolution(evolutionRes);
        if (curriculumRes.success) setCurriculumProgress(curriculumRes);
        if (homeBaseRes.success) setGemsBalance(homeBaseRes.data.gemsBalance ?? 0);
      }

      if (activeTool === 'safety' || activeTool === 'laboratory') {
        const res = await getGems();
        if (res.success) setGems(res.data ?? []);
      }

      if (activeTool === 'architect') {
        const res = await getSavedBlueprints();
        if (res.success) setSavedBlueprints(res.data ?? []);
      }
    };

    loadToolData();
  }, [activeTool]);

  const handleResearch = async () => {
    if (!url) return;
    setLoading(true);
    setResearchResult(null);
    const result = await runResearchMode({ url, mode: researchMode });
    if (result.success) setResearchResult(result);
    setLoading(false);
  };

  const handleArchitect = async () => {
    if (!blueprint) return;
    setLoading(true);
    setArchitectResult(null);
    setSelectedFile(null);
    const result = await runArchitect(blueprint);
    if (result.success) {
      setArchitectResult(result.data ?? []);
      const history = await getSavedBlueprints();
      if (history.success) setSavedBlueprints(history.data ?? []);
    }
    setLoading(false);
  };

  const loadBlueprint = (bp: any) => {
    setArchitectResult(bp.structure);
    setArchitectTab('new');
    setSelectedFile(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  if (activeTool === 'research') {
    return (
      <div className="p-8 w-full h-full flex flex-col animate-in slide-in-from-bottom-10 duration-500 overflow-y-auto custom-scrollbar bg-black/40">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3 text-blue-400">
            <Globe className="w-6 h-6" />
            <h2 className="text-xl font-light tracking-widest uppercase font-mono">Research_Domain_Core</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setActiveTool(null)} className="text-white/30 hover:text-white">
            <X className="w-6 h-6" />
          </Button>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Tabs 
              value={researchMode} 
              onValueChange={(v) => setResearchMode(v as any)}
              className="bg-white/5 p-1 rounded-lg border border-white/10"
            >
              <TabsList className="bg-transparent border-0 gap-2">
                <TabsTrigger value="scout" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400 font-mono text-[10px] uppercase tracking-widest py-2">
                  <Zap className="w-3 h-3 mr-2" /> Scout
                </TabsTrigger>
                <TabsTrigger value="deep" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400 font-mono text-[10px] uppercase tracking-widest py-2">
                  <Book className="w-3 h-3 mr-2" /> Deep_Read
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex flex-1 gap-2">
              <Input
                placeholder="ENTER_COORDINATES_URL..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/10 font-mono text-xs tracking-wider h-11"
              />
              <Button onClick={handleResearch} disabled={loading} className={`${researchMode === 'scout' ? 'bg-blue-500/20 text-blue-400 border-blue-500/40' : 'bg-purple-500/20 text-purple-400 border-purple-500/40'} border hover:bg-opacity-30 transition-all h-11 px-6`}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {researchResult && (
            <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Card className={`bg-black/40 border-white/10 backdrop-blur-md overflow-hidden ${researchResult.mode === 'deep' ? 'border-purple-500/30' : 'border-blue-500/30'}`}>
                <CardHeader className="bg-white/5 border-b border-white/5 py-3">
                  <CardTitle className="text-[10px] font-mono text-white/50 uppercase tracking-[0.3em] flex justify-between items-center">
                    <span>{researchResult.mode === 'deep' ? 'EPITOMIZER_DEEP_ESSSENCE' : 'FLUX_ECHO_RECON_REPORT'}</span>
                    <span className="text-white/20">{researchResult.data.title || 'Untitled_Stream'}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="text-white/80 leading-relaxed font-mono text-xs whitespace-pre-wrap">
                    {researchResult.mode === 'deep' ? researchResult.data.epitome : researchResult.data.summary}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeTool === 'architect') {
    return (
      <div className="p-8 w-full h-full flex flex-col animate-in slide-in-from-bottom-10 duration-500 overflow-y-auto custom-scrollbar bg-black/40">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3 text-purple-400">
            <Box className="w-6 h-6" />
            <h2 className="text-xl font-light tracking-widest uppercase font-mono">Architect_Domain_Core</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setActiveTool(null)} className="text-white/30 hover:text-white">
            <X className="w-6 h-6" />
          </Button>
        </div>

        <Tabs value={architectTab} onValueChange={setArchitectTab} className="w-full">
          <TabsList className="bg-white/5 border border-white/10 mb-6 p-1 h-auto gap-2">
            <TabsTrigger value="new" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400 font-mono text-[10px] uppercase tracking-widest py-2 px-4">
              <Zap className="w-3 h-3 mr-2" /> New_Blueprint
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400 font-mono text-[10px] uppercase tracking-widest py-2 px-4">
              <History className="w-3 h-3 mr-2" /> Retrieval_Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="new" className="space-y-6 mt-0">
            <div className="flex flex-col gap-4">
              <Input
                placeholder="DESCRIBE_SYSTEM_BLUEPRINT..."
                value={blueprint}
                onChange={(e) => setBlueprint(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/10 font-mono text-xs tracking-wider h-11"
              />
              <Button onClick={handleArchitect} disabled={loading} className="bg-purple-500/20 text-purple-400 border border-purple-500/40 hover:bg-purple-500/30 transition-all h-11 w-full uppercase font-mono tracking-widest text-xs">
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                {loading ? "Printing_Structure..." : "Summon_Architect"}
              </Button>
            </div>

            {architectResult && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 h-full max-h-[600px]">
                <Card className="bg-black/40 border-purple-500/30 backdrop-blur-md overflow-y-auto custom-scrollbar">
                  <CardHeader className="bg-white/5 border-b border-white/5 py-3 sticky top-0 z-10">
                    <CardTitle className="text-[10px] font-mono text-white/50 uppercase tracking-[0.3em]">GENERATED_STRUCTURE</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 font-mono text-[11px] text-white/70 space-y-1">
                    {architectResult.map((file, i) => (
                      <div key={i} onClick={() => file.type === 'file' && setSelectedFile(file)} className={`flex items-center gap-3 py-2 hover:bg-white/5 rounded px-2 transition-colors cursor-pointer group ${selectedFile?.path === file.path ? 'bg-white/10' : ''}`}>
                        {file.type === 'directory' ? <Folder className="w-3 h-3 text-purple-400/60 group-hover:text-purple-400" /> : <FileCode className="w-3 h-3 text-blue-400/60 group-hover:text-blue-400" />}
                        <span className={file.type === 'directory' ? 'text-purple-300/80 font-bold' : 'text-white/60'}>{file.path}</span>
                        {file.content && file.type === 'file' && <Badge variant="outline" className="ml-auto text-[7px] border-blue-500/20 text-blue-400/40 uppercase">Boilerplate</Badge>}
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <Card className="bg-black/40 border-white/10 backdrop-blur-md overflow-hidden flex flex-col">
                  <CardHeader className="bg-white/5 border-b border-white/5 py-3 flex flex-row items-center justify-between">
                    <CardTitle className="text-[10px] font-mono text-white/50 uppercase tracking-[0.3em]">{selectedFile ? `PREVIEW: ${selectedFile.path.split('/').pop()}` : 'SELECT_FILE_FOR_PREVIEW'}</CardTitle>
                    {selectedFile?.content && <Button variant="ghost" size="icon" className="h-6 w-6 text-white/30 hover:text-white" onClick={() => copyToClipboard(selectedFile.content)}>{copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}</Button>}
                  </CardHeader>
                  <CardContent className="flex-1 p-0 overflow-auto custom-scrollbar">
                    {selectedFile?.content ? <pre className="p-6 text-[10px] font-mono text-white/70 whitespace-pre leading-relaxed">{selectedFile.content}</pre> : <div className="h-full flex items-center justify-center text-white/10 font-mono text-[10px] uppercase tracking-widest p-12 text-center">{selectedFile ? 'No_Boilerplate_Available_For_This_File' : 'Awaiting_File_Selection...'}</div>}
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="mt-0 space-y-4">
            {savedBlueprints.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-20 text-white/20 border border-dashed border-white/10 rounded-2xl">
                <Database className="w-12 h-12 mb-4 opacity-10" />
                <p className="font-mono text-[10px] uppercase tracking-widest">No_Saved_Architectures_Found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedBlueprints.map((bp) => (
                  <Card key={bp.id} className="bg-black/40 border-white/5 hover:border-purple-500/30 transition-all group cursor-pointer" onClick={() => loadBlueprint(bp)}>
                    <CardHeader className="p-4 border-b border-white/5 flex flex-row items-center justify-between">
                      <CardTitle className="text-[10px] font-mono text-white/60 uppercase truncate mr-4">{bp.name}</CardTitle>
                      <Badge variant="outline" className="text-[8px] border-purple-500/20 text-purple-400/60 uppercase shrink-0">Blueprint</Badge>
                    </CardHeader>
                    <CardContent className="p-4">
                      <p className="text-[9px] text-white/30 font-mono line-clamp-2 mb-4 italic">"{bp.prompt}"</p>
                      <div className="flex items-center justify-between text-[8px] font-mono uppercase tracking-widest text-white/20">
                        <span>{new Date(bp.timestamp).toLocaleDateString()}</span>
                        <span className="group-hover:text-purple-400 transition-colors flex items-center gap-2">Load_Core <ArrowRight className="w-3 h-3" /></span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  if (activeTool === 'safety') {
    return (
      <div className="relative w-full h-full">
        <Button variant="ghost" size="icon" onClick={() => setActiveTool(null)} className="absolute top-8 right-8 z-50 text-white/30 hover:text-white">
          <X className="w-6 h-6" />
        </Button>
        <GemsDrawer gems={gems} balance={gemsBalance} onResolve={async () => {
          const res = await getGems();
          if (res.success) setGems(res.data ?? []);
          const hb = await getHomeBase();
          if (hb.success) setGemsBalance(hb.data.gemsBalance ?? 0);
        }} />
      </div>
    );
  }

  if (activeTool === 'laboratory') {
    return (
      <div className="relative w-full h-full">
        <Button variant="ghost" size="icon" onClick={() => setActiveTool(null)} className="absolute top-8 right-8 z-50 text-white/30 hover:text-white">
          <X className="w-6 h-6" />
        </Button>
        <LaboratoryDrawer />
      </div>
    );
  }

  if (activeTool === 'graph') {
    return (
      <div className="relative w-full h-full">
        <Button variant="ghost" size="icon" onClick={() => setActiveTool(null)} className="absolute top-8 right-8 z-50 text-white/30 hover:text-white">
          <X className="w-6 h-6" />
        </Button>
        <NeuralGraph lessons={curriculumProgress?.lessons || []} />
      </div>
    );
  }

  if (activeTool === 'birthday') {
    return <BirthdayDrawer onClose={() => setActiveTool(null)} establishedDate="2026-02-06" milestones={milestones} isAnniversary={systemEvolution?.isAnniversary} neuralComplexity={curriculumProgress?.neuralComplexity} knowledgeIntegration={curriculumProgress?.knowledgeIntegration} />;
  }

  if (activeTool === 'curriculum') {
    return (
      <div className="relative w-full h-full">
        <Button variant="ghost" size="icon" onClick={() => setActiveTool(null)} className="absolute top-8 right-8 z-50 text-white/30 hover:text-white">
          <X className="w-6 h-6" />
        </Button>
        <CurriculumDrawer progress={curriculumProgress} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full animate-in zoom-in-95 duration-500 p-8 overflow-y-auto custom-scrollbar">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {/* Research Drawer */}
        <button onClick={() => setActiveTool('research')} className="group flex flex-col items-center p-8 rounded-xl border border-white/5 bg-black/40 hover:bg-blue-500/5 hover:border-blue-500/20 transition-all duration-300 transform hover:-translate-y-2">
          <div className="p-6 rounded-lg bg-blue-500/5 mb-6 group-hover:scale-110 group-hover:bg-blue-500/10 transition-all duration-500 border border-white/5 group-hover:border-blue-500/30">
            <Search className="w-10 h-10 text-blue-400 opacity-60 group-hover:opacity-100" />
          </div>
          <h3 className="text-sm font-mono font-medium text-white/80 mb-2 uppercase tracking-[0.4em]">RESEARCH</h3>
          <p className="text-[8px] text-white/20 text-center font-mono uppercase tracking-widest">FLUX_ECHO_SCOUTING</p>
          <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity"><Badge variant="outline" className="text-[8px] border-blue-500/30 text-blue-400/60 uppercase">ENGAGE_RESEARCH</Badge></div>
        </button>

        {/* Discovery Drawer */}
        <button onClick={() => setActiveTool('curriculum')} className="group flex flex-col items-center p-8 rounded-xl border border-white/5 bg-black/40 hover:bg-green-500/5 hover:border-green-500/20 transition-all duration-300 transform hover:-translate-y-2">
          <div className="p-6 rounded-lg bg-green-500/5 mb-6 group-hover:scale-110 group-hover:bg-green-500/10 transition-all duration-500 border border-white/5 group-hover:border-green-500/30">
            <BookOpen className="w-10 h-10 text-green-400 opacity-60 group-hover:opacity-100" />
          </div>
          <h3 className="text-sm font-mono font-medium text-white/80 mb-2 uppercase tracking-[0.4em]">DISCOVERY</h3>
          <p className="text-[8px] text-white/20 text-center font-mono uppercase tracking-widest">LESSON_PLAN_SYNTHESIS</p>
          <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity"><Badge variant="outline" className="text-[8px] border-green-500/30 text-green-400/60 uppercase">INITIALIZE_TUTOR</Badge></div>
        </button>

        {/* Development Drawer */}
        <button onClick={() => setActiveTool('architect')} className="group flex flex-col items-center p-8 rounded-xl border border-white/5 bg-black/40 hover:bg-purple-500/5 hover:border-purple-500/20 transition-all duration-300 transform hover:-translate-y-2">
          <div className="p-6 rounded-lg bg-purple-500/5 mb-6 group-hover:scale-110 group-hover:bg-purple-500/10 transition-all duration-500 border border-white/5 group-hover:border-blue-500/30">
            <MessageSquareCode className="w-10 h-10 text-purple-400 opacity-60 group-hover:opacity-100" />
          </div>
          <h3 className="text-sm font-mono font-medium text-white/80 mb-2 uppercase tracking-[0.4em]">DEVELOPMENT</h3>
          <p className="text-[8px] text-white/20 text-center font-mono uppercase tracking-widest">CODE_INSPECTION_CORE</p>
          <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity"><Badge variant="outline" className="text-[8px] border-purple-500/30 text-purple-400/60 uppercase">RUN_ARCHITECT</Badge></div>
        </button>

        {/* Neural Graph Drawer */}
        <button onClick={() => setActiveTool('graph')} className="group flex flex-col items-center p-8 rounded-xl border border-white/5 bg-black/40 hover:bg-blue-500/5 hover:border-blue-500/20 transition-all duration-300 transform hover:-translate-y-2">
          <div className="p-6 rounded-lg bg-blue-500/5 mb-6 group-hover:scale-110 group-hover:bg-blue-500/10 transition-all duration-500 border border-white/5 group-hover:border-blue-500/30">
            <Share2 className="w-10 h-10 text-blue-400 opacity-60 group-hover:opacity-100" />
          </div>
          <h3 className="text-sm font-mono font-medium text-white/80 mb-2 uppercase tracking-[0.4em]">CONTEXT</h3>
          <p className="text-[8px] text-white/20 text-center font-mono uppercase tracking-widest">NEURAL_GRAPH_MAP</p>
          <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity"><Badge variant="outline" className="text-[8px] border-blue-500/30 text-blue-400/60 uppercase">VIEW_NODES</Badge></div>
        </button>

        {/* Laboratory Drawer */}
        <button onClick={() => setActiveTool('laboratory')} className="group flex flex-col items-center p-8 rounded-xl border border-white/5 bg-black/40 hover:bg-purple-500/5 hover:border-purple-500/20 transition-all duration-300 transform hover:-translate-y-2">
          <div className="p-6 rounded-lg bg-purple-500/5 mb-6 group-hover:scale-110 group-hover:bg-purple-500/10 transition-all duration-500 border border-white/5 group-hover:border-purple-500/30">
            <Beaker className="w-10 h-10 text-purple-400 opacity-60 group-hover:opacity-100" />
          </div>
          <h3 className="text-sm font-mono font-medium text-white/80 mb-2 uppercase tracking-[0.4em]">LABORATORY</h3>
          <p className="text-[8px] text-white/20 text-center font-mono uppercase tracking-widest">PARAMETER_TUNING_HUB</p>
          <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity"><Badge variant="outline" className="text-[8px] border-purple-500/30 text-purple-400/60 uppercase">TWEAK_LOGIC</Badge></div>
        </button>

        {/* Safety Drawer */}
        <button onClick={() => setActiveTool('safety')} className="group flex flex-col items-center p-8 rounded-xl border border-white/5 bg-black/40 hover:bg-red-500/5 hover:border-red-500/20 transition-all duration-300 transform hover:-translate-y-2">
          <div className="p-6 rounded-lg bg-red-500/5 mb-6 group-hover:scale-110 group-hover:bg-red-500/10 transition-all duration-500 border border-white/5 group-hover:border-red-500/30">
            <ShieldCheck className="w-10 h-10 text-red-400 opacity-60 group-hover:opacity-100" />
          </div>
          <h3 className="text-sm font-mono font-medium text-white/80 mb-2 uppercase tracking-[0.4em]">INTEGRITY</h3>
          <p className="text-[8px] text-white/20 text-center font-mono uppercase tracking-widest">SAFETY_LEDGER_SYNC</p>
          <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity"><Badge variant="outline" className="text-[8px] border-red-500/30 text-red-400/60 uppercase">VIEW_PULSES</Badge></div>
        </button>

        {/* Evolution Drawer */}
        <button onClick={() => setActiveTool('birthday')} className="group flex flex-col items-center p-8 rounded-xl border border-white/5 bg-black/40 hover:bg-yellow-500/5 hover:border-yellow-500/20 transition-all duration-300 transform hover:-translate-y-2">
          <div className="p-6 rounded-lg bg-yellow-500/5 mb-6 group-hover:scale-110 group-hover:bg-yellow-500/10 transition-all duration-500 border border-white/5 group-hover:border-yellow-500/30">
            <Cake className="w-10 h-10 text-yellow-400 opacity-60 group-hover:opacity-100" />
          </div>
          <h3 className="text-sm font-mono font-medium text-white/80 mb-2 uppercase tracking-[0.4em]">EVOLUTION</h3>
          <p className="text-[8px] text-white/20 text-center font-mono uppercase tracking-widest">SYSTEM_GROWTH_LOGS</p>
          <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity"><Badge variant="outline" className="text-[8px] border-yellow-500/30 text-yellow-400/60 uppercase">VIEW_MILESTONES</Badge></div>
        </button>
      </div>

      <button onClick={() => setIsOpen(false)} className="mt-16 text-white/10 hover:text-white transition-all flex items-center gap-3 group font-mono text-[10px] uppercase tracking-[0.6em]">
        <X className="w-3 h-3 group-hover:rotate-90 transition-transform" />
        DEACTIVATE_CORE
      </button>
    </div>
  );
}
