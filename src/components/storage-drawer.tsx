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
  LayoutGrid,
  Sparkles,
  MessageSquare,
  Send,
  Home,
  Save,
  Edit2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { 
  getVFSNodesAction, 
  deleteVFSNodeAction, 
  initializeVFS,
  postAgenticNote,
  createVFSDirectory,
  updateVFSNodeAction
} from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';

interface VFSNode {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'directory';
  content?: string;
  parentId: string | null;
  updatedAt: string;
  metadata?: any;
}

export function StorageDrawer() {
  const { toast } = useToast();
  const [nodes, setNodes] = useState<VFSNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentParentId, setCurrentParentId] = useState<string | null>(null);
  const [history, setHistory] = useState<{id: string | null, name: string}[]>([]);
  const [selectedFile, setSelectedFile] = useState<VFSNode | null>(null);
  const [searchTerm, setSearch] = useState('');
  const [newNote, setNewNote] = useState('');
  const [isPostingNote, setIsPostingNote] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

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
      const currentName = currentParentId === null ? 'Root' : (nodes.find(n => n.id === currentParentId)?.name || 'Unknown');
      setHistory(prev => [...prev, { id: currentParentId, name: currentName }]);
      setCurrentParentId(node.id);
      setSelectedFile(null);
      setIsEditing(false);
    } else {
      setSelectedFile(node);
      setEditedContent(node.content || '');
      setIsEditing(false);
    }
  };

  const jumpToBreadcrumb = (id: string | null, index: number) => {
    setHistory(prev => prev.slice(0, index));
    setCurrentParentId(id);
    setSelectedFile(null);
    setIsEditing(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Confirm permanent node purge?")) return;
    const res = await deleteVFSNodeAction(id);
    if (res.success) {
      toast({ title: "PURGE_COMPLETE", description: "Node removed from storage.", className: "bg-black/80 border-red-500/30 text-red-400 font-mono text-[8px]" });
      loadNodes(currentParentId);
      if (selectedFile?.id === id) setSelectedFile(null);
    }
  };

  const handleSaveContent = async () => {
    if (!selectedFile) return;
    setIsSaving(true);
    const res = await updateVFSNodeAction(selectedFile.id, editedContent);
    if (res.success) {
      toast({ title: "VAULT_SYNC_COMPLETE", description: "File content updated in Librarian archives." });
      setSelectedFile({ ...selectedFile, content: editedContent });
      setIsEditing(false);
      loadNodes(currentParentId);
    } else {
      toast({ variant: "destructive", title: "SYNC_FAILED", description: res.error });
    }
    setIsSaving(false);
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    setIsCreatingFolder(true);
    const res = await createVFSDirectory(newFolderName, currentParentId);
    if (res.success) {
      setNewFolderName('');
      loadNodes(currentParentId);
      toast({ title: "DIRECTORY_SYNTHESIZED", description: `Folder ${newFolderName} added to vault.` });
    }
    setIsCreatingFolder(false);
  };

  const handleInitialize = async () => {
    setLoading(true);
    await initializeVFS();
    loadNodes(null);
    toast({ title: "STORAGE_INITIALIZED", description: "Virtual File System ready.", className: "bg-black/80 border-blue-500/30 text-blue-400 font-mono text-[8px]" });
  };

  const handlePostNote = async () => {
    if (!newNote.trim()) return;
    setIsPostingNote(true);
    const res = await postAgenticNote("User", newNote, "Manual_Coordination");
    if (res.success) {
      setNewNote('');
      loadNodes(currentParentId);
      toast({ title: "SIGNAL_POSTED", description: "Note synchronized with agentic memory." });
    }
    setIsPostingNote(false);
  };

  const filteredNodes = nodes.filter(n => n.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const agentNotes = nodes.filter(n => n.metadata?.type === 'agent_note' || n.metadata?.type === 'research_report');

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

      <Tabs defaultValue="explorer" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="bg-transparent border-b border-white/5 w-full justify-start rounded-none h-12 p-0 gap-8 mb-6">
          <TabsTrigger value="explorer" className="data-[state=active]:bg-transparent data-[state=active]:text-green-400 text-[10px] uppercase tracking-[0.2em] p-0 h-full border-b-2 border-transparent data-[state=active]:border-green-400 rounded-none gap-2">
            <LayoutGrid className="w-3.5 h-3.5" /> File_Explorer
          </TabsTrigger>
          <TabsTrigger value="memory" className="data-[state=active]:bg-transparent data-[state=active]:text-purple-400 text-[10px] uppercase tracking-[0.2em] p-0 h-full border-b-2 border-transparent data-[state=active]:border-purple-400 rounded-none gap-2">
            <Sparkles className="w-3.5 h-3.5" /> Agentic_Memory
          </TabsTrigger>
        </TabsList>

        <TabsContent value="explorer" className="flex-1 m-0 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
            <div className="lg:col-span-7 flex flex-col gap-4 overflow-hidden">
              <Card className="bg-black/40 border-white/5 backdrop-blur-md flex-1 flex flex-col overflow-hidden">
                <CardHeader className="bg-white/5 border-b border-white/5 py-3 flex flex-row items-center gap-4">
                  <div className="flex items-center gap-2 overflow-hidden flex-1">
                    <Button variant="ghost" size="icon" onClick={() => jumpToBreadcrumb(null, 0)} className="h-7 w-7 text-white/40 hover:text-white shrink-0">
                      <Home className="w-3.5 h-3.5" />
                    </Button>
                    <div className="flex items-center gap-1 text-[10px] text-white/30 uppercase tracking-widest overflow-hidden">
                      {history.map((h, i) => (
                        <div key={i} className="flex items-center gap-1">
                          <ChevronRight className="w-3 h-3 opacity-20" />
                          <button onClick={() => jumpToBreadcrumb(h.id, i)} className="hover:text-white transition-colors truncate max-w-[100px]">{h.name}</button>
                        </div>
                      ))}
                      {currentParentId && (
                        <>
                          <ChevronRight className="w-3 h-3 opacity-20" />
                          <span className="text-green-400 font-bold truncate max-w-[150px]">{nodes.find(n => n.id === currentParentId)?.name || 'Loading...'}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="ml-auto flex items-center gap-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" className="h-7 bg-white/5 border border-white/10 text-[8px] uppercase tracking-widest gap-2 px-3">
                          <Plus className="w-3 h-3" /> Folder
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-[#0a0a0a] border-white/10 text-white font-mono">
                        <DialogHeader>
                          <DialogTitle className="text-xs uppercase tracking-widest text-white/60">Node_Synthesis</DialogTitle>
                        </DialogHeader>
                        <div className="py-4 space-y-4">
                          <div className="space-y-2">
                            <label className="text-[8px] text-white/30 uppercase tracking-[0.3em]">Directory_Name</label>
                            <Input 
                              value={newFolderName} 
                              onChange={(e) => setNewFolderName(e.target.value)}
                              placeholder="FOLDER_ALPHA..."
                              className="bg-white/5 border-white/10 text-[11px]"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleCreateFolder} disabled={isCreatingFolder || !newFolderName.trim()} className="w-full bg-green-600 hover:bg-green-500 text-[10px] uppercase tracking-widest h-10">Synthesize_Directory</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <div className="relative hidden md:block">
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

            <div className="lg:col-span-5 flex flex-col gap-4 overflow-hidden">
              <Card className="bg-black/40 border-white/5 backdrop-blur-md flex-1 flex flex-col overflow-hidden">
                <CardHeader className="bg-white/5 border-b border-white/5 py-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-[10px] text-white/30 uppercase tracking-widest flex items-center gap-2">
                    <ShieldCheck className="w-3 h-3 text-green-500" /> Node_Inspector
                  </CardTitle>
                  {selectedFile?.type === 'file' && !isEditing && (
                    <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)} className="h-7 w-7 text-white/30 hover:text-green-400">
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                  )}
                  {isEditing && (
                    <Button variant="ghost" size="icon" onClick={handleSaveContent} disabled={isSaving} className="h-7 w-7 text-green-400 hover:text-green-300">
                      {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    </Button>
                  )}
                </CardHeader>
                <ScrollArea className="flex-1">
                  <CardContent className="pt-6">
                    {selectedFile ? (
                      <div className="space-y-6">
                        <div className="flex items-start justify-between">
                          <div className="min-w-0 flex-1 pr-4">
                            <h4 className="text-sm font-bold text-white uppercase mb-1 truncate">{selectedFile.name}</h4>
                            <Badge className="bg-green-500/10 text-green-400 text-[7px] uppercase h-4 px-2">
                              {selectedFile.type}
                            </Badge>
                          </div>
                          <Button variant="outline" size="sm" className="h-7 border-white/10 text-white/40 text-[8px] uppercase hover:text-white shrink-0">
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
                            {isEditing ? (
                              <Textarea 
                                value={editedContent}
                                onChange={(e) => setEditedContent(e.target.value)}
                                className="min-h-[300px] bg-black/60 border-green-500/20 text-green-400 font-mono text-[10px] focus-visible:ring-green-500/30"
                              />
                            ) : (
                              <div className="p-4 rounded-lg bg-black/60 border border-white/5 font-mono text-[10px] text-green-400/70 whitespace-pre overflow-auto max-h-60 custom-scrollbar">
                                {selectedFile.content || '// Empty Stream'}
                              </div>
                            )}
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
        </TabsContent>

        <TabsContent value="memory" className="flex-1 m-0 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
            <div className="lg:col-span-8 flex flex-col gap-4 overflow-hidden">
              <ScrollArea className="flex-1">
                <div className="space-y-4 pr-4">
                  {agentNotes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/5 rounded-xl opacity-20">
                      <MessageSquare className="w-12 h-12 mb-4" />
                      <p className="text-[10px] uppercase tracking-[0.2em]">No_Agentic_Signals_Established</p>
                    </div>
                  ) : (
                    agentNotes.map((note) => (
                      <Card key={note.id} className="bg-white/[0.02] border-white/5 hover:border-purple-500/30 transition-all overflow-hidden group">
                        <div className="bg-white/5 px-4 py-2 border-b border-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_5px_rgba(168,85,247,0.5)]" />
                            <span className="text-[9px] font-bold text-white/60 uppercase tracking-widest">{note.metadata?.owner_agent || 'Unknown_Agent'}</span>
                            <Badge variant="outline" className="text-[7px] border-purple-500/20 text-purple-400/40 uppercase h-4">
                              {note.metadata?.intent_vector || 'General'}
                            </Badge>
                          </div>
                          <span className="text-[8px] text-white/20">{new Date(note.updatedAt).toLocaleString()}</span>
                        </div>
                        <CardContent className="p-4">
                          <p className="text-[11px] text-white/70 leading-relaxed italic whitespace-pre-wrap">{note.content}</p>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-4 overflow-hidden">
              <Card className="bg-black/40 border-white/5 backdrop-blur-md flex-1 flex flex-col overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
                <CardHeader className="bg-white/5 border-b border-white/5 py-3">
                  <CardTitle className="text-[10px] text-white/30 uppercase tracking-widest flex items-center gap-2">
                    <Send className="w-3 h-3 text-purple-500" /> Broadcast_Signal
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <p className="text-[9px] text-white/30 leading-relaxed uppercase tracking-tighter">
                    Inject a manual signal into the agentic memory stream to coordinate cross-agent logic.
                  </p>
                  <Textarea 
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="ENTER_COORDINATION_LOG..."
                    className="bg-white/5 border-white/10 text-[11px] h-40 font-mono focus-visible:ring-purple-500/50"
                  />
                  <Button 
                    onClick={handlePostNote}
                    disabled={isPostingNote || !newNote.trim()}
                    className="w-full bg-purple-600 hover:bg-purple-500 h-10 text-[10px] uppercase tracking-widest gap-2"
                  >
                    {isPostingNote ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    Sync_Signal
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
