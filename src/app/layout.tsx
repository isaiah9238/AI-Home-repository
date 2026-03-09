import type {Metadata} from 'next';
import './globals.css';
import { AppShell } from '@/components/app-shell';
import { Toaster } from '@/components/ui/toaster';
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: 'AI Home',
  description: 'Build your own Generative AI from the beginning.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}