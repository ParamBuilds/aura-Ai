import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-gray-300 py-24 px-4 font-sans leading-relaxed">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-serif text-white mb-8">Privacy Policy</h1>
        <div className="space-y-6">
          <section>
            <h2 className="text-xl text-white font-serif mb-3">1. Information We Collect</h2>
            <p>We collect your name and email address via Google Sign-In, and the room images you upload for design processing.</p>
          </section>
          <section>
            <h2 className="text-xl text-white font-serif mb-3">2. How We Use Data</h2>
            <p>Your data is used to provide the AI visualization service, manage your account preference, and communicate important service updates.</p>
          </section>
          <section>
            <h2 className="text-xl text-white font-serif mb-3">3. Data Sharing</h2>
            <p>We do not sell your personal data. Images are processed through secured industrial AI providers (Google Cloud, OpenRouter, OpenAI) solely for the purpose of generating your designs.</p>
          </section>
          <section>
            <h2 className="text-xl text-white font-serif mb-3">4. Cookies</h2>
            <p>We use essential cookies to maintain your login session and application performance.</p>
          </section>
          <section>
            <h2 className="text-xl text-white font-serif mb-3">5. Your Rights</h2>
            <p>You may request to delete your account and associated data by contacting our support team within the platform.</p>
          </section>
        </div>
        <div className="mt-12 text-sm opacity-50">
          Last updated: April 2026
        </div>
      </div>
    </div>
  );
}
