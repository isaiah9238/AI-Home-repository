"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BotMessageSquare, Loader2 } from "lucide-react";
// Corrected imports
import { getMorningBriefing } from "@/app/actions";
import { getHomeBase } from "@/ai/discovery/establish-home-base";

export default function MentorshipPage() {
  const [briefing, setBriefing] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        // 1. Fetch data from your Firestore 'primary_user'
        const homeBase = await getHomeBase();
        
        if (homeBase.success && homeBase.data) {
          // Temporary test in MentorshipPage.tsx
          const response = await getMorningBriefing({ name: "Isaiah", interests: ["Soccer"] });
          setBriefing(response);
        } else {
          setBriefing("Please establish your Home Base (primary_user) in Firestore first.");
        }
      } catch (err) {
        console.error("AI Mentor Initialization Error:", err); // Look at your terminal/browser console for this!
        setBriefing("Connection error. Check terminal logs.");
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
            <div className="bg-muted/30 p-6 rounded-lg border">
              <p className="whitespace-pre-wrap leading-relaxed italic text-foreground/90">
                "{briefing}"
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}