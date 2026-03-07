'use client';

import { BookOpen, GraduationCap, CheckCircle2, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Lesson {
  id: string;
  title: string;
  subject: string;
  completedAt: string;
  status: string;
}

interface CurriculumProgress {
  integratedPlans: number;
  neuralComplexity: number;
  knowledgeIntegration: number;
  lastTopic: string;
  lessons: Lesson[];
}

/**
 * CurriculumDrawer
 * Displays the user's learning progress and ingested knowledge milestones.
 */
export function CurriculumDrawer({ progress }: { progress: CurriculumProgress }) {
  return (
    <div className="p-8 w-full h-full flex flex-col bg-black/40 backdrop-blur-xl font-inter overflow-y-auto custom-scrollbar">
      <div className="flex items-center gap-3 text-blue-400 mb-8">
        <div className="p-2 rounded bg-blue-500/10 border border-blue-500/20">
          <GraduationCap className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-light tracking-[0.3em] uppercase font-mono">Curriculum_Progress</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Knowledge Stats */}
        <Card className="bg-black/20 border-blue-500/20 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-[10px] font-mono text-blue-500/50 uppercase tracking-widest">Mastery_Levels</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] uppercase text-white/50 font-mono">
                <span>Integrated_Plans</span>
                <span className="text-blue-400">{progress?.integratedPlans || 0}</span>
              </div>
              <Progress value={progress?.neuralComplexity || 64} className="h-1 bg-white/5" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] uppercase text-white/50 font-mono">
                <span>Neural_Complexity</span>
                <span className="text-blue-400">{progress?.neuralComplexity || 64}%</span>
              </div>
              <Progress value={progress?.neuralComplexity || 64} className="h-1 bg-white/5" />
            </div>
          </CardContent>
        </Card>

        {/* Current Focus */}
        <div className="p-6 rounded-lg border border-white/5 bg-white/5 flex flex-col justify-center">
          <h3 className="text-[10px] font-mono text-white/20 uppercase mb-4 tracking-widest">Current_Focus</h3>
          <div className="flex items-center gap-4 text-white">
            <BookOpen className="w-8 h-8 text-blue-400" />
            <div>
              <p className="text-xs font-bold tracking-widest uppercase">{progress?.lastTopic || "System Initialization"}</p>
              <p className="text-[8px] text-white/30 uppercase mt-1 font-mono">Status: Processing_New_Context</p>
            </div>
          </div>
        </div>
      </div>

      {/* Milestones Section */}
      <div className="mt-4">
        <h3 className="text-[10px] font-mono text-white/20 uppercase tracking-[0.5em] mb-4">Ingested_Milestones</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {progress?.lessons?.length > 0 ? (
            progress.lessons.map((lesson) => (
              <div key={lesson.id} className="p-4 rounded border border-blue-500/20 bg-blue-500/5 group hover:bg-blue-500/10 transition-all cursor-default relative overflow-hidden">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-mono text-blue-400 uppercase tracking-tighter">{lesson.subject}</span>
                  <CheckCircle2 className="w-3 h-3 text-blue-400 animate-pulse" />
                </div>
                <p className="text-xs font-bold text-white uppercase tracking-tighter group-hover:text-blue-300 transition-colors truncate">
                  {lesson.title}
                </p>
                <div className="flex items-center gap-2 mt-3 text-[8px] text-white/30 uppercase font-mono">
                  <Clock className="w-2 h-2" />
                  <span>{new Date(lesson.completedAt).toLocaleDateString()}</span>
                </div>
                <div className="absolute bottom-0 left-0 h-[1px] bg-blue-500/40 w-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center border border-dashed border-white/10 rounded-lg">
              <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest">No_Knowledge_Fragments_Ingested</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
