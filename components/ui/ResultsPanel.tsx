'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Info, Save, Check, Download, Layers } from 'lucide-react';

interface ResultsPanelProps {
  original: string | null;
  generated: string | null;
  isGenerating: boolean;
  styleDescription?: string;
  onSave?: () => void;
  isSaving?: boolean;
  saveSuccess?: boolean;
}

export function ResultsPanel({ 
  original, 
  generated, 
  isGenerating, 
  styleDescription,
  onSave,
  isSaving,
  saveSuccess
}: ResultsPanelProps) {
  return (
    <div className="mx-auto w-full space-y-16">
      <div className="grid gap-12 lg:grid-cols-2">
        {/* Original */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="group relative overflow-hidden rounded-[3rem] border border-white/5 bg-white/[0.02] shadow-2xl transition-all hover:border-white/20"
        >
          <div className="absolute top-8 left-8 z-10">
            <span className="rounded-full bg-black/60 px-5 py-2 text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-white backdrop-blur-xl border border-white/10">
              01 Base Reference
            </span>
          </div>
          <div className="aspect-[16/10] w-full overflow-hidden">
            {original ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={original} alt="Original room" className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105 grayscale-[0.2]" />
            ) : (
              <div className="h-full w-full bg-white/5 flex items-center justify-center">
                 <div className="w-16 h-1 w-full max-w-[100px] bg-white/10 rounded-full" />
              </div>
            )}
          </div>
        </motion.div>

        {/* Generated */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="group relative overflow-hidden rounded-[3rem] border border-primary/20 bg-white/[0.02] shadow-3xl transition-all hover:border-primary/40"
        >
          <div className="absolute top-8 left-8 z-20 flex items-center justify-between w-[calc(100%-4rem)]">
            <span className="flex items-center gap-3 rounded-full bg-primary/20 px-5 py-2 text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-primary backdrop-blur-xl border border-primary/30">
              <Sparkles size={14} className="fill-primary" /> 02 Vision Render
            </span>
            
            {generated && !isGenerating && (
              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(var(--primary-rgb), 1)', color: 'white' }}
                whileTap={{ scale: 0.9 }}
                onClick={onSave}
                disabled={isSaving}
                className={`
                  flex items-center gap-2 rounded-full p-3 transition-all
                  ${saveSuccess 
                    ? 'bg-green-500 text-white border-green-500 shadow-lg shadow-green-500/20' 
                    : 'bg-white/10 text-white border-white/10 hover:border-primary/50'
                  }
                  border disabled:opacity-50
                `}
              >
                {saveSuccess ? <Check size={20} /> : <Download size={20} />}
              </motion.button>
            )}
          </div>
          
          <div className="aspect-[16/10] w-full overflow-hidden relative">
            {isGenerating ? (
              <div className="absolute inset-0 bg-[#0a0a0a] flex flex-col items-center justify-center gap-10">
                <div className="relative">
                   <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="w-24 h-24 rounded-full border-t-2 border-primary border-r-2 border-primary/20 shadow-[0_0_40px_rgba(var(--primary-rgb),0.2)]"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                     <Layers className="text-primary/40" size={24} />
                  </div>
                </div>
                <div className="space-y-6 text-center max-w-[200px]">
                  <p className="text-[10px] font-mono tracking-[0.4em] uppercase text-primary animate-pulse">Forging Neural Context</p>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ x: [-200, 200] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      className="h-full w-24 bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"
                    />
                  </div>
                </div>
              </div>
            ) : generated ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={generated} alt="Reimagined room" className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110" />
            ) : (
              <div className="h-full w-full bg-white/5 flex flex-col items-center justify-center text-center p-12 transition-opacity duration-1000">
                <div className="w-16 h-px bg-white/10 mb-8" />
                <p className="text-sm text-gray-600 font-mono tracking-[0.2em] uppercase italic">Awaiting Evolution</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Curator Intelligence */}
      {styleDescription && !isGenerating && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-[3rem] blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
          <div className="relative rounded-[3rem] border border-white/5 bg-white/[0.03] p-12 backdrop-blur-3xl overflow-hidden">
            <div className="flex flex-col md:flex-row gap-12 items-start relative z-10">
              <div className="shrink-0">
                <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary shadow-xl shadow-primary/10 border border-primary/20">
                  <Info size={32} />
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                   <h3 className="text-xs font-mono font-bold uppercase tracking-[0.4em] text-primary">Architectural Logic</h3>
                   <div className="h-px flex-1 bg-white/5" />
                </div>
                <p className="text-2xl md:text-3xl font-serif text-gray-200 leading-tight italic max-w-4xl">
                  &ldquo;{styleDescription}&rdquo;
                </p>
              </div>
            </div>
            
            {/* Subtle Texture */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
          </div>
        </motion.div>
      )}
    </div>
  );
}
