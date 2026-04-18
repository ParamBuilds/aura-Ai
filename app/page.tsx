'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { reimaginedRoom, createDesignChat } from '@/lib/gemini';
import { saveDesign } from '@/lib/storage';
import { STYLES } from '@/components/StyleSelector';
import { Message } from '@/components/DesignChat';

// New UI Components
import { Navbar } from '@/components/ui/Navbar';
import { UploadZone } from '@/components/ui/UploadZone';
import { StylePicker } from '@/components/ui/StylePicker';
import { ResultsPanel } from '@/components/ui/ResultsPanel';
import { ChatBar } from '@/components/ui/ChatBar';

export default function AuraHome() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [reimaginedImage, setReimaginedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0].id);
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState<'upload' | 'design'>('upload');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "I've rendered the vision for your space. It emphasizes natural light and creates a cleaner flow between the dining and sitting areas." }
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
        setMessages([{ role: 'model', content: "Welcome to your new design session. I'm analyzing the light and structure of your space." }]);
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
    setOriginalImage(null);
    setReimaginedImage(null);
    setStep('upload');
    setMessages([{ role: 'model', content: "Ready for a new project. Upload a photo to begin." }]);
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

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar onNewSession={resetSession} />

      {/* Progress Bar (Global) */}
      {isGenerating && (
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '0%' }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="fixed top-14 left-0 h-0.5 w-full bg-primary z-[60]"
        />
      )}

      <main className="flex-1 overflow-x-hidden pt-6 pb-40">
        <AnimatePresence mode="wait">
          {step === 'upload' ? (
            <motion.div
              key="hero"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden"
            >
              {/* Mesh Gradient Background */}
              <div className="absolute inset-0 -z-10 bg-background overflow-hidden">
                <div className="mesh-blob absolute -top-1/4 -left-1/4 h-[80vw] w-[80vw] rounded-full bg-purple-500/10 blur-[120px] dark:bg-purple-900/10" />
                <div className="mesh-blob absolute top-1/2 left-1/2 h-[60vw] w-[60vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-500/10 blur-[100px] dark:bg-rose-900/10" style={{ animationDelay: '2s' }} />
                <div className="mesh-blob absolute -bottom-1/4 -right-1/4 h-[80vw] w-[80vw] rounded-full bg-blue-500/10 blur-[120px] dark:bg-blue-900/10" style={{ animationDelay: '4s' }} />
              </div>

              <div className="container mx-auto px-4 py-32 text-center">
                <motion.h1 
                  className="mb-4 text-4xl font-bold tracking-tight md:text-6xl"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  Reimagine <span className="text-muted-foreground italic font-medium">Your Space</span>
                </motion.h1>
                <motion.p 
                  className="mx-auto mb-10 max-w-xl text-lg text-muted-foreground"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Upload a photo of any interior. Aura&apos;s AI consultant will render a vision based on professional aesthetic principles.
                </motion.p>

                <div className="space-y-8">
                  <UploadZone onFileSelect={handleFileUpload} preview={originalImage} />
                  
                  {originalImage && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-8"
                    >
                      <StylePicker selectedId={selectedStyle} onSelect={handleStyleChange} />
                      <button
                        onClick={() => generateDesign(originalImage!, selectedStyle)}
                        disabled={isGenerating}
                        className="h-11 w-full max-w-sm rounded-xl bg-primary px-8 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                      >
                        {isGenerating ? 'Rendering...' : 'Generate Design'}
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="container mx-auto px-4 py-8">
                <div className="mb-10 flex flex-col items-center gap-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold tracking-tight">Design Preview</h2>
                    <p className="text-sm text-muted-foreground italic">Exploring {STYLES.find(s => s.id === selectedStyle)?.name} aesthetics</p>
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
        <ChatBar 
          messages={messages} 
          input={chatInput} 
          onInputChange={setChatInput} 
          onSend={handleChatSend} 
          isGenerating={isGenerating} 
        />
      )}
    </div>
  );
}
