'use client';

import React from 'react';
import { motion } from 'motion/react';

export const STYLES = [
  { id: 'scandinavian', name: 'Scandinavian', description: 'Minimalist, functional, and cozy.', icon: '🏔️' },
  { id: 'mid-century', name: 'Mid-Century', description: 'Retro charm with modern lines.', icon: '📻' },
  { id: 'industrial', name: 'Industrial', description: 'Raw materials and urban edge.', icon: '🏭' },
  { id: 'bohemian', name: 'Bohemian', description: 'Eclectic, colorful, and free-spirited.', icon: '🌿' },
  { id: 'japandi', name: 'Japandi', description: 'Japanese aesthetic meets Scandi.', icon: '🎋' },
  { id: 'minimalist', name: 'Minimalist', description: 'Essentialist and ultra-clean.', icon: '⚪' },
];

interface StyleSelectorProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

export function StyleSelector({ selectedId, onSelect }: StyleSelectorProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 px-2 no-scrollbar">
      {STYLES.map((style) => (
        <motion.button
          key={style.id}
          whileHover={{ opacity: 0.8 }}
          onClick={() => onSelect(style.id)}
          className={`flex-shrink-0 w-28 text-left transition-all ${
            selectedId === style.id ? 'opacity-100' : 'opacity-60'
          }`}
        >
          <div 
            className={`w-full h-20 mb-2 transition-all border ${
                selectedId === style.id ? 'border-brand-ink outline outline-1 outline-brand-ink' : 'border-brand-border'
            }`}
            style={{ 
                backgroundColor: style.id === 'scandinavian' ? '#E2DDD5' : 
                                style.id === 'mid-century' ? '#D5DAD2' : 
                                style.id === 'industrial' ? '#CBD2D5' :
                                style.id === 'japandi' ? '#D2CBD5' :
                                style.id === 'bohemian' ? '#D5C2C2' : '#E0E0E0'
            }}
          />
          <span className="text-[10px] font-bold uppercase tracking-[1px] block">{style.name}</span>
        </motion.button>
      ))}
    </div>
  );
}
