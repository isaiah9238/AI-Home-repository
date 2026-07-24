'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, FolderTree, FilePlus, FileCode, Sparkles, Cpu, 
  LayoutDashboard, ShieldAlert, Code, PlayCircle, Minimize2, Trash2, Edit3,
  CheckCircle, AlertTriangle, Package, Terminal, Variable, Globe, Brush
} from 'lucide-react';

interface CodeInspectorProps {
  selectedAudit?: any;
}

export function CodeInspector({ selectedAudit }: CodeInspectorProps) {
  // If an audit prop is passed, load it into initial virtual files; otherwise fallback to default sandbox
  const [virtualFiles, setVirtualFiles] = useState([
    {
      id: "app-js",
      name: selectedAudit?.fileName || "app.js",
      language: "javascript",
      content: selectedAudit?.content || `// Code Inspector Pro Sandbox\nconst API_TOKEN_SECRET = "sk_prod_90a12fbc45de99ff";\nlet activeFlag = true;\nlet unusedVariable = "I am dead code";\n\nfunction runHeavyMath(payload) {\n  let depth = 0;\n  if (payload) {\n    for(let i=0; i<10; i++) {\n      if (i % 2 === 0) depth++; else depth--;\n    }\n  }\n  return depth;\n}`
    },
    {
      id: "index-html",
      name: "index.html",
      language: "html",
      content: `<!DOCTYPE html>\n<html>\n<head><title>Security Sandbox</title></head>\n<body>\n  <div id="output">Rendering incoming data...</div>\n  <button onclick="runHeavyMath(true)">Activate</button>\n</body>\n</html>`
    }
  ]);

  const [activeFileIdx, setActiveFileIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'issues' | 'ast' | 'compiler'>('dashboard');
  const [editorContent, setEditorContent] = useState(virtualFiles[0]?.content || '');
  const [compilerLogs, setCompilerLogs] = useState('Ready to bundle project components.');
  const [sandboxBlobUrl, setSandboxBlobUrl] = useState('');

  // Sync editor content when changing active file
  useEffect(() => {
    if (virtualFiles[activeFileIdx]) {
      setEditorContent(virtualFiles[activeFileIdx].content);
    }
  }, [activeFileIdx, virtualFiles]);

  // Modern In-Memory Compiler via Blob URL
  const compileWorkspace = () => {
    const htmlFile = virtualFiles.find(f => f.name.endsWith('.html'));
    const cssFile = virtualFiles.find(f => f.name.endsWith('.css'));
    const jsFile = virtualFiles.find(f => f.name.endsWith('.js'));

    if (!htmlFile) {
      setCompilerLogs('ERROR: Compilation failed. Missing index.html in root workspace.');
      return;
    }

    let rawHtml = htmlFile.content;
    const cssContent = cssFile ? cssFile.content : '';
    const jsContent = jsFile ? jsFile.content : '';

    const compiledStyles = `<style>\n${cssContent}\n</style>`;
    const compiledScript = `<script>\n${jsContent}\n</script>`;

    rawHtml = rawHtml.includes('</head>') 
      ? rawHtml.replace('</head>', `${compiledStyles}\n</head>`) 
      : compiledStyles + rawHtml;
      
    rawHtml = rawHtml.includes('</body>') 
      ? rawHtml.replace('</body>', `${compiledScript}\n</body>`) 
      : rawHtml + compiledScript;

    const blob = new Blob([rawHtml], { type: 'text/html' });
    if (sandboxBlobUrl) URL.revokeObjectURL(sandboxBlobUrl);
    
    setSandboxBlobUrl(URL.createObjectURL(blob));
    setCompilerLogs('⚡ Build Compiled Successfully!');
  };

  return (
    <div className="flex-1 flex h-full bg-[#181825] text-[#cdd6f4] overflow-hidden">
      {/* Workspace Sidebar */}
      <aside className="w-56 bg-[#11111b] border-r border-[#313244] flex flex-col p-3 shrink-0">
        <div className="flex items-center justify-between pb-3 border-b border-[#313244] mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#a6adc8] flex items-center gap-1.5">
            <FolderTree className="w-3.5 h-3.5 text-[#89b4fa]" /> Workspace
          </span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-1">
          {virtualFiles.map((file, idx) => (
            <button
              key={file.id}
              onClick={() => setActiveFileIdx(idx)}
              className={`w-full flex items-center gap-2 text-xs px-2.5 py-1.5 rounded transition-all ${
                idx === activeFileIdx ? 'bg-[#313244] text-white font-medium' : 'text-[#a6adc8] hover:text-white'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-[#89b4fa] shrink-0" />
              <span className="truncate">{file.name}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* Center Code Editor */}
      <main className="flex-1 flex flex-col bg-[#1e1e2e]">
        <div className="bg-[#11111b] border-b border-[#313244] px-4 py-2 flex items-center justify-between text-xs shrink-0">
          <span className="font-mono text-white">{virtualFiles[activeFileIdx]?.name}</span>
          <button 
            onClick={compileWorkspace}
            className="bg-[#89b4fa] hover:bg-[#b4befe] text-[#11111b] font-semibold px-3 py-1 rounded flex items-center gap-1.5 transition-colors"
          >
            <Cpu className="w-3.5 h-3.5" /> Run Inspector & Compile
          </button>
        </div>

        <textarea
          value={editorContent}
          onChange={(e) => {
            setEditorContent(e.target.value);
            const updated = [...virtualFiles];
            updated[activeFileIdx].content = e.target.value;
            setVirtualFiles(updated);
          }}
          className="flex-1 bg-transparent p-4 focus:outline-none font-mono text-xs text-[#cdd6f4] resize-none leading-relaxed"
          spellCheck={false}
        />
      </main>

      {/* Diagnostic & Compiler Side Panel */}
      <section className="w-80 bg-[#11111b] border-l border-[#313244] flex flex-col shrink-0">
        <div className="flex border-b border-[#313244] text-[11px] shrink-0">
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`flex-1 py-2.5 text-center font-semibold ${activeTab === 'dashboard' ? 'border-b-2 border-[#cba6f7] text-white' : 'text-[#a6adc8]'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => { setActiveTab('compiler'); compileWorkspace(); }} 
            className={`flex-1 py-2.5 text-center font-semibold ${activeTab === 'compiler' ? 'border-b-2 border-[#cba6f7] text-white' : 'text-[#a6adc8]'}`}
          >
            Live Compiler
          </button>
        </div>

        <div className="flex-1 p-3 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <div className="space-y-3">
              <div className="bg-[#181825] border border-[#313244] rounded p-3">
                <span className="text-[10px] text-[#a6adc8] uppercase font-bold block mb-1">Audit Target</span>
                <span className="text-xs font-mono text-green-400">{selectedAudit?.id || 'LOCAL_SANDBOX'}</span>
              </div>
            </div>
          )}

          {activeTab === 'compiler' && (
            <div className="h-full flex flex-col space-y-3">
              <div className="bg-[#181825] border border-[#313244] p-2 text-[10px] font-mono text-[#a6e3a1]">
                {compilerLogs}
              </div>
              <div className="flex-1 bg-white rounded border border-[#45475a] overflow-hidden min-h-[250px]">
                <iframe src={sandboxBlobUrl} className="w-full h-full border-none" sandbox="allow-scripts" />
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}