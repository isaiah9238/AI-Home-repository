import { InteriorDashboard } from "@/components/interior-dashboard";
import { getHomeBaseAction } from "@/app/actions";

/**
 * AI Home: The Digital Cabinet Dashboard
 * 
 * This server component acts as the entry point, fetching context from the Librarian (Firestore)
 * before handing off to the cybernetic HUD interface.
 */
export default async function AIHomeApp() {
  // 1. Fetch initial profile context from Home Base
  const userData = await getHomeBaseAction();

  return (
    <div className="w-full bg-[#050505] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden min-h-screen">
      {/* Visual background layer */}
      <div className="hud-scanline" />
      
      {/* 2. Pass serialized context to the High-Fidelity HUD */}
      <InteriorDashboard initialUserData={userData} />
    </div>
  );
}
