'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PartnershipPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-600 selection:text-white overflow-hidden">
      
      {/* --- NAVBAR --- */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#050505]/90 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tighter text-white cursor-pointer">
              TRADE<span className="text-blue-500">CORE</span>
          </Link>
          <div className="flex items-center gap-6">
             <Link href="/company" className="text-sm font-medium text-gray-400 hover:text-white transition flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
                Back to Company
             </Link>
             <Link href="/login?view=signup" className="hidden md:block bg-white hover:bg-gray-200 text-black px-5 py-2 rounded-full text-sm font-bold transition shadow-lg shadow-white/5">Become a Partner</Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-48 pb-32 px-6">
         {/* Background Glow (Purple variant for Partnership) */}
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none"></div>
         <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>

         <div className="max-w-5xl mx-auto text-center relative z-10">
            <span className="inline-block py-1 px-3 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold tracking-widest uppercase mb-6">
                Affiliate & IB Program
            </span>
            <h1 className="text-5xl md:text-8xl font-bold mb-8 tracking-tight leading-tight">
                Partner With <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-white">A Global Leader.</span>
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto mb-10">
              Join the TradeCore Partner Ecosystem. Whether you are an Introducer Broker (IB), Affiliate, or Fund Manager, we provide the tools, payouts, and support you need to scale.
            </p>
            <div className="flex justify-center gap-4">
                <Link href="/login?view=signup" className="px-8 py-4 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-500 transition shadow-lg shadow-purple-500/20">
                    Start Earning
                </Link>
            </div>
         </div>
      </section>

      {/* --- STATS STRIP --- */}
      <section className="border-y border-white/5 bg-[#080808] relative z-10">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 divide-x divide-white/5">
              <div className="py-12 text-center group hover:bg-white/5 transition duration-500">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-purple-500 transition">$15M+</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest">Paid to Partners</div>
              </div>
              <div className="py-12 text-center group hover:bg-white/5 transition duration-500">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-purple-500 transition">12,000+</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest">Active Affiliates</div>
              </div>
              <div className="py-12 text-center group hover:bg-white/5 transition duration-500">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-purple-500 transition">$1,200</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest">Max CPA</div>
              </div>
              <div className="py-12 text-center group hover:bg-white/5 transition duration-500">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-purple-500 transition">Daily</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest">Payouts</div>
              </div>
          </div>
      </section>

      {/* --- WHY PARTNER WITH US --- */}
      <section className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
              <div className="mb-20 text-center md:text-left">
                  <h2 className="text-4xl font-bold mb-4">Why TradeCore?</h2>
                  <p className="text-gray-400 max-w-xl">We treat our partners as an extension of our team. Your success is our business model.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Card 1 */}
                  <div className="p-10 rounded-3xl bg-[#0A0A0A] border border-white/10 hover:border-purple-500/50 transition-all duration-500 group">
                      <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-purple-500"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.769 3.07.769 4.242 0 1.172-.769 1.172-2.033 0-2.817-.117-.077-.32-.207-.606-.386M7 21a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3ZM17 21a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3Z" /></svg>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-4">Lucrative Payouts</h3>
                      <p className="text-gray-400 leading-relaxed">
                          Choose between high CPA (up to $1,200), ongoing RevShare (up to 60%), or a Hybrid model tailored to your traffic.
                      </p>
                  </div>

                  {/* Card 2 */}
                  <div className="p-10 rounded-3xl bg-[#0A0A0A] border border-white/10 hover:border-blue-500/50 transition-all duration-500 group">
                      <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-blue-500"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" /></svg>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-4">Advanced Tracking</h3>
                      <p className="text-gray-400 leading-relaxed">
                          Get access to a dedicated Partner Portal with real-time analytics, transparent reporting, and deep-link generation.
                      </p>
                  </div>

                  {/* Card 3 */}
                  <div className="p-10 rounded-3xl bg-[#0A0A0A] border border-white/10 hover:border-green-500/50 transition-all duration-500 group">
                      <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-green-500"><path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" /></svg>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-4">Marketing Support</h3>
                      <p className="text-gray-400 leading-relaxed">
                          We provide high-converting banners, landing pages, and email kits. Plus, a dedicated manager to help you optimize.
                      </p>
                  </div>
              </div>
          </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section className="py-24 bg-[#080808] border-t border-white/5">
         <div className="max-w-7xl mx-auto px-6">
             <div className="text-center mb-16">
                 <h2 className="text-3xl font-bold text-white">How It Works</h2>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                 {/* Connecting Line (Desktop) */}
                 <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent z-0"></div>

                 <div className="relative z-10 text-center group">
                     <div className="w-24 h-24 mx-auto bg-[#111] border border-white/10 rounded-full flex items-center justify-center mb-6 group-hover:border-purple-500 transition duration-500 shadow-xl shadow-black">
                         <span className="text-3xl font-bold text-purple-500">1</span>
                     </div>
                     <h3 className="text-xl font-bold text-white mb-2">Register</h3>
                     <p className="text-gray-400 text-sm max-w-xs mx-auto">Sign up for a partner account in minutes. Instant approval for qualified affiliates.</p>
                 </div>

                 <div className="relative z-10 text-center group">
                     <div className="w-24 h-24 mx-auto bg-[#111] border border-white/10 rounded-full flex items-center justify-center mb-6 group-hover:border-purple-500 transition duration-500 shadow-xl shadow-black">
                         <span className="text-3xl font-bold text-purple-500">2</span>
                     </div>
                     <h3 className="text-xl font-bold text-white mb-2">Refer</h3>
                     <p className="text-gray-400 text-sm max-w-xs mx-auto">Use your unique tracking link to refer clients to TradeCore's premium trading environment.</p>
                 </div>

                 <div className="relative z-10 text-center group">
                     <div className="w-24 h-24 mx-auto bg-[#111] border border-white/10 rounded-full flex items-center justify-center mb-6 group-hover:border-purple-500 transition duration-500 shadow-xl shadow-black">
                         <span className="text-3xl font-bold text-purple-500">3</span>
                     </div>
                     <h3 className="text-xl font-bold text-white mb-2">Earn</h3>
                     <p className="text-gray-400 text-sm max-w-xs mx-auto">Receive daily payouts directly to your wallet or bank account. Track performance in real-time.</p>
                 </div>
             </div>
         </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="border-t border-white/5 bg-black py-16 text-center">
         <div className="max-w-4xl mx-auto px-6">
             <h3 className="text-2xl font-bold text-white mb-4">Ready to grow your income?</h3>
             <p className="text-gray-400 mb-8">Join the thousands of partners who trust TradeCore.</p>
             <Link href="/login?view=signup" className="px-10 py-4 bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition">Become a Partner</Link>
             <p className="text-gray-600 text-xs mt-12">© 2026 TradeCore Technologies. All rights reserved.</p>
         </div>
      </footer>

    </div>
  );
}