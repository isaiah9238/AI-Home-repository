'use client';

import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { VaultLogo } from '@/app/logo';
import { Shield, Lock, Terminal, Activity, ChevronRight, Cpu, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timestamp, setTimestamp] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setTimestamp(new Date().toISOString().replace('T', ' ').substring(0, 19));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = '/'; 
    } catch (err: any) {
      setError('ACCESS_DENIED: CREDENTIAL_MISMATCH');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 relative overflow-hidden font-mono text-blue-400">
      {/* Background HUD Layer */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full" 
             style={{ backgroundImage: 'linear-gradient(rgba(0, 168, 232, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 168, 232, 0.05) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#050505_70%)]" />
      </div>

      {/* Security Scanline */}
      <div className="absolute top-0 left-0 w-full h-1 bg-blue-500/20 shadow-[0_0_15px_rgba(0,168,232,0.5)] animate-[scan_4s_linear_infinite] z-50 pointer-events-none" />

      {/* Top Left HUD: System Stats */}
      <div className="absolute top-10 left-10 hidden xl:flex flex-col gap-6 opacity-60">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em]">
            <Activity className="w-3 h-3 text-blue-500" /> Neural_Link: Active
          </div>
          <div className="w-32 h-1 bg-blue-900/30 rounded-full overflow-hidden">
            <div className="w-2/3 h-full bg-blue-500 animate-pulse" />
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em]">
            <Shield className="w-3 h-3 text-green-500" /> Firewall: Optimal
          </div>
          <div className="w-32 h-1 bg-green-900/30 rounded-full overflow-hidden">
            <div className="w-full h-full bg-green-500" />
          </div>
        </div>
      </div>

      {/* Top Right HUD: Metadata */}
      <div className="absolute top-10 right-10 hidden xl:block text-right opacity-60">
        <div className="text-[10px] uppercase tracking-[0.3em] mb-1">Authorization_Protocol</div>
        <div className="text-xs text-white/80 font-bold">{timestamp}</div>
        <div className="text-[8px] mt-2 text-blue-500/50">NODE_ID: STUDIO_CABINET_V4</div>
      </div>

      {/* Main Branding */}
      <div className="mb-12 relative group animate-in fade-in zoom-in duration-1000">
        <div className="absolute inset-0 bg-blue-500/10 blur-[100px] rounded-full scale-150 animate-pulse" />
        <VaultLogo size={180} className="relative z-10 transition-all duration-700 group-hover:scale-110 group-hover:drop-shadow-[0_0_30px_rgba(0,168,232,0.4)]" />
      </div>

      {/* Access Terminal */}
      <div className="w-full max-w-md bg-black/60 border border-white/5 backdrop-blur-2xl p-10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] relative z-10 animate-in slide-in-from-bottom-8 duration-700">
        <div className="absolute -top-px left-10 right-10 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
        <div className="absolute -bottom-px left-10 right-10 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
        
        <div className="flex items-center justify-between mb-10">
          <div className="flex flex-col">
            <h1 className="text-white text-xl font-bold tracking-[0.4em] uppercase flex items-center gap-3">
              <Cpu className="w-5 h-5 text-blue-500" /> AUTH_NODE
            </h1>
            <span className="text-[9px] text-blue-500/40 uppercase tracking-widest mt-2">Biometric_Sync_Required</span>
          </div>
          <div className="p-2 rounded-lg bg-blue-500/5 border border-blue-500/10">
            <Lock className="w-4 h-4 text-blue-500/60" />
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-8">
          <div className="space-y-5">
            <div className="group relative">
              <label className="absolute -top-2 left-3 px-2 bg-[#0a0a0a] text-[8px] text-blue-500/50 uppercase tracking-widest z-10">Admin_Identifier</label>
              <input
                type="email"
                placeholder="USER_NAME"
                className="w-full p-4 bg-black/40 border border-white/10 text-white placeholder:text-white/5 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all text-xs tracking-widest rounded-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="group relative">
              <label className="absolute -top-2 left-3 px-2 bg-[#0a0a0a] text-[8px] text-blue-500/50 uppercase tracking-widest z-10">Security_Cipher</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="PASSWORD"
                className="w-full p-4 bg-black/40 border border-white/10 text-white placeholder:text-white/5 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all text-xs tracking-widest rounded-lg pr-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-blue-400 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-500/5 border border-red-500/20 text-red-400 text-[9px] tracking-[0.2em] text-center uppercase animate-pulse rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-blue-600/10 border border-blue-500/30 hover:bg-blue-600 hover:text-white text-blue-400 font-bold tracking-[0.5em] uppercase transition-all duration-500 flex items-center justify-center gap-3 group relative overflow-hidden rounded-lg shadow-[0_0_20px_rgba(0,168,232,0.1)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
            {loading ? (
              <span className="flex items-center gap-3">
                <Loader2 className="w-4 h-4 animate-spin" /> DECRYPTING...
              </span>
            ) : (
              <>
                INITIALIZE_SYNC <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 pt-6 border-t border-white/5 flex justify-between items-center opacity-40 text-[8px] uppercase tracking-[0.3em]">
          <span>Security: TLS_1.3</span>
          <span className="text-blue-500">Node_Stable</span>
          <span>V.4.2.0</span>
        </div>
      </div>

      {/* Style for custom scan animation */}
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
