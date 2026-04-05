
'use client';

import { useState, useEffect } from 'react';
import { Box, Sparkles, Loader2, Folder, FileCode, Copy, Check, Terminal, History, Database, Trash2, ArrowRight, ShieldCheck, HardDrive } from 'lucide-react';
import { runArchitect, getSavedBlueprints, deleteBlueprint } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function ArchitectPage() {
  const { toast } = useToast();
  const [blueprint, setBlueprint] = useState('');
  const [loading, setLoading] = useState(false);
  const [commitToVFS, setCommitToVFS] = useState(true);
  const [results, setResults] = useState<any[] | null>(null);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('new');
  const [savedBlueprints, setSavedBlueprints] = useState<any[]>([]);

  useEffect(() => {
    if (activeTab === 'history') {
      loadHistory();
    }
  }, [activeTab]);

  const loadHistory = async () => {
    const res = await getSavedBlueprints();
    if (res.success) setSavedBlueprints(res.data ?? []);
  };

  const handleArchitect = async () => {
    if (!blueprint) return;
    setLoading(true);
    setResults(null);
    setSelectedFile(null);
    
    try {
      const result = await runArchitect(blueprint, commitToVFS);
      if (result.success) {
        setResults(result.data ?? []);
        loadHistory();
        if (result.vfsCommitted) {
          toast({
            title: "VAULT_SYNC_COMPLETE",
            description: "Autonomous writing successful. Structure committed to VFS.",
            className: "bg-black/80 border-green-500/30 text-green-400 font-mono text-[8px]"
          });
        }
      } else {
        toast({
          variant: "destructive",
          title: "CONSTRUCTION_FAILED",
          description: result.error
        });
      }
    } catch (error) {
      console.error("Construction Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadBlueprint = (bp: any) => {
    setResults(bp.structure);
    setActiveTab('new');
    setSelectedFile(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Permanently wipe this architecture from the Librarian?")) {
      const res = await deleteBlueprint(id);
      if (res.success) loadHistory();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 font-mono">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-l-4 border-purple-500 pl-6">
        <div>
          <h1 className="text-4xl font-light tracking-[0.2em] uppercase flex items-center gap-4 text-white">
            <Box className="w-8 h-8 text-purple-500" /> The_Architect
          </h1>
          <p className="text-white/40 mt-2 uppercase tracking-widest text-xs">
            Phase 3: Autonomous Writing & VFS Synchronization.
          </p>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-purple-500/50 uppercase tracking-[0.3em]">Module: AUTONOMOUS_CONSTRUCTION</div>
          <div className="text-[10px] text-white/20 uppercase tracking-[0.3em]">Sync: LIBRARIAN_VFS_ACTIVE</div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-white/5 border border-white/10 mb-8 p-1 h-auto gap-2">
          <TabsTrigger value="new" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400 font-mono text-[10px] uppercase tracking-widest py-3 px-6">
            <Sparkles className="w-3 h-3 mr-2" /> New_Blueprint
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400 font-mono text-[10px] uppercase tracking-widest py-3 px-6">
            <History className="w-3 h-3 mr-2" /> Retrieval_Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="space-y-8 mt-0">
          <Card className="bg-black/40 border-white/5 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
            <CardHeader>
              <CardTitle className="text-[10px] font-mono text-white/30 uppercase tracking-[0.3em] flex items-center gap-2">
                <Terminal className="w-3 h-3" /> Construction_Input
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4">
                <Input
                  placeholder="DESCRIBE_SYSTEM_REQUIREMENTS (e.g. NextJS App with Firebase Auth)..."
                  value={blueprint}
                  onChange={(e) => setBlueprint(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/10 font-mono text-sm tracking-wider h-12"
                  onKeyDown={(e) => e.key === 'Enter' && handleArchitect()}
                />
                <Button 
                  onClick={handleArchitect} 
                  disabled={loading || !blueprint} 
                  className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-8 h-12 rounded transition-all shadow-[0_0_20px_rgba(168,85,247,0.2)] uppercase tracking-widest text-xs"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> PRINTING...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" /> SUMMON_ARCHITECT
                    </span>
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-green-500/60" />
                  <div className="flex flex-col">
                    <Label htmlFor="vfs-toggle" className="text-[10px] uppercase text-white/60 tracking-widest cursor-pointer">Autonomous_Vault_Writing</Label>
                    <span className="text-[8px] text-white/20 uppercase tracking-tighter">Commit structure directly to Virtual File System</span>
                  </div>
                </div>
                <Switch 
                  id="vfs-toggle"
                  checked={commitToVFS}
                  onCheckedChange={setCommitToVFS}
                  className="data-[state=checked]:bg-purple-500"
                />
              </div>
            </CardContent>
          </Card>

          {results && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[600px] animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <Card className="lg:col-span-4 bg-black/40 border-white/5 flex flex-col overflow-hidden">
                <CardHeader className="bg-white/5 border-b border-white/5 py-3">
                  <CardTitle className="text-[10px] text-white/30 uppercase tracking-widest font-bold flex items-center gap-2">
                    <HardDrive className="w-3 h-3" /> Structural_Nodes
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 p-2 overflow-y-auto custom-scrollbar">
                  <div className="space-y-1">
                    {results.map((file, i) => (
                      <div 
                        key={i} 
                        onClick={() => file.type === 'file' && setSelectedFile(file)}
                        className={`
                          flex items-center gap-3 p-2 rounded cursor-pointer transition-all group
                          ${file.type === 'file' ? 'hover:bg-purple-500/10' : 'cursor-default'}
                          ${selectedFile?.path === file.path ? 'bg-purple-500/20 border-l-2 border-purple-500' : 'border-l-2 border-transparent'}
                        `}
                      >
                        {file.type === 'directory' ? (
                          <Folder className="w-3 h-3 text-purple-400/60" />
                        ) : (
                          <FileCode className="w-3 h-3 text-blue-400/60" />
                        )}
                        <span className={`text-[11px] truncate ${file.type === 'directory' ? 'text-purple-300/80 font-bold' : 'text-white/60'}`}>
                          {file.path}
                        </span>
                        {file.content && (
                          <Badge variant="outline" className="ml-auto text-[7px] border-blue-500/20 text-blue-400/40 uppercase">BP</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-8 bg-black/40 border-white/5 flex flex-col overflow-hidden">
                <CardHeader className="bg-white/5 border-b border-white/5 py-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-[10px] text-white/30 uppercase tracking-widest font-bold">
                    {selectedFile ? `Node_Preview: ${selectedFile.path.split('/').pop()}` : 'Select_Node_To_Preview'}
                  </CardTitle>
                  {selectedFile?.content && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 text-[10px] uppercase text-white/30 hover:text-white"
                      onClick={() => copyToClipboard(selectedFile.content)}
                    >
                      {copied ? <Check className="w-3 h-3 mr-2 text-green-500" /> : <Copy className="w-3 h-3 mr-2" />}
                      {copied ? "COPIED" : "COPY_BOILERPLATE"}
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="flex-1 p-0 overflow-auto custom-scrollbar bg-black/20">
                  {selectedFile?.content ? (
                    <pre className="p-6 text-[11px] text-blue-100/70 whitespace-pre leading-relaxed font-mono">
                      {selectedFile.content}
                    </pre>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center opacity-10">
                      <Box className="w-16 h-16 mb-4" />
                      <span className="text-[10px] uppercase tracking-[0.4em]">Awaiting_Selection</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-0 animate-in slide-in-from-right-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedBlueprints.length === 0 ? (
              <div className="col-span-full py-24 text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
                <Database className="w-12 h-12 mx-auto mb-4 text-white/10" />
                <p className="text-[10px] text-white/20 uppercase tracking-[0.5em]">No_Structural_Archives_Recovered</p>
              </div>
            ) : (
              savedBlueprints.map((bp) => (
                <Card key={bp.id} className="bg-black/40 border-white/5 hover:border-purple-500/30 transition-all group cursor-pointer" onClick={() => loadBlueprint(bp)}>
                  <CardHeader className="p-4 border-b border-white/5 flex flex-row items-center justify-between">
                    <CardTitle className="text-[10px] font-mono text-white/60 uppercase truncate mr-4">{bp.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={(e) => { e.stopPropagation(); handleDelete(bp.id); }}
                        className="h-6 w-6 text-white/10 hover:text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                      <Badge variant="outline" className="text-[8px] border-purple-500/20 text-purple-400/60 uppercase">Archive</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <p className="text-[9px] text-white/30 font-mono line-clamp-2 mb-4 italic">"{bp.prompt}"</p>
                    <div className="flex items-center justify-between text-[8px] font-mono uppercase tracking-widest text-white/20">
                      <span>{new Date(bp.timestamp).toLocaleDateString()}</span>
                      <span className="group-hover:text-purple-400 transition-colors flex items-center gap-2">Load_Node <ArrowRight className="w-3 h-3" /></span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
