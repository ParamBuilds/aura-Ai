'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { reimaginedRoom, createDesignChat } from '@/lib/gemini';
import { saveDesign } from '@/lib/storage';
import { STYLES } from '@/components/StyleSelector';
import { Message } from '@/components/DesignChat';

// UI Components
import { Navbar } from '@/components/ui/Navbar';
import { UploadZone } from '@/components/ui/UploadZone';
import { StylePicker } from '@/components/ui/StylePicker';
import { ResultsPanel } from '@/components/ui/ResultsPanel';
import { ChatBar } from '@/components/ui/ChatBar';
import { Sparkles, Layout, Palette, Zap, ArrowDown, ChevronRight } from 'lucide-react';

export default function AuraPrestige() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [reimaginedImage, setReimaginedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0].id);
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState<'upload' | 'design'>('upload');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "Welcome to Aura Prestige. I'm your digital architect. Upload a space to begin your bespoke design journey." }
  ]);
  const [chat] = useState(() => createDesignChat());
  const [chatInput, setChatInput] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setOriginalImage(result);
        setStep('design');
        setMessages([{ role: 'model', content: "Space analyzed. I'm now crafting a design vision that balances architectural integrity with your chosen aesthetic." }]);
        generateDesign(result, selectedStyle);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateDesign = async (image: string, styleId: string, refinement?: string) => {
    setIsGenerating(true);
    try {
      const styleName = STYLES.find(s => s.id === styleId)?.name || styleId;
      const result = await reimaginedRoom(image.split(',')[1], styleName, refinement);
      if (result.image) {
        setReimaginedImage(result.image);
      }
    } catch (error) {
      console.error("Design generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStyleChange = (styleId: string) => {
    setSelectedStyle(styleId);
    if (originalImage) {
      generateDesign(originalImage, styleId);
    }
  };

  const handleChatSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isGenerating) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const result = await chat.sendMessage({ message: userMessage });
      const modelResponse = result.text || "I'm sorry, I couldn't generate a response.";
      setMessages(prev => [...prev, { role: 'model', content: modelResponse }]);

      const visualKeywords = ['make', 'change', 'color', 'add', 'remove', 'style', 'blue', 'green', 'red', 'dark', 'light'];
      if (visualKeywords.some(keyword => userMessage.toLowerCase().includes(keyword)) && originalImage) {
        generateDesign(originalImage, selectedStyle, userMessage);
      }
    } catch (error) {
      console.error("Chat error:", error);
    }
  };

  const resetSession = () => {
    setStep('upload');
    setOriginalImage(null);
    setReimaginedImage(null);
    setMessages([{ role: 'model', content: "The canvas is fresh. Where shall we begin?" }]);
  };

  const handleSave = async () => {
    if (!originalImage || !reimaginedImage) return;
    
    setIsSaving(true);
    try {
      const designData = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        style: STYLES.find(s => s.id === selectedStyle)?.name || selectedStyle,
        original: originalImage,
        reimagined: reimaginedImage,
        refinements: messages.filter(m => m.role === 'user').map(m => m.content)
      };

      await saveDesign(designData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to save design:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#050505] text-white selection:bg-primary/30 tracking-tight overflow-x-hidden relative">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full opacity-50" 
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            x: [0, -40, 0],
            y: [0, -20, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full opacity-40" 
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <Navbar onNewSession={resetSession} />

      <main className="flex-1 z-10">
        <AnimatePresence mode="wait">
          {step === 'upload' ? (
            <motion.div
              key="hero"
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20, transition: { duration: 0.5 } }}
              variants={containerVariants}
              className="px-6 pb-32"
            >
              <div className="max-w-7xl mx-auto pt-32 lg:pt-48 pb-20 border-b border-white/5">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                  <div className="space-y-12">
                    <motion.div variants={itemVariants as any} className="inline-flex items-center gap-4 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <span className="text-primary font-mono text-[10px] tracking-[0.3em] uppercase font-bold">The Future of Interior Design</span>
                    </motion.div>
                    
                    <motion.h1
                      variants={itemVariants as any}
                      className="text-7xl md:text-[8rem] font-serif font-medium leading-[0.85] tracking-tighter"
                    >
                      Bespoke <br />
                      <span className="italic text-gray-500/80 italic-glow">Atmospheres</span>.
                    </motion.h1>

                    <motion.div variants={itemVariants as any} className="space-y-8">
                      <p className="text-xl text-gray-400 font-sans max-w-lg leading-relaxed">
                        Step into a realm where artificial intelligence serves as your personal design concierge. Curate, refine, and manifest your ideal sanctuary.
                      </p>
                      
                      <div className="flex items-center gap-6">
                        <button 
                          onClick={() => document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' })}
                          className="group relative flex items-center gap-3 bg-white text-black px-8 py-4 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 overflow-hidden"
                        >
                          <span className="relative z-10 uppercase tracking-widest text-xs">Begin Creation</span>
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />
                          <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity" />
                        </button>
                        
                        <div className="hidden sm:flex items-center gap-4 text-gray-500 font-mono text-[10px] tracking-widest uppercase italic">
                          <span>30k+ Renders</span>
                          <div className="w-1 h-1 rounded-full bg-gray-700" />
                          <span>Global Presence</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  <motion.div
                    variants={itemVariants as any}
                    className="relative"
                  >
                    <div className="absolute -inset-4 bg-primary/20 blur-3xl opacity-20 animate-pulse" />
                    <div className="relative rounded-[3rem] overflow-hidden border border-white/10 shadow-3xl bg-black/40 backdrop-blur-md p-4">
                      <img 
                        src="https://picsum.photos/seed/luxury-living-prestige/1280/720" 
                        alt="Aura Prestige Interior" 
                        className="rounded-[2.5rem] w-full aspect-video object-cover hover:scale-105 transition-all duration-1000"
                      />
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Upload Section */}
              <div id="upload-section" className="max-w-7xl mx-auto py-32 space-y-24">
                <div className="flex flex-col md:flex-row items-end justify-between gap-10">
                  <motion.div variants={itemVariants as any} className="max-w-xl">
                    <h2 className="text-4xl md:text-6xl font-serif font-medium leading-none tracking-tighter mb-6">Import Your <br/><span className="italic text-gray-500">Spatial Context</span></h2>
                    <p className="text-lg text-gray-500 leading-relaxed font-sans">Our neural engine analyzes every contour, shadow, and architectural detail to provide a foundation for your new aesthetic.</p>
                  </motion.div>
                  <ArrowDown className="w-12 h-12 text-primary opacity-20 hidden md:block animate-bounce mb-4" />
                </div>

                <motion.div variants={itemVariants as any}>
                  <UploadZone onFileSelect={handleFileUpload} preview={originalImage} />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <FeatureCard
                    icon={<Sparkles />}
                    title="Neural Rendering"
                    desc="High-fidelity generative AI synthesis."
                  />
                  <FeatureCard
                    icon={<Layout />}
                    title="Architectural Edge"
                    desc="Precise maintenance of structural integrity."
                  />
                  <FeatureCard
                    icon={<Palette />}
                    title="Master Curation"
                    desc="Historical and modern design libraries."
                  />
                  <FeatureCard
                    icon={<Zap />}
                    title="Instant Refinement"
                    desc="Real-time conversational design iteration."
                  />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="px-6 py-20"
            >
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-end justify-between gap-12 mb-20 border-b border-white/5 pb-16">
                  <div className="max-w-xl">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-primary font-mono text-[10px] tracking-[0.5em] uppercase font-bold mb-6"
                    >
                      Refinement Boutique
                    </motion.div>
                    <h2 className="text-5xl md:text-8xl font-serif font-medium leading-none tracking-tighter">New <span className="italic text-gray-500">Perspectives</span></h2>
                  </div>
                  <StylePicker selectedId={selectedStyle} onSelect={handleStyleChange} />
                </div>

                <ResultsPanel 
                  original={originalImage} 
                  generated={reimaginedImage} 
                  isGenerating={isGenerating}
                  styleDescription={messages.find(m => m.role === 'model' && m.content.length > 50)?.content}
                  onSave={handleSave}
                  isSaving={isSaving}
                  saveSuccess={saveSuccess}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Chat Bar Overlay */}
      {step === 'design' && (
        <ChatBar messages={messages} input={chatInput} onInputChange={setChatInput} onSend={handleChatSend} isGenerating={isGenerating} />
      )}

      <style jsx global>{`
        .italic-glow {
          text-shadow: 0 0 40px rgba(var(--primary-rgb), 0.3);
        }
        .shadow-3xl {
          box-shadow: 0 50px 100px -20px rgba(0,0,0,0.5);
        }
      `}</style>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <motion.div
      whileHover={{ 
        y: -10, 
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderColor: 'rgba(255, 255, 255, 0.2)'
      }}
      className="p-10 rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-xl transition-all group flex flex-col items-center text-center space-y-8"
    >
      <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-500">
        {React.cloneElement(icon as React.ReactElement<any>, { size: 28 })}
      </div>
      <div>
        <h3 className="font-serif text-2xl mb-3 text-white tracking-tight">{title}</h3>
        <p className="text-sm text-gray-500 font-sans leading-relaxed px-2">{desc}</p>
      </div>
    </motion.div>
  );
}
