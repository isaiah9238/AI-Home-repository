'use client';

import { useState } from 'react';
import { model } from '@/lib/firebase';
import { Card, CardContent } from './card';
import { Button } from './button';

export function AIChat() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Profile state for terminal variables
  const [profile, setProfile] = useState({
    name: 'ISAIAH_SMITH',
    age: '24',
    experiences: 'WEB_DEV',
    interests: 'NEXTJS_AI',
    expectations: 'HIGH',
    adaptive: 'ON'
  });

  const handleKeyboardClick = (key: string) => {
    if (key === 'BACK') {
      setInput(prev => prev.slice(0, -1));
    } else if (key === 'SPACE') {
      setInput(prev => prev + ' ');
    } else if (key === 'ENTER') {
      handleSubmit();
    } else {
      setInput(prev => prev + key);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    try {
      // Check for custom "SET" commands for local state
      const upperInput = input.toUpperCase().trim();
      if (upperInput.startsWith('SET ')) {
        const parts = upperInput.split(' ');
        const field = parts[1];
        const value = parts.slice(2).join('_');

        if (field === 'NAME') setProfile(p => ({ ...p, name: value }));
        else if (field === 'AGE') setProfile(p => ({ ...p, age: value }));
        else if (field === 'EXP') setProfile(p => ({ ...p, experiences: value }));
        else if (field === 'INT') setProfile(p => ({ ...p, interests: value }));
        else if (field === 'EXPECT') setProfile(p => ({ ...p, expectations: value }));
        else if (field === 'ADAPT') setProfile(p => ({ ...p, adaptive: value }));

        setResponse(`SYSTEM: Local field [${field}] updated successfully.`);
        setInput('');
        setLoading(false);
        return;
      }

      const result = await model.generateContent(input);
      setResponse(result.response.text());
      setInput('');
    } catch (error: any) {
      console.error("AI Error:", error);
      setResponse(`Error: ${error.message || "Failed to connect to Gemini."}`);
    } finally {
      setLoading(false);
    }
  };

  const keys = [
    'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
    'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L',
    'Z', 'X', 'C', 'V', 'B', 'N', 'M', ' ', '.', '_',
    'BACK', 'SPACE', 'ENTER'
  ];

  return (
    <div className="w-full space-y-4">
      {/* Output Log */}
      <div className="p-4 border border-green-900 bg-black rounded-md min-h-[120px] shadow-inner">
        <p className="text-green-600 font-mono text-[10px] mb-2 opacity-50 uppercase tracking-tighter">/sys/logs/output.bin</p>
        <div className="text-green-400 font-mono text-sm whitespace-pre-wrap">
          {loading ? "> Processing vector data..." : response || "> Awaiting instruction..."}
        </div>
      </div>

      {/* Input Field */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          className="flex-1 bg-black border border-green-500 p-3 text-green-400 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-green-400 transition-all placeholder:text-green-900"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="TYPE COMMAND OR USE KEYBOARD..."
        />
        <Button 
          type="submit" 
          disabled={loading}
          className="bg-green-600 hover:bg-green-500 text-black font-bold px-8 rounded-none border-b-4 border-green-800 active:border-b-0 active:translate-y-1 transition-all"
        >
          EXEC
        </Button>
      </form>

      {/* Virtual Keyboard */}
      <div className="bg-gray-800/50 p-3 rounded border border-gray-700 grid grid-cols-6 md:grid-cols-10 gap-1.5 shadow-2xl">
        {keys.map((key) => (
          <button
            key={key}
            onClick={() => handleKeyboardClick(key)}
            className={`
              p-2 font-mono text-xs rounded border transition-all active:scale-95
              ${key === 'ENTER' ? 'col-span-2 bg-green-900 text-green-400 border-green-700 hover:bg-green-800' : 
                key === 'BACK' ? 'bg-red-900/20 text-red-400 border-red-900/50 hover:bg-red-900/40' : 
                'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600 hover:text-white'}
            `}
          >
            {key}
          </button>
        ))}
      </div>

      {/* SYSTEM_PROFILE_STATE (Moved here from Sidebar) */}
      <div className="mt-6">
        <div className="bg-green-900/10 border border-green-900 p-4 rounded-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-1 bg-green-900 text-[8px] font-mono text-green-300 uppercase px-2">
            Status: Active
          </div>
          <h3 className="text-green-600 font-mono text-xs mb-4 uppercase tracking-[0.2em] font-bold">System_Core_Profile</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4 font-mono">
            <div className="flex flex-col space-y-1">
              <span className="text-[10px] text-green-800 uppercase">01.ID_NAME</span>
              <span className="text-sm text-green-400 truncate">{profile.name}</span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-[10px] text-green-800 uppercase">02.ID_AGE</span>
              <span className="text-sm text-green-400">{profile.age}</span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-[10px] text-green-800 uppercase">03.EXPERIENCES</span>
              <span className="text-sm text-green-400 truncate">{profile.experiences}</span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-[10px] text-green-800 uppercase">04.INTERESTS</span>
              <span className="text-sm text-green-400 truncate">{profile.interests}</span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-[10px] text-green-800 uppercase">05.EXPECTATIONS</span>
              <span className="text-sm text-green-400">{profile.expectations}</span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-[10px] text-green-800 uppercase">06.ADAPTIVE_MODE</span>
              <span className={`text-sm ${profile.adaptive === 'ON' ? 'text-green-400' : 'text-red-500'}`}>
                [{profile.adaptive}]
              </span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-green-900/30 flex justify-between items-center text-[10px] font-mono text-green-900 italic">
            <span>* Use "SET [FIELD] [VALUE]" to update profile metrics.</span>
            <span className="animate-pulse">_LISTENING_</span>
          </div>
        </div>
      </div>
    </div>
  );
}
