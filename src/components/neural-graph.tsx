'use client';

import { useState, useMemo } from 'react';
import { Network, Share2, Info, X, Zap, Database, Brain } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

/**
 * NeuralGraph: An interactive SVG node-map.
 * Visualizes the connections between learned topics.
 */
export function NeuralGraph({ lessons }: NeuralGraphProps) {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  // Simple deterministic layout algorithm for the nodes
  const graphData = useMemo(() => {
    const nodes: Node[] = lessons.map((l, i) => {
      const angle = (i / lessons.length) * 2 * Math.PI;
      const radius = 150 + (i % 2) * 50;
      return {
        id: l.id,
        label: l.title,
        group: l.subject,
        complexity: l.complexityGain || 5,
        x: 400 + radius * Math.cos(angle),
        y: 300 + radius * Math.sin(angle),
      };
    });

    // Add a central "Core" node
    const centralNode: Node = {
      id: 'core',
      label: 'SYSTEM_CORE',
      group: 'Core',
      complexity: 100,
      x: 400,
      y: 300
    };

    const allNodes = [centralNode, ...nodes];

    // Create links: everything connects to core, plus shared subjects connect to each other
    const links: Link[] = nodes.map(n => ({ source: 'core', target: n.id }));
    
    // Connect nodes of the same group
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].group === nodes[j].group) {
          links.push({ source: nodes[i].id, target: nodes[j].id });
        }
      }
    }

    return { nodes: allNodes, links };
  }, [lessons]);

  const findNode = (id: string) => graphData.nodes.find(n => n.id === id);

  return (
    <div className="p-8 w-full h-full flex flex-col bg-black/40 backdrop-blur-xl font-mono overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3 text-blue-400">
          <div className="p-2 rounded bg-blue-500/10 border border-blue-500/20">
            <Share2 className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-light tracking-[0.3em] uppercase">Neural_Context_Graph</h2>
        </div>
        <Badge variant="outline" className="border-blue-500/20 text-blue-400/60 bg-blue-500/5 text-[8px] tracking-[0.2em]">
          XAI_VISUALIZER_ACTIVE
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 overflow-hidden">
        
        {/* Left: The Interactive Map */}
        <div className="lg:col-span-8 relative bg-black/20 border border-white/5 rounded-2xl overflow-hidden cursor-move">
          <svg viewBox="0 0 800 600" className="w-full h-full">
            {/* Defs for gradients/glows */}
            <defs>
              <filter id="nodeGlow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Links */}
            {graphData.links.map((link, i) => {
              const s = findNode(link.source);
              const t = findNode(link.target);
              if (!s || !t) return null;
              const isHighlighted = selectedNode && (selectedNode.id === s.id || selectedNode.id === t.id);
              return (
                <line
                  key={i}
                  x1={s.x} y1={s.y} x2={t.x} y2={t.y}
                  stroke={isHighlighted ? "#60a5fa" : "#ffffff"}
                  strokeWidth={isHighlighted ? 1 : 0.2}
                  strokeOpacity={isHighlighted ? 0.6 : 0.1}
                  className="transition-all duration-500"
                />
              );
            })}

            {/* Nodes */}
            {graphData.nodes.map((node) => (
              <g 
                key={node.id} 
                className="group cursor-pointer" 
                onClick={() => setSelectedNode(node)}
              >
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.id === 'core' ? 12 : 6}
                  fill={selectedNode?.id === node.id ? "#60a5fa" : (node.id === 'core' ? "#3b82f6" : "#1e293b")}
                  stroke={selectedNode?.id === node.id ? "#ffffff" : "#3b82f6"}
                  strokeWidth={selectedNode?.id === node.id ? 2 : 1}
                  filter={selectedNode?.id === node.id ? "url(#nodeGlow)" : ""}
                  className="transition-all duration-300 group-hover:scale-125"
                />
                <text
                  x={node.x}
                  y={node.y + 20}
                  textAnchor="middle"
                  fill="white"
                  fillOpacity={selectedNode?.id === node.id ? 1 : 0.3}
                  fontSize="8"
                  className="font-mono uppercase tracking-widest pointer-events-none select-none"
                >
                  {node.label}
                </text>
              </g>
            ))}
          </svg>

          <div className="absolute bottom-4 left-4 p-3 bg-black/60 backdrop-blur-md border border-white/5 rounded-lg text-[8px] text-white/40 uppercase tracking-widest leading-relaxed">
            Interference: NULL <br />
            Context_Density: {lessons.length} Fragments <br />
            Protocol: Explainable_Neural_Mapping
          </div>
        </div>

        {/* Right: Context Inspector */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <Card className="bg-black/40 border-white/5 backdrop-blur-md flex-1 overflow-y-auto custom-scrollbar">
            <CardHeader className="border-b border-white/5 py-3">
              <CardTitle className="text-[10px] text-white/30 uppercase tracking-widest flex items-center gap-2">
                <Brain className="w-3 h-3 text-blue-400" /> Context_Inspector
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {selectedNode ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div>
                    <h4 className="text-lg font-bold text-white uppercase tracking-tighter mb-1">{selectedNode.label}</h4>
                    <Badge variant="outline" className="text-[8px] border-blue-500/20 text-blue-400/60 uppercase">{selectedNode.group}</Badge>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="text-[8px] text-white/20 uppercase tracking-widest">Architectural_Impact</div>
                      <div className="text-xs text-blue-400 font-bold">+{selectedNode.complexity}% Neural Complexity</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[8px] text-white/20 uppercase tracking-widest">Association_Strings</div>
                      <p className="text-[10px] text-white/60 leading-relaxed italic">
                        Connected to {graphData.links.filter(l => l.source === selectedNode.id || l.target === selectedNode.id).length} other fragments via {selectedNode.group} pathways.
                      </p>
                    </div>
                  </div>

                  <Button className="w-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-[9px] uppercase tracking-widest hover:bg-blue-600/20">
                    <Database className="w-3 h-3 mr-2" /> Retrieve_Raw_Fragment
                  </Button>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4 opacity-20">
                  <Network className="w-12 h-12" />
                  <p className="text-[10px] uppercase tracking-[0.3em]">Select_Node_To_Inspect_Logic</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
            <div className="flex items-center gap-2 text-[9px] text-blue-400 uppercase tracking-widest font-bold mb-2">
              <Zap className="w-3 h-3" /> System_Insight
            </div>
            <p className="text-[8px] text-white/30 uppercase leading-relaxed font-mono">
              The graph visualizes how new lesson plans anchor into the core system. Clicking nodes reveals the weight of each fragment.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
