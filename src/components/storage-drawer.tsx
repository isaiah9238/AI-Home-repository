'use client';

import { useState, useEffect } from 'react';
import { 
  Folder, 
  File, 
  ChevronRight, 
  Search, 
  HardDrive, 
  X, 
  Plus, 
  Trash2, 
  Download, 
  Loader2, 
  ArrowLeft,
  FileJson,
  FileCode,
  ShieldCheck,
  RefreshCcw,
  LayoutGrid
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getVFSNodesAction, deleteVFSNodeAction, initializeVFS } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

interface VFSNode {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'directory';
  content?: string;
  parentId: string | null;
  updatedAt: string;
}

export function StorageDrawer() {
  const { toast } = useToast();
  const [nodes, setNodes] = useState<VFSNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentParentId, setCurrentParentId] = useState<string | null>(null);
  const [history, setHistory] = useState<{id: string | null, name: string}[]>([]);
  const [selectedFile, setSelectedFile] = useState<VFSNode | null>(null);
  const [searchTerm, setSearch] = useState('');

  useEffect(() => {
    loadNodes(currentParentId);
  }, [currentParentId]);

  const loadNodes = async (parentId: string | null) => {
    setLoading(true);
    const res = await getVFSNodesAction(parentId);
    if (res.success) {
      setNodes(res.data as VFSNode[]);
    }
    setLoading(false);
  };

  const handleNavigate = (node: VFSNode) => {
    if (node.type === 'directory') {
      setHistory(prev => [...prev, { id: currentParentId, name: nodes.find(n => n.id === currentParentId)?.name || 'Root' }]);
      setCurrentParentId(node.id);
      setSelectedFile(null);
    } else {
      setSelectedFile(node);
    }
  };

  const goBack = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    setCurrentParentId(last.id);
    setSelectedFile(null);
  };

  const handleDelete = async (id: string) => {
    const res = await deleteVFSNodeAction(id);
    if (res.success) {
      toast({ title: "PURGE_COMPLETE", description: "Node removed from storage.", className: "bg-black/80 border-red-500/30 text-red-400 font-mono text-[8px]" });
      loadNodes(currentParentId);
      if (selectedFile?.id === id) setSelectedFile(null);
    }
  };

  const handleInitialize = async () => {
    setLoading(true);
    await initializeVFS();
    loadNodes(null);
    toast({ title: "STORAGE_INITIALIZED", description: "Virtual File System ready.", className: "bg-black/80 border-blue-500/30 text-blue-400 font-mono text-[8px]" });
  };

  const filteredNodes = nodes.filter(n => n.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-8 w-full h-full flex flex-col bg-black/40 backdrop-blur-xl font-mono overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3 text-green-400">
          <div className="p-2 rounded bg-green-500/10 border border-green-500/20">
            <HardDrive className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-light tracking-[0.3em] uppercase">AI_Storage_Vault</h2>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => loadNodes(currentParentId)} className="text-white/20 hover:text-white">
            <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Badge variant="outline" className="border-green-500/20 text-green-400/60 bg-green-500/5 text-[8px] tracking-[0.2em] h-7 px-3">
            LIBRARIAN_VFS_ACTIVE
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 overflow-hidden">
        
        {/* Explorer Panel */}
        <div className="lg:col-span-7 flex flex-col gap-4 overflow-hidden">
          <Card className="bg-black/40 border-white/5 backdrop-blur-md flex-1 flex flex-col overflow-hidden">
            <CardHeader className="bg-white/5 border-b border-white/5 py-3 flex flex-row items-center gap-4">
              <div className="flex items-center gap-2">
                {history.length > 0 && (
                  <Button variant="ghost" size="icon" onClick={goBack} className="h-7 w-7 text-white/40 hover:text-white">
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                )}
                <span className="text-[10px] text-white/30 uppercase tracking-widest">
                  {history.map(h => h.name).join(' / ') || 'System_Root'}
                </span>
              </div>
              <div className="ml-auto flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-2 top-2 w-3 h-3 text-white/20" />
                  <Input 
                    placeholder="Filter..." 
                    value={searchTerm}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-7 bg-white/5 border-white/10 pl-7 text-[10px] w-32"
                  />
                </div>
              </div>
            </CardHeader>
            <ScrollArea className="flex-1">
              <CardContent className="p-4">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
                    <span className="text-[8px] text-white/20 uppercase tracking-[0.4em]">Retrieving_Nodes...</span>
                  </div>
                ) : filteredNodes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/5 rounded-xl">
                    <LayoutGrid className="w-12 h-12 text-white/5 mb-4" />
                    <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] mb-6">No_Nodes_In_Current_Depth</p>
                    <Button onClick={handleInitialize} className="bg-green-600/20 text-green-400 border border-green-500/40 text-[8px] tracking-widest uppercase h-8 px-6">
                      Sync_Sample_Structure
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {filteredNodes.map((node) => (
                      <div 
                        key={node.id} 
                        onClick={() => handleNavigate(node)}
                        className={`group p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-green-500/20 transition-all cursor-pointer flex items-center justify-between ${selectedFile?.id === node.id ? 'border-green-500/40 bg-green-500/5' : ''}`}
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className={`p-2 rounded-lg bg-white/5 ${node.type === 'directory' ? 'text-blue-400' : 'text-green-400'}`}>
                            {node.type === 'directory' ? <Folder className="w-4 h-4" /> : <FileCode className="w-4 h-4" />}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[11px] font-bold text-white/80 uppercase truncate">{node.name}</span>
                            <span className="text-[7px] text-white/20 uppercase tracking-tighter">Modified: {new Date(node.updatedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={(e) => { e.stopPropagation(); handleDelete(node.id); }}
                            className="h-7 w-7 text-white/20 hover:text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                          <ChevronRight className="w-3 h-3 text-white/20" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </ScrollArea>
          </Card>
        </div>

        {/* Inspector Panel */}
        <div className="lg:col-span-5 flex flex-col gap-4 overflow-hidden">
          <Card className="bg-black/40 border-white/5 backdrop-blur-md flex-1 flex flex-col overflow-hidden">
            <CardHeader className="bg-white/5 border-b border-white/5 py-3">
              <CardTitle className="text-[10px] text-white/30 uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck className="w-3 h-3 text-green-500" /> Node_Inspector
              </CardTitle>
            </CardHeader>
            <ScrollArea className="flex-1">
              <CardContent className="pt-6">
                {selectedFile ? (
                  <div className="space-y-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-white uppercase mb-1">{selectedFile.name}</h4>
                        <Badge className="bg-green-500/10 text-green-400 text-[7px] uppercase h-4 px-2">
                          {selectedFile.type}
                        </Badge>
                      </div>
                      <Button variant="outline" size="sm" className="h-7 border-white/10 text-white/40 text-[8px] uppercase hover:text-white">
                        <Download className="w-3 h-3 mr-2" /> Export
                      </Button>
                    </div>

                    <div className="p-4 rounded-lg bg-black/40 border border-white/5 space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <span className="text-[7px] text-white/20 uppercase block">Created</span>
                          <span className="text-[9px] text-white/60">{new Date(selectedFile.updatedAt).toLocaleString()}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[7px] text-white/20 uppercase block">Protocol</span>
                          <span className="text-[9px] text-white/60">VFS_LIBRARIAN</span>
                        </div>
                      </div>
                    </div>

                    {selectedFile.type === 'file' && (
                      <div className="space-y-3">
                        <span className="text-[8px] text-white/20 uppercase tracking-[0.2em] block">Data_Stream_Preview</span>
                        <div className="p-4 rounded-lg bg-black/60 border border-white/5 font-mono text-[10px] text-green-400/70 whitespace-pre overflow-auto max-h-60 custom-scrollbar">
                          {selectedFile.content || '// Empty Stream'}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center py-20 opacity-10">
                    <File className="w-16 h-16 mb-4" />
                    <p className="text-[10px] uppercase tracking-[0.4em]">Select_Node_To_Inspect</p>
                  </div>
                )}
              </CardContent>
            </ScrollArea>
          </Card>
        </div>

      </div>
    </div>
  );
}
