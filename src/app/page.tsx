'use client';

import { InteriorDashboard } from "@/components/interior-dashboard";

/**
 * The main entry point for the AI Home.
 * This file acts as the "app.jsx" controller for the HUD environment.
 */
export default function AIHomeApp() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-green-500/30 overflow-hidden">
      {/* Global HUD Interface */}
      <InteriorDashboard />
      
      {/* Global CSS for CRT and UI Effects */}
      <style jsx global>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        
        .hud-scanline {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            transparent,
            rgba(34, 197, 94, 0.05),
            transparent
          );
          height: 10%;
          width: 100%;
          animation: scanline 8s linear infinite;
          pointer-events: none;
          z-index: 50;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(34, 197, 94, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(34, 197, 94, 0.4);
        }
      `}</style>
    </div>
  );
}
