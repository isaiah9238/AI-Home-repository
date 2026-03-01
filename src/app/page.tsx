'use client';

import { PortalInterface } from "@/components/portal-interface";

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white font-sans overflow-hidden">
      <main className="flex-1 p-8 flex flex-col relative">
        <PortalInterface />
      </main>
    </div>
  );
}
