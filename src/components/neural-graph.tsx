'use client';

import { useState, useMemo } from 'react';
import { Network, Share2, Info, X, Zap, Database, Brain, Rocket, BookOpen, MessageSquareCode, ShieldCheck, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DynamicInstructions } from '@/components/dynamic-instructions';
import { ScrollArea } from "@/components/ui/scroll-area";
import React from 'react';

interface Node {
  id: string;
  label: string;
  group: 'Core' | 'Curriculum' | 'Research' | 'Development' | 'Integrity';
  complexity: number;
  status?: string;
  x: number;
  y: number;
  data?: any;
}

interface Link {
  source: string;
  target: string;
  speed: number;
}

interface NeuralGraphProps {
  lessons: any[];
  nodes?: any[];
  neuralComplexity: number;
  knowledgeIntegration: number;
}

export function NeuralGraph({
  lessons, 
  neuralComplexity, 
  knowledgeIntegration, 
  nodes 
  }: NeuralGraphProps) {
    
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [activeHelpTerm, setActiveHelpTerm] = useState<string | null>(null);

  const graphData = useMemo(() => {
    const nodes: Node[] = [];
    const links: Link[] = [];
    const coreX = 400;
    const coreY = 300;

    // 1. SYSTEM_CORE (Center)
    nodes.push({
      id: 'core',
      label: 'SYSTEM_CORE',
      group: 'Core',
      complexity: neuralComplexity,
      x: coreX,
      y: coreY
    });

    // 2. CURRICULUM NODES (Iterating through lessons)
    lessons.forEach((lesson, i) => {
      const angle = (i / Math.max(1, lessons.length)) * 2 * Math.PI;
      const radius = 180 + (i % 2 === 0 ? 20 : -20);
      const x = coreX + Math.cos(angle) * radius;
      const y = coreY + Math.sin(angle) * radius;
      
      const lessonId = lesson.id || `lesson-${i}`;

      nodes.push({
        id: lessonId,
        label: lesson.title || 'FRAGMENT_PENDING',
        group: 'Curriculum',
        complexity: lesson.status === 'completed' ? 70 + (i % 10) : 40 + (i % 5),
        status: lesson.status,
        x,
        y,
        data: lesson
      });

      links.push({
        source: 'core',
        target: lessonId,
        speed: lesson.status === 'completed' ? 1.5 : 4
      });
    });

    // 3. SECTOR NODES (Anchor points)
    const sectors: { id: string; label: string; group: Node['group']; angle: number }[] = [
      { id: 'research_sector', label: 'RESEARCH_EXPANSE', group: 'Research', angle: Math.PI * 0.25 },
      { id: 'dev_sector', label: 'DEV_LOGIC_FIELD', group: 'Development', angle: Math.PI * 1.25 },
      { id: 'safety_sector', label: 'INTEGRITY_SHIELD', group: 'Integrity', angle: Math.PI * 0.75 },
    ];

    sectors.forEach(sector => {
      const x = coreX + Math.cos(sector.angle) * 260;
      const y = coreY + Math.sin(sector.angle) * 260;
      nodes.push({
        id: sector.id,
        label: sector.label,
        group: sector.group,
        complexity: 40,
        x,
        y
      });
      links.push({ source: 'core', target: sector.id, speed: 6 });
    });

    return { nodes, links };
  }, [lessons, neuralComplexity]);

  const findNode = (id: string) => graphData.nodes.find(n => n.id === id);

  const getGroupColor = (group: Node['group']) => {
    switch (group) {
      case 'Core': return '#3b82f6';
      case 'Curriculum': return '#22c55e';
      case 'Research': return '#60a5fa';
      case 'Development': return '#a855f7';
      case 'Integrity': return '#ef4444';
      default: return '#94a3b8';
    }
  };

  return (
    <div className="p-8 w-full h-full flex flex-col bg-black/40 backdrop-blur-xl font-mono overflow-hidden">
      {/* Header UI */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3 text-blue-400">
          <div className="p-2 rounded bg-blue-500/10 border border-blue-500/20">
            <Share2 className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-light tracking-[0.3em] uppercase">Neural_Context_Evolution</h2>
          <DynamicInstructions 
            variant="blue"
            title="Advanced Neural Mapping" 
            instructions={
              <div className="space-y-4">
                <p className="text-white/40 uppercase text-[9px] tracking-widest mb-2 border-b border-white/5 pb-2">XAI_Visualizer_Protocol</p>
                
                <div className="space-y-3">
                  <div>
                    <button 
                      onClick={() => setActiveHelpTerm(activeHelpTerm === 'core' ? null : 'core')}
                      className="flex items-center gap-2 text-blue-400 font-bold hover:text-white transition-colors"
                    >
                      <Info className="w-3 h-3" /> PULSE_CORE
                    </button>
                    {activeHelpTerm === 'core' && (
                      <p className="mt-1 pl-5 text-[10px] text-white/50 border-l border-blue-500/30 ml-1.5">
                        The central unit representing your core AI state. Radius scales dynamically with <span className="text-blue-400">{neuralComplexity}% Complexity</span>.
                      </p>
                    )}
                  </div>

                  <div>
                    <button 
                      onClick={() => setActiveHelpTerm(activeHelpTerm === 'path' ? null : 'path')}
                      className="flex items-center gap-2 text-green-400 font-bold hover:text-white transition-colors"
                    >
                      <Info className="w-3 h-3" /> PATHWAYS
                    </button>
                    {activeHelpTerm === 'path' && (
                      <p className="mt-1 pl-5 text-[10px] text-white/50 border-l border-green-500/30 ml-1.5">
                        Active data synchronization streams. Animation speed reflects neural latency and integration depth.
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
                  <div className="text-[9px] uppercase tracking-widest text-blue-400/60 mb-1">Status_Telemetry</div>
                  <p className="text-[9px] text-white/40 italic">
                    Nodes are color-coded by operational domain. Select any node to inspect its specific neural vector and metadata.
                  </p>
                </div>
              </div>
            }
          />
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="border-blue-500/20 text-blue-400/60 bg-blue-500/5 text-[8px] tracking-[0.2em] h-7 px-3">
            XAI_VISUALIZER_V2.0
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 overflow-hidden">
        {/* SVG Graph Area */}
        <div className="lg:col-span-8 relative bg-black/20 border border-white/5 rounded-2xl overflow-hidden">
          <svg viewBox="0 0 800 600" className="w-full h-full relative z-10">
            <defs>
              <filter id="nodeGlow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Render Links with Pulse Animation */}
            {graphData.links.map((link, i) => {
              const s = findNode(link.source);
              const t = findNode(link.target);
              if (!s || !t) return null;
              const color = getGroupColor(t.group);
              const path = `M ${s.x} ${s.y} Q ${(s.x + t.x) / 2 + (i % 2 === 0 ? 20 : -20)} ${(s.y + t.y) / 2} ${t.x} ${t.y}`;

              return (
                <g key={`link-${i}`}>
                  <path d={path} fill="none" stroke={color} strokeWidth="0.5" strokeOpacity="0.1" />
                  <circle r="1.5" fill={color} filter="url(#nodeGlow)">
                    <animateMotion dur={`${link.speed}s`} repeatCount="indefinite" path={path} />
                  </circle>
                </g>
              );
            })}

            {/* Render Nodes */}
            {graphData.nodes.map((node) => {
              const isCore = node.id === 'core';
              const isSelected = selectedNode?.id === node.id;
              const color = getGroupColor(node.group);

              return (
                <g key={node.id} className="cursor-pointer" onClick={() => setSelectedNode(node)}>
                  {isCore && (
                    <g>
                      <circle cx={node.x} cy={node.y} r={22} fill={color} fillOpacity="0.05">
                        <animate attributeName="r" values="22;45;22" dur="4s" repeatCount="indefinite" />
                      </circle>
                    </g>
                  )}
                  
                  <circle
                    cx={node.x} cy={node.y}
                    r={isCore ? 14 : 6}
                    fill={isSelected ? color : (isCore ? color : "#0f172a")}
                    stroke={color}
                    strokeWidth={isCore ? 3 : 1.5}
                    filter="url(#nodeGlow)"
                  />
                  
                  <text x={node.x} y={node.y + (isCore ? 32 : 20)} textAnchor="middle" fill={color} className="text-[8px] font-bold uppercase tracking-[0.2em]">
                    {node.label}
                  </text>

                  {isCore && (
                    <>
                      <text x={node.x} y={node.y + 45} textAnchor="middle" fill="white" className="text-[9px] font-mono opacity-70">
                        Complexity: {neuralComplexity}%
                      </text>
                      <text x={node.x} y={node.y + 55} textAnchor="middle" fill="white" className="text-[9px] font-mono opacity-70">
                        Integration: {knowledgeIntegration}%
                      </text>
                    </>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Sidebar Inspector */}
        <div className="lg:col-span-4 flex flex-col gap-4 overflow-hidden">
          <Card className="bg-black/40 border-white/5 backdrop-blur-md flex-1 overflow-hidden flex flex-col">
            <CardHeader className="border-b border-white/5 py-3">
              <CardTitle className="text-[10px] text-white/30 uppercase tracking-widest flex items-center gap-2">
                <Brain className="w-3 h-3 text-blue-400" /> Context_Inspector
              </CardTitle>
            </CardHeader>
            <ScrollArea className="flex-1">
              <CardContent className="pt-6">
                {selectedNode ? (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-base font-bold text-white uppercase mb-1 leading-tight">{selectedNode.label}</h4>
                      <Badge variant="outline" className="text-[7px] border-white/10 text-white/40 uppercase">
                        {selectedNode.group}
                      </Badge>
                    </div>
                    <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                      <span className="text-[7px] text-white/20 uppercase block mb-1">Neural_Complexity</span>
                      <span className="text-sm font-bold text-blue-400">{selectedNode.complexity}%</span>
                    </div>
                    <div className="p-4 bg-black/40 border border-white/5 rounded-lg font-mono text-[9px] text-white/40">
                       <p>UUID: {selectedNode.id}</p>
                       <p>VECTOR: [{selectedNode.x.toFixed(0)}, {selectedNode.y.toFixed(0)}]</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center py-20 opacity-10">
                    <Network className="w-16 h-16 mb-4" />
                    <p className="text-[10px] uppercase tracking-[0.4em]">Initialize_Node_Inspection</p>
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
