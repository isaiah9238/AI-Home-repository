"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { HardDrive, ShieldCheck, Folder, FileCode, ExternalLink } from 'lucide-react';

interface VFSNode {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'directory';
  content?: string;
  parentId: string | null;
  updatedAt: string;
  metadata?: {
    isVault?: boolean;
    agentOrigin?: string;
    neuralWeight?: number;
    intent_vector?: string;
    owner_agent?: string;
  };
}

export default function CabinetPage() {
  const [activeFiles, setActiveFiles] = useState<VFSNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<VFSNode | null>(null);

  useEffect(() => {
    const vfsRef = collection(db, "ai_vfs");
    
    // Establishing live sync with structural records
    const unsubscribe = onSnapshot(query(vfsRef), (snapshot) => {
      const filesData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || "Unknown_File",
          path: data.path || "",
          type: data.type || "file",
          content: data.content || "",
          parentId: data.parentId || null,
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : new Date().toISOString(),
          metadata: {
            owner_agent: data.metadata?.owner_agent || data.metadata?.agentOrigin || "System",
            intent_vector: data.metadata?.intent_vector || "None",
            isVault: data.metadata?.isVault || false
          }
        } as VFSNode;
      });
      
      setActiveFiles(filesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="p-8 w-full h-full flex flex-col bg-black/40 backdrop-blur-xl font-mono text-emerald-400 overflow-hidden">
      {/* Header Banner */}
      <div className="flex items-center justify-between mb-8 border-b border-emerald-950 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-light tracking-[0.3em] uppercase text-emerald-300">The_Cabinet_Vault</h2>
            <p className="text-[9px] text-emerald-700 uppercase mt-1 tracking-wider">Secure Matrix Link // ai_vfs_live</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 overflow-hidden strict-height">
        {/* Left Side: Directory Grid */}
        <div className="lg:col-span-7 flex flex-col gap-4 overflow-y-auto max-h-[70vh] pr-2 custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <span className="w-2 h-2 bg-emerald-500 rounded-full inline-block animate-ping"></span>
              <span className="text-[8px] text-emerald-600 uppercase tracking-[0.4em]">Syncing_Archives...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeFiles.map((file) => (
                <div 
                  key={file.id} 
                  onClick={() => setSelectedFile(file)}
                  className={`border p-4 bg-black/60 transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[130px] rounded-xl
                    ${selectedFile?.id === file.id 
                      ? 'border-emerald-400 bg-emerald-950/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]' 
                      : 'border-emerald-900/40 hover:border-emerald-600 hover:bg-emerald-950/10'}`}
                >
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-1.5 rounded bg-white/5 ${file.type === 'directory' ? 'text-blue-400' : 'text-emerald-400'}`}>
                        {file.type === 'directory' ? <Folder className="w-4 h-4" /> : <FileCode className="w-4 h-4" />}
                      </div>
                      <h3 className="text-[11px] font-bold text-emerald-200 truncate tracking-tight max-w-[150px] uppercase">{file.name}</h3>
                    </div>
                    {file.metadata?.intent_vector !== "None" && (
                      <span className="text-[7px] uppercase tracking-widest bg-emerald-950/80 text-emerald-500/80 px-2 py-0.5 rounded border border-emerald-800/30">
                        {file.metadata?.intent_vector}
                      </span>
                    )}
                  </div>
                  
                  <div className="text-[8px] text-emerald-700/70 flex justify-between items-end mt-4 pt-2 border-t border-emerald-950/40">
                    <span>Src: {file.metadata?.owner_agent}</span>
                    <span className="font-mono text-[7px]">{file.id.substring(0,8)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Structural Node Inspector */}
        <div className="lg:col-span-5 flex flex-col gap-4 border border-emerald-900/30 rounded-xl bg-black/60 p-5 overflow-hidden">
          <div className="text-[9px] text-emerald-600 uppercase tracking-widest flex items-center gap-2 border-b border-emerald-950 pb-3">
            <HardDrive className="w-3.5 h-3.5" /> Node_Decryption_Matrix
          </div>
          
          {selectedFile ? (
            <div className="space-y-4 flex-1 flex flex-col overflow-hidden mt-2">
              <div>
                <h4 className="text-xs font-bold text-emerald-200 uppercase tracking-wider truncate">{selectedFile.name}</h4>
                <p className="text-[7px] text-emerald-700 uppercase mt-0.5">{selectedFile.path}</p>
              </div>

              <div className="p-3 bg-emerald-950/10 border border-emerald-900/30 rounded-lg text-[8px] space-y-1 text-emerald-500">
                <div><span className="text-emerald-700">NODE_TYPE:</span> {selectedFile.type.toUpperCase()}</div>
                <div><span className="text-emerald-700">STAMPED:</span> {new Date(selectedFile.updatedAt).toLocaleString()}</div>
              </div>

              <div className="flex-1 flex flex-col min-h-0">
                <span className="text-[8px] text-emerald-600 uppercase tracking-wider mb-2 block">Payload Stream:</span>
                <div className="flex-1 p-3 rounded-lg bg-black border border-emerald-950 font-mono text-[10px] text-emerald-400/80 whitespace-pre overflow-y-auto custom-scrollbar">
                  {selectedFile.content || '// Zero payload detected inside node.'}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-emerald-800 opacity-40 py-20">
              <FileCode className="w-12 h-12 mb-3" />
              <p className="text-[9px] uppercase tracking-[0.3em]">Select_Node_To_Decrypt</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}