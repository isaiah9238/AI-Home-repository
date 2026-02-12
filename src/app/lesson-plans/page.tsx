'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Loader2 } from "lucide-react";
// Import the model we exported in your clean firebase.ts
import { lessonModel } from "@/lib/firebase"; 

export default function LessonPlansPage() {
  // 1. Re-add the missing state (The data storage)
  const [subject, setSubject] = useState('');
  const [plan, setPlan] = useState('');
  const [loading, setLoading] = useState(false);

  // 2. Re-add the handleGenerate function (The engine)
  const handleGenerate = async () => {
    if (!subject) return;
    setLoading(true);
    
    try {
      // Calls the Gemini 3 Flash model from your firebase.ts
      const result = await lessonModel.generateContent(`Create a detailed, structured lesson plan for: ${subject}`);
      const response = await result.response;
      setPlan(response.text());
    } catch (error) {
      console.error("AI Generation Error:", error);
      setPlan("Error: Make sure your Firebase AI Logic is enabled in the console.");
    } finally {
      setLoading(false);
    }
  };

  // 3. This is your UI (The shell)
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <Card className="w-full max-w-md text-center text-white bg-slate-900 border-slate-800">
        <CardHeader>
          <div className="mx-auto bg-primary/10 p-3 rounded-full">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="mt-4">Lesson Plans</CardTitle>
          <CardDescription className="text-slate-400">
            Enter a subject below to generate a guided learning journey.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3">
            <Input 
              placeholder="e.g. Intro to Land Surveying" 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
            />
            <Button 
              onClick={handleGenerate} 
              disabled={loading || !subject}
              className="bg-primary hover:bg-primary/90"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Plan"
              )}
            </Button>
          </div>

          {plan && (
            <div className="mt-6 p-4 bg-slate-800 rounded-md text-left whitespace-pre-wrap text-sm border border-slate-700 text-slate-200">
              {plan}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}