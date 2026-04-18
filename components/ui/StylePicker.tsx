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
    <div className="flex flex-wrap items-center justify-center gap-2">
      {STYLES.map((style) => {
        const isActive = selectedId === style.id;
        return (
          <motion.button
            key={style.id}
            onClick={() => onSelect(style.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              relative flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium transition-all
              ${isActive 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground border border-border/40'
              }
            `}
          >
            <span>{style.icon}</span>
            <span>{style.name}</span>
            {isActive && (
              <motion.div
                layoutId="style-pill"
                className="absolute inset-0 z-[-1] rounded-full bg-primary"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
