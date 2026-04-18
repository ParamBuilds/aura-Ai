'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon, RefreshCcw } from 'lucide-react';
import { motion } from 'motion/react';

interface NavbarProps {
  onNewSession: () => void;
}

export function Navbar({ onNewSession }: NavbarProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  React.useLayoutEffect(() => {
    const savedTheme = localStorage.getItem('aura-theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('aura-theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold tracking-tight text-foreground">Aura Home</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNewSession}
            className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <RefreshCcw className="h-4 w-4" />
            <span className="hidden sm:inline">New Session</span>
          </button>
          
          <button
            onClick={toggleTheme}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            {theme === 'light' ? (
              <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
            ) : (
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
            )}
            <span className="sr-only">Toggle theme</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
