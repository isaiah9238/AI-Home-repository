'use client';

import { useState } from 'react';
import { Info, X, Zap, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DynamicInstructionsProps {
  title: string;
  instructions: React.ReactNode;
  variant?: 'blue' | 'purple' | 'green';
}

/**
 * DynamicInstructions: High-fidelity HUD Help Overlay.
 * Provides adaptive, themed assistance for specialized AI Drawers.
 */
export function DynamicInstructions({ title, instructions, variant = 'blue' }: DynamicInstructionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const variants = {
    blue: {
      text: 'text-blue-400',
      border: 'border-blue-500/30',
      bg: 'bg-blue-500/5',
      glow: 'shadow-[0_0_20px_rgba(59,130,246,0.15)]',
      hover: 'hover:border-blue-500/50'
    },
    purple: {
      text: 'text-purple-400',
      border: 'border-purple-500/30',
      bg: 'bg-purple-500/5',
      glow: 'shadow-[0_0_20px_rgba(168,85,247,0.15)]',
      hover: 'hover:border-purple-500/50'
    },
    green: {
      text: 'text-green-400',
      border: 'border-green-500/30',
      bg: 'bg-green-500/5',
      glow: 'shadow-[0_0_20px_rgba(34,197,94,0.15)]',
      hover: 'hover:border-green-500/50'
    }
  };

  const v = variants[variant];

  return (
    <div className="relative z-50 font-mono">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-center p-2 rounded-lg border backdrop-blur-xl transition-all duration-500 group",
          v.text,
          v.border,
          v.bg,
          v.hover,
          isOpen ? "bg-white/10" : "bg-black/40"
        )}
        aria-label="Toggle System Help"
      >
        {isOpen ? <X className="w-4 h-4" /> : <Info className="w-4 h-4 group-hover:rotate-12 transition-transform" />}
      </button>

      {isOpen && (
        <div className={cn(
          "absolute top-12 right-0 w-80 p-6 bg-black/90 backdrop-blur-2xl border rounded-2xl animate-in zoom-in-95 fade-in slide-in-from-top-4 duration-300",
          v.text,
          v.border,
          v.glow
        )}>
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Zap className="w-3 h-3 animate-pulse" />
              <h3 className="font-bold tracking-[0.2em] uppercase text-[10px]">
                {title}
              </h3>
            </div>
            <span className="text-[8px] opacity-30 tracking-widest">PROTOCOL_v4.2.0</span>
          </div>
          
          <div className="space-y-4 leading-relaxed text-[11px] text-white/70">
            {instructions}
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 text-[7px] uppercase tracking-widest opacity-20">
              <ChevronRight className="w-2 h-2" /> Adaptive_HUD_Overlay_Active
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-[8px] uppercase tracking-[0.4em] opacity-30 hover:opacity-100 transition-opacity"
            >
              Close_Buffer [ESC]
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
