'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { resolveGem } from '@/app/actions';
import { Check, XCircle, Loader2 } from 'lucide-react';

interface GemActionsProps {
  gemId: string;
  status: string;
}

export function GemActions({ gemId, status }: GemActionsProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleResolve = async (resolution: 'resolved' | 'dismissed') => {
    setLoading(resolution);
    await resolveGem(gemId, resolution);
    setLoading(null);
  };

  if (status !== 'pending') {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        size="icon"
        variant="ghost"
        className="h-7 w-7 text-green-500/50 hover:text-green-500 hover:bg-green-500/10"
        onClick={() => handleResolve('resolved')}
        disabled={!!loading}
      >
        {loading === 'resolved' ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <Check className="h-3 w-3" />
        )}
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className="h-7 w-7 text-red-500/50 hover:text-red-500 hover:bg-red-500/10"
        onClick={() => handleResolve('dismissed')}
        disabled={!!loading}
      >
        {loading === 'dismissed' ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <XCircle className="h-3 w-3" />
        )}
      </Button>
    </div>
  );
}
