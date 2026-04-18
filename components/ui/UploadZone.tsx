'use client';

import React, { useState } from 'react';
import { UploadCloud, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface UploadZoneProps {
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  preview: string | null;
}

export function UploadZone({ onFileSelect, preview }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="mx-auto w-full max-w-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`
          relative flex flex-col items-center justify-center rounded-2xl border border-dashed p-8 transition-all
          ${isDragging 
            ? 'border-primary ring-2 ring-primary ring-offset-2 ring-offset-background bg-accent/50' 
            : 'border-border/60 bg-card hover:bg-accent/30'
          }
          ${preview ? 'p-4' : 'h-64'}
        `}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); /* Logic handled by input */ }}
      >
        <input
          type="file"
          className="absolute inset-0 z-10 cursor-pointer opacity-0"
          accept="image/*"
          onChange={onFileSelect}
        />

        {preview ? (
          <div className="relative w-full overflow-hidden rounded-xl border border-border shadow-md">
            <img src={preview} alt="Upload preview" className="h-48 w-full object-cover sm:h-64" />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute top-3 right-3 rounded-full bg-primary p-1.5 text-primary-foreground shadow-sm">
              <CheckCircle2 size={16} />
            </div>
            <div className="absolute bottom-3 left-3 rounded-md bg-background/80 px-2 py-1 text-xs font-medium backdrop-blur-sm">
              Source Loaded
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="rounded-full bg-accent p-4 text-accent-foreground">
              <UploadCloud size={32} />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">Click or drag a photo of your room</p>
              <p className="text-xs text-muted-foreground">Supports PNG, JPG (Max 5MB)</p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
