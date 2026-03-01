
'use client';

import { InteriorDashboard } from "@/components/interior-dashboard";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-green-500/30">
      <InteriorDashboard />
    </div>
  );
}
