import React from 'react';

export const PortalLogo = ({ size = 200, className = "" }: { size?: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 200 200" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <radialGradient id="portalGradient" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#00A8E8" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#4ade80" stopOpacity="0.1" />
      </radialGradient>
      <filter id="portalGlow">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    {/* Dynamic Background Pulse */}
    <circle cx="100" cy="100" r="90" fill="url(#portalGradient)" className="animate-pulse" opacity="0.2" />

    {/* Outer Orbitals */}
    <circle 
      cx="100" cy="100" r="80" 
      stroke="#00A8E8" strokeWidth="0.5" 
      strokeDasharray="10 20" 
      className="animate-[spin_30s_linear_infinite]" 
      opacity="0.3" 
    />
    <circle 
      cx="100" cy="100" r="70" 
      stroke="#4ade80" strokeWidth="0.5" 
      strokeDasharray="5 15" 
      className="animate-[spin_20s_linear_infinite_reverse]" 
      opacity="0.4" 
    />

    {/* Main Portal Frame */}
    <circle 
      cx="100" cy="100" r="55" 
      stroke="#00A8E8" strokeWidth="6" 
      fill="none" 
      opacity="0.9"
      filter="url(#portalGlow)"
    />
    
    <circle 
      cx="100" cy="100" r="45" 
      stroke="#4ade80" strokeWidth="1" 
      fill="none" 
      strokeDasharray="2 4"
      opacity="0.6"
    />

    {/* Central Intelligence Node */}
    <g filter="url(#portalGlow)">
      <circle cx="100" cy="95" r="12" fill="#00A8E8" />
      <path d="M92 125 L108 125 L104 105 L96 105 Z" fill="#00A8E8" />
      <circle cx="100" cy="95" r="4" fill="#fff" opacity="0.5" className="animate-pulse" />
    </g>
  </svg>
);
