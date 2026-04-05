'use client';

import { useState } from 'react';
import { Play, Code2, Sparkles, Loader2, Info, Layout, Box, Copy, Check, Terminal, ExternalLink } from 'lucide-react';
import { getPreviewAnalysis } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export default function SandboxPage() {
  const [files, setFiles] = useState({
    html: '<!-- HTML Hello, World Specification -->\n<div class="sandbox-test">\n  <h1>Hello, World</h1>\n  <p>Has anyone else tried the new sandbox?</p>\n</div>',
    css: '.sandbox-test {\n  font-family: monospace;\n  text-align: center;\n  padding: 2rem;\n  color: #fff;\n  background: #050505;\n  border: 1px dashed rgba(255,255,255,0.2);\n  border-radius: 8px;\n}',
    js: 'console.log("Sandbox initialized");',
    flux: 'Flux Echo Notes:\n- Started the flux echo search.\n- Preparing Agentic Memory Sync.'
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const handlePreview = async () => {
    const combinedCode = `
<style>${files.css}</style>
${files.html}
<script>${files.js}</script>
<!-- Echo Context: ${files.flux} -->
    `;
    
    if (!combinedCode.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await getPreviewAnalysis(combinedCode);
      if (res.success) {
        setResult(res.data);
      } else {
        alert(res.error);
      }
    } catch (error) {
      console.error("Preview Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openInNewWindow = (previewCode: string) => {
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(previewCode);
      newWindow.document.close();
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 font-mono">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-l-4 border-blue-500 pl-6">
        <div>
          <h1 className="text-4xl font-light tracking-[0.2em] uppercase flex items-center gap-4 text-white">
            <Box className="w-8 h-8 text-blue-500" /> Autonomous_Previewer
          </h1>
          <p className="text-white/40 mt-2 uppercase tracking-widest text-xs">
            Phase 3: Sandbox Environment & Intent Analysis Core.
          </p>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-blue-500/50 uppercase tracking-[0.3em]">Module: AGENTIC_EXECUTION</div>
          <div className="text-[10px] text-white/20 uppercase tracking-[0.3em]">Status: SANDBOX_READY</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-250px)] min-h-[600px]">
        
        {/* Input Panel */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <Card className="bg-black/40 border-white/5 backdrop-blur-xl flex-1 flex flex-col overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
            <CardHeader className="bg-white/5 border-b border-white/5 py-3">
              <CardTitle className="text-[10px] font-mono text-white/30 uppercase tracking-[0.3em] flex items-center gap-2">
                <Terminal className="w-3 h-3" /> Source_Logic_Stream
              </CardTitle>
            </CardHeader>
          <CardContent className="flex-1 p-0 flex flex-col">
            <Tabs defaultValue="html" className="w-full h-full flex flex-col">
              <TabsList className="bg-transparent border-b border-white/5 w-full justify-start rounded-none h-10 p-0 px-2">
                <TabsTrigger value="html" className="data-[state=active]:bg-white/5 data-[state=active]:text-blue-400 rounded-none h-full font-mono text-[10px] uppercase px-4">HTML</TabsTrigger>
                <TabsTrigger value="css" className="data-[state=active]:bg-white/5 data-[state=active]:text-blue-400 rounded-none h-full font-mono text-[10px] uppercase px-4">CSS</TabsTrigger>
                <TabsTrigger value="js" className="data-[state=active]:bg-white/5 data-[state=active]:text-blue-400 rounded-none h-full font-mono text-[10px] uppercase px-4">JS</TabsTrigger>
                <TabsTrigger value="flux" className="data-[state=active]:bg-white/5 data-[state=active]:text-purple-400 rounded-none h-full font-mono text-[10px] uppercase px-4 flex items-center gap-2"><Sparkles className="w-3 h-3"/> Flux Echo</TabsTrigger>
              </TabsList>
              
              {['html', 'css', 'js', 'flux'].map((tab) => (
                <TabsContent key={tab} value={tab} className="flex-1 m-0 p-0 outline-none data-[state=active]:flex flex-col">
                  <Textarea
                    placeholder={`PASTE_OR_WRITE_${tab.toUpperCase()}_HERE...`}
                    value={files[tab as keyof typeof files]}
                    onChange={(e) => setFiles({ ...files, [tab]: e.target.value })}
                    className="w-full flex-1 min-h-[300px] bg-transparent border-0 text-blue-100 placeholder:text-white/5 font-mono text-[11px] leading-relaxed resize-none p-6 focus-visible:ring-0 custom-scrollbar"
                  />
                </TabsContent>
              ))}
            </Tabs>
            </CardContent>
            <div className="p-4 bg-white/5 border-t border-white/5">
              <Button 
                onClick={handlePreview} 
              disabled={loading} 
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold h-12 uppercase tracking-widest text-xs shadow-[0_0_20px_rgba(59,130,246,0.2)]"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> ANALYZING_INTENT...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Play className="w-4 h-4" /> EXECUTE_PREVIEW
                  </span>
                )}
              </Button>
            </div>
          </Card>
        </div>

        {/* Execution & Intent Panel */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {result ? (
            <div className="flex-1 flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-black/40 border-blue-500/20 p-4 space-y-3">
                  <div className="text-[9px] text-blue-400/60 uppercase tracking-widest flex items-center gap-2">
                    <Sparkles className="w-3 h-3" /> Intent_Vector
                  </div>
                  <p className="text-[10px] text-white/70 leading-relaxed italic line-clamp-3">"{result.intent}"</p>
                </Card>
                <Card className="bg-black/40 border-purple-500/20 p-4 space-y-3">
                  <div className="text-[9px] text-purple-400/60 uppercase tracking-widest flex items-center gap-2">
                    <Layout className="w-3 h-3" /> Tech_Stack
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.techStack.map((tech: string) => (
                      <Badge key={tech} variant="outline" className="text-[8px] border-purple-500/30 text-purple-400/60 uppercase">{tech}</Badge>
                    ))}
                  </div>
                </Card>
              </div>

              <Card className="flex-1 bg-white/[0.02] border-white/5 backdrop-blur-md overflow-hidden flex flex-col">
                <CardHeader className="bg-white/5 border-b border-white/5 py-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-[10px] text-white/30 uppercase tracking-[0.3em]">Execution_Chamber</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => openInNewWindow(result.previewCode)}
                      className="h-7 w-7 text-white/30 hover:text-blue-400"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => copyCode(result.previewCode)}
                      className="h-7 w-7 text-white/30 hover:text-blue-400"
                    >
                      {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                    </Button>
                    <Badge variant="outline" className="text-[8px] border-green-500/20 text-green-400/60 uppercase h-6">Live_Preview</Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 p-0 relative">
                  <iframe
                    srcDoc={result.previewCode}
                    className="w-full h-full border-0 bg-white"
                    title="Sandbox Execution Preview"
                    sandbox="allow-scripts"
                  />
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 border border-dashed border-white/5 rounded-2xl bg-black/20 text-center">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-blue-500/10 blur-[60px] rounded-full animate-pulse" />
                <Code2 className="w-20 h-20 text-white/5 relative z-10" />
              </div>
              <h3 className="text-[10px] font-mono text-white/20 uppercase tracking-[0.5em] mb-3">Awaiting_Neural_Input</h3>
              <p className="text-[9px] font-mono text-white/10 uppercase tracking-[0.2em] max-w-[280px] leading-relaxed">
                Submit a code fragment to initialize intent analysis and trigger the high-fidelity execution chamber.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
