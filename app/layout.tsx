import type {Metadata} from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import Link from 'next/link';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ThemeToggle } from '@/components/ThemeToggle';
import { MobileMenu } from '@/components/MobileMenu';
import { InteractiveBackground } from '@/components/InteractiveBackground';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: {
    default: 'Slayr | Personal Portfolio',
    template: '%s | Slayr',
  },
  description: 'A modern, sleek personal portfolio website showcasing projects, skills, experience, and photography.',
  keywords: ['portfolio', 'developer', 'software engineer', 'projects', 'blog', 'photography'],
  authors: [{ name: 'Slayr' }],
  openGraph: {
    title: 'Slayr | Personal Portfolio',
    description: 'A modern, sleek personal portfolio website showcasing projects, skills, experience, and photography.',
    type: 'website',
    locale: 'en_US',
  },
  metadataBase: new URL('https://slayr.github.io'),
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col relative overflow-x-hidden">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <InteractiveBackground />
          <header className="sticky top-0 z-50 bg-bg/80 backdrop-blur-md te-border-b">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
              <Link href="/" className="font-sans font-bold tracking-tighter text-xl">
                Portfolio<span className="text-accent">.</span>
              </Link>
              <nav className="hidden md:flex items-center gap-8">
                {[
                  { name: 'Projects', path: '/projects' },
                  { name: 'Skills', path: '/skills' },
                  { name: 'Experience', path: '/experience' },
                  { name: 'Education', path: '/education' },
                  { name: 'Blog', path: '/blog' },
                  { name: 'Photography', path: '/photography' },
                  { name: 'Contact', path: '/contact' },
                ].map((item) => (
                  <Link 
                    key={item.name} 
                    href={item.path}
                    className="text-sm font-medium text-ink/70 hover:text-ink transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <Link href="/admin" className="te-button hidden md:inline-flex">
                  Admin
                </Link>
                <MobileMenu />
              </div>
            </div>
          </header>
          <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-12">
            {children}
          </main>
          <footer className="te-border-t py-8 mt-auto bg-bg/50 backdrop-blur-sm">
            <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="te-label">© {new Date().getFullYear()} All rights reserved.</p>
              <p className="te-label flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                System Online
              </p>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
