'use client';

import { InteriorDashboard } from "@/components/interior-dashboard";

/**
 * The main entry point for the AI Home "Portal".
 * This page serves as the "App" controller, initializing the HUD environment.
 */
export default function AIHomeApp() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-green-500/30 overflow-hidden">
      <InteriorDashboard />
    </div>
  );
}
