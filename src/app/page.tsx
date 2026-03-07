import { InteriorDashboard } from "@/components/interior-dashboard";
import { getHomeBaseAction } from "@/app/actions";

/**
 * The main entry point for the AI Home.
 * Now a Server Component to handle data sanitization before hydration.
 */
export default async function AIHomeApp() {
  // Fetch and sanitize data on the server
  const userData = await getHomeBaseAction();

  return (
    <div className="w-full bg-[#050505] text-white font-sans selection:bg-green-500/30 overflow-x-hidden">
      <div className="hud-scanline" />
      
      {/* Pass the serialized data to the Client Component */}
      <InteriorDashboard initialUserData={userData} />
    </div>
  );
}
