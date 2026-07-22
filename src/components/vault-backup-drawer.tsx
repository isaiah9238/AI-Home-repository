'use client';

import { useState, useRef } from 'react';
import { Database, ShieldCheck, Download, Copy, Check, Archive, Loader2, Sparkles, AlertCircle, FileJson, Upload, RefreshCw } from 'lucide-react';
import { exportVaultData, importVaultData } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

/**
 * VaultBackupDrawer: The Librarian's Export & Restoration Protocol.
 * Bundles all AI state data into a portable structure and restores from backups.
 */
export function VaultBackupDrawer() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [backupData, setBackupData] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDistill = async () => {
    setLoading(true);
    setBackupData(null);
    try {
      const res = await exportVaultData();
      if (res.success) {
        setBackupData(res.bundle);
        toast({
          title: "VAULT_DISTILLED",
          description: "System state has been aggregated into a unified structure.",
          className: "bg-black/80 border-blue-500/30 text-blue-400 font-mono text-[8px]",
        });
      } else {
        toast({
          variant: "destructive",
          title: "DISTILLATION_FAILED",
          description: res.error,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!backupData) return;
    navigator.clipboard.writeText(JSON.stringify(backupData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "COPIED_TO_BUFFER",
      description: "AI state is now secured in your clipboard.",
      className: "bg-black/80 border-green-500/30 text-green-400 font-mono text-[8px]",
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsedJSON = JSON.parse(event.target?.result as string);
        executeRestore(parsedJSON);
      } catch (err) {
        toast({
          variant: "destructive",
          title: "INVALID_ARCHIVE_FILE",
          description: "The uploaded file is not a valid JSON backup bundle.",
          className: "bg-black/80 border-red-500/30 text-red-400 font-mono text-[8px]",
        });
      }
    };
    reader.readAsText(file);
  };

  const executeRestore = async (bundle: any) => {
    if (!confirm("WARNING: Restoring an archive will overwrite matching VFS nodes. Proceed?")) return;
    setRestoring(true);
    try {
      const res = await importVaultData(bundle);
      if (res.success) {
        setBackupData(bundle);
        toast({
          title: "RESTORATION_COMPLETE",
          description: `Successfully ingested ${res.count} state items into Firestore & Vector Index.`,
          className: "bg-black/80 border-green-500/30 text-green-400 font-mono text-[8px]",
        });
      } else {
        throw new Error(res.error);
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "RESTORATION_FAILED",
        description: err.message || "Failed to ingest archive bundle.",
      });
    } finally {
      setRestoring(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="p-8 w-full h-full flex flex-col bg-black/40 backdrop-blur-xl font-mono overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3 text-blue-400">
          <div className="p-2 rounded bg-blue-500/10 border border-blue-500/20">
            <Archive className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-light tracking-[0.3em] uppercase">Librarian_Archive_Protocol</h2>
        </div>
        <Badge variant="outline" className="border-blue-500/20 text-blue-400/60 bg-blue-500/5 text-[8px] tracking-[0.2em] h-8 px-4">
          PORTABILITY_READY
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        
        {/* Left: Control Panel (Export & Import) */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="bg-black/40 border-white/5 backdrop-blur-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Sparkles className="w-20 h-20 text-blue-400" />
            </div>
            <CardHeader>
              <CardTitle className="text-[10px] text-white/30 uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck className="w-3 h-3 text-green-500" /> Disaster_Recovery_Core
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-[10px] text-white/40 leading-relaxed uppercase">
                Distill system state to a file or import an archive to recover VFS nodes and vector context.
              </p>
              <div className="p-4 rounded-lg bg-yellow-500/5 border border-yellow-500/10 space-y-2">
                <div className="flex items-center gap-2 text-yellow-500/60 font-bold text-[9px] uppercase">
                  <AlertCircle className="w-3 h-3" /> Note
                </div>
                <p className="text-[8px] text-white/30 leading-relaxed italic">
                  Restoring an archive updates Firestore documents and triggers vector re-indexing automatically.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <Button 
                  onClick={handleDistill} 
                  disabled={loading || restoring}
                  className="w-full bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/40 h-11 uppercase tracking-widest text-xs"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Database className="w-4 h-4 mr-2" />}
                  {loading ? 'Distilling_Data...' : 'Trigger_Distillation'}
                </Button>

                {/* Import Archive Hidden File Input & Trigger */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept=".json" 
                  onChange={handleFileUpload} 
                  className="hidden" 
                />
                <Button 
                  onClick={() => fileInputRef.current?.click()} 
                  disabled={loading || restoring}
                  className="w-full bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-500/40 h-11 uppercase tracking-widest text-xs"
                >
                  {restoring ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                  {restoring ? 'Ingesting_Archive...' : 'Import_Archive'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {backupData && (
            <div className="p-6 rounded-xl border border-green-500/10 bg-green-500/5 space-y-4 animate-in zoom-in-95">
              <div className="flex justify-between items-center">
                <h3 className="text-[9px] text-green-400/60 uppercase tracking-[0.3em] flex items-center gap-2">
                  <Check className="w-3 h-3" /> State_Buffered
                </h3>
                <span className="text-[8px] text-white/20 font-mono">Size: {(JSON.stringify(backupData).length / 1024).toFixed(2)}KB</span>
              </div>
              <Button 
                onClick={copyToClipboard}
                className="w-full bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-500/40 h-10 uppercase tracking-widest text-[9px]"
              >
                {copied ? <Check className="w-3 h-3 mr-2" /> : <Copy className="w-3 h-3 mr-2" />}
                {copied ? 'Copied_to_Buffer' : 'Copy_Archive_Bundle'}
              </Button>
            </div>
          )}
        </div>

        {/* Right: Stream Preview Canvas */}
        <div className="lg:col-span-8 flex flex-col">
          <Card className="bg-black/20 border-white/5 flex-1 overflow-hidden flex flex-col min-h-[400px]">
            <CardHeader className="bg-white/5 border-b border-white/5 py-3 flex flex-row items-center justify-between">
              <CardTitle className="text-[10px] text-white/30 uppercase tracking-widest flex items-center gap-2">
                <FileJson className="w-3 h-3" /> Export_Import_Stream_Buffer
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-auto custom-scrollbar relative">
              {backupData ? (
                <pre className="p-6 text-[10px] text-blue-100/60 font-mono leading-relaxed bg-black/40 select-all">
                  {JSON.stringify(backupData, null, 2)}
                </pre>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-12 opacity-10">
                  <Download className="w-16 h-16 mb-4 animate-pulse" />
                  <p className="text-[10px] uppercase tracking-[0.4em]">Awaiting_Distillation_Or_Ingest_Pulse</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}