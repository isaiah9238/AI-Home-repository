// 1. Add the ReactNode import
import React, { ReactNode } from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/app-shell';
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: 'AI Home',
  description: 'Build your own Generative AI from the beginning.',
};

// 2. Define the interface for props
interface RootLayoutProps {
  children: ReactNode;
}

// 3. Use the interface here
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="bg-black text-white selection:bg-blue-500/30">
        <Providers>
          <AppShell>
            {children}
          </AppShell>
        </Providers>
      </body>
    </html>
  );
}