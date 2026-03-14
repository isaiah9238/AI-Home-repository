'use client';

import { useState } from 'react';
import { Beaker, Zap, Sliders, ToggleLeft, ToggleRight, Info, Save, RotateCcw, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DynamicInstructions } from '@/components/dynamic-instructions';
import { ProbabilityWave } from '@/components/ProbabilityWave';

interface LabConfig {
  temperature: number;
  topP: number;
  maxOutputTokens: number;
  persona: 'architect' | 'librarian' | 'mentor';
  experimentalMode: boolean;
}

/**
 * LaboratoryDrawer: Parameter Tuner for Neural Logic.
 * Features neumorphic-style sliders and glowing toggles.
 */
export function LaboratoryDrawer({ onSave }: { onSave?: (config: LabConfig) => void }) {
  const [config, setConfig] = useState<LabConfig>({
    temperature: 0.7,
    topP: 0.9,
    maxOutputTokens: 1024,
    persona: 'mentor',
    experimentalMode: false,
  });

  const handleSave = () => {
    if (onSave) onSave(config);
    // Visual feedback for save
  };

  return (
    <div className="p-8 w-full h-full flex flex-col bg-black/40 backdrop-blur-xl font-mono overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3 text-purple-400">
          <div className="p-2 rounded bg-purple-500/10 border border-purple-500/20">
            <Beaker className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-light tracking-[0.3em] uppercase">Neural_Laboratory</h2>
          {/* Integrated Toggle */}
          <DynamicInstructions 
            title="Laboratory Protocol" 
            instructions={
              <div className="space-y-2">
                <p><span className="text-purple-400 font-bold">Temperature:</span> Adjusts the "creativity" threshold. Low values (0.1) are precise for code; high values (0.8+) allow for brainstorming.</p>
                <p><span className="text-purple-400 font-bold">Top_P:</span> Nucleus sampling. It limits the AI to a subset of most likely words, preventing "rambling."</p>
                <p><span className="text-purple-400 font-bold">Persona Matrix:</span> Swaps the system prompt logic. The Mentor teaches, the Architect builds, and the Librarian organizes.</p>
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
        
        {/* Left: Tuning Sliders */}
        <div className="lg:col-span-7 space-y-8">
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] text-white/40 uppercase tracking-[0.4em] flex items-center gap-2">
                <Sliders className="w-3 h-3 text-purple-500" /> Probabilistic_Weights
              </h3>
              <Badge variant="outline" className="border-purple-500/20 text-purple-400 text-[8px]">ACTIVE_TUNING</Badge>
            </div>

            {/* Temperature Slider */}
            {/* 1. Main Card Container (This is line 83 in your error) */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4 group hover:border-purple-500/20 transition-all">
  
              {/* 2. Flex Header (Groups the label and the number on one line) */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-white/80 uppercase tracking-widest font-bold">Temperature</span>
                  {/* Tooltip code goes here if you have it */}
                </div>
    
                {/* This span shows the number, it needs to be INSIDE the flex header div */}
                <span className="text-xs font-bold text-purple-400 font-mono">
                   {config.temperature.toFixed(2)}
                </span>
             </div> {/* <--- This closes the Flex Header */}

              {/* 3. Wave Row (Sits outside the header flexbox so it can be full width) */}
              <ProbabilityWave temperature={config.temperature} />

              {/* 4. Slider Row */}
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
            </div>  {/* <--- CRITICAL: This closes the Main Card Container! */}

            {/* TopP Slider */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4 group hover:border-blue-500/20 transition-all">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-white/80 uppercase tracking-widest font-bold">Top_P (Nucleus)</span>
                </div>
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
        </div>

        {/* Right: Persona & Meta */}
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

          <div className="p-6 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between">
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

          <div className="mt-8 opacity-20 text-center">
            <div className="inline-flex items-center gap-3">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-white" />
              <span className="text-[8px] uppercase tracking-[0.5em]">System_Optimization_Protocol</span>
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-white" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
