'use client';

import { useMemo } from 'react';
import { Area, AreaChart, ResponsiveContainer, YAxis } from 'recharts';

// The Interface: Tells TypeScript what data this component expects
interface ProbabilityWaveProps {
  temperature: number;
}

// The Export: Makes it available to the rest of your app
export function ProbabilityWave({ temperature }: ProbabilityWaveProps) {
  const data = useMemo(() => {
    const points = [];
    // We calculate a Bell Curve (Gaussian Distribution)
    // Higher temp = wider curve = more randomness
    const sigma = Math.max(0.2, temperature * 1.5); 
    
    for (let x = -4; x <= 4; x += 0.4) {
      const probability = Math.exp(-Math.pow(x, 2) / (2 * Math.pow(sigma, 2)));
      points.push({ x, probability });
    }
    return points;
  }, [temperature]);

  return (
    <div className="h-20 w-full mt-2 mb-2 opacity-60 pointer-events-none">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="waveFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="probability"
            stroke="#a855f7"
            strokeWidth={1}
            fill="url(#waveFill)"
            isAnimationActive={false} // Faster performance during slider dragging
          />
          {/* Hide axes for a clean "HUD" look */}
          <YAxis hide domain={[0, 1]} /> 
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}