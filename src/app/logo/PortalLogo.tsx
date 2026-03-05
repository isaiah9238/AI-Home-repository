import React from 'react';

export const PortalLogo = ({ size = 200, className = "" }: { size?: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 200 200" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Floating Data Rings */}
    <circle 
      cx="100" cy="100" r="85" 
      stroke="#00A8E8" strokeWidth="1" 
      strokeDasharray="20 10" 
      className="animate-[spin_20s_linear_infinite]" 
      opacity="0.2" 
    />
    <circle 
      cx="100" cy="100" r="75" 
      stroke="#4ade80" strokeWidth="1" 
      strokeDasharray="10 5" 
      className="animate-[spin_15s_linear_infinite_reverse]" 
      opacity="0.3" 
    />

    {/* The Portal Core */}
    <circle cx="100" cy="100" r="60" stroke="#00A8E8" strokeWidth="10" fill="none" />
    <circle cx="100" cy="100" r="45" stroke="#00A8E8" strokeWidth="2" strokeDasharray="5 5" opacity="0.6" />

    {/* Central Pulsing Keyhole */}
    <g fill="#00A8E8">
      <circle cx="100" cy="90" r="14" />
      <path d="M92 125 L108 125 L104 100 L96 100 Z" />
    </g>
    
    {/* Internal Glow Effect */}
    <circle cx="100" cy="100" r="30" fill="url(#portalGlow)" opacity="0.4" />
    <defs>
      <radialGradient id="portalGlow">
        <stop offset="0%" stopColor="#00A8E8" />
        <stop offset="100%" stopColor="transparent" />
      </radialGradient>
    </defs>
  </svg>
);
