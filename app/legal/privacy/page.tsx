'use client';

import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-600 selection:text-white">
      
      <nav className="fixed w-full z-50 bg-[#050505]/90 backdrop-blur-xl border-b border-white/5 py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tighter text-white">GAV<span className="text-blue-500">BLUE</span></Link>
          <Link href="/" className="text-sm text-gray-400 hover:text-white transition">Close</Link>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-6">
         <div className="max-w-3xl mx-auto">
            <span className="text-blue-500 text-xs font-bold tracking-widest uppercase mb-4 block">Legal</span>
            <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
            
            <div className="space-y-8 text-gray-400 leading-relaxed text-sm">
                <p>Last updated: February 19, 2026</p>
                
                <h3 className="text-xl font-bold text-white pt-4">1. Introduction</h3>
                <p>Gavblue ("we", "our", "us") respects your privacy and is committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.</p>

                <h3 className="text-xl font-bold text-white pt-4">2. Data We Collect</h3>
                <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows: Identity Data, Contact Data, Financial Data, and Transaction Data.</p>

                <h3 className="text-xl font-bold text-white pt-4">3. How We Use Your Data</h3>
                <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances: Where we need to perform the contract we are about to enter into or have entered into with you.</p>
                
                <h3 className="text-xl font-bold text-white pt-4">4. Data Security</h3>
                <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.</p>
            </div>
         </div>
      </section>

      <footer className="border-t border-white/5 bg-black py-10 text-center">
         <p className="text-gray-600 text-xs">© 2026 Gavblue Technologies. All rights reserved.</p>
      </footer>
    </div>
  );
}