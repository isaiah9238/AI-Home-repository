'use client';

import { useState } from 'react';
import { model } from '@/lib/firebase';

export function AIChat() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    try {
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

  return (
    <div className="w-full space-y-4">
      <div className="p-4 border-2 border-green-900 bg-black rounded-md min-h-[150px]">
        <p className="text-green-500 font-mono text-sm mb-2">/output/response.log</p>
        <div className="text-green-300 font-mono text-sm whitespace-pre-wrap">
          {loading ? "System: Processing query..." : response || "Waiting for input..."}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          className="flex-1 bg-black border border-green-400 p-2 text-green-400 font-mono focus:outline-none focus:ring-1 focus:ring-green-400"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter command..."
        />
        <button 
          type="submit" 
          disabled={loading}
          className="bg-green-600 hover:bg-green-500 text-black font-bold px-6 py-2 rounded disabled:bg-gray-700"
        >
          EXEC
        </button>
      </form>
    </div>
  );
}