"use client"; // This is the magic word that tells Next.js this page is interactive
export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../../firebase";

// Defining what an AI File looks like based on your database screenshot
interface AIFile {
  id: string;
  name: string;
  type: string;
  owner_agent?: string;
  intent_vector?: string;
}

export default function CabinetPage() {
  const [activeFiles, setActiveFiles] = useState<AIFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Point directly at the VFS collection your Architect created
    const vfsRef = collection(db, "ai_vfs");
    
    // 2. Set up a "live listener" (onSnapshot) instead of a one-time fetch
    // If your AI creates a file while you are looking at this screen, it pops up instantly.
    const unsubscribe = onSnapshot(query(vfsRef), (snapshot) => {
      const filesData = snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name || "Unknown_File",
        type: doc.data().type || "file",
        owner_agent: doc.data().metadata?.owner_agent || "System",
        intent_vector: doc.data().metadata?.intent_vector || "None"
      }));
      
      setActiveFiles(filesData);
      setLoading(false);
    });

    // Clean up the listener when you leave the page
    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end border-l-4 border-emerald-600 pl-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-emerald-400">The Cabinet</h2>
          <p className="text-emerald-700 mt-1">Directory: Live Database Connection</p>
        </div>
      </div>

      {loading ? (
        <div className="text-emerald-500 animate-pulse flex items-center space-x-2">
          <span className="w-2 h-2 bg-emerald-500 rounded-full inline-block"></span>
          <span>Establishing secure link to ai_vfs...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {activeFiles.map((file) => (
            <div 
              key={file.id} 
              className="border border-emerald-900/50 bg-black p-5 hover:border-emerald-500 hover:bg-emerald-950/30 hover:shadow-[0_0_15px_rgba(16,185,129,0.1)] transition-all duration-200 cursor-pointer group flex flex-col justify-between min-h-[140px]"
            >
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl opacity-70 group-hover:opacity-100 transition-opacity">
                    {file.type === 'folder' ? '📂' : '📄'}
                  </span>
                  <h3 className="font-medium text-emerald-300 truncate tracking-tight">{file.name}</h3>
                </div>
                {file.intent_vector !== "None" && (
                  <span className="text-[10px] uppercase tracking-wider bg-emerald-950 text-emerald-500 px-2 py-1 rounded border border-emerald-900/50">
                    {file.intent_vector}
                  </span>
                )}
              </div>
              
              <div className="text-xs text-emerald-800 flex justify-between items-end mt-4">
                <span>Owner: {file.owner_agent}</span>
                <span>{file.id.substring(0,6)}...</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}