'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from './button';
import { sendTerminalMessage, updateHomeBaseAction, getHomeBaseAction } from '@/app/actions';
import { Loader2, Terminal } from 'lucide-react';

interface TerminalMessage {
  role: 'user' | 'system';
  content: string;
}

export function AIChat() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<TerminalMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [profile, setProfile] = useState({
    name: 'ISAIAH_SMITH',
    age: '24',
    experiences: 'WEB_DEV',
    interests: 'NEXTJS_AI',
    expectations: 'HIGH',
    adaptive: 'ON'
  });

  useEffect(() => {
    async function syncProfile() {
      const homeBase = await getHomeBaseAction();
      if (homeBase) {
        setProfile(p => ({
          ...p,
          name: homeBase.name.toUpperCase().replace(/\s/g, '_'),
          interests: homeBase.interests.join('_').toUpperCase(),
          role: homeBase.role?.toUpperCase() || 'PRIMARY_USER'
        }));
      }
    }
    syncProfile();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

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

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const upperInput = userMessage.toUpperCase();
      if (upperInput.startsWith('SET ')) {
        const parts = upperInput.split(' ');
        const field = parts[1];
        const value = parts.slice(2).join(' ').replace(/_/g, ' ');

        let updateKey = '';
        if (field === 'NAME') updateKey = 'name';
        else if (field === 'INT') updateKey = 'interests';
        else if (field === 'EXP') updateKey = 'experiences';

        if (updateKey) {
          const updates = updateKey === 'interests' 
            ? { interests: value.split(' ') } 
            : { [updateKey]: value };
          
          const syncResult = await updateHomeBaseAction(updates);
          
          if (syncResult.success) {
            setProfile(p => ({ ...p, [field === 'NAME' ? 'name' : field === 'INT' ? 'interests' : 'experiences']: value.toUpperCase().replace(/\s/g, '_') }));
            setMessages(prev => [...prev, { role: 'system', content: `LIBRARIAN: Field [${field}] persisted to Home Base.` }]);
          } else {
            setMessages(prev => [...prev, { role: 'system', content: `ERROR: Librarian write failed.` }]);
          }
        } else {
          setMessages(prev => [...prev, { role: 'system', content: `SYSTEM: Local field [${field}] updated (Unmapped to Librarian).` }]);
        }
        
        setLoading(false);
        return;
      }

      const result = await sendTerminalMessage(userMessage);
      
      if (result.success) {
        setMessages(prev => [...prev, { role: 'system', content: result.response || 'NO_SIGNAL_RETURNED' }]);
      } else {
        setMessages(prev => [...prev, { role: 'system', content: `ERROR: ${result.error || "Failed to sync with the Cabinet."}` }]);
      }
    } catch (error: any) {
      console.error("Terminal Sync Error:", error);
      setMessages(prev => [...prev, { role: 'system', content: `CRITICAL_ERROR: ${error.message || "Failed to reach the Mentor."}` }]);
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
    <div className="w-full space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
      {/* Output Log */}
      <div 
        ref={scrollRef}
        className="p-4 border border-green-900/30 bg-black/80 rounded-md h-[200px] overflow-y-auto custom-scrollbar shadow-inner relative"
      >
        <div className="sticky top-0 right-0 flex items-center justify-between bg-black/40 backdrop-blur-sm px-2 py-1 mb-2 border-b border-green-900/10">
          <p className="text-green-600 font-mono text-[8px] uppercase tracking-widest flex items-center gap-2">
            <Terminal className="w-2 h-2" /> /sys/logs/output.bin
          </p>
          <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
        </div>
        
        <div className="space-y-3">
          {messages.length === 0 && !loading && (
            <div className="text-green-900 font-mono text-xs italic">&gt; Awaiting instruction...</div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`font-mono text-sm leading-relaxed ${msg.role === 'user' ? 'text-blue-400/80' : 'text-green-400'}`}>
              <span className="opacity-30 mr-2">{msg.role === 'user' ? '>' : '#'}</span>
              {msg.content}
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-green-400 font-mono text-sm animate-pulse">
              <span className="opacity-30 mr-2">#</span>
              <Loader2 className="w-3 h-3 animate-spin" /> Processing neural logic...
            </div>
          )}
        </div>
      </div>

      {/* Input Field */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          className="flex-1 bg-black border border-green-500/40 p-3 text-green-400 font-mono text-sm focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400/20 transition-all placeholder:text-green-900/50 rounded-sm"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="TYPE COMMAND OR USE KEYBOARD..."
          autoComplete="off"
        />
        <Button 
          type="submit" 
          disabled={loading}
          className="bg-green-600 hover:bg-green-500 text-black font-bold px-8 rounded-sm border-b-4 border-green-800 active:border-b-0 active:translate-y-1 transition-all uppercase tracking-widest text-xs"
        >
          EXEC
        </Button>
      </form>

      {/* Virtual Keyboard */}
      <div className="bg-white/[0.02] p-3 rounded border border-white/5 grid grid-cols-6 md:grid-cols-10 gap-1.5 shadow-2xl backdrop-blur-sm">
        {keys.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => handleKeyboardClick(key)}
            className={`
              p-2 font-mono text-[10px] rounded border transition-all active:scale-95 uppercase tracking-tighter
              ${key === 'ENTER' ? 'col-span-2 bg-green-900/40 text-green-400 border-green-700/50 hover:bg-green-800/40' : 
                key === 'BACK' ? 'bg-red-900/20 text-red-400 border-red-900/50 hover:bg-red-900/40' : 
                'bg-white/5 text-white/40 border-white/5 hover:bg-white/10 hover:text-white/80'}
            `}
          >
            {key}
          </button>
        ))}
      </div>

      {/* SYSTEM_PROFILE_STATE */}
      <div className="mt-6">
        <div className="bg-green-900/5 border border-green-900/20 p-4 rounded-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-1 bg-green-900/20 text-[7px] font-mono text-green-400/60 uppercase px-3 tracking-[0.2em] border-bl border-green-900/20">
            Node_Access: Stable
          </div>
          <h3 className="text-green-600/40 font-mono text-[10px] mb-4 uppercase tracking-[0.3em] font-bold border-b border-green-900/10 pb-2">Live_Neural_Registry</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4 font-mono">
            {[
              { id: '01', label: 'ID_NAME', val: profile.name },
              { id: '02', label: 'ID_AGE', val: profile.age },
              { id: '03', label: 'EXPERIENCES', val: profile.experiences },
              { id: '04', label: 'INTERESTS', val: profile.interests },
              { id: '05', label: 'EXPECTATIONS', val: profile.expectations },
              { id: '06', label: 'ADAPTIVE', val: profile.adaptive, status: true }
            ].map((item) => (
              <div key={item.id} className="flex flex-col space-y-1 group/item">
                <span className="text-[8px] text-green-900 uppercase tracking-widest group-hover/item:text-green-700 transition-colors">{item.id}.{item.label}</span>
                <span className={`text-xs truncate ${item.status ? (item.val === 'ON' ? 'text-green-400' : 'text-red-500') : 'text-green-400/70'}`}>
                  {item.status ? `[${item.val}]` : item.val}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-green-900/10 flex justify-between items-center text-[8px] font-mono text-green-900/40 italic uppercase tracking-wider">
            <span>* Persist with &quot;SET [FIELD] [VALUE]&quot;</span>
            <span className="flex items-center gap-2">
              <div className="w-1 h-1 bg-green-500/20 rounded-full animate-ping" />
              Monitoring_Stream
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
