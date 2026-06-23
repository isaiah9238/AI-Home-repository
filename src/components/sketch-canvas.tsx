"use client";

import React, { useRef, useEffect, useState } from "react";
import { Crosshair, ShieldAlert, RotateCcw } from "lucide-react";

interface SurveyPoint {
  x: number;
  y: number;
  label: string;
}

export default function SketchCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [points, setPoints] = useState<SurveyPoint[]>([]);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions based on parent container scaling
    canvas.width = canvas.parentElement?.clientWidth || 800;
    canvas.height = 500;

    // Draw grid baseline environment (Minimalist Grid)
    ctx.strokeStyle = "#111111";
    ctx.lineWidth = 1;
    const gridSize = 25;
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  }, [points]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);
    setCoords({ x, y });

    if (!isDrawing) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw interactive neon vector lines
    ctx.strokeStyle = "#00ff66"; // Neon Emerald Accent
    ctx.lineWidth = 2;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    // Log target benchmark point
    const newPoint: SurveyPoint = {
      x: coords.x,
      y: coords.y,
      label: `PT-${points.length + 1}`,
    };
    setPoints([...points, newPoint]);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setPoints([]);
  };

  return (
    <div className="w-full h-full bg-black border border-zinc-800 rounded-lg p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
        <div className="flex items-center gap-2">
          <Crosshair className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-xs font-mono tracking-widest text-zinc-400">THE_SKETCH_PROJECT // VECTOR_CORE</span>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-500">
          <span>X: <span className="text-cyan-400">{coords.x}px</span></span>
          <span>Y: <span className="text-cyan-400">{coords.y}px</span></span>
          <button onClick={clearCanvas} className="hover:text-emerald-400 transition-colors flex items-center gap-1">
            <RotateCcw className="w-3 h-3" /> CLEAR
          </button>
        </div>
      </div>

      <div className="relative bg-[#030303] rounded border border-zinc-900 overflow-hidden cursor-crosshair flex-1">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          className="absolute top-0 left-0 w-full h-full"
        />
      </div>

      {/* Point Data Matrix Display */}
      <div className="grid grid-cols-4 gap-2 text-[10px] font-mono text-zinc-400 max-h-24 overflow-y-auto">
        {points.map((pt, i) => (
          <div key={i} className="bg-zinc-950 border border-zinc-900 p-1.5 rounded flex justify-between">
            <span className="text-emerald-500">{pt.label}</span>
            <span className="text-zinc-500">[{pt.x}, {pt.y}]</span>
          </div>
        ))}
      </div>
    </div>
  );
}