'use client';

import React, { useState } from 'react';
import { Sun, Moon, RefreshCcw, User, LayoutGrid, Zap, Origami, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';

interface NavbarProps {
  onNewSession: () => void;
}

export function Navbar({ onNewSession }: NavbarProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-black/40 backdrop-blur-2xl transition-colors duration-500">
      <div className="max-w-7xl mx-auto flex h-24 items-center justify-between px-6">
        <Link 
          href="/" 
          className="flex items-center gap-5 group"
        >
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 10 }}
            whileTap={{ scale: 0.95 }}
            className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-primary via-primary/80 to-blue-500 flex items-center justify-center border border-white/20 shadow-xl shadow-primary/20 transition-all duration-300"
          >
            <Origami className="w-7 h-7 text-white" />
          </motion.div>
          <div className="flex flex-col">
            <span className="text-2xl font-serif font-medium tracking-tight text-white leading-tight">Aura</span>
            <span className="text-[10px] font-mono font-bold tracking-[0.4em] uppercase text-primary -mt-1">Prestige</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-12">
          {[
            { name: 'Membership', href: '/pricing' },
            { name: 'Terms', href: '/terms' },
            { name: 'Privacy', href: '/privacy' }
          ].map((item) => (
            <Link 
              key={item.name}
              href={item.href} 
              className="relative text-[11px] font-sans font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-[0.2em] group py-2"
            >
              {item.name}
              <motion.span 
                className="absolute bottom-0 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full"
              />
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
            whileTap={{ scale: 0.95 }}
            onClick={onNewSession}
            className="hidden sm:flex items-center gap-3 rounded-full px-6 py-3 text-[10px] font-bold tracking-widest uppercase text-gray-300 transition-all border border-white/10"
          >
            <RefreshCcw className="h-4 w-4" />
            Reset
          </motion.button>
          
          <div className="h-8 w-px bg-white/10 mx-2 hidden lg:block" />

          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 rounded-full border border-white/10 p-1.5 pr-4 hover:bg-white/5 transition-all group"
              >
                {user.photoURL ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.photoURL} alt="Avatar" className="h-10 w-10 rounded-full object-cover border border-white/10 group-hover:border-primary/50 transition-all" />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border border-white/10">
                    <User className="h-5 h-5 text-primary" />
                  </div>
                )}
                <span className="hidden sm:inline text-[11px] font-bold text-gray-200 uppercase tracking-widest">{user.displayName || 'Architect'}</span>
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    className="absolute right-0 mt-4 w-60 rounded-3xl bg-[#0a0a0a] border border-white/10 p-3 shadow-2xl backdrop-blur-3xl overflow-hidden z-20"
                  >
                    <div className="px-4 py-4 border-b border-white/5 mb-3">
                      <p className="text-[10px] text-gray-500 uppercase font-mono tracking-widest leading-none mb-2">Member Status</p>
                      <p className="text-xs text-white truncate font-medium">{user.email}</p>
                    </div>
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-widest text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                    >
                      Disconnect session
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-8 py-3 rounded-full bg-white text-black font-bold text-[11px] uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-[0.98] shadow-lg shadow-white/5"
            >
              Entry
            </Link>
          )}

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ rotate: 180 }}
            onClick={toggleTheme}
            className="hidden lg:flex h-12 w-12 items-center justify-center rounded-full transition-colors hover:bg-white/10 text-gray-400"
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </motion.button>

          <button 
            className="lg:hidden h-12 w-12 flex items-center justify-center rounded-full border border-white/10 text-white hover:bg-white/5 transition-all"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-black/95 backdrop-blur-3xl border-b border-white/5 overflow-hidden"
          >
            <div className="px-6 py-10 space-y-8">
              {[
                { name: 'Membership', href: '/pricing' },
                { name: 'Terms & Service', href: '/terms' },
                { name: 'Privacy Policy', href: '/privacy' }
              ].map((item) => (
                <Link 
                  key={item.name}
                  href={item.href} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-2xl font-serif text-gray-400 hover:text-white transition-all italic"
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-8 border-t border-white/5 flex gap-4">
                 <button className="flex-1 py-4 bg-white/5 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-white border border-white/10" onClick={onNewSession}>Reset Session</button>
                 <button className="h-14 w-14 flex items-center justify-center rounded-2xl border border-white/10 text-gray-400" onClick={toggleTheme}>
                   {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                 </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
