'use client';

import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-600 selection:text-white">
      
      <nav className="fixed w-full z-50 bg-[#050505]/90 backdrop-blur-xl border-b border-white/5 py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tighter text-white">GAV<span className="text-blue-500">BLUE</span></Link>
          <Link href="/" className="text-sm text-gray-400 hover:text-white transition">Back Home</Link>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-6">
         <div className="max-w-3xl mx-auto">
            <span className="text-blue-500 text-xs font-bold tracking-widest uppercase mb-4 block">Legal</span>
            <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
            
            <div className="space-y-8 text-gray-400 leading-relaxed text-sm">
                <p>Last updated: February 19, 2026</p>
                <h3 className="text-xl font-bold text-white pt-4">1. Acceptance of Terms</h3>
                <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>

                <h3 className="text-xl font-bold text-white pt-4">2. Provision of Services</h3>
                <p>Gavblue is constantly innovating in order to provide the best possible experience for its users. You acknowledge and agree that the form and nature of the services which Gavblue provides may change from time to time without prior notice to you.</p>

                <h3 className="text-xl font-bold text-white pt-4">3. Termination</h3>
                <p>We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
            </div>
         </div>
      </section>

      <footer className="border-t border-white/5 bg-black py-10 text-center">
         <p className="text-gray-600 text-xs">© 2026 Gavblue Technologies. All rights reserved.</p>
      </footer>
    </div>
  );
}