'use client';

import { useState, useEffect } from 'react';
import { BookOpen, GraduationCap, CheckCircle2, Clock, Zap, Sparkles, Loader2, Brain, Plus, Trash2, ArrowRight, Info } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { generateLessonPlan, getPendingLessonPlans, deleteLessonPlan, integrateLessonAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

interface Lesson {
  id: string;
  title: string;
  subject: string;
  completedAt: string;
  status: string;
}

interface PendingPlan {
  id: string;
  title: string;
  subject: string;
  content: string;
  status: string;
  timestamp: string;
}

interface CurriculumProgress {
  integratedPlans: number;
  neuralComplexity: number;
  knowledgeIntegration: number;
  lastTopic: string;
  lessons: Lesson[];
}

export function CurriculumDrawer({ progress: initialProgress }: { progress: CurriculumProgress }) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [integratingId, setIntegratingId] = useState<string | null>(null);
  const [pendingPlans, setPendingPlans] = useState<PendingPlan[]>([]);
  const [progress, setProgress] = useState(initialProgress);

  useEffect(() => {
    if (activeTab === 'synthesis') {
      loadPendingPlans();
    }
  }, [activeTab]);

  const loadPendingPlans = async () => {
    const res = await getPendingLessonPlans();
    if (res.success) setPendingPlans(res.data as PendingPlan[]);
  };

  const handleGenerate = async () => {
    if (!subject) return;
    setLoading(true);
    const res = await generateLessonPlan(subject);
    if (res.success) {
      toast({
        title: "SYNTHESIS_COMPLETE",
        description: `New lesson plan generated for ${subject}.`,
        className: "bg-black/80 border-blue-500/30 text-blue-400 font-mono text-[8px]",
      });
      setSubject('');
      loadPendingPlans();
    } else {
      toast({
        variant: "destructive",
        title: "SYNTHESIS_FAILED",
        description: res.error,
      });
    }
    setLoading(false);
  };

  const handleIntegrate = async (plan: PendingPlan) => {
    setIntegratingId(plan.id);
    const res = await integrateLessonAction({
      title: plan.title,
      subject: plan.subject,
      content: plan.content,
      complexityGain: 5
    });

    if (res.success) {
      await deleteLessonPlan(plan.id);
      toast({
        title: "INTEGRATION_SUCCESS",
        description: `${plan.title} is now part of the System Core.`,
        className: "bg-black/80 border-green-500/30 text-green-400 font-mono text-[8px]",
      });
      loadPendingPlans();
    }
    setIntegratingId(null);
  };

  const handleDeletePlan = async (id: string) => {
    const res = await deleteLessonPlan(id);
    if (res.success) loadPendingPlans();
  };

  return (
    <div className="p-8 w-full h-full flex flex-col bg-black/40 backdrop-blur-xl font-mono overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3 text-blue-400">
          <div className="p-2 rounded bg-blue-500/10 border border-blue-500/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-light tracking-[0.3em] uppercase">Curriculum_Center</h2>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-white/5 p-1 rounded-lg border border-white/10">
          <TabsList className="bg-transparent border-0 gap-2 h-8">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400 text-[10px] uppercase tracking-widest px-4">Overview</TabsTrigger>
            <TabsTrigger value="synthesis" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400 text-[10px] uppercase tracking-widest px-4">Synthesis</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Tabs value={activeTab} className="w-full">
        <TabsContent value="overview" className="mt-0 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="bg-black/20 border-blue-500/20 backdrop-blur-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] text-blue-500/50 uppercase tracking-widest">Mastery_Levels</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] uppercase text-white/50">
                    <span>Integrated_Plans</span>
                    <span className="text-blue-400">{progress?.integratedPlans || 0}</span>
                  </div>
                  <Progress value={progress?.neuralComplexity || 64} className="h-1 bg-white/5" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] uppercase text-white/50">
                    <span>Neural_Complexity</span>
                    <span className="text-blue-400">{progress?.neuralComplexity || 64}%</span>
                  </div>
                  <Progress value={progress?.neuralComplexity || 64} className="h-1 bg-white/5" />
                </div>
              </CardContent>
            </Card>

            <div className="p-6 rounded-xl border border-white/5 bg-white/5 flex flex-col justify-center relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Brain className="w-32 h-32 text-blue-400" />
              </div>
              <h3 className="text-[10px] text-white/20 uppercase mb-4 tracking-widest">Current_Focus</h3>
              <div className="flex items-center gap-4 text-white">
                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <BookOpen className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-bold tracking-widest uppercase">{progress?.lastTopic || "System Initialization"}</p>
                  <p className="text-[8px] text-white/30 uppercase mt-1">Status: Stable_Integration</p>
                </div>
              </div>
            </div>
          </div>

          <h3 className="text-[10px] text-white/20 uppercase tracking-[0.5em] mb-4">Ingested_Milestones</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {progress?.lessons?.length > 0 ? (
              progress.lessons.map((lesson) => (
                <div key={lesson.id} className="p-4 rounded border border-blue-500/20 bg-blue-500/5 group hover:bg-blue-500/10 transition-all cursor-default relative overflow-hidden">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] text-blue-400 uppercase tracking-tighter">{lesson.subject}</span>
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
                <p className="text-[10px] text-white/20 uppercase tracking-widest">No_Knowledge_Fragments_Ingested</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="synthesis" className="mt-0 animate-in slide-in-from-right-4 duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-6">
              <Card className="bg-black/20 border-purple-500/20 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-[10px] text-purple-400/60 uppercase tracking-widest flex items-center gap-2">
                    <Sparkles className="w-3 h-3" /> Synthesis_Input
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-[10px] text-white/40 leading-relaxed">
                    Enter a subject coordinate to trigger the Tutor's generation protocol. The resulting plan will be staged for core integration.
                  </p>
                  <div className="space-y-2">
                    <Input 
                      placeholder="ENTER_SUBJECT_E.G._QUANTUM_COMPUTING"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/10 text-xs h-11"
                    />
                    <Button 
                      onClick={handleGenerate} 
                      disabled={loading || !subject}
                      className="w-full bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-500/40 h-11 uppercase tracking-widest text-xs"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                      {loading ? 'Synthesizing...' : 'Trigger_Synthesis'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="p-6 rounded-xl border border-blue-500/10 bg-blue-500/5 space-y-2">
                <h4 className="text-[10px] text-blue-400 font-bold uppercase tracking-widest flex items-center gap-2">
                  <Info className="w-3 h-3" /> System_Tip
                </h4>
                <p className="text-[9px] text-white/40 leading-relaxed uppercase">
                  Integrating new lesson plans increases <span className="text-blue-400">Neural_Complexity</span> and unlocks new sectors in the <span className="text-purple-400">Neural_Graph</span>.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[10px] text-white/20 uppercase tracking-[0.4em] flex items-center gap-2">
                  <Zap className="w-3 h-3 text-yellow-400" /> Pending_Integration_Queue
                </h3>
                <Badge variant="outline" className="text-[8px] text-white/20 border-white/5">{pendingPlans.length}_STAGED</Badge>
              </div>

              {pendingPlans.length === 0 ? (
                <div className="py-20 text-center border border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
                  <p className="text-[10px] text-white/10 uppercase tracking-[0.5em]">Queue_Empty_Awaiting_Input</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingPlans.map((plan) => (
                    <Card key={plan.id} className="bg-white/[0.02] border-white/5 hover:border-purple-500/30 transition-all group">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-[10px] font-bold text-white/80 uppercase truncate">{plan.title}</span>
                            <Badge className="bg-purple-500/10 text-purple-400 text-[7px] uppercase h-4">Pending</Badge>
                          </div>
                          <p className="text-[8px] text-white/20 uppercase tracking-tighter">Coordinates: {plan.subject}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeletePlan(plan.id)}
                            className="h-8 w-8 text-white/10 hover:text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={() => handleIntegrate(plan)}
                            disabled={integratingId === plan.id}
                            className="h-8 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 text-[8px] uppercase tracking-widest gap-2 px-4"
                          >
                            {integratingId === plan.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <ArrowRight className="w-3 h-3" />
                            )}
                            Integrate_Core
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
