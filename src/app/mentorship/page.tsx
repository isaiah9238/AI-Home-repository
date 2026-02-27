"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BotMessageSquare, Loader2 } from "lucide-react";
import { getHomeBase } from "@/ai/discovery/establish-home-base";
import { getMorningBriefing, seedHomeBaseAction } from "@/app/actions";

export default function MentorshipPage() {
  const [briefing, setBriefing] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const homeBase = await getHomeBase();
        
        if (homeBase.success && homeBase.data) {
          const response = await getMorningBriefing(homeBase.data);
          setBriefing(response);
        } else {
          setBriefing("Welcome! I don't know your interests yet. Click 'Profile' to set up your Home Base.");
        }
      } catch (err) {
        console.error("Initialization Error:", err);
        setBriefing("The Mentor is currently offline. Please ensure emulators are started.");
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
            <BotMessageSquare className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="mt-4 text-2xl">Web Intel Mentor</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="animate-spin h-8 w-8 text-primary" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-muted/30 p-6 rounded-lg border">
                <p className="whitespace-pre-wrap leading-relaxed italic text-foreground/90">
                  "{briefing}"
                </p>
              </div>
              {/* Only show the seed button if profile is missing or offline */}
            {(briefing?.includes("don't know your interests") || briefing?.includes("offline")) && (
              <div className="flex flex-col items-center gap-4 pt-6 border-t border-destructive/20 mt-4">
                <p className="text-sm font-medium text-destructive">
                  No Home Base detected in Emulators.
                </p>
                <button 
              onClick={async () => {
                const res = await seedHomeBaseAction();
                if (res.success) {
                  // Refresh the page to trigger the AI briefing now that data exists
                  window.location.reload();
                }
              }}
              className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-xl uppercase tracking-wider transition-all"
            >
              🔥 Initialize Home Base
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