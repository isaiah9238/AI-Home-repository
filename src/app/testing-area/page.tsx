'use client';

import { useState, useEffect } from 'react';
import { 
  Play, 
  Plus, 
  Trash2, 
  Save, 
  FolderOpen, 
  Sparkles, 
  Loader2, 
  Box, 
  Terminal, 
  Layout, 
  Columns, 
  Grid2X2,
  Copy,
  Check,
  ChevronRight,
  Monitor,
  ExternalLink
} from 'lucide-react';
import { 
  getPreviewAnalysis, 
  getVariationAnalysis, 
  saveTestingWorkspace, 
  getTestingWorkspaces, 
  deleteVFSNodeAction 
} from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface TestSlot {
  id: string;
  name: string;
  code: string;
  intent: string;
  previewCode: string;
  loading: boolean;
  techStack: string[];
}

export default function TestingChamberPage() {
  const [slots, setSlots] = useState<TestSlot[]>([
    { id: 'slot_1', name: 'Base_Chamber', code: '', intent: '', previewCode: '', loading: false, techStack: [] }
  ]);
  const [workspaceName, setWorkspaceName] = useState('New_Session');
  const [savedWorkspaces, setSavedWorkspaces] = useState<any[]>([]);
  const [loadingWorkspaces, setLoadingWorkspaces] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'split'>('grid');
  const [isVariationDialogOpen, setIsVariationDialogOpen] = useState(false);
  const [variationInstructions, setVariationInstructions] = useState('');
  const [variationCount, setVariationCount] = useState(2);
  const [isGeneratingVariations, setIsGeneratingVariations] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    setLoadingWorkspaces(true);
    const res = await getTestingWorkspaces();
    if (res.success && res.data) {
      setSavedWorkspaces(res.data || []);
    } else {
      setSavedWorkspaces([]);
    }
    setLoadingWorkspaces(false);
  };

  const addSlot = () => {
    const newId = `slot_${Date.now()}`;
    setSlots([...slots, { 
      id: newId, 
      name: `Chamber_${slots.length + 1}`, 
      code: '', 
      intent: '', 
      previewCode: '', 
      loading: false, 
      techStack: [] 
    }]);
  };

  const removeSlot = (id: string) => {
    if (slots.length === 1) return;
    setSlots(slots.filter(s => s.id !== id));
  };

  const updateSlot = (id: string, updates: Partial<TestSlot>) => {
    setSlots(slots.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const executeSlot = async (id: string) => {
    const slot = slots.find(s => s.id === id);
    if (!slot || !slot.code.trim()) return;

    updateSlot(id, { loading: true });
    try {
      const res = await getPreviewAnalysis(slot.code);
      if (res.success && res.data) {
        updateSlot(id, { 
          previewCode: res.data.previewCode || '', 
          intent: res.data.intent || '', 
          techStack: res.data.techStack || [],
          loading: false 
        });
      } else {
        toast({ title: "Execution Failed", description: res.error || "Signal lost.", variant: "destructive" });
        updateSlot(id, { loading: false });
      }
    } catch (error) {
      updateSlot(id, { loading: false });
    }
  };

  const handleGenerateVariations = async () => {
    const baseSlot = slots[0];
    if (!baseSlot.code.trim()) {
      toast({ title: "Base Code Required", description: "Initialize the primary chamber first.", variant: "destructive" });
      return;
    }

    setIsGeneratingVariations(true);
    try {
      const res = await getVariationAnalysis(baseSlot.code, variationInstructions, variationCount);
      if (res.success && res.data) {
        const newVariations = (res.data || []).map((v: any) => ({
          id: `var_${Date.now()}_${v.id}`,
          name: `Variation_${v.id}`,
          code: v.code,
          intent: v.intent || '',
          previewCode: '',
          loading: true,
          techStack: v.techStack || []
        }));

        setSlots(prev => [...prev, ...newVariations]);
        setIsVariationDialogOpen(false);
        setVariationInstructions('');

        // Automatically execute new variations
        for (const v of newVariations) {
          const previewRes = await getPreviewAnalysis(v.code);
          if (previewRes.success && previewRes.data) {
            setSlots(prev => prev.map(s => s.id === v.id ? { 
              ...s, 
              previewCode: previewRes.data?.previewCode || '', 
              intent: previewRes.data?.intent || '',
              techStack: previewRes.data?.techStack || [],
              loading: false 
            } : s));
          } else {
            setSlots(prev => prev.map(s => s.id === v.id ? { ...s, loading: false } : s));
          }
        }
      }
    } catch (error) {
      toast({ title: "Generation Failed", description: "Signal lost during variation synthesis.", variant: "destructive" });
    } finally {
      setIsGeneratingVariations(false);
    }
  };

  const saveWorkspace = async () => {
    if (!workspaceName.trim()) return;
    const res = await saveTestingWorkspace(workspaceName, slots);
    if (res.success) {
      toast({ title: "Workspace Saved", description: `Archived as ${workspaceName}.chamber.json` });
      fetchWorkspaces();
    } else {
      toast({ title: "Save Failed", description: res.error, variant: "destructive" });
    }
  };

  const loadWorkspace = (workspace: any) => {
    try {
      const loadedSlots = JSON.parse(workspace.content);
      setSlots(loadedSlots);
      setWorkspaceName(workspace.name.replace('.chamber.json', ''));
      toast({ title: "Workspace Restored", description: `Loaded ${workspace.name}` });
    } catch (e) {
      toast({ title: "Load Error", description: "Corruption detected in workspace file.", variant: "destructive" });
    }
  };

  const openInNewWindow = (previewCode: string) => {
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(previewCode);
      newWindow.document.close();
    }
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 font-mono min-h-screen">
      
      {/* Header HUD */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-l-4 border-purple-500 pl-6 bg-white/[0.02] p-4 rounded-r-xl">
        <div>
          <h1 className="text-4xl font-light tracking-[0.2em] uppercase flex items-center gap-4 text-white">
            <Layout className="w-8 h-8 text-purple-500 animate-pulse" /> Testing_Chamber
          </h1>
          <p className="text-white/40 mt-2 uppercase tracking-widest text-xs">
            Multi-Agent Orchestration &amp; Parallel Execution Environment.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-black/40 p-1 rounded-lg border border-white/5">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setViewMode('grid')}
              className={cn("h-8 px-3 gap-2 text-[10px] uppercase tracking-widest", viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-white/40')}
            >
              <Grid2X2 className="w-3 h-3" /> Grid
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setViewMode('split')}
              className={cn("h-8 px-3 gap-2 text-[10px] uppercase tracking-widest", viewMode === 'split' ? 'bg-white/10 text-white' : 'text-white/40')}
            >
              <Columns className="w-3 h-3" /> Split
            </Button>
          </div>

          <div className="h-8 w-px bg-white/10 mx-2" />

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 border-white/10 bg-white/5 text-[10px] uppercase tracking-widest gap-2">
                <FolderOpen className="w-3 h-3" /> Restore
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0a0a0a] border-white/10 text-white font-mono max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xs uppercase tracking-widest text-white/60">Archived_Chambers</DialogTitle>
              </DialogHeader>
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {loadingWorkspaces ? (
                  <div className="py-8 text-center text-white/20 uppercase text-[10px]">Syncing_VFS...</div>
                ) : savedWorkspaces.length === 0 ? (
                  <div className="py-8 text-center text-white/20 uppercase text-[10px]">No_Archives_Found</div>
                ) : (
                  savedWorkspaces.map(w => (
                    <div key={w.id} className="group flex items-center justify-between p-3 rounded-lg border border-white/5 hover:border-purple-500/30 bg-white/[0.02] transition-all">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-white/80 font-bold">{w.name}</span>
                        <span className="text-[8px] text-white/20 uppercase tracking-tighter italic">ID: {w.id.slice(0, 8)}...</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => loadWorkspace(w)} className="h-8 w-8 text-blue-400 hover:text-blue-300">
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 border-white/10 bg-white/5 text-[10px] uppercase tracking-widest gap-2">
                <Save className="w-3 h-3" /> Archive
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0a0a0a] border-white/10 text-white font-mono">
              <DialogHeader>
                <DialogTitle className="text-xs uppercase tracking-widest text-white/60">Snapshot_Identity</DialogTitle>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-[8px] text-white/30 uppercase tracking-[0.3em]">Workspace_Name</label>
                  <Input 
                    value={workspaceName} 
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    className="bg-white/5 border-white/10 text-[11px]"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={saveWorkspace} className="w-full bg-purple-600 hover:bg-purple-500 text-[10px] uppercase tracking-widest h-10">Commit_to_VFS</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main Grid */}
      <div className={cn(
        "grid gap-8 min-h-[700px]",
        viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
      )}>
        {slots.map((slot, index) => (
          <Card key={slot.id} className="bg-black/40 border-white/5 backdrop-blur-xl flex flex-col overflow-hidden relative group">
            <div className={cn(
              "absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-transparent to-transparent group-hover:via-purple-500/50 transition-all duration-700",
              index === 0 && "via-blue-500/50"
            )} />
            
            <CardHeader className="bg-white/5 border-b border-white/5 py-3 px-4 flex flex-row items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className={cn("w-2 h-2 rounded-full animate-pulse", index === 0 ? "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" : "bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]")} />
                <CardTitle className="text-[10px] font-mono text-white/50 uppercase tracking-[0.3em] flex items-center gap-2">
                  <Terminal className="w-3 h-3" /> {slot.name}
                </CardTitle>
              </div>
              <div className="flex items-center gap-2">
                {slots.length > 1 && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeSlot(slot.id)}
                    className="h-6 w-6 text-white/10 hover:text-red-400"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}
                {slot.techStack.length > 0 && (
                  <Badge variant="outline" className="text-[7px] border-white/5 text-white/20 uppercase h-5">{slot.techStack[0]}</Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="flex-1 p-0 flex flex-col">
              <Tabs defaultValue="code" className="flex-1 flex flex-col">
                <div className="px-4 bg-black/20 border-b border-white/5 flex items-center justify-between">
                  <TabsList className="bg-transparent border-0 h-9 p-0 gap-4">
                    <TabsTrigger value="code" className="data-[state=active]:bg-transparent data-[state=active]:text-blue-400 text-[9px] uppercase tracking-widest p-0 h-full border-b-2 border-transparent data-[state=active]:border-blue-400 rounded-none">Source</TabsTrigger>
                    <TabsTrigger value="preview" className="data-[state=active]:bg-transparent data-[state=active]:text-purple-400 text-[9px] uppercase tracking-widest p-0 h-full border-b-2 border-transparent data-[state=active]:border-purple-400 rounded-none">Execution</TabsTrigger>
                    <TabsTrigger value="intent" className="data-[state=active]:bg-transparent data-[state=active]:text-green-400 text-[9px] uppercase tracking-widest p-0 h-full border-b-2 border-transparent data-[state=active]:border-green-400 rounded-none">Intent</TabsTrigger>
                  </TabsList>
                  
                  {slot.loading && <Loader2 className="w-3 h-3 animate-spin text-white/20" />}
                </div>

                <TabsContent value="code" className="flex-1 mt-0 relative">
                  <Textarea
                    placeholder="LOAD_MODULE..."
                    value={slot.code}
                    onChange={(e) => updateSlot(slot.id, { code: e.target.value })}
                    className="w-full h-full min-h-[300px] bg-transparent border-0 text-blue-100 placeholder:text-white/5 font-mono text-[11px] leading-relaxed resize-none p-6 focus-visible:ring-0 custom-scrollbar"
                  />
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    {index === 0 && (
                      <Button 
                        onClick={() => setIsVariationDialogOpen(true)}
                        size="sm"
                        className="h-8 bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 text-purple-400 text-[9px] uppercase tracking-widest"
                      >
                        <Sparkles className="w-3 h-3 mr-2" /> Evolve
                      </Button>
                    )}
                    <Button 
                      onClick={() => executeSlot(slot.id)}
                      disabled={slot.loading || !slot.code.trim()}
                      size="sm"
                      className="h-8 bg-blue-600 hover:bg-blue-500 text-white text-[9px] uppercase tracking-widest"
                    >
                      <Play className="w-3 h-3 mr-2" /> Run
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="preview" className="flex-1 mt-0 bg-white/5 min-h-[300px] relative overflow-hidden">
                  {slot.previewCode ? (
                    <>
                      <iframe
                        srcDoc={slot.previewCode}
                        className="w-full h-full border-0 bg-white"
                        title={`Execution_${slot.id}`}
                        sandbox="allow-scripts"
                      />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => openInNewWindow(slot.previewCode)}
                        className="absolute top-4 right-4 h-8 w-8 bg-black/50 text-white hover:bg-black/70 backdrop-blur-md rounded-lg"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-white/10 uppercase text-[9px] gap-4">
                      <Monitor className="w-10 h-10 opacity-5" />
                      Awaiting_Execution
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="intent" className="flex-1 mt-0 p-6 bg-black/20 text-white/60 text-[11px] leading-relaxed italic border-t border-white/5 min-h-[300px]">
                  {slot.intent || "No intent vector established. Execute logic to analyze."}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ))}

        {/* Add Slot Button */}
        <button 
          onClick={addSlot}
          className="group flex flex-col items-center justify-center p-12 border border-dashed border-white/10 rounded-2xl bg-white/[0.01] hover:bg-white/[0.03] hover:border-purple-500/30 transition-all text-center gap-4"
        >
          <div className="p-4 rounded-full bg-white/5 group-hover:bg-purple-500/10 transition-colors">
            <Plus className="w-8 h-8 text-white/20 group-hover:text-purple-400 transition-colors" />
          </div>
          <span className="text-[10px] text-white/10 uppercase tracking-[0.4em] group-hover:text-purple-400/60 transition-colors">Initialize_Chamber</span>
        </button>
      </div>

      {/* Variation Dialog */}
      <Dialog open={isVariationDialogOpen} onOpenChange={setIsVariationDialogOpen}>
        <DialogContent className="bg-[#0a0a0a] border-white/10 text-white font-mono max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-sm uppercase tracking-widest text-white/80 flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-purple-500" /> Neural_Variation_Synthesizer
            </DialogTitle>
          </DialogHeader>
          <div className="py-6 space-y-6">
            <div className="space-y-3">
              <label className="text-[9px] text-white/30 uppercase tracking-[0.3em]">Evolution_Instructions</label>
              <Textarea 
                placeholder="e.g. 'Generate 3 variations with different glassmorphism intensities and neon color schemes...'"
                value={variationInstructions}
                onChange={(e) => setVariationInstructions(e.target.value)}
                className="bg-white/5 border-white/10 text-[12px] h-32 leading-relaxed"
              />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-[9px] text-white/30 uppercase tracking-[0.3em]">Branch_Count</label>
                <span className="text-purple-400 text-xs">{variationCount}</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="5" 
                value={variationCount} 
                onChange={(e) => setVariationCount(parseInt(e.target.value))}
                className="w-full accent-purple-500 bg-white/5 h-1 rounded-lg"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              disabled={isGeneratingVariations || !variationInstructions.trim()}
              onClick={handleGenerateVariations}
              className="w-full bg-purple-600 hover:bg-purple-500 h-12 text-[11px] uppercase tracking-widest gap-3"
            >
              {isGeneratingVariations ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> SYNTHESIZING_BRANCHES...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" /> BEGIN_EVOLUTION
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
