import type {Metadata} from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import Link from 'next/link';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ThemeToggle } from '@/components/ThemeToggle';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

const metadataBase = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: {
    default: 'Rishi Mihir Popat | Personal Portfolio',
    template: '%s | Rishi Mihir Popat',
  },
  description: 'A modern, sleek personal portfolio website showcasing projects, skills, experience, and photography.',
  keywords: ['portfolio', 'data science', 'ai', 'developer', 'machine learning', 'projects'],
  authors: [{ name: 'Rishi Mihir Popat' }],
  openGraph: {
    title: 'Rishi Mihir Popat | Personal Portfolio',
    description: 'A modern, sleek personal portfolio website showcasing projects, skills, experience, and photography.',
    type: 'website',
    locale: 'en_US',
  },
  metadataBase: new URL(metadataBase),
  icons: {
    icon: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/profile.png`,
    shortcut: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/profile.png`,
    apple: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/profile.png`,
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col relative overflow-x-hidden">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} themes={['light', 'dark', 'colorful']}>
          <main className="flex-1 max-w-screen-2xl mx-auto w-full px-4 md:px-8 lg:px-10 py-12">
            {children}
          </main>
          {/* Floating Theme Toggle */}
          <div className="fixed bottom-6 right-6 z-50">
            <ThemeToggle />
          </div>
          {/* Admin panel quick link in footer */}
          <footer className="te-border-t py-8 mt-auto bg-bg/50 backdrop-blur-sm">
            <div className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="te-label">© {new Date().getFullYear()} All rights reserved.</p>
              <div className="flex items-center gap-6">
                <Link href="/admin" className="font-mono text-xs font-black uppercase text-neo-pink hover:underline">
                  SYSTEM_AUTH_PORT
                </Link>
                <p className="te-label flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent-orange animate-pulse"></span>
                  Rishi Mihir Popat
                </p>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
