'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Loader2 } from "lucide-react";
import { integrateLessonAction, generateLessonPlan } from "@/app/actions";

export default function LessonPlansPage() {
  const [subject, setSubject] = useState('');
  const [plan, setPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);

  const handleGenerate = async () => {
    if (!subject) return;
    setLoading(true);
    try {
      const result = await generateLessonPlan(subject);
      if (result.success) {
        setPlan(result.plan || '');
      } else {
        setPlan(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("AI Generation Error:", error);
      setPlan("Error: The Cabinet Tutor is currently unresponsive.");
    } finally {
      setLoading(false);
    }
  };

  const handleIntegrate = async () => {
    if (!plan || !subject) return;
    setIsMigrating(true);
    try {
      const result = await integrateLessonAction({
        title: subject,
        subject: "AI Generated Lesson",
        complexityGain: 5 
      });
      if (result.success) {
        alert("Librarian: Lesson officially integrated into the Cabinet.");
      }
    } catch (error) {
      console.error("Migration Error:", error);
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 font-inter text-white">
      <Card className="w-full max-w-md bg-slate-900 border-slate-800">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="mt-4 uppercase tracking-widest">Lesson Plans</CardTitle>
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
              className="bg-blue-600 hover:bg-blue-500"
            >
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : "Generate Plan"}
            </Button>
          </div>

          {plan && (
            <div className="space-y-4">
              <div className="mt-6 p-4 bg-slate-800 rounded-md text-left whitespace-pre-wrap text-sm border border-slate-700 text-slate-200">
                {plan}
              </div>
              <Button 
                onClick={handleIntegrate}
                disabled={isMigrating}
                className="w-full bg-green-600 hover:bg-green-500 font-mono text-[10px] uppercase tracking-widest"
              >
                {isMigrating ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Integrate_into_Curriculum_Drawer"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
