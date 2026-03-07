import React from 'react';

export const VaultLogo = ({ size = 200, className = "" }: { size?: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 200 200" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="vaultGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00A8E8" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#00A8E8" stopOpacity="0.2" />
      </linearGradient>
      <filter id="vaultGlow">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    {/* Outer Shield - Hexagon */}
    <path 
      d="M100 20 L175 60 L175 140 L100 180 L25 140 L25 60 Z" 
      fill="none" 
      stroke="url(#vaultGradient)" 
      strokeWidth="2" 
      className="animate-pulse"
    />
    
    {/* Inner Circular Vault Door */}
    <circle 
      cx="100" 
      cy="100" 
      r="65" 
      stroke="#00A8E8" 
      strokeWidth="1" 
      fill="none" 
      strokeDasharray="4 4" 
      opacity="0.4"
    />
    
    <circle 
      cx="100" 
      cy="100" 
      r="55" 
      stroke="#00A8E8" 
      strokeWidth="8" 
      fill="none" 
      opacity="0.8"
      filter="url(#vaultGlow)"
    />

    {/* The Lock Core */}
    <g fill="#00A8E8" filter="url(#vaultGlow)">
      <circle cx="100" cy="85" r="15" />
      <path d="M90 125 L110 125 L105 95 L95 95 Z" />
    </g>

    {/* Rotating Security Ring */}
    <circle 
      cx="100" 
      cy="100" 
      r="75" 
      stroke="#00A8E8" 
      strokeWidth="1" 
      fill="none" 
      strokeDasharray="20 40" 
      className="animate-[spin_10s_linear_infinite]"
      opacity="0.3"
    />
  </svg>
);
