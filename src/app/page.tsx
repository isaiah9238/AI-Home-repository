'use client';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AIChat } from "@/components/ui/chat";

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-900 text-white font-sans overflow-hidden">
      {/* Sidebar - Simplified navigation area */}
      <aside className="w-64 p-6 bg-gray-800 border-r border-gray-700 hidden md:block">
        <div className="space-y-4">
          <h2 className="text-xl font-bold font-headline text-green-400 border-b border-green-900 pb-2">TERMINAL_NAV</h2>
          <p className="text-xs text-gray-500 font-mono italic">
            Connected to Node_Alpha_01
            <br />
            Status: OPTIMAL
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 flex flex-col gap-6 overflow-y-auto">
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
              <pre className="whitespace-pre-wrap font-mono text-sm text-green-300">
                $ Welcome to AI Home. System initialized. Please enter profile parameters below to begin customization.
              </pre>
            </CardContent>
          </Card>
        </section>

        {/* AI Chat Section */}
        <section className="chat-section flex-1">
           <h2 className="font-mono text-green-400 mb-2 uppercase tracking-widest text-xs">Execute Command:</h2>
           <AIChat />
        </section>
      </main>
    </div>
  );
}
