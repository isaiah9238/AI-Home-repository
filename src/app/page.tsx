'use client';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";
import { Skeleton } from "@/components/ui/skeleton";
// Import moved to the top where it belongs
import { AIChat } from "@/components/ui/chat";

const MOCK_BRIEFING = "Welcome to AI Home! It looks like there might be an issue with the Firebase project configuration. To keep you unblocked, I've loaded this mock briefing.";
const MOCK_INTERESTS = ["AI Development", "Next.js", "Firebase", "React"];

export default function Dashboard() {
  const [morningBriefing] = useState<string | null>(MOCK_BRIEFING);
  const [userInterests] = useState<string[] | null>(MOCK_INTERESTS);
  const [loading] = useState(false);

  return (
    <div className="flex h-screen bg-gray-900 text-white font-sans">
      {/* Sidebar */}
      <aside className="w-64 p-6 bg-gray-800 border-r border-gray-700">
        <h2 className="text-2xl font-bold mb-6 font-headline text-green-400">Interests</h2>
        <div className="flex flex-wrap gap-3">
          {loading || userInterests === null ? (
            <>
              <Skeleton className="h-6 w-24 rounded-full bg-gray-700" />
              <Skeleton className="h-6 w-32 rounded-full bg-gray-700" />
            </>
          ) : (
            userInterests.map((interest) => (
              <Tag key={interest} text={interest} />
            ))
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 flex flex-col gap-6">
        <section className="hero-section">
          <Card className="bg-black border-green-400 border-2 shadow-lg shadow-green-400/20">
            <CardHeader className="border-b border-green-400 p-4 flex flex-row items-center justify-between">
              <CardTitle className="font-mono text-lg text-green-400">user@cloudshell: ~ (Briefing)</CardTitle>
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {loading || morningBriefing === null ? (
                <Skeleton className="h-20 w-full bg-gray-800" />
              ) : (
                <pre className="whitespace-pre-wrap font-mono text-sm text-green-300">
                  $ {morningBriefing}
                </pre>
              )}
            </CardContent>
          </Card>
        </section>

        {/* AI Chat Section - integrated into the dashboard */}
        <section className="chat-section flex-1">
           <h2 className="font-mono text-green-400 mb-2">Execute Command:</h2>
           <AIChat />
        </section>
      </main>
    </div>
  );
}