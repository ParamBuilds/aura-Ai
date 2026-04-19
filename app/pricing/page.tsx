'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Check, ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';

const tiers = [
  {
    name: 'Essence',
    price: 'Free',
    description: 'Perfect for exploring your first few spaces.',
    features: ['3 AI Renders / Month', 'Standard Resolution', 'Gemini Flash AI', 'Basic Style Library'],
    cta: 'Start Now',
    highlighted: false,
  },
  {
    name: 'Visionary',
    price: '$19',
    period: '/mo',
    description: 'For home owners reimagining multiple rooms.',
    features: [
      'Unlimited AI Renders',
      '4K Resolution Exports',
      'OpenRouter (DALL-E 3) Core',
      'Design Consultation AI',
      'Save to Cloud Gallery',
    ],
    cta: 'Go Visionary',
    highlighted: true,
  },
  {
    name: 'Prestige',
    price: '$49',
    period: '/mo',
    description: 'Professional tools for interior designers.',
    features: [
      'All Visionary Features',
      'Batch Image Processing',
      'Priority Render Queue',
      'Commercial Usage License',
      'Custom Style Training (Coming Soon)',
    ],
    cta: 'Get Prestige',
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#050505] py-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10 text-white">
        <div className="text-center mb-24">
          <h1 className="text-5xl md:text-8xl font-serif font-medium mb-6">Invest in <span className="italic text-gray-500 underline decoration-primary/30 underline-offset-[12px]">Excellence</span></h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg font-sans">Choose the plan that fits your design journey. Professional architectural visualization at your fingertips.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-10 rounded-[2.5rem] border transition-all duration-500 ${
                tier.highlighted ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/10 opacity-80'
              }`}
            >
              <h3 className="text-2xl font-serif mb-2">{tier.name}</h3>
              <p className="text-gray-500 text-sm mb-8 h-10 leading-relaxed font-sans">{tier.description}</p>
              
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-mono font-bold tracking-tighter">{tier.price}</span>
                {tier.period && <span className="text-gray-500 text-xl font-sans">{tier.period}</span>}
              </div>

              <ul className="space-y-4 mb-10">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-4 text-gray-400 text-sm font-sans">
                    <Check className="w-5 h-5 text-primary shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href="/login"
                className={`w-full h-14 rounded-xl flex items-center justify-center gap-2 transition-all font-semibold ${
                  tier.highlighted ? 'bg-primary text-primary-foreground' : 'bg-white/10 text-white border border-white/10 hover:bg-white/20'
                }`}
              >
                {tier.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
