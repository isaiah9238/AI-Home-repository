"use client";

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Code2, BookOpen, BotMessageSquare, Flag, Cpu } from 'lucide-react';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarContent, SidebarInset } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const FluxEchoIcon = (props: React.ComponentProps<'svg'>) => (
    <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
      <circle
        cx="50" cy="50" r="40"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="15 10"
        className="animate-[spin_10s_linear_infinite] origin-center"
      />
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

  // Hide the shell completely on the login page
  if (pathname === '/login') {
    return <>{children}</>;
  }

  const menuItems = [
    { 
      href: '/', 
      label: 'Dashboard', 
      icon: LayoutDashboard, 
      color: 'text-blue-400',
      description: 'System_Core'
    },
    { 
      href: '/code-analyzer', 
      label: 'Code Analyzer', 
      icon: Code2, 
      color: 'text-purple-400',
      description: 'Architect_Domain'
    },
    { 
      href: '/flux-echo', 
      label: 'Flux Echo', 
      icon: FluxEchoIcon, 
      color: 'text-blue-400',
      description: 'Research_Scout'
    },
    { 
      href: '/lesson-plans', 
      label: 'Lesson Plans', 
      icon: BookOpen, 
      color: 'text-green-400',
      description: 'Discovery_Tutor'
    },
    { 
      href: '/mentorship', 
      label: 'AI Mentor', 
      icon: BotMessageSquare, 
      color: 'text-orange-400',
      description: 'Technical_Mentor'
    },
    { 
      href: '/reports', 
      label: 'Reports', 
      icon: Flag, 
      color: 'text-red-400',
      description: 'Safety_Ledger'
    },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#050505] font-mono">
        <Sidebar collapsible="icon" className="border-r border-white/5">
          <SidebarHeader className="p-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="p-2 rounded bg-blue-500/10 border border-blue-500/20 group-hover:border-blue-500/40 transition-all">
                <Cpu className="w-5 h-5 text-blue-500" />
              </div>
              <h1 className="text-xs font-bold tracking-[0.4em] uppercase text-white/80 group-hover:text-white transition-colors overflow-hidden whitespace-nowrap">
                The_Cabinet
              </h1>
            </Link>
          </SidebarHeader>
          <SidebarContent className="px-2">
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/')}
                    tooltip={item.label}
                    className="h-12 transition-all hover:bg-white/5"
                  >
                    <Link href={item.href} className="flex items-center gap-3">
                      <item.icon className={cn("w-4 h-4 shrink-0 transition-colors", item.color)} />
                      <div className="flex flex-col min-w-0">
                        <span className={cn("text-[10px] font-bold uppercase tracking-widest transition-colors", item.color)}>
                          {item.label}
                        </span>
                        <span className="text-[7px] text-white/20 uppercase tracking-[0.2em] group-hover:text-white/40">
                          {item.description}
                        </span>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarInset className="bg-transparent border-0">
          <header className="flex h-14 items-center gap-4 px-6 border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0 z-30">
            <SidebarTrigger />
            <div className="h-4 w-px bg-white/5" />
            <div className="text-[10px] text-white/30 uppercase tracking-[0.3em] hidden sm:block">
              Neural_Path: <span className="text-white/60">{pathname === '/' ? 'ROOT' : pathname.toUpperCase().slice(1).replace('-', '_')}</span>
            </div>
          </header>
          <main className="flex-1 relative">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
