"use client";

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrainCircuit, Code2, Flag, LayoutDashboard, BookOpen, BotMessageSquare } from 'lucide-react';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarContent, SidebarInset } from '@/components/ui/sidebar';

const FluxEchoIcon = (props: React.ComponentProps<'svg'>) => (
    <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
      {/* Animated Vortex Ring */}
      <circle
        cx="50" cy="50" r="40"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="15 10"
        className="animate-[spin_10s_linear_infinite] origin-center"
      />
      {/* The Echo Waves */}
      <path
        d="M30 50 Q40 30 50 50 T70 50"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M35 60 Q45 45 55 60 T75 60"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
);


export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menuItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/code-analyzer', label: 'Code Analyzer', icon: Code2 },
    { href: '/link-genie', label: 'Flux Echo', icon: FluxEchoIcon },
    { href: '/lesson-plans', label: 'Lesson Plans', icon: BookOpen },
    { href: '/mentorship', label: 'AI Mentor', icon: BotMessageSquare },
    { href: '/reports', label: 'Reports', icon: Flag },
  ];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <Link href="/" className="flex items-center gap-2">
            <BrainCircuit className="w-8 h-8 text-primary" />
            <h1 className="text-xl font-semibold font-headline">AI Home</h1>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/')}
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-4 border-b sticky top-0 bg-background/95 backdrop-blur z-10">
          <SidebarTrigger />
          {/* User menu can be added here */}
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
