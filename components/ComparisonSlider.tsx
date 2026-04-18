'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';

interface ComparisonSliderProps {
  original: string;
  generated: string;
  className?: string;
}

export function ComparisonSlider({ original, generated, className = '' }: ComparisonSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
    const position = ((x - rect.left) / rect.width) * 100;
    
    setSliderPosition(Math.max(0, Math.min(100, position)));
  };

  useEffect(() => {
    const handleGlobalMove = (e: MouseEvent | TouchEvent) => {
      if (document.activeElement?.closest('.slider-container')) {
          handleMove(e as any);
      }
    };
    
    // We only want to track movement when actively dragging
    // For simplicity in this specialized component, we'll use regular mouse events on the container
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden select-none cursor-ew-resize group slider-container ${className}`}
      onMouseMove={(e) => e.buttons === 1 && handleMove(e)}
      onTouchMove={handleMove}
      onMouseDown={handleMove}
    >
      {/* Generated Image (Right) */}
      <img 
        src={generated} 
        alt="Reimagined Space" 
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />
      
      {/* Original Image (Left - Clipped) */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img 
          src={original} 
          alt="Original Space" 
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
      </div>

      {/* Slider Bar */}
      <div 
        className="absolute inset-y-0 z-10 w-[2px] bg-white cursor-ew-resize"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-brand-border rounded-full shadow-lg flex items-center justify-center text-[10px] font-bold">
            &larr; &rarr;
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-5 left-5 z-20 px-2 py-1 bg-white border border-brand-border text-brand-ink text-[9px] font-bold uppercase tracking-[1px] pointer-events-none">
        Original Space
      </div>
      <div className="absolute top-5 right-5 z-20 px-2 py-1 bg-white border border-brand-border text-brand-ink text-[9px] font-bold uppercase tracking-[1px] pointer-events-none">
        AI Reimagined
      </div>
    </div>
  );
}
