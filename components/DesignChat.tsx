'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, User, Sparkles, ShoppingBag } from 'lucide-react';
import { createDesignChat } from '@/lib/gemini';

interface Message {
  role: 'user' | 'model';
  content: string;
}

interface DesignChatProps {
  onRefine: (refinement: string) => void;
  isGenerating: boolean;
}

export function DesignChat({ onRefine, isGenerating }: DesignChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "I've rendered the vision for your space. It emphasizes natural light and creates a cleaner flow between the dining and sitting areas." }
  ]);
  const [input, setInput] = useState('');
  const [chat] = useState(() => createDesignChat());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const result = await chat.sendMessage({ message: userMessage });
      const modelResponse = result.text || "I'm sorry, I couldn't generate a response.";
      setMessages(prev => [...prev, { role: 'model', content: modelResponse }]);

      const visualKeywords = ['make', 'change', 'color', 'add', 'remove', 'style', 'blue', 'green', 'red', 'dark', 'light'];
      if (visualKeywords.some(keyword => userMessage.toLowerCase().includes(keyword))) {
        onRefine(userMessage);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'model', content: "I'm having a bit of trouble connecting to my design library. Could you try again?" }]);
    }
  };

  const parseContent = (content: string) => {
    const parts = content.split(/(\[ITEM:.*?\])/g);
    return parts.map((part, index) => {
      if (part.startsWith('[ITEM:')) {
        const match = part.match(/\[ITEM:\s*(.*?)\s*\|\s*(.*?)\s*\|\s*(.*?)\s*\|\s*(.*?)\s*\]/);
        if (match) {
          const [, name, price, desc, seed] = match;
          return (
            <div key={index} className="my-6 flex gap-4 items-start">
              <div className="w-12 h-12 bg-gray-100 rounded-brand overflow-hidden flex-shrink-0">
                <img 
                  src={`https://picsum.photos/seed/${seed}/200/200`} 
                  alt={name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-baseline">
                  <h4 className="text-[11px] font-bold uppercase">{name}</h4>
                  <span className="text-[10px] opacity-40">{price}</span>
                </div>
                <p className="text-[11px] text-brand-ink/70 mt-1 leading-relaxed">{desc}</p>
              </div>
            </div>
          );
        }
      }
      return <p key={index} className="whitespace-pre-wrap">{part}</p>;
    });
  };

  return (
    <div className="flex flex-col h-[500px] bg-white overflow-hidden">
      <div className="mb-8 block border-b border-brand-border pb-2">
        <span className="text-[10px] uppercase tracking-[2px] opacity-60">Design Consultant</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-8 no-scrollbar pb-10">
        {messages.map((message, i) => (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            key={i}
            className="flex flex-col"
          >
            <div className={`text-sm leading-relaxed ${
                message.role === 'model' 
                ? 'font-serif italic text-brand-accent pr-10' 
                : 'text-brand-ink font-medium pl-10 text-right uppercase text-[12px] tracking-[1px]'
            }`}>
               {message.role === 'model' ? (
                 <div>{parseContent(message.content)}</div>
               ) : (
                 <p>{message.content}</p>
               )}
            </div>
          </motion.div>
        ))}
        {isGenerating && (
            <div className="text-[10px] uppercase tracking-[2px] opacity-40 animate-pulse">
                Consultant is thinking...
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="pt-6 border-t border-brand-border">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about furniture, colors, or lighting..."
          className="w-full px-4 py-3 bg-brand-bg border border-brand-border rounded-brand text-[13px] focus:outline-none focus:border-brand-ink transition-colors"
        />
        <div className="mt-4 flex justify-between items-center px-1">
            <span className="text-[11px] opacity-40">AI is generating style alternatives...</span>
            <button
                type="submit"
                disabled={isGenerating || !input.trim()}
                className="bg-brand-ink text-white px-4 py-2 text-[11px] font-bold uppercase tracking-[1px] rounded-brand hover:opacity-80 disabled:opacity-50 transition-all"
            >
                Refine
            </button>
        </div>
      </form>
    </div>
  );
}
