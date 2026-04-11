import { InteriorDashboard } from "@/components/interior-dashboard";
import { getHomeBase } from "@/app/actions";
import { redirect } from 'next/navigation';

/**
 * AI Home: The Digital Cabinet Dashboard
 * 
 * This server component acts as the entry point, fetching context from the Librarian (Firestore)
 * before handing off to the cybernetic HUD interface.
 */
// src/app/page.tsx (conceptual update)
export default async function AIHomeApp() {
  const response = await getHomeBase();
  
  // If getHomeBase fails (and we aren't using the bypass), 
  // we would redirect to /login here.
  if (!response.success) {
    redirect('/login'); 
  }

  return (
    <div className="min-h-screen bg-black">
      <InteriorDashboard initialUserData={response.data} />
    </div>
  );
}
