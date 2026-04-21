'use client';

import React from 'react';
import { motion } from 'motion/react';
import { STYLES } from '@/components/StyleSelector';

interface StylePickerProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

export function StylePicker({ selectedId, onSelect }: StylePickerProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {STYLES.map((style) => {
        const isActive = selectedId === style.id;
        return (
          <motion.button
            key={style.id}
            onClick={() => onSelect(style.id)}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            className={`
              relative flex items-center gap-3 rounded-2xl px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-500
              ${isActive 
                ? 'text-primary-foreground' 
                : 'text-gray-400 hover:text-white border border-white/5 hover:border-white/20 bg-white/[0.03] hover:bg-white/[0.08]'
              }
            `}
          >
            <span className="text-lg opacity-80">{style.icon}</span>
            <span className="relative z-10">{style.name}</span>
            {isActive && (
              <motion.div
                layoutId="style-pill-bg"
                className="absolute inset-0 z-0 rounded-2xl bg-gradient-to-r from-primary to-blue-600 shadow-lg shadow-primary/20"
                transition={{ type: 'spring', bounce: 0.15, duration: 0.6 }}
              />
            )}
            
            {/* Hover Tooltip - Minimalist version */}
            {!isActive && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/90 text-white rounded-lg text-[10px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/10 backdrop-blur-md">
                    {style.description}
                </div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
