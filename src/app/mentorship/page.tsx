"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BotMessageSquare, Loader2 } from "lucide-react";
import { getMorningBriefing } from "@/app/actions";
import { getHomeBase } from "@/ai/discovery/establish-home-base";

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
                <div className="flex flex-col items-center gap-2 pt-4">
                  <p className="text-xs text-muted-foreground">Dev Tool: No profile detected.</p>
                  <button 
                    onClick={() => alert("Run 'npx tsx src/scripts/seed.ts' in your terminal now!")}
                    className="text-xs underline text-primary hover:text-primary/80"
                  >
                    How do I seed this?
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