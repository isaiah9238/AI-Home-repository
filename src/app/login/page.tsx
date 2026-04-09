
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { VaultLogo } from '@/app/logo';
import { Lock, ChevronRight, Cpu, Loader2, AlertTriangle } from 'lucide-react';

function LoginContent() {
  const [loading, setLoading] = useState(false);
  const [timestamp, setTimestamp] = useState('');
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    const timer = setInterval(() => {
      setTimestamp(new Date().toISOString().replace('T', ' ').substring(0, 19));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      // trustHost in auth.ts ensures this fetch succeeds behind the workspace proxy
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      console.error("Login initialization failed:", error);
      setLoading(false);
    }
  };

  const getErrorMessage = (err: string) => {
    switch (err) {
      case "AccessDenied":
        return "UNAUTHORIZED_NODE: Your email is not on the Sovereign whitelist. Check ALLOWED_EMAILS in .env.";
      case "Configuration":
        return "SYSTEM_ERROR: Auth configuration mismatch. Verify AUTH_SECRET and Google OAuth keys in .env.";
      default:
        return `SIGNAL_INTERRUPTED: ${err}`;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 relative overflow-hidden font-mono text-blue-400">
      {/* Background HUD Layer */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full" 
             style={{ backgroundImage: 'linear-gradient(rgba(0, 168, 232, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 168, 232, 0.05) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
      </div>

      {/* Security Scanline */}
      <div className="absolute top-0 left-0 w-full h-1 bg-blue-500/20 shadow-[0_0_15px_rgba(0, 168, 232, 0.5)] animate-[scan_4s_linear_infinite] z-50 pointer-events-none" />

      {/* Main Branding */}
      <div className="mb-12 relative group animate-in fade-in zoom-in duration-1000">
        <div className="absolute inset-0 bg-blue-500/10 blur-[100px] rounded-full scale-150 animate-pulse" />
        <VaultLogo size={180} className="relative z-10 transition-all duration-700 group-hover:scale-110 group-hover:drop-shadow-[0_0_30px_rgba(0,168,232,0.4)]" />
      </div>

      {/* Access Terminal */}
      <div className="w-full max-w-md bg-black/60 border border-white/5 backdrop-blur-2xl p-10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] relative z-10">
        <div className="flex items-center justify-between mb-10">
          <div className="flex flex-col">
            <h1 className="text-white text-xl font-bold tracking-[0.2em] uppercase flex items-center gap-3">
              <Cpu className="w-5 h-5 text-blue-500" /> AUTH_NODE
            </h1>
            <span className="text-[9px] text-blue-500/40 uppercase tracking-widest mt-2">OAuth2_Sync_Ready</span>
          </div>
          <Lock className="w-4 h-4 text-blue-500/60" />
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3 animate-in slide-in-from-top-2 duration-500">
            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Access_Denied</span>
              <p className="text-[9px] text-red-400/80 leading-relaxed uppercase tracking-tighter">
                {getErrorMessage(error)}
              </p>
            </div>
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-5 bg-blue-600/10 border border-blue-500/30 hover:bg-blue-600 hover:text-white text-blue-400 font-bold tracking-wider uppercase transition-all duration-500 flex items-center justify-center gap-3 group relative overflow-hidden rounded-lg px-4"
        >
          {loading ? (
            <span className="flex items-center gap-3">
              <Loader2 className="w-4 h-4 animate-spin" /> AUTHORIZING...
            </span>
          ) : (
            <>
              <span className="truncate">SIGN IN WITH GOOGLE</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
            </>
          )}
        </button>

        <div className="mt-10 pt-6 border-t border-white/5 flex justify-between items-center opacity-40 text-[8px] uppercase tracking-[0.3em]">
          <span>Security: TLS_1.3</span>
          <span className="text-blue-500">{timestamp}</span>
          <span>V.4.2.0</span>
        </div>
      </div>

      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateY(-10vh); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(110vh); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050505] flex items-center justify-center font-mono text-blue-500/40 tracking-[0.5em] uppercase text-[10px]">
        Synchronizing_Node...
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
