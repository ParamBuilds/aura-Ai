'use client';

import React from 'react';
import { motion } from 'motion/react';

export const STYLES = [
  { id: 'japandi', name: 'Japandi Luxury', description: 'Japanese zen meets Scandinavian warmth.', icon: '🎋' },
  { id: 'dark-academia', name: 'Dark Academia', description: 'Mysterious, scholarly, and moody.', icon: '📚' },
  { id: 'brutalist', name: 'Raw Brutalism', description: 'Honest materials and rhythmic geometry.', icon: '🧱' },
  { id: 'art-deco', name: 'Art Deco', description: 'Glamorous, geometric, and opulent.', icon: '💎' },
  { id: 'minimalist', name: 'Pure Minimalist', description: 'The absolute essence of the space.', icon: '⚪' },
  { id: 'industrial', name: 'High Industrial', description: 'Polished concrete and steel elegance.', icon: '🏗️' },
];

interface StyleSelectorProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

export function StyleSelector({ selectedId, onSelect }: StyleSelectorProps) {
  return (
    <div className="flex gap-6 overflow-x-auto pb-6 px-4 no-scrollbar">
      {STYLES.map((style) => (
        <motion.button
          key={style.id}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(style.id)}
          data-assistant-text={style.description}
          className={`flex-shrink-0 w-32 text-left group transition-all`}
        >
          <div 
            className={`w-full h-24 mb-3 rounded-2xl transition-all border overflow-hidden relative ${
                selectedId === style.id ? 'border-primary ring-2 ring-primary/20' : 'border-white/10 opacity-60 group-hover:opacity-100 group-hover:border-white/30'
            }`}
            style={{ 
                backgroundColor: style.id === 'japandi' ? '#D9D1C5' : 
                                style.id === 'dark-academia' ? '#2A2E33' : 
                                style.id === 'brutalist' ? '#8C8C8C' :
                                style.id === 'art-deco' ? '#A68966' :
                                style.id === 'minimalist' ? '#F7F7F7' : '#4A5568'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center text-3xl">
                {style.icon}
            </div>
            {selectedId === style.id && (
                <motion.div 
                    layoutId="style-active"
                    className="absolute inset-0 border-2 border-primary rounded-2xl"
                />
            )}
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-[0.2em] block text-center ${selectedId === style.id ? 'text-primary' : 'text-gray-500'}`}>
            {style.name}
          </span>
        </motion.button>
      ))}
    </div>
  );
}
