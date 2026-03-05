import React from 'react';
import { VaultLogo, PortalLogo } from '@/app/logo';

interface LogoProps {
  variant?: 'portal' | 'vault';
  size?: number;
  className?: string;
}

/**
 * MainLogo Switchboard
 * Central component to toggle between the Vault (Security) and Portal (Dashboard) themes.
 */
export const MainLogo = ({ variant = 'portal', size = 100, className = "" }: LogoProps) => {
  if (variant === 'vault') {
    return <VaultLogo size={size} className={className} />;
  }
  return <PortalLogo size={size} className={className} />;
};
