import React from 'react';

export const PortalLogo = () => {
  return (
    <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      {/* The Background */}
      <rect width="200" height="200" fill="transparent" />
      
      {/* THE PORTAL: Note 'strokeWidth' (No Dash!) */}
      <circle cx="100" cy="100" r="80" stroke="#00A8E8" strokeWidth="12" fill="none" />
      
      {/* THE INNER RING: Note 'strokeDasharray' (CamelCase!) */}
      <circle cx="100" cy="100" r="55" stroke="#00A8E8" strokeWidth="4" strokeDasharray="10 5" opacity="0.6" />

      {/* THE KEYHOLE */}
      <g fill="#00A8E8">
        <circle cx="100" cy="85" r="18" />
        <path d="M90 130 L110 130 L106 95 L94 95 Z" />
      </g>
    </svg>
  );
};
