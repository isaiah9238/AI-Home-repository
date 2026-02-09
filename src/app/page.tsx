'use client';

import { useEffect, useState } from "react";
import { getMorningBriefing, getUserInterests } from "@/app/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const [morningBriefing, setMorningBriefing] = useState<string | null>(null);
  const [userInterests, setUserInterests] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [briefing, interests] = await Promise.all([
          getMorningBriefing(),
          getUserInterests(),
        ]);
        setMorningBriefing(briefing);
        setUserInterests(interests);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        setMorningBriefing("Error: Could not load morning briefing.");
        setUserInterests([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="flex h-screen bg-gray-900 text-white font-sans">
      <aside className="w-64 p-6 bg-gray-800 border-r border-gray-700">
        <h2 className="text-2xl font-bold mb-6 font-headline">Interests</h2>
        <div className="flex flex-wrap gap-3">
          {loading || userInterests === null ? (
            <>
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-32 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </>
          ) : (
            userInterests.map((interest) => (
              <Tag key={interest} text={interest} />
            ))
          )}
        </div>
      </aside>
      <main className="flex-1 p-8">
        <section className="hero-section">
          <Card className="bg-black border-green-400 border-2 shadow-lg shadow-green-400/20">
            <CardHeader className="border-b border-green-400 p-4 flex flex-row items-center justify-between">
              <CardTitle className="font-mono text-lg text-green-400">user@cloudshell: ~</CardTitle>
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {loading || morningBriefing === null ? (
                <Skeleton className="h-20 w-full" />
              ) : (
                <pre className="whitespace-pre-wrap font-mono text-sm text-green-300">
                  $ {morningBriefing}
                </pre>
              )}
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
