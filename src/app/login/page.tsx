'use client';

import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { VaultLogo } from '@/app/logo';
import { Shield, Lock, Terminal, Activity, ChevronRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="min-h-screen bg-[#020202] flex flex-col items-center justify-center p-6 relative overflow-hidden font-mono">
      {/* Background Grid & Scanline */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#00A8E8 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent h-20 w-full animate-[scanline_10s_linear_infinite] pointer-events-none" />

      {/* Security Status HUD */}
      <div className="absolute top-8 left-8 hidden lg:flex flex-col gap-4 opacity-40">
        <div className="flex items-center gap-3 text-[10px] text-blue-400">
          <Activity className="w-3 h-3" /> NODE_STATUS: ENCRYPTED
        </div>
        <div className="flex items-center gap-3 text-[10px] text-green-400">
          <Shield className="w-3 h-3" /> FIREWALL: ACTIVE
        </div>
      </div>

      <div className="absolute top-8 right-8 hidden lg:block text-right opacity-40">
        <div className="text-[10px] text-blue-400 uppercase tracking-widest">System_Time</div>
        <div className="text-xs text-white/60">{timestamp}</div>
      </div>

      {/* Main Branding */}
      <div className="mb-12 relative group">
        <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <VaultLogo size={160} className="relative z-10 transition-transform duration-700 group-hover:scale-105" />
      </div>

      {/* Access Panel */}
      <div className="w-full max-w-md bg-black/40 border border-white/10 backdrop-blur-xl p-8 rounded-lg shadow-2xl relative z-10">
        <div className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col">
            <h1 className="text-blue-400 text-lg font-bold tracking-[0.3em] uppercase flex items-center gap-2">
              <Terminal className="w-4 h-4" /> System_Access
            </h1>
            <span className="text-[8px] text-white/20 uppercase tracking-widest mt-1">Level_01_Authorization_Required</span>
          </div>
          <Lock className="w-4 h-4 text-white/20" />
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="group relative">
              <input
                type="email"
                placeholder="ADMIN_IDENTITY"
                className="w-full p-4 bg-black/60 border border-white/10 text-blue-100 placeholder:text-white/10 focus:outline-none focus:border-blue-500/50 transition-all text-xs tracking-widest"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[8px] text-white/10 group-focus-within:text-blue-500/50">EMAIL_ID</div>
            </div>

            <div className="group relative">
              <input
                type="password"
                placeholder="SECURITY_CIPHER"
                className="w-full p-4 bg-black/60 border border-white/10 text-blue-100 placeholder:text-white/10 focus:outline-none focus:border-blue-500/50 transition-all text-xs tracking-widest"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[8px] text-white/10 group-focus-within:text-blue-500/50">CIPHER_KEY</div>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-900/20 border border-red-500/30 text-red-400 text-[10px] tracking-widest text-center animate-pulse">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900 text-white font-bold tracking-[0.4em] uppercase transition-all flex items-center justify-center gap-2 group overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
            {loading ? 'Decrypting...' : (
              <>
                Unlock_Vault <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center opacity-30">
          <span className="text-[8px] tracking-widest uppercase">Encryption: AES-256</span>
          <span className="text-[8px] tracking-widest uppercase">V.4.0.2</span>
        </div>
      </div>

      {/* Style for custom scanline animation */}
      <style jsx global>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(1000%); }
        }
      `}</style>
    </div>
  );
}
