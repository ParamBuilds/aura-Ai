import React from 'react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-gray-300 py-24 px-4 font-sans leading-relaxed">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-serif text-white mb-8">Terms of Service</h1>
        <div className="space-y-6">
          <section>
            <h2 className="text-xl text-white font-serif mb-3">1. Acceptance of Terms</h2>
            <p>By accessing Aura Prestige, you agree to comply with these Terms of Service. If you do not agree, please refrain from using the platform.</p>
          </section>
          <section>
            <h2 className="text-xl text-white font-serif mb-3">2. AI-Generated Content</h2>
            <p>Our renderings are generated using advanced artificial intelligence. While we strive for realism, Aura Prestige does not guarantee the dimensional accuracy or structural feasibility of generated designs. Users should consult professional contractors for physical implementation.</p>
          </section>
          <section>
            <h2 className="text-xl text-white font-serif mb-3">3. User Accounts</h2>
            <p>You are responsible for maintaining the confidentiality of your login credentials provided via our Google Authentication integration.</p>
          </section>
          <section>
            <h2 className="text-xl text-white font-serif mb-3">4. Intellectual Property</h2>
            <p>You retain the rights to the original images you upload. Aura Prestige retains the rights to the proprietary AI models and interface used to generate design transformations.</p>
          </section>
          <section>
            <h2 className="text-xl text-white font-serif mb-3">5. Termination</h2>
            <p>We reserve the right to suspend accounts that violate our usage policies or engage in abusive behavior towards our systems.</p>
          </section>
        </div>
        <div className="mt-12 text-sm opacity-50">
          Last updated: April 2026
        </div>
      </div>
    </div>
  );
}
