'use client';

import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { MainBrandLogo } from '@/app/logo';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = '/dashboard'; // Move to the Portal after success
    } catch (err: any) {
      setError('Vault Access Denied: Check credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center p-4">
      {/* Branding */}
      <div className="mb-8">
        <MainBrandLogo /> 
      </div>

      <form onSubmit={handleLogin} className="w-full max-w-md space-y-6">
        <h1 className="text-[#00A8E8] text-2xl font-bold text-center tracking-widest">
          SYSTEM ACCESS
        </h1>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="ADMIN EMAIL"
            className="w-full p-3 bg-black border border-[#00A8E8] text-white placeholder:text-gray-600 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="SECURITY KEY"
            className="w-full p-3 bg-black border border-[#00A8E8] text-white placeholder:text-gray-600 focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="text-red-500 text-sm text-center font-mono">{error}</p>}

        <button
          type="submit"
          className="w-full p-3 bg-[#00A8E8] text-black font-bold hover:bg-[#0077a3] transition-colors"
        >
          UNLOCK VAULT
        </button>
      </form>
    </div>
  );
}