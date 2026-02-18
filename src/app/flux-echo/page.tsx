'use client';

import { useActionState, type ComponentProps } from 'react';
import { useFormStatus } from 'react-dom';
import { EpitomizeUrl, type EpitomizeState } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Link as LinkIcon } from "lucide-react";


const FluxEchoIcon = ({ className = "w-10 h-10", ...props }: ComponentProps<'svg'>) => (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Animated Vortex Ring */}
      <circle
        cx="50" cy="50" r="40"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="15 10"
        className="animate-[spin_10s_linear_infinite] origin-center"
      />
      {/* The Echo Waves */}
      <path
        d="M30 50 Q40 30 50 50 T70 50"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M35 60 Q45 45 55 60 T75 60"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="bg-purple-600 hover:bg-purple-700">
            {pending ? <Loader2 className="animate-spin" /> : "Epitomize"}
        </Button>
    );
}

export default function FluxEchoPage() {
  const initialState: EpitomizeState = { message: "", data: null };
  const [state, formAction] = useActionState(EpitomizeUrl, initialState);

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Card className="bg-slate-900 border-slate-800 text-white">
        <CardHeader className="relative text-center pb-2">
        <div className="absolute left-6 top-6">
          <FluxEchoIcon className="w-10 h-10 text-purple-400 opacity-90" />
        </div>

        <div className="pt-2">
          <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
            FluxEcho
          </span>
          <CardTitle className="text-xl font-semibold mt-1">
            Intelligence in Motion
          </CardTitle>
          <p className="text-slate-400 text-sm mt-1">
            Capture, epitomize, and echo the magic of the web.
          </p>
        </div>
      </CardHeader>
        <CardContent className="space-y-4">
          <form action={formAction} className="flex gap-2">
            <div className="relative flex-1">
              <LinkIcon className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <Input
                name="url"
                placeholder="https://example.com/article"
                className="pl-10 bg-slate-800 border-slate-700 text-white"
                required
              />
            </div>
            <SubmitButton />
          </form>
          {state.data?.summary && (
            <div className="mt-6 p-4 bg-slate-800 rounded-lg border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
              <h3 className="text-purple-400 font-semibold mb-2">Flux Echo&apos;s Summary:</h3>
              <div className="text-slate-200 text-sm whitespace-pre-wrap leading-relaxed">
                {state.data.summary}
              </div>
            </div>
          )}
          {state.message && state.message !== 'Success' && (
             <div className="mt-4 p-3 bg-red-900/50 text-red-300 rounded-lg border border-red-700/50 text-sm">
                {state.message}
             </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
