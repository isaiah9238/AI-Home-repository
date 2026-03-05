import React from 'react';

export const VaultLogo = ({ size = 200, className = "" }: { size?: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 200 200" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Outer Hexagon Shield */}
    <path 
      d="M100 20 L170 50 L170 150 L100 180 L30 150 L30 50 Z" 
      fill="none" 
      stroke="#00A8E8" 
      strokeWidth="4" 
      opacity="0.3"
    />
    
    {/* Main Circular Frame */}
    <circle cx="100" cy="100" r="70" stroke="#00A8E8" strokeWidth="8" fill="none" />
    <circle cx="100" cy="100" r="78" stroke="#00A8E8" strokeWidth="1" strokeDasharray="4 8" opacity="0.5" />

    {/* The Keyhole Core */}
    <g fill="#00A8E8">
      <circle cx="100" cy="85" r="18" className="animate-pulse" />
      <path d="M90 130 L110 130 L106 95 L94 95 Z" />
    </g>

    {/* Decorative Security Notches */}
    <rect x="98" y="25" width="4" height="15" fill="#00A8E8" opacity="0.8" />
    <rect x="98" y="160" width="4" height="15" fill="#00A8E8" opacity="0.8" />
    <rect x="25" y="98" width="15" height="4" fill="#00A8E8" opacity="0.8" />
    <rect x="160" y="98" width="15" height="4" fill="#00A8E8" opacity="0.8" />
  </svg>
);
