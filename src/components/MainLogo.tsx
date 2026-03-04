import React from 'react';

// Expert Tip: Use a "Variant" prop to switch between Portal and Vault
interface LogoProps {
  variant?: 'portal' | 'vault';
  size?: number;
}

export const MainLogo = ({ variant = 'portal', size = 100 }: LogoProps) => {
  const color = "#00A8E8"; // Your Cyber Blue

  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
      {variant === 'portal' ? (
        <>
          <circle cx="100" cy="100" r="80" stroke={color} strokeWidth="12" />
          <circle cx="100" cy="100" r="55" stroke={color} strokeWidth="4" strokeDasharray="10 5" opacity="0.6" />
        </>
      ) : (
        <>
          <rect x="20" y="20" width="160" height="160" stroke={color} strokeWidth="12" rx="20" />
          <circle cx="100" cy="100" r="30" fill={color} />
        </>
      )}
      {/* The Keyhole - common to both */}
      <g fill={color}>
        <circle cx="100" cy="85" r="18" />
        <path d="M90 130 L110 130 L106 95 L94 95 Z" />
      </g>
    </svg>
  );
};