"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BotMessageSquare, Loader2 } from "lucide-react";
import { getMorningBriefing, getHomeBase } from "@/app/actions";

/**
 * Mentorship Page
 * Interface for receiving AI-driven mentorship briefings based on user profile.
 */
export default function MentorshipPage() {
  const [briefing, setBriefing] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const homeBase = await getHomeBase();
        
        if (homeBase && homeBase.data) {
          const response = await getMorningBriefing(homeBase.data);
          setBriefing(response);
        } else {
          setBriefing("Welcome! I don&apos;t know your interests yet. Use the command line on the Dashboard to set your profile variables.");
        }
      } catch (err) {
        console.error("Initialization Error:", err);
        setBriefing("The Mentor is currently offline. System synchronization failed.");
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <Card className="w-full max-w-2xl bg-black/60 border-white/10 backdrop-blur-md">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
            <BotMessageSquare className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="mt-4 text-2xl font-mono uppercase tracking-[0.2em] text-white/90">Web_Intel_Mentor</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="animate-spin h-8 w-8 text-primary" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-white/5 p-6 rounded-lg border border-white/5">
                <p className="whitespace-pre-wrap leading-relaxed italic text-white/70 font-mono text-sm">
                  &quot;{briefing}&quot;
                </p>
              </div>
              
              {(briefing?.includes("don't know your interests") || briefing?.includes("offline")) && (
                <div className="flex flex-col items-center gap-4 pt-6 border-t border-white/5 mt-4">
                  <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
                    Librarian_Status: Awaiting_Data
                  </p>
                  <button 
                    onClick={async () => {
                      const res = await getHomeBase();
                      if (res.success) {
                        window.location.reload();
                      }
                    }}
                    className="w-full py-4 bg-green-600 hover:bg-green-500 text-black font-bold rounded shadow-xl uppercase tracking-wider transition-all font-mono text-sm"
                  >
                    EXEC: INITIALIZE_HOME_BASE
                  </button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
