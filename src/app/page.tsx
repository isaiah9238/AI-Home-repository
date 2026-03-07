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
      
      {/* Pass the serialized data to your Client Component.
          Note: You'll need to update InteriorDashboard to accept this prop! 
      */}
      <InteriorDashboard initialUserData={userData} />
      
      <style jsx global>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        
        .hud-scanline {
          position: fixed;
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