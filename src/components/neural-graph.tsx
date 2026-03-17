'use client';

import { useState, useMemo } from 'react';
import { Network, Share2, Info, X, Zap, Database, Brain, Rocket, BookOpen, MessageSquareCode } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DynamicInstructions } from '@/components/dynamic-instructions';
import { ScrollArea } from "@/components/ui/scroll-area";

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
}

export function NeuralGraph({ lessons }: NeuralGraphProps) {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const graphData = useMemo(() => {
    const nodes: Node[] = [];
    const links: Link[] = [];

    // 1. SYSTEM_CORE (Center)
    const coreX = 400;
    const coreY = 300;
    nodes.push({
      id: 'core',
      label: 'SYSTEM_CORE',
      group: 'Core',
      complexity: 100,
      x: coreX,
      y: coreY
    });

    // 2. CURRICULUM NODES (Outer Ring)
    const activeLessons = lessons || [];
    activeLessons.forEach((lesson, i) => {
      const angle = (i / Math.max(1, activeLessons.length)) * 2 * Math.PI;
      const radius = 180 + (i % 2 === 0 ? 20 : -20); // Staggered radius
      const x = coreX + Math.cos(angle) * radius;
      const y = coreY + Math.sin(angle) * radius;
      
      nodes.push({
        id: lesson.id || `lesson-${i}`,
        label: lesson.title || 'FRAGMENT_PENDING',
        group: 'Curriculum',
        complexity: 65,
        status: lesson.status,
        x,
        y,
        data: lesson
      });

      links.push({
        source: 'core',
        target: lesson.id || `lesson-${i}`,
        speed: lesson.status === 'completed' ? 1.5 : 4
      });
    });

    // 3. SECTOR NODES (Anchor points for future expansion)
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
  }, [lessons]);

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

  const getGroupIcon = (group: Node['group']) => {
    switch (group) {
      case 'Core': return <Brain className="w-4 h-4" />;
      case 'Curriculum': return <BookOpen className="w-4 h-4" />;
      case 'Research': return <Share2 className="w-4 h-4" />;
      case 'Development': return <MessageSquareCode className="w-4 h-4" />;
      case 'Integrity': return <ShieldCheck className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-8 w-full h-full flex flex-col bg-black/40 backdrop-blur-xl font-mono overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3 text-blue-400">
          <div className="p-2 rounded bg-blue-500/10 border border-blue-500/20">
            <Share2 className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-light tracking-[0.3em] uppercase">Neural_Context_Evolution</h2>
          <DynamicInstructions 
            title="Advanced Neural Mapping" 
            instructions={
              <div className="space-y-2 text-[11px]">
                <p><strong>Pulse Core:</strong> Central processing unit. Size reflects global complexity.</p>
                <p><strong>Pathways:</strong> Animated flow represents active data sync. Speed indicates latency.</p>
                <p><strong>Node Growth:</strong> Colors represent functional domains (Green: Lessons, Purple: Dev, Blue: Research).</p>
              </div>
            }
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            {['Curriculum', 'Research', 'Development', 'Integrity'].map(g => (
              <div key={g} className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/[0.02] border border-white/5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getGroupColor(g as any) }} />
                <span className="text-[7px] text-white/40 uppercase tracking-tighter">{g}</span>
              </div>
            ))}
          </div>
          <Badge variant="outline" className="border-blue-500/20 text-blue-400/60 bg-blue-500/5 text-[8px] tracking-[0.2em] h-7 px-3">
            XAI_VISUALIZER_V2.0
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 overflow-hidden">
        <div className="lg:col-span-8 relative bg-black/20 border border-white/5 rounded-2xl overflow-hidden group">
          {/* Background Grid */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
               style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          
          <svg viewBox="0 0 800 600" className="w-full h-full relative z-10">
            <defs>
              <filter id="nodeGlow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <linearGradient id="linkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
                <stop offset="50%" stopColor="currentColor" stopOpacity="0.8" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            {/* 1. Links & Data Flow */}
            {graphData.links.map((link, i) => {
              const s = findNode(link.source);
              const t = findNode(link.target);
              if (!s || !t) return null;
              const isHighlighted = selectedNode && (selectedNode.id === s.id || selectedNode.id === t.id);
              const color = getGroupColor(t.group);

              return (
                <g key={`link-group-${i}`}>
                  <path
                    d={`M ${s.x} ${s.y} Q ${(s.x + t.x) / 2 + (i % 2 === 0 ? 20 : -20)} ${(s.y + t.y) / 2} ${t.x} ${t.y}`}
                    fill="none"
                    stroke={color}
                    strokeWidth={isHighlighted ? 1.5 : 0.5}
                    strokeOpacity={isHighlighted ? 0.4 : 0.1}
                    className="transition-all duration-500"
                  />
                  {/* Flowing Data Particle */}
                  <circle r="1.5" fill={color}>
                    <animateMotion
                      dur={`${link.speed}s`} 
                      repeatCount="indefinite"
                      path={`M ${s.x} ${s.y} Q ${(s.x + t.x) / 2 + (i % 2 === 0 ? 20 : -20)} ${(s.y + t.y) / 2} ${t.x} ${t.y}`} 
                    />
                  </circle>
                </g>
              );
            })}

            {/* 2. Nodes */}
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
                        <animate attributeName="opacity" values="0.2;0.05;0.2" dur="4s" repeatCount="indefinite" />
                      </circle>
                      <circle cx={node.x} cy={node.y} r={28} className="stroke-blue-500/20 fill-none animate-[spin_10s_linear_infinite]" strokeDasharray="4 4" />
                    </g>
                  )}
                  
                  {/* External Node Ring for Selection */}
                  {isSelected && (
                    <circle cx={node.x} cy={node.y} r={isCore ? 20 : 10} fill="none" stroke={color} strokeWidth="1" strokeDasharray="2 2" className="animate-[spin_4s_linear_infinite]" />
                  )}

                  {/* Node Circle */}
                  <circle
                    cx={node.x} cy={node.y}
                    r={isCore ? 14 : 6}
                    fill={isSelected ? color : (isCore ? color : "#0f172a")}
                    stroke={color}
                    strokeWidth={isCore ? 3 : 1.5}
                    className="transition-all duration-300"
                    filter="url(#nodeGlow)"
                  />
                  
                  {/* Label */}
                  <text
                    x={node.x} y={node.y + (isCore ? 32 : 20)}
                    textAnchor="middle"
                    fill={color}
                    fillOpacity={isSelected || isCore ? 1 : 0.4}
                    className="text-[8px] font-bold uppercase tracking-[0.2em] pointer-events-none"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Right Sidebar - Context Inspector */}
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
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-base font-bold text-white uppercase mb-1 leading-tight">{selectedNode.label}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[7px] border-white/10 text-white/40 flex items-center gap-1 uppercase">
                            {getGroupIcon(selectedNode.group)} {selectedNode.group}
                          </Badge>
                          {selectedNode.status && (
                            <Badge className="bg-blue-500/20 text-blue-400 text-[7px] uppercase tracking-widest h-4">
                              {selectedNode.status}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                          <span className="text-[7px] text-white/20 uppercase block mb-1">Neural_Complexity</span>
                          <span className="text-sm font-bold text-blue-400">{selectedNode.complexity}%</span>
                        </div>
                        <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                          <span className="text-[7px] text-white/20 uppercase block mb-1">Signal_Strength</span>
                          <span className="text-sm font-bold text-green-400">98.4dB</span>
                        </div>
                      </div>

                      {selectedNode.data?.subject && (
                        <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/10">
                          <span className="text-[8px] text-blue-400/60 uppercase font-bold block mb-2">Fragment_Context</span>
                          <p className="text-[10px] text-white/70 leading-relaxed italic">
                            Topic: {selectedNode.data.subject}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4 bg-black/40 border border-white/5 rounded-lg font-mono text-[9px] text-white/40 space-y-1">
                      <p className="text-white/20 mb-2 font-bold flex items-center gap-2 italic">
                        <Activity className="w-2.5 h-2.5" /> TELEMETRY_FEED
                      </p>
                      <div className="flex justify-between"><span>UUID:</span> <span className="text-white/60">{selectedNode.id.slice(0, 12)}</span></div>
                      <div className="flex justify-between"><span>VECTOR:</span> <span className="text-white/60">[{selectedNode.x.toFixed(0)}, {selectedNode.y.toFixed(0)}]</span></div>
                      <div className="flex justify-between"><span>LATENCY:</span> <span className="text-white/60">1.2ms</span></div>
                      <div className="flex justify-between"><span>JITTER:</span> <span className="text-white/60">0.02ms</span></div>
                    </div>

                    <Button className="w-full bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 text-blue-400 text-[9px] uppercase tracking-widest h-10">
                      <Database className="w-3 h-3 mr-2" /> Retrieve_Memory_Stream
                    </Button>
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
