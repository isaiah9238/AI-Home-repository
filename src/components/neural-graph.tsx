'use client';

import { useState, useMemo } from 'react';
import { Network, Share2, Info, X, Zap, Database, Brain } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DynamicInstructions } from '@/components/dynamic-instructions';
import { ScrollArea } from "@/components/ui/scroll-area";

interface Node {
  id: string;
  label: string;
  group: string;
  complexity: number;
  x: number;
  y: number;
}

interface Link {
  source: string;
  target: string;
}

interface NeuralGraphProps {
  lessons: any[];
}

export function NeuralGraph({ lessons }: NeuralGraphProps) {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const graphData = useMemo(() => {
    const centralNode: Node = {
      id: 'core',
      label: 'SYSTEM_CORE',
      group: 'Core',
      complexity: 100,
      x: 400,
      y: 300
    };
    
    const activeLessons = lessons && lessons.length > 0 ? lessons : [];

    const lessonNodes: Node[] = activeLessons.map((lesson, i) => {
      const angle = (i / activeLessons.length) * 2 * Math.PI;
      const radius = 160;
      return {
        id: lesson.id || `lesson-${i}`,
        label: lesson.title || 'FRAGMENT_PENDING',
        group: 'Lesson',
        complexity: 50,
        x: 400 + Math.cos(angle) * radius,
        y: 300 + Math.sin(angle) * radius,
      };
    });
    
    const allNodes = [centralNode, ...lessonNodes];
    const links: Link[] = lessonNodes.map(n => ({ source: 'core', target: n.id }));

    return { nodes: allNodes, links };
  }, [lessons]);

  const findNode = (id: string) => graphData.nodes.find(n => n.id === id);

  return (
    <div className="p-8 w-full h-full flex flex-col bg-black/40 backdrop-blur-xl font-mono overflow-hidden">
      {/* Header section remains unchanged */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3 text-blue-400">
          <div className="p-2 rounded bg-blue-500/10 border border-blue-500/20">
            <Share2 className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-light tracking-[0.3em] uppercase">Neural_Context_Graph</h2>
          <DynamicInstructions 
            title="Neural Mapping Protocol" 
            instructions={
              <div className="space-y-2 text-[11px]">
                <p><strong>System Core:</strong> The central node represents foundation logic.</p>
                <p><strong>Context Fragments:</strong> Surrounding nodes are lessons and data points.</p>
                <p className="text-blue-400 italic">Click any node to inspect data.</p>
              </div>
            }
          />
        </div>
        <Badge variant="outline" className="border-blue-500/20 text-blue-400/60 bg-blue-500/5 text-[8px] tracking-[0.2em]">
          XAI_VISUALIZER_ACTIVE
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 overflow-hidden">
        <div className="lg:col-span-8 relative bg-black/20 border border-white/5 rounded-2xl overflow-hidden">
          <svg viewBox="0 0 800 600" className="w-full h-full">
            <defs>
              <filter id="nodeGlow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* 1. Links & Data Flow (Rendered first to be in back) */}
            {graphData.links.map((link, i) => {
              const s = findNode(link.source);
              const t = findNode(link.target);
              if (!s || !t) return null;
              const isHighlighted = selectedNode && (selectedNode.id === s.id || selectedNode.id === t.id);

              return (
                <g key={`link-group-${i}`}>
                  <line
                    x1={s.x} y1={s.y} x2={t.x} y2={t.y}
                    stroke={isHighlighted ? "#60a5fa" : "#ffffff"}
                    strokeWidth={isHighlighted ? 1 : 0.2}
                    strokeOpacity={isHighlighted ? 0.6 : 0.1}
                  />
                  {/* Data Packet */}
                  <circle r="1.5" className="fill-cyan-400 shadow-lg">
                    <animateMotion
                      dur={`${2 + Math.random() * 3}s`} 
                      repeatCount="indefinite"
                      path={`M ${s.x} ${s.y} L ${t.x} ${t.y}`} 
                    />
                  </circle>
                </g>
              );
            })}

            {/* 2. Nodes & Core Pulse */}
            {graphData.nodes.map((node) => {
              const isCore = node.id === 'core';
              const isSelected = selectedNode?.id === node.id;

              return (
                <g key={node.id} className="cursor-pointer" onClick={() => setSelectedNode(node)}>
                  {isCore && (
                    <g>
                      {/* The Centered Heartbeat Glow */}
                      <circle cx={node.x} cy={node.y} r={18} className="fill-cyan-500/20">
                        <animate attributeName="r" values="18;55;18" dur="4s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.4;0;0.4" dur="4s" repeatCount="indefinite" />
                      </circle>
                      <circle cx={node.x} cy={node.y} r={25} className="stroke-cyan-500/10 fill-none animate-ping [animation-duration:3s]" />
                    </g>
                  )}
                  
                  {/* Node Circle */}
                  <circle
                    cx={node.x} cy={node.y}
                    r={isCore ? 14 : 6}
                    fill={isSelected ? "#60a5fa" : (isCore ? "#3b82f6" : "#1e293b")}
                    stroke={isCore ? "#60a5fa" : (isSelected ? "#ffffff" : "#3b82f6")}
                    strokeWidth={isCore ? 3 : 1}
                    className="transition-all duration-300"
                  />
                  
                  {/* Label */}
                  <text
                    x={node.x} y={node.y + (isCore ? 32 : 20)}
                    textAnchor="middle"
                    fill={isCore ? "#60a5fa" : "white"}
                    fillOpacity={isSelected || isCore ? 1 : 0.3}
                    className="text-[9px] font-mono uppercase tracking-widest pointer-events-none"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Right Sidebar - Context Inspector remains as is */}
        <div className="lg:col-span-4 flex flex-col gap-4 overflow-hidden">
          <Card className="bg-black/40 border-white/5 backdrop-blur-md flex-1 overflow-hidden flex flex-col">
            <CardHeader className="border-b border-white/5 py-3">
              <CardTitle className="text-[10px] text-white/30 uppercase tracking-widest flex items-center gap-2">
                <Brain className="w-3 h-3 text-blue-400" /> Context_Inspector
              </CardTitle>
            </CardHeader>

            <ScrollArea className="h-[calc(100vh-350px)] flex-1">
              <CardContent className="pt-6">
                {selectedNode ? (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-bold text-white uppercase mb-1">{selectedNode.label}</h4>
                      <Badge variant="outline" className="text-[8px] border-blue-500/20 text-blue-400">{selectedNode.group}</Badge>
                    </div>
                    {/* Data Details Section */}
                    <div className="space-y-4">
                      <div className="text-[8px] text-white/20 uppercase">Impact: <span className="text-blue-400">+{selectedNode.complexity}%</span></div>
                      <p className="text-[10px] text-white/60 leading-relaxed italic">
                        Fragment linked to core system via {selectedNode.group} pathways.
                      </p>
                    </div>
                    
                    <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded font-mono text-[9px] text-white/40">
                      <p className="text-blue-400 mb-1 font-bold">RAW_SIGNAL_DECODE:</p>
                      <p className="leading-relaxed">
                        NODE_ID: {selectedNode.id}<br />
                        COORD_X: {selectedNode.x.toFixed(2)}<br />
                        COORD_Y: {selectedNode.y.toFixed(2)}<br />
                        STATUS: STABLE_FRAGMENT
                      </p>
                    </div>

                    <Button className="w-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-[9px] uppercase tracking-widest">
                      <Database className="w-3 h-3 mr-2" /> Retrieve_Raw_Fragment
                    </Button>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12 opacity-20">
                    <Network className="w-12 h-12" />
                    <p className="text-[10px] uppercase tracking-[0.3em] mt-4">Select_Node_To_Inspect</p>
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