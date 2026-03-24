import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <p className="te-label mb-4 text-accent tracking-[0.3em]">ERROR</p>
      <h1 className="text-[20vw] md:text-[12vw] font-black tracking-tighter leading-none mb-4">404</h1>
      <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
      <p className="text-ink/60 mb-8 max-w-md">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/" className="te-button te-button-accent flex items-center gap-2">
        <Home size={18} />
        Return Home
      </Link>
    </div>
  );
}
