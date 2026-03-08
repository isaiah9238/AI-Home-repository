'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { performCodeAnalysis, type CodeAnalysisState } from './actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Zap, Bug, ShieldAlert, Code2, Copy, Check, Terminal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button 
      type="submit" 
      disabled={pending} 
      className="w-full bg-purple-600 hover:bg-purple-500 text-white font-mono tracking-[0.3em] uppercase py-6 rounded-xl transition-all shadow-[0_0_20px_rgba(168,85,247,0.2)] group"
    >
      {pending ? (
        <span className="flex items-center gap-3">
          <Loader2 className="h-4 w-4 animate-spin" /> ANALYZING_VECTORS...
        </span>
      ) : (
        <span className="flex items-center gap-3">
          <Zap className="h-4 w-4 group-hover:text-yellow-400 transition-colors" /> INITIALIZE_AUDIT
        </span>
      )}
    </Button>
  );
}

export function CodeAnalyzerClient() {
  const initialState: CodeAnalysisState = { message: null, errors: {}, data: null };
  const [state, formAction] = useActionState(performCodeAnalysis, initialState);
  const [copied, setCopied] = useState(false);

  // Notice the 'async' keyword before the parameters
  const copyFix = async (text: string) => { 
    try {
      // This 'await' now works because the function is 'async'
      await navigator.clipboard.writeText(text); 
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Clipboard sync failed:", err);
      }
    };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* Input Section */}
      <div className="lg:col-span-5 space-y-6">
        <Card className="bg-black/40 border-white/5 backdrop-blur-xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
          <CardHeader>
            <CardTitle className="text-[10px] font-mono text-white/30 uppercase tracking-[0.3em] flex items-center gap-2">
              <Terminal className="w-3 h-3" /> Input_Stream
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-6">
              <div className="space-y-2">
                <Select name="language" defaultValue="typescript">
                  <SelectTrigger className="bg-white/5 border-white/10 text-white font-mono text-xs tracking-widest h-11">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0a0a0a] border-white/10 text-white font-mono text-xs">
                    <SelectItem value="typescript">TypeScript</SelectItem>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="go">Go</SelectItem>
                    <SelectItem value="rust">Rust</SelectItem>
                  </SelectContent>
                </Select>
                {state.errors?.language && (
                  <p className="text-[10px] text-red-400 font-mono mt-1 uppercase">{state.errors.language[0]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Textarea
                  name="code"
                  placeholder="PASTE_NEURAL_LOGIC_HERE..."
                  className="min-h-[400px] bg-black/40 border-white/10 text-blue-100 placeholder:text-white/5 font-mono text-[11px] leading-relaxed resize-none focus:border-purple-500/50 transition-all custom-scrollbar"
                  required
                />
                {state.errors?.code && (
                  <p className="text-[10px] text-red-400 font-mono mt-1 uppercase">{state.errors.code[0]}</p>
                )}
              </div>

              <SubmitButton />
            </form>

            {state.message && !state.data && (
              <div className="mt-6 p-4 bg-red-500/5 border border-red-500/20 rounded-lg">
                <p className="text-[10px] text-red-400 font-mono uppercase tracking-widest text-center">
                  {state.message}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Results Section */}
      <div className="lg:col-span-7 space-y-6">
        {state.data ? (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-700">
            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-black/40 border-blue-500/20 backdrop-blur-md p-4 space-y-2">
                <div className="flex items-center gap-2 text-[9px] text-blue-400 font-mono uppercase tracking-widest">
                  <Code2 className="w-3 h-3" /> Complexity
                </div>
                <div className="text-xs text-white/80 font-mono">{state.data.complexity}</div>
              </Card>
              <Card className="bg-black/40 border-red-500/20 backdrop-blur-md p-4 space-y-2">
                <div className="flex items-center gap-2 text-[9px] text-red-400 font-mono uppercase tracking-widest">
                  <Bug className="w-3 h-3" /> Logic_Bugs
                </div>
                <div className="text-xs text-white/80 font-mono">{state.data.bugs}</div>
              </Card>
              <Card className="bg-black/40 border-yellow-500/20 backdrop-blur-md p-4 space-y-2">
                <div className="flex items-center gap-2 text-[9px] text-yellow-400 font-mono uppercase tracking-widest">
                  <ShieldAlert className="w-3 h-3" /> Security
                </div>
                <div className="text-xs text-white/80 font-mono">{state.data.vulnerabilities}</div>
              </Card>
            </div>

            {/* Recommended Fix */}
            <Card className="bg-black/40 border-purple-500/30 backdrop-blur-xl relative overflow-hidden">
              <CardHeader className="bg-white/5 border-b border-white/5 py-3 flex flex-row items-center justify-between">
                <CardTitle className="text-[10px] font-mono text-purple-400 uppercase tracking-[0.3em]">
                  RECOMMENDED_REFACTOR
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 text-white/30 hover:text-purple-400 transition-colors"
                  onClick={() => copyFix(state.data!.suggestedFixes)}
                >
                  {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                </Button>
              </CardHeader>
              <CardContent className="p-0 overflow-auto custom-scrollbar max-h-[500px]">
                <pre className="p-6 text-[11px] font-mono text-blue-100/80 whitespace-pre leading-relaxed bg-black/20">
                  {state.data.suggestedFixes}
                </pre>
              </CardContent>
            </Card>
            
            <div className="flex items-center justify-center gap-2 py-4 opacity-20">
              <div className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
              <span className="text-[8px] font-mono uppercase tracking-[0.5em]">Audit_Cycle_Complete</span>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-12 border border-dashed border-white/5 rounded-2xl bg-black/20">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-purple-500/20 blur-2xl rounded-full animate-pulse" />
              <Code2 className="w-16 h-16 text-white/5 relative z-10" />
            </div>
            <h3 className="text-[10px] font-mono text-white/20 uppercase tracking-[0.4em] mb-2">Awaiting_Input_Stream</h3>
            <p className="text-[9px] font-mono text-white/10 uppercase tracking-widest text-center max-w-[200px]">
              Submit a code snippet to initialize the security and complexity audit.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
