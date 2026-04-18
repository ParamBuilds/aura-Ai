'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Info, Save, Check } from 'lucide-react';

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
    <div className="mx-auto w-full max-w-6xl space-y-8 p-4">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-xl font-bold tracking-tight">Design Preview</h2>
        {generated && !isGenerating && (
          <button
            onClick={onSave}
            disabled={isSaving}
            className={`
              flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all
              ${saveSuccess 
                ? 'bg-green-600 text-white' 
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
              }
              disabled:opacity-50
            `}
          >
            {saveSuccess ? <Check size={14} /> : <Save size={14} />}
            {saveSuccess ? 'Saved' : isSaving ? 'Saving...' : 'Save Design'}
          </button>
        )}
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Original */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-lg"
        >
          <div className="absolute top-4 left-4 z-10">
            <span className="rounded-full bg-background/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border border-border/40">
              Original
            </span>
          </div>
          {original ? (
            <img src={original} alt="Original room" className="aspect-[4/3] w-full object-cover sm:aspect-video" />
          ) : (
            <div className="aspect-[4/3] w-full animate-pulse bg-muted sm:aspect-video" />
          )}
        </motion.div>

        {/* Generated */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-lg"
        >
          <div className="absolute top-4 left-4 z-10">
            <span className="flex items-center gap-1.5 rounded-full bg-primary/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground backdrop-blur-md shadow-sm">
              <Sparkles size={10} /> After
            </span>
          </div>
          
          {isGenerating ? (
            <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-video">
              <div className="absolute inset-0 animate-pulse bg-muted">
                <div className="h-full w-full bg-gradient-to-r from-transparent via-background/20 to-transparent animate-shimmer" 
                     style={{ backgroundSize: '200% 100%', animation: 'shimmer 2s infinite' }} />
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <Sparkles className="h-8 w-8 animate-spin text-primary opacity-20" />
                <p className="text-xs font-medium text-muted-foreground">Rendering Atmosphere...</p>
              </div>
            </div>
          ) : generated ? (
            <img src={generated} alt="Reimagined room" className="aspect-[4/3] w-full object-cover sm:aspect-video" />
          ) : (
            <div className="aspect-[4/3] w-full bg-muted/20 sm:aspect-video flex items-center justify-center">
              <p className="text-xs text-muted-foreground uppercase tracking-widest italic opacity-50">Pending Vision</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* AI Insights */}
      {styleDescription && !isGenerating && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm"
        >
          <div className="mb-4 flex items-center gap-2 text-primary">
            <Info size={18} />
            <h3 className="text-sm font-bold uppercase tracking-tight">AI Design Insights</h3>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {styleDescription}
          </p>
        </motion.div>
      )}

      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite linear;
        }
      `}</style>
    </div>
  );
}
