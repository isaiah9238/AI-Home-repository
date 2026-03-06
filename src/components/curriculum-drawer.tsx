'use client';

import { BookOpen, GraduationCap, CheckCircle2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function CurriculumDrawer({ progress }: { progress: any }) {
  return (
    <div className="p-8 w-full h-full flex flex-col bg-black/40 backdrop-blur-xl font-inter">
      <div className="flex items-center gap-3 text-blue-400 mb-8">
        <GraduationCap className="w-6 h-6" />
        <h2 className="text-xl font-light tracking-[0.3em] uppercase">Curriculum_Progress</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Knowledge Stats */}
        <Card className="bg-black/20 border-blue-500/20">
          <CardHeader>
            <CardTitle className="text-[10px] font-mono text-blue-500/50 uppercase tracking-widest">Mastery_Levels</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] uppercase text-white/50">
                <span>Integrated_Plans</span>
                <span>{progress.integratedPlans}</span>
              </div>
              <Progress value={progress.neuralComplexity} className="h-1 bg-white/5" />
            </div>
          </CardContent>
        </Card>

        {/* Current Focus */}
        <div className="p-6 rounded-lg border border-white/5 bg-white/5">
          <h3 className="text-[10px] font-mono text-white/20 uppercase mb-4">Current_Focus</h3>
          <div className="flex items-center gap-4 text-white">
            <BookOpen className="w-8 h-8 text-blue-400" />
            <div>
              <p className="text-xs font-bold tracking-widest">{progress.lastTopic}</p>
              <p className="text-[8px] text-white/30 uppercase mt-1">Status: Processing_New_Context</p>
            </div>
          </div>
        </div>
      </div>

      {/* Milestones Section */}
      <div className="mt-4">
        <h3 className="text-[10px] font-mono text-white/20 uppercase tracking-[0.5em] mb-4">Ingested_Milestones</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded border border-blue-500/20 bg-blue-500/5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-mono text-blue-400 uppercase">Knowledge_Ingested</span>
              <CheckCircle2 className="w-3 h-3 text-blue-400" />
            </div>
            <p className="text-xs font-bold text-white uppercase tracking-tighter">
              Introduction to Architecture
            </p>
            <p className="text-[8px] text-white/40 mt-1 uppercase">
              Focus: Form, Function, Structure, Aesthetics, Context
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
