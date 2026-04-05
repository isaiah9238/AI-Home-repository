'use client';

import { useState } from 'react';
import { Zap, ChevronRight } from 'lucide-react'; // Removed unused Info, X
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
      icon: 'text-blue-500'
    },
    purple: {
      text: 'text-purple-400',
      border: 'border-purple-500/30',
      bg: 'bg-purple-500/5',
      glow: 'shadow-[0_0_20px_rgba(168,85,247,0.15)]',
      icon: 'text-purple-500'
    },
    green: {
      text: 'text-emerald-400',
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-500/5',
      glow: 'shadow-[0_0_20px_rgba(16,185,129,0.15)]',
      icon: 'text-emerald-500'
    }
  };

  const v = variants[variant];

  return (
    <div className={cn("relative mb-4 overflow-hidden rounded-lg border transition-all duration-300", v.border, v.bg, v.glow)}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-3 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Zap className={cn("w-4 h-4", v.icon)} />
          <span className={cn("text-xs font-mono font-bold tracking-tighter uppercase", v.text)}>
            {title}
          </span>
        </div>
        <ChevronRight className={cn("w-4 h-4 transition-transform", v.text, isOpen && "rotate-90")} />
      </button>

      {isOpen && (
        <div className="p-3 pt-0 border-t border-white/5 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="text-[11px] font-mono leading-relaxed text-white/70">
            {instructions}
          </div>
        </div>
      )}
    </div>
  );
}