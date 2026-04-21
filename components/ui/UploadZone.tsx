'use client';

import React, { useState } from 'react';
import { UploadCloud, Image as ImageIcon, CheckCircle2, MoveUp, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface UploadZoneProps {
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  preview: string | null;
}

export function UploadZone({ onFileSelect, preview }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className={`
          relative flex flex-col items-center justify-center rounded-[3rem] border transition-all duration-700 overflow-hidden
          ${isDragging 
            ? 'border-primary ring-4 ring-primary/20 bg-primary/5' 
            : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/20'
          }
          ${preview ? 'p-6' : 'h-[500px]'}
        `}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); }}
      >
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20 transition-opacity duration-1000">
           <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
           <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
        </div>

        <input
          type="file"
          className="absolute inset-0 z-10 cursor-pointer opacity-0"
          accept="image/*"
          onChange={onFileSelect}
        />

        {preview ? (
          <div className="relative w-full aspect-[16/9] md:aspect-video overflow-hidden rounded-[2.5rem] border border-white/10 shadow-3xl group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
               src={preview} 
               alt="Upload preview" 
               className="h-full w-full object-cover grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
            <div className="absolute top-8 right-8 rounded-full bg-primary p-3 text-white shadow-2xl shadow-primary/40">
              <CheckCircle2 size={24} />
            </div>
            <div className="absolute bottom-8 left-8 flex flex-col gap-2">
              <span className="text-[10px] font-mono font-bold tracking-[0.4em] uppercase text-primary mb-1">Source Captured</span>
              <h4 className="text-2xl font-serif text-white italic">The Architectural Foundation</h4>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-10 text-center px-12 relative z-10">
            <motion.div 
              animate={{ 
                y: [0, -15, 0],
                rotateY: [0, 180, 360]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-primary/20 to-blue-500/10 flex items-center justify-center text-primary border border-white/10 backdrop-blur-md shadow-2xl shadow-primary/5"
            >
              <Sparkles size={40} className="text-primary" />
            </motion.div>
            
            <div className="space-y-4">
              <h3 className="text-3xl md:text-5xl font-serif font-medium text-white tracking-tight">The Vision <span className="italic text-gray-500">Starts Here</span></h3>
              <p className="text-lg text-gray-500 font-sans max-w-md mx-auto leading-relaxed">Drag your space into the AI forge or click to select a high-resolution reference.</p>
            </div>

            <div className="flex items-center gap-6 pt-6">
              <button className="px-8 py-3 bg-white text-black font-bold text-[11px] uppercase tracking-widest rounded-full hover:bg-gray-100 transition-all pointer-events-none">Select Frame</button>
              <div className="flex items-center gap-4 text-[10px] font-mono tracking-widest text-gray-600 uppercase">
                <span>RAW</span>
                <span className="w-1 h-1 rounded-full bg-white/10" />
                <span>4K</span>
                <span className="w-1 h-1 rounded-full bg-white/10" />
                <span>PRO</span>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
