'use client';

import React, { useRef, useEffect } from 'react';
import { ArrowUp, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageBubble } from './MessageBubble';

interface Message {
  role: 'user' | 'model';
  content: string;
}

interface ChatBarProps {
  messages: Message[];
  input: string;
  onInputChange: (val: string) => void;
  onSend: (e: React.FormEvent) => void;
  isGenerating: boolean;
}

export function ChatBar({ messages, input, onInputChange, onSend, isGenerating }: ChatBarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isGenerating]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      {/* Message History Scroller */}
      {messages.length > 0 && (
        <div 
          ref={scrollRef}
          className="container mx-auto max-h-64 overflow-y-auto px-4 pb-4 no-scrollbar flex flex-col gap-3 pointer-events-auto"
          style={{ maskImage: 'linear-gradient(to top, black 80%, transparent)' }}
        >
          {messages.map((msg, i) => (
            <MessageBubble key={i} role={msg.role} content={msg.content} />
          ))}
          {isGenerating && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 px-4 py-2 text-xs text-muted-foreground italic rounded-full bg-secondary/50 self-start border border-border/40"
            >
              <Sparkles size={12} className="animate-pulse" />
              Aura is thinking...
            </motion.div>
          )}
        </div>
      )}

      {/* Input Bar */}
      <div className="border-t border-border/40 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto max-w-3xl px-4 py-4">
          <form onSubmit={onSend} className="relative flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder="Refine your design... (e.g., 'Make the rug blue')"
              disabled={isGenerating}
              className="h-11 flex-1 rounded-full border border-input bg-secondary px-6 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isGenerating || !input.trim()}
              className={`
                flex h-10 w-10 items-center justify-center rounded-full transition-all
                ${isGenerating || !input.trim() 
                  ? 'bg-muted text-muted-foreground' 
                  : 'bg-primary text-primary-foreground hover:scale-105 active:scale-95 shadow-md shadow-primary/20'
                }
              `}
            >
              <ArrowUp size={20} />
            </button>
          </form>
          <p className="mt-2 text-center text-[10px] text-muted-foreground uppercase tracking-widest opacity-50">
            Powered by Aura AI • Gemini 3.1 Pro
          </p>
        </div>
      </div>
    </div>
  );
}
