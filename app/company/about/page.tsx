'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AboutPage() {
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
          <Link href="/company" className="text-sm font-medium text-gray-400 hover:text-white transition flex items-center gap-2">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
             Back to Company
          </Link>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-48 pb-32 px-6">
         {/* Background Glow */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none"></div>

         <div className="max-w-4xl mx-auto text-center relative z-10">
            <span className="text-blue-500 text-xs font-bold tracking-widest uppercase mb-6 block">Our Story</span>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight leading-tight">
                Built for Traders, <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-white">By Traders.</span>
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
              We started TradeCore with a simple mission: to democratize institutional-grade trading infrastructure for the retail market. No dealing desks. No re-quotes. Just pure execution.
            </p>
         </div>
      </section>

      {/* --- STATS GRID --- */}
      <section className="border-y border-white/5 bg-[#080808]">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 divide-x divide-white/5">
              <div className="py-12 text-center">
                  <div className="text-4xl font-bold text-white mb-2">2018</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest">Founded</div>
              </div>
              <div className="py-12 text-center">
                  <div className="text-4xl font-bold text-white mb-2">140k+</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest">Active Clients</div>
              </div>
              <div className="py-12 text-center">
                  <div className="text-4xl font-bold text-white mb-2">$5B+</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest">Daily Volume</div>
              </div>
              <div className="py-12 text-center">
                  <div className="text-4xl font-bold text-white mb-2">4</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest">Global Offices</div>
              </div>
          </div>
      </section>

      {/* --- VISION & VALUES --- */}
      <section className="py-32 px-6 bg-[#050505]">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
              <div>
                  <h2 className="text-4xl font-bold mb-6">Transparency is in <br/> our DNA.</h2>
                  <div className="space-y-8">
                      <div>
                          <h4 className="text-xl font-bold text-white mb-2">No Dealing Desk (NDD)</h4>
                          <p className="text-gray-400 leading-relaxed">
                              We never trade against our clients. Your orders are routed directly to our liquidity providers, ensuring no conflict of interest.
                          </p>
                      </div>
                      <div>
                          <h4 className="text-xl font-bold text-white mb-2">Ultra-Low Latency</h4>
                          <p className="text-gray-400 leading-relaxed">
                              Our servers in Equinix NY4 and LD4 data centers connect you to the markets in milliseconds, reducing slippage.
                          </p>
                      </div>
                      <div>
                          <h4 className="text-xl font-bold text-white mb-2">Security of Funds</h4>
                          <p className="text-gray-400 leading-relaxed">
                              Client funds are kept in segregated accounts with Tier-1 investment grade banks, completely separate from our operating funds.
                          </p>
                      </div>
                  </div>
              </div>
              <div className="relative h-[500px] rounded-3xl overflow-hidden border border-white/10 group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/40 to-transparent z-10"></div>
                   {/* Abstract Representation of Connectivity */}
                   <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-64 h-64 border border-blue-500/30 rounded-full animate-ping opacity-20"></div>
                        <div className="w-48 h-48 border border-blue-500/50 rounded-full animate-ping opacity-30 absolute"></div>
                        <div className="w-32 h-32 bg-blue-500/20 rounded-full blur-2xl absolute"></div>
                        <span className="relative z-20 text-2xl font-bold tracking-widest uppercase">Global<br/>Connect</span>
                   </div>
              </div>
          </div>
      </section>

      {/* --- TIMELINE --- */}
      <section className="py-32 px-6 border-t border-white/5 bg-[#080808]">
         <div className="max-w-4xl mx-auto">
             <div className="text-center mb-16">
                 <h2 className="text-3xl font-bold">Our Journey</h2>
             </div>
             
             <div className="relative border-l border-white/10 ml-6 md:ml-0 md:pl-0 space-y-12">
                 {/* 2018 */}
                 <div className="relative pl-12 md:pl-0 md:grid md:grid-cols-2 md:gap-16">
                     <div className="hidden md:block text-right">
                         <span className="text-3xl font-bold text-blue-500">2018</span>
                     </div>
                     <div className="absolute left-0 md:left-1/2 -translate-x-[5px] md:-translate-x-[5px] w-2.5 h-2.5 bg-blue-500 rounded-full ring-4 ring-[#080808]"></div>
                     <div>
                         <span className="md:hidden text-2xl font-bold text-blue-500 block mb-2">2018</span>
                         <h4 className="text-xl font-bold text-white mb-2">Inception</h4>
                         <p className="text-gray-400 text-sm">TradeCore is founded in London with a vision to build a better broker.</p>
                     </div>
                 </div>

                 {/* 2020 */}
                 <div className="relative pl-12 md:pl-0 md:grid md:grid-cols-2 md:gap-16">
                     <div className="hidden md:block text-right">
                        <h4 className="text-xl font-bold text-white mb-2">Global Expansion</h4>
                        <p className="text-gray-400 text-sm">Opened offices in Dubai and Singapore. Reached 10,000 active clients.</p>
                     </div>
                     <div className="absolute left-0 md:left-1/2 -translate-x-[5px] md:-translate-x-[5px] w-2.5 h-2.5 bg-gray-600 rounded-full ring-4 ring-[#080808]"></div>
                     <div className="block md:hidden">
                         <span className="text-2xl font-bold text-gray-500 block mb-2">2020</span>
                         <h4 className="text-xl font-bold text-white mb-2">Global Expansion</h4>
                         <p className="text-gray-400 text-sm">Opened offices in Dubai and Singapore. Reached 10,000 active clients.</p>
                     </div>
                     <div className="hidden md:block">
                        <span className="text-3xl font-bold text-gray-500">2020</span>
                     </div>
                 </div>

                 {/* 2023 */}
                 <div className="relative pl-12 md:pl-0 md:grid md:grid-cols-2 md:gap-16">
                     <div className="hidden md:block text-right">
                         <span className="text-3xl font-bold text-gray-500">2023</span>
                     </div>
                     <div className="absolute left-0 md:left-1/2 -translate-x-[5px] md:-translate-x-[5px] w-2.5 h-2.5 bg-gray-600 rounded-full ring-4 ring-[#080808]"></div>
                     <div>
                         <span className="md:hidden text-2xl font-bold text-gray-500 block mb-2">2023</span>
                         <h4 className="text-xl font-bold text-white mb-2">New Tech Stack</h4>
                         <p className="text-gray-400 text-sm">Launched TradeCore Web 2.0 with integrated TradingView charts.</p>
                     </div>
                 </div>

                 {/* 2026 */}
                 <div className="relative pl-12 md:pl-0 md:grid md:grid-cols-2 md:gap-16">
                     <div className="hidden md:block text-right">
                        <h4 className="text-xl font-bold text-white mb-2">The Future</h4>
                        <p className="text-gray-400 text-sm">Expanding into AI-driven analytics and institutional liquidity services.</p>
                     </div>
                     <div className="absolute left-0 md:left-1/2 -translate-x-[5px] md:-translate-x-[5px] w-2.5 h-2.5 bg-white rounded-full ring-4 ring-[#080808] animate-pulse"></div>
                     <div className="block md:hidden">
                         <span className="text-2xl font-bold text-white block mb-2">2026</span>
                         <h4 className="text-xl font-bold text-white mb-2">The Future</h4>
                         <p className="text-gray-400 text-sm">Expanding into AI-driven analytics and institutional liquidity services.</p>
                     </div>
                     <div className="hidden md:block">
                        <span className="text-3xl font-bold text-white">2026</span>
                     </div>
                 </div>
             </div>
         </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="border-t border-white/5 bg-black py-12 text-center">
         <div className="max-w-4xl mx-auto px-6">
             <h3 className="text-2xl font-bold text-white mb-4">Ready to trade with a leader?</h3>
             <p className="text-gray-400 mb-8">Join thousands of traders who have already made the switch.</p>
             <Link href="/login?view=signup" className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-500 transition">Create Account</Link>
             <p className="text-gray-600 text-xs mt-12">© 2026 TradeCore Technologies. All rights reserved.</p>
         </div>
      </footer>

    </div>
  );
}