'use client';

import { useState } from 'react';
import { runAdversarySuite, StressTestReport } from '@/ai/stress/provocateur-runner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Flame, ShieldAlert, CheckCircle2, XCircle, Loader2, Bug, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ProvocateurDashboard() {
  const { toast } = useToast();
  const [running, setRunning] = useState(false);
  const [reports, setReports] = useState<StressTestReport[]>([]);

  const handleRunSuite = async () => {
    setRunning(true);
    setReports([]);

    try {
      toast({
        title: "PROVOCATEUR_ENGAGED",
        description: "Launching synthetic stress test suite against Loop 1 & Loop 2...",
        className: "bg-black/80 border-purple-500/30 text-purple-400 font-mono text-[8px]",
      });

      const results = await runAdversarySuite();
      setReports(results);

      const allPassed = results.every((r) => r.passed);
      toast({
        title: allPassed ? "STRESS_TEST_PASSED" : "VULNERABILITY_DETECTED",
        description: allPassed 
          ? "All defenses held firm against synthetic attack vectors." 
          : "One or more stress test assertions failed.",
        className: allPassed 
          ? "bg-black/80 border-green-500/30 text-green-400 font-mono text-[8px]"
          : "bg-black/80 border-red-500/30 text-red-400 font-mono text-[8px]",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "SUITE_CRASH",
        description: err.message || "Failed to execute adversary runner.",
      });
    } finally {
      setRunning(false);
    }
  };

  const passCount = reports.filter((r) => r.passed).length;

  return (
    <div className="p-8 w-full h-full flex flex-col bg-black/40 backdrop-blur-xl font-mono overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3 text-purple-400">
          <div className="p-2 rounded bg-purple-500/10 border border-purple-500/20">
            <Flame className="w-6 h-6 text-purple-500 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-light tracking-[0.3em] uppercase">The_Provocateur</h2>
            <p className="text-[9px] text-white/40 tracking-widest uppercase">Environmental Pressure & Stress Engine</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {reports.length > 0 && (
            <Badge 
              variant="outline" 
              className={`h-8 px-4 text-[9px] tracking-[0.2em] uppercase ${
                passCount === reports.length 
                  ? 'border-green-500/30 text-green-400 bg-green-500/5' 
                  : 'border-red-500/30 text-red-400 bg-red-500/5'
              }`}
            >
              DEFENSE_SCORE: {passCount}/{reports.length}
            </Badge>
          )}
          <Button
            onClick={handleRunSuite}
            disabled={running}
            className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-500/40 h-10 px-6 uppercase tracking-widest text-xs"
          >
            {running ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Zap className="w-4 h-4 mr-2" />}
            {running ? 'Simulating_Attacks...' : 'Unleash_Provocateur'}
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        
        {/* Left: Attack Vector Summary */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="bg-black/40 border-white/5 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-[10px] text-white/30 uppercase tracking-widest flex items-center gap-2">
                <ShieldAlert className="w-3 h-3 text-purple-400" /> Active_Threat_Vectors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-[9px] text-white/50">
              <div className="p-3 rounded bg-white/5 border border-white/5">
                <span className="font-bold text-purple-400">1. Identity Spoofing</span>
                <p className="text-white/30 mt-1">Attempts unauthorized VFS index writes using mismatched user payload claims.</p>
              </div>
              <div className="p-3 rounded bg-white/5 border border-white/5">
                <span className="font-bold text-purple-400">2. Resource Exhaustion</span>
                <p className="text-white/30 mt-1">Issues massive limits (500+) to verify server-side hard-cap protections.</p>
              </div>
              <div className="p-3 rounded bg-white/5 border border-white/5">
                <span className="font-bold text-purple-400">3. Schema Mutilation</span>
                <p className="text-white/30 mt-1">Passes missing/malformed Zod payloads directly to core handlers.</p>
              </div>
              <div className="p-3 rounded bg-white/5 border border-white/5">
                <span className="font-bold text-purple-400">4. Trivial Query Spam</span>
                <p className="text-white/30 mt-1">Fires sub-threshold query strings to test early validation rejection.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Real-time Results Terminal */}
        <div className="lg:col-span-8 flex flex-col">
          <Card className="bg-black/20 border-white/5 flex-1 overflow-hidden flex flex-col min-h-[400px]">
            <CardHeader className="bg-white/5 border-b border-white/5 py-3">
              <CardTitle className="text-[10px] text-white/30 uppercase tracking-widest flex items-center gap-2">
                <Bug className="w-3 h-3 text-purple-400" /> Stress_Execution_Log
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-4">
              {running && (
                <div className="h-full flex flex-col items-center justify-center text-center py-12 text-purple-400/60">
                  <Loader2 className="w-10 h-10 animate-spin mb-4" />
                  <p className="text-[10px] uppercase tracking-[0.3em]">Executing_Pressure_Matrix...</p>
                </div>
              )}

              {!running && reports.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center py-12 text-white/10">
                  <Flame className="w-12 h-12 mb-3" />
                  <p className="text-[10px] uppercase tracking-[0.3em]">Awaiting_Provocateur_Trigger</p>
                </div>
              )}

              {!running && reports.map((report, idx) => (
                <div 
                  key={idx}
                  className={`p-4 rounded-lg border text-left space-y-2 transition-all ${
                    report.passed 
                      ? 'bg-green-500/5 border-green-500/20 text-green-400' 
                      : 'bg-red-500/5 border-red-500/20 text-red-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[10px] tracking-wider uppercase flex items-center gap-2">
                      {report.passed ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
                      {report.testName}
                    </span>
                    <Badge variant="outline" className={`text-[8px] ${report.passed ? 'border-green-500/30 text-green-400' : 'border-red-500/30 text-red-400'}`}>
                      {report.passed ? 'DEFENDED' : 'BREACHED'}
                    </Badge>
                  </div>
                  <p className="text-[9px] text-white/60 font-mono pl-6 leading-relaxed">
                    {report.details}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}