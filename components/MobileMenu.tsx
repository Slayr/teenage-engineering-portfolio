'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const navItems = [
  { name: 'Projects', path: '/projects' },
  { name: 'Skills', path: '/skills' },
  { name: 'Experience', path: '/experience' },
  { name: 'Education', path: '/education' },
  { name: 'Blog', path: '/blog' },
  { name: 'Photography', path: '/photography' },
  { name: 'Contact', path: '/contact' },
  { name: 'Admin', path: '/admin' },
];

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <div className="md:hidden">
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 text-ink/70 hover:text-ink transition-colors"
        aria-label="Open menu"
      >
        <Menu size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[99] bg-black/50"
              onClick={() => setIsOpen(false)}
            />
            {/* Sliding menu panel */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-0 z-[100] bg-bg flex flex-col p-6"
            >
              <div className="flex items-center justify-between mb-12">
                <Link 
                  href="/" 
                  className="font-sans font-bold tracking-tighter text-xl"
                  onClick={() => setIsOpen(false)}
                >
                  Portfolio<span className="text-accent">.</span>
                </Link>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-ink/70 hover:text-ink transition-colors"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>

              <nav className="flex flex-col gap-6">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link 
                      href={item.path}
                      className="text-4xl font-black tracking-tighter uppercase hover:text-accent transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="mt-auto pt-8 te-border-t">
                <p className="te-label">© {new Date().getFullYear()} Slayr</p>
                <p className="te-label flex items-center gap-2 mt-2">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                  System Online
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
