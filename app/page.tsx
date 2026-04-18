'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, Camera, Eraser, Sparkles, SlidersHorizontal, ArrowRight, Check, Save, Download, History } from 'lucide-react';
import { ComparisonSlider } from '@/components/ComparisonSlider';
import { StyleSelector, STYLES } from '@/components/StyleSelector';
import { DesignChat, Message } from '@/components/DesignChat';
import { reimaginedRoom } from '@/lib/gemini';
import { saveDesign, getDesigns } from '@/lib/storage';

export default function AuraHome() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [reimaginedImage, setReimaginedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0].id);
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState<'upload' | 'design'>('upload');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "I've rendered the vision for your space. It emphasizes natural light and creates a cleaner flow between the dining and sitting areas." }
  ]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setOriginalImage(event.target?.result as string);
        setStep('design');
        // Reset messages for new design
        setMessages([
          { role: 'model', content: "I've rendered the vision for your space. It emphasizes natural light and creates a cleaner flow between the dining and sitting areas." }
        ]);
        // Auto-generate first design
        generateDesign(event.target?.result as string, selectedStyle);
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

  const handleChatRefinement = (refinement: string) => {
    if (originalImage) {
      generateDesign(originalImage, selectedStyle, refinement);
    }
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

      // Save using IndexedDB storage utility
      await saveDesign(designData);

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to save design:", error);
      alert("Aura encountered a storage limit error. We've optimized the system; please try saving again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto min-h-screen border-x border-brand-border bg-brand-bg flex flex-col">
      {/* Header */}
      <header className="h-20 px-10 flex justify-between items-center border-b border-brand-border bg-white">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-4"
        >
          <span className="text-2xl font-serif italic tracking-tight">Aura.ai</span>
        </motion.div>
        
        <div className="flex items-center gap-6">
            <div className="text-right flex flex-col items-end">
                <div className="text-[10px] uppercase tracking-[2px] opacity-60 mb-0.5">Active Design Space</div>
                <div className="text-xs font-medium">Lexington Ave. Loft — Living Area</div>
            </div>
            
            <button 
                onClick={handleSave}
                disabled={isSaving || !reimaginedImage}
                className={`px-6 py-2 border border-brand-ink text-[11px] font-bold uppercase tracking-[1px] transition-all flex items-center gap-2 ${
                    saveSuccess ? 'bg-green-600 border-green-600 text-white' : 'bg-brand-ink text-white hover:bg-white hover:text-brand-ink'
                } disabled:opacity-50`}
            >
                {saveSuccess ? <><Check size={14} /> Saved</> : isSaving ? 'Saving...' : <><Save size={14} /> Save Design</>}
            </button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {step === 'upload' ? (
          <motion.section 
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center py-20 px-10"
          >
            <div className="max-w-2xl text-center space-y-8">
              <h1 className="text-6xl font-serif italic leading-tight">
                Reimagine Your Space
              </h1>
              <p className="text-brand-ink/70 text-base leading-relaxed max-w-lg mx-auto">
                Upload a photo of any interior. Aura&apos;s AI consultant will render a vision based on professional aesthetic principles.
              </p>

              <label className="group relative block w-full aspect-video border border-brand-border rounded-brand cursor-pointer hover:border-brand-ink transition-all overflow-hidden bg-white">
                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <div className="w-12 h-12 flex items-center justify-center text-brand-ink">
                    <Upload size={24} />
                  </div>
                  <div className="text-[10px] uppercase tracking-[2px] font-bold">Upload Source Image</div>
                </div>
              </label>
            </div>
          </motion.section>
        ) : (
          <motion.section 
            key="design"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 grid lg:grid-cols-[1fr_360px] bg-brand-border gap-[1px]"
          >
            {/* Visualization Pane */}
            <div className="bg-brand-bg p-10 flex flex-col">
              <div className="relative flex-1 min-h-[400px] border border-brand-border rounded-brand overflow-hidden bg-white shadow-sm">
                {originalImage && reimaginedImage ? (
                  <ComparisonSlider original={originalImage} generated={reimaginedImage} className="w-full h-full" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-6 text-center">
                    <div className="text-brand-ink/20 animate-pulse">
                        <Camera size={48} />
                    </div>
                    <div>
                        <div className="text-[10px] uppercase tracking-[2px] opacity-60 mb-2">System Status</div>
                        <h2 className="text-xl font-serif italic">Analyzing architectural flow...</h2>
                    </div>
                  </div>
                )}
                
                {isGenerating && reimaginedImage && (
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-30 flex items-center justify-center">
                         <div className="bg-white px-6 py-3 border border-brand-border rounded-brand shadow-xl flex items-center gap-3">
                            <Sparkles className="animate-pulse text-brand-ink" size={16} />
                            <span className="text-[10px] uppercase tracking-[2px] font-bold">Recalibrating Vision</span>
                         </div>
                    </div>
                )}
              </div>

              {/* Controls */}
              <div className="mt-8 space-y-6">
                <div className="flex items-center justify-between border-b border-brand-border pb-4">
                    <span className="text-[10px] uppercase tracking-[2px] font-bold">Style Carousel</span>
                    <button 
                        onClick={() => { setStep('upload'); setOriginalImage(null); setReimaginedImage(null); }}
                        className="text-[9px] uppercase tracking-[1px] font-bold hover:opacity-50 transition-opacity"
                    >
                        Reset Workspace
                    </button>
                </div>
                
                <StyleSelector selectedId={selectedStyle} onSelect={handleStyleChange} />
              </div>
            </div>

            {/* Side Console */}
            <div className="bg-white p-6 flex flex-col">
                <DesignChat 
                  onRefine={handleChatRefinement} 
                  isGenerating={isGenerating} 
                  messages={messages}
                  setMessages={setMessages}
                />
                
                <div className="mt-10">
                    <span className="text-[10px] uppercase tracking-[2px] mb-4 block border-b border-brand-border pb-2 opacity-60">Curated Collection</span>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-brand-accent/20 rounded-brand" />
                            <div>
                                <div className="text-[11px] font-bold">Sørensen Leather Sofa</div>
                                <div className="text-[10px] opacity-50">$4,200.00 — Design Within Reach</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-brand-ink/10 rounded-brand" />
                            <div>
                                <div className="text-[11px] font-bold">Hand-Tufted Wool Rug</div>
                                <div className="text-[10px] opacity-50">$890.00 — Nordic Knots</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
      
      {/* Footer Branding */}
      <footer className="mt-32 pt-12 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-muted pb-12">
        <div>© 2026 Aura Home Interiors</div>
        <div className="flex gap-12">
            <a href="#" className="hover:text-brand-ink transition-colors">Privacy</a>
            <a href="#" className="hover:text-brand-ink transition-colors">Terms</a>
            <a href="#" className="hover:text-brand-ink transition-colors">Contact</a>
        </div>
      </footer>
    </main>
  );
}
