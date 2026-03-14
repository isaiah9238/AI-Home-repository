'use client';

import { useState } from 'react';
import { Info, X } from 'lucide-react'; // Assuming you are using lucide-react for icons

interface DynamicInstructionsProps {
  title: string;
  instructions: React.ReactNode;
}

export function DynamicInstructions({ title, instructions }: DynamicInstructionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative z-50">
      {/* The Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center p-2 text-gray-400 hover:text-cyan-400 transition-colors duration-200 bg-[#050505]/50 border border-gray-800 rounded-md backdrop-blur-md"
        aria-label="Toggle Instructions"
      >
        <Info className="w-5 h-5" />
      </button>

      {/* The Instruction Overlay */}
      {isOpen && (
        <div className="absolute top-12 right-0 w-80 p-4 bg-[#0a0a0a]/90 backdrop-blur-xl border border-gray-700/50 rounded-lg shadow-2xl text-sm text-gray-300 transform transition-all">
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-800">
            <h3 className="text-cyan-500 font-semibold tracking-wide uppercase text-xs">
              {title}
            </h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-3 leading-relaxed">
            {instructions}
          </div>
        </div>
      )}
    </div>
  );
}