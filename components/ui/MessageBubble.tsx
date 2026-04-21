'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, User } from 'lucide-react';

interface MessageBubbleProps {
  role: 'user' | 'model';
  content: string;
}

export function MessageBubble({ role, content }: MessageBubbleProps) {
  const isAI = role === 'model';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
      className={`flex w-full ${isAI ? 'justify-start' : 'justify-end'}`}
    >
      <div className={`flex max-w-[85%] items-start gap-3 sm:max-w-[70%]`}>
        {isAI && (
          <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
            <Sparkles size={12} />
          </div>
        )}
        
        <div className={`
          rounded-2xl px-4 py-2.5 text-sm shadow-sm transition-colors
          ${isAI 
            ? 'border border-border bg-card text-foreground' 
            : 'bg-primary text-primary-foreground'
          }
        `}>
          <p className="whitespace-pre-wrap leading-relaxed">{content}</p>
        </div>

        {!isAI && (
          <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary border border-border text-secondary-foreground">
            <User size={12} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
