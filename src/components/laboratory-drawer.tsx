'use client';

import { useState, useEffect } from 'react';
import { Beaker, Zap, Sliders, Save, RotateCcw, Keyboard, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DynamicInstructions } from '@/components/dynamic-instructions';
import { ProbabilityWave } from '@/components/ProbabilityWave';
import { commitNeuralWeights, getNeuralWeights } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

interface LabConfig {
  temperature: number;
  topP: number;
  maxOutputTokens: number;
  persona: 'architect' | 'librarian' | 'mentor';
  experimentalMode: boolean;
}

function BinaryMarquee() {
  const [binary, setBinary] = useState('');
  
  useEffect(() => {
    const chars = '01';
    const generate = () => {
      let str = '';
      for (let i = 0; i < 120; i++) str += chars[Math.floor(Math.random() * chars.length)];
      setBinary(str);
    };
    generate();
    const interval = setInterval(generate, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full overflow-hidden bg-white/[0.02] border-y border-white/5 py-3 select-none pointer-events-none">
      <div className="flex whitespace-nowrap animate-marquee opacity-20">
        <span className="text-[14px] font-mono tracking-[0.5em] text-purple-400/60 pr-[0.5em]">{binary}</span>
        <span className="text-[14px] font-mono tracking-[0.5em] text-purple-400/60 pr-[0.5em]">{binary}</span>
      </div>
    </div>
  );
}

function VirtualKeyboard({ onKey }: { onKey?: (key: string) => void }) {
  const keys = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  return (
    <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
      <div className="flex items-center gap-2 mb-4 text-white/20">
        <Keyboard className="w-3 h-3" />
        <span className="text-[8px] uppercase tracking-widest font-bold font-mono">Neural_Input_Simulator</span>
      </div>
      {keys.map((row, i) => (
        <div key={i} className="flex justify-center gap-1.5">
          {row.map(key => (
            <button
              key={key}
              onClick={() => onKey?.(key)}
              className="w-7 h-8 rounded bg-white/5 border border-white/5 text-[9px] font-bold text-white/40 hover:bg-purple-500/20 hover:text-purple-400 hover:border-purple-500/40 transition-all active:scale-95"
            >
              {key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

export function LaboratoryDrawer({ onSave }: { onSave?: (config: LabConfig) => void }) {
  const { toast } = useToast();
  const [config, setConfig] = useState<LabConfig>({
    temperature: 0.7,
    topP: 0.9,
    maxOutputTokens: 1024,
    persona: 'mentor',
    experimentalMode: false,
  });
  const [lastInput, setLastInput] = useState<string[]>([]);

  useEffect(() => {
    const loadConfig = async () => {
      const result = await getNeuralWeights();
      if (result.success && result.data) {
        setConfig((prev) => ({ ...prev, ...result.data }));
        toast({
          title: "NEURAL_SYNC_COMPLETE",
          description: "Previous calibration weights loaded.",
          className: "bg-black/80 border-blue-500/30 text-blue-400 font-mono text-[8px]",
        });
      }
    };
    loadConfig();
  }, [toast]);

  const handleSave = async () => {
    const result = await commitNeuralWeights(config);
    if (result.success) {
      toast({
        title: "WEIGHTS_COMMITTED",
        description: "Neural calibration synchronized with Home Base.",
        className: "bg-black/90 border-purple-500/50 text-purple-400 font-mono border-2 backdrop-blur-xl",
      });
      if (onSave) onSave(config);
    } else {
      toast({
        variant: "destructive",
        title: "CALIBRATION_FAILED",
        description: result.error || "System interference detected.",
        className: "font-mono border-2",
      });
    }
  };

  const handleKey = (key: string) => {
    setLastInput(prev => [key, ...prev].slice(0, 12));
  };

  return (
    <div className="w-full h-full flex flex-col bg-black/40 backdrop-blur-xl font-mono overflow-hidden">
      <BinaryMarquee />
      
      <ScrollArea className="flex-1">
        <div className="p-8 space-y-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-purple-400">
              <div className="p-2 rounded bg-purple-500/10 border border-purple-500/20">
                <Beaker className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-light tracking-[0.3em] uppercase">Neural_Laboratory</h2>
              <DynamicInstructions 
                title="Laboratory Protocol" 
                instructions={
                  <div className="space-y-2 text-[11px]">
                    <p><span className="text-purple-400 font-bold">Temperature:</span> Adjusts the "creativity" threshold. Low values (0.1) are precise; high values (0.8+) allow for brainstorming.</p>
                    <p><span className="text-purple-400 font-bold">Top_P:</span> Nucleus sampling. It limits the AI to most likely words, preventing "rambling."</p>
                    <p><span className="text-purple-400 font-bold">Persona Matrix:</span> Swaps system prompt logic. The Mentor teaches, the Architect builds, and the Librarian organizes.</p>
                  </div>
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setConfig({ temperature: 0.7, topP: 0.9, maxOutputTokens: 1024, persona: 'mentor', experimentalMode: false })} className="text-[8px] text-white/20 uppercase tracking-widest hover:text-white">
                <RotateCcw className="w-3 h-3 mr-2" /> Reset_Defaults
              </Button>
              <Button onClick={handleSave} className="bg-purple-600/20 text-purple-400 border border-purple-500/40 text-[8px] tracking-[0.2em] uppercase px-6">
                <Save className="w-3 h-3 mr-2" /> Commit_Weights
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-8">
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] text-white/40 uppercase tracking-[0.4em] flex items-center gap-2">
                    <Sliders className="w-3 h-3 text-purple-500" /> Probabilistic_Weights
                  </h3>
                  <Badge variant="outline" className="border-purple-500/20 text-purple-400 text-[8px]">ACTIVE_TUNING</Badge>
                </div>

                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4 group hover:border-purple-500/20 transition-all">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-white/80 uppercase tracking-widest font-bold">Temperature</span>
                    <span className="text-xs font-bold text-purple-400 font-mono">{config.temperature.toFixed(2)}</span>
                  </div>
                  <ProbabilityWave temperature={config.temperature} />
                  <Slider 
                    value={[config.temperature]} 
                    max={1} 
                    step={0.01} 
                    onValueChange={([v]) => setConfig({ ...config, temperature: v })}
                    className="py-4"
                  />
                  <div className="flex justify-between text-[7px] text-white/10 uppercase tracking-widest font-mono">
                    <span>Deterministic</span>
                    <span>Hallucinogenic</span>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4 group hover:border-blue-500/20 transition-all">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-white/80 uppercase tracking-widest font-bold">Top_P (Nucleus)</span>
                    <span className="text-xs font-bold text-blue-400 font-mono">{config.topP.toFixed(2)}</span>
                  </div>
                  <Slider 
                    value={[config.topP]} 
                    max={1} 
                    step={0.01} 
                    onValueChange={([v]) => setConfig({ ...config, topP: v })}
                    className="py-4"
                  />
                </div>
              </section>

              <VirtualKeyboard onKey={handleKey} />
            </div>

            <div className="lg:col-span-5 space-y-6">
              <Card className="bg-black/20 border-white/5 backdrop-blur-md overflow-hidden">
                <CardHeader className="bg-white/5 border-b border-white/5">
                  <CardTitle className="text-[10px] text-white/40 uppercase tracking-widest">Persona_Matrix</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {[
                    { id: 'mentor', label: 'The_Mentor', desc: 'Cooperative & Instructive', color: 'text-blue-400' },
                    { id: 'architect', label: 'The_Architect', desc: 'Structural & Technical', color: 'text-purple-400' },
                    { id: 'librarian', label: 'The_Librarian', desc: 'Precise & Archival', color: 'text-green-400' }
                  ].map((p) => (
                    <div 
                      key={p.id}
                      onClick={() => setConfig({ ...config, persona: p.id as any })}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                        config.persona === p.id 
                          ? 'bg-purple-500/10 border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.1)]' 
                          : 'bg-white/5 border-white/5 hover:border-white/10'
                      }`}
                    >
                      <div>
                        <div className={`text-[10px] font-bold uppercase tracking-widest ${config.persona === p.id ? p.color : 'text-white/40'}`}>
                          {p.label}
                        </div>
                        <div className="text-[8px] text-white/20 uppercase mt-1">{p.desc}</div>
                      </div>
                      {config.persona === p.id && <Zap className={`w-4 h-4 ${p.color} animate-pulse`} />}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="p-6 rounded-2xl bg-black/40 border border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-white/80 uppercase tracking-widest font-bold">Experimental_Mode</span>
                    <span className="text-[8px] text-white/20 uppercase tracking-widest">Unstable_Neural_Pathways</span>
                  </div>
                  <Switch 
                    checked={config.experimentalMode} 
                    onCheckedChange={(v) => setConfig({ ...config, experimentalMode: v })}
                    className="data-[state=checked]:bg-purple-500"
                  />
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                <div className="flex items-center gap-2 text-white/20 mb-2">
                  <Activity className="w-3 h-3" />
                  <span className="text-[8px] uppercase tracking-widest font-bold">Recent_Signal_Inputs</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {lastInput.length === 0 ? (
                    <span className="text-[8px] text-white/10 uppercase italic tracking-widest">Awaiting_Virtual_Key_Input...</span>
                  ) : (
                    lastInput.map((k, i) => (
                      <span key={i} className="px-2 py-1 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[9px] animate-in zoom-in-95 duration-300">
                        {k}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}