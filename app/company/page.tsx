'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CompanyHub() {
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll for navbar transparency
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
          <div className="flex items-center gap-8">
             <Link href="/" className="text-sm font-medium text-gray-400 hover:text-white transition hidden md:block">Home</Link>
             <Link href="/markets" className="text-sm font-medium text-gray-400 hover:text-white transition hidden md:block">Markets</Link>
             <Link href="/login?view=signin" className="text-sm font-medium text-white hover:text-blue-400 transition">Log In</Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-48 pb-32 px-6 overflow-hidden">
         {/* Abstract Background Elements */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>
         <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-purple-900/5 rounded-full blur-[120px] pointer-events-none"></div>

         <div className="max-w-5xl mx-auto text-center relative z-10">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-widest uppercase mb-6">
                Corporate Hub
            </span>
            <h1 className="text-5xl md:text-8xl font-bold mb-8 tracking-tight leading-tight">
                The Backbone of <br/> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-blue-500">Modern Finance.</span>
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto mb-12 font-light">
              TradeCore isn't just a broker. We are a fintech powerhouse building the infrastructure that connects retail traders to institutional liquidity.
            </p>
         </div>
      </section>

      {/* --- STATS STRIP --- */}
      <section className="border-y border-white/5 bg-[#080808] relative z-10">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 divide-x divide-white/5">
              <div className="py-12 text-center group hover:bg-white/5 transition duration-500">
                  <div className="text-4xl font-bold text-white mb-2 group-hover:text-blue-500 transition">$150B+</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest">Monthly Volume</div>
              </div>
              <div className="py-12 text-center group hover:bg-white/5 transition duration-500">
                  <div className="text-4xl font-bold text-white mb-2 group-hover:text-blue-500 transition">140k</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest">Active Clients</div>
              </div>
              <div className="py-12 text-center group hover:bg-white/5 transition duration-500">
                  <div className="text-4xl font-bold text-white mb-2 group-hover:text-blue-500 transition">12ms</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest">Avg Latency</div>
              </div>
              <div className="py-12 text-center group hover:bg-white/5 transition duration-500">
                  <div className="text-4xl font-bold text-white mb-2 group-hover:text-blue-500 transition">180+</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest">Countries Served</div>
              </div>
          </div>
      </section>

      {/* --- CORE PILLARS --- */}
      <section className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
              <div className="mb-20">
                  <h2 className="text-4xl font-bold mb-4">Our Core Pillars</h2>
                  <p className="text-gray-400 max-w-xl">The foundation upon which we build every product and service.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Pillar 1 */}
                  <div className="p-10 rounded-3xl bg-[#0A0A0A] border border-white/10 hover:border-blue-500/50 transition-all duration-500 group">
                      <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-blue-500"><path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" /></svg>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-4">Technology First</h3>
                      <p className="text-gray-400 leading-relaxed">
                          We don't outsource our core tech. Our matching engine is built in-house to ensure zero downtime and millisecond execution speeds.
                      </p>
                  </div>

                  {/* Pillar 2 */}
                  <div className="p-10 rounded-3xl bg-[#0A0A0A] border border-white/10 hover:border-purple-500/50 transition-all duration-500 group">
                      <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-purple-500"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" /></svg>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-4">Radical Transparency</h3>
                      <p className="text-gray-400 leading-relaxed">
                          We operate a strictly No Dealing Desk (NDD) model. We never trade against our clients. Your win is our win.
                      </p>
                  </div>

                  {/* Pillar 3 */}
                  <div className="p-10 rounded-3xl bg-[#0A0A0A] border border-white/10 hover:border-green-500/50 transition-all duration-500 group">
                      <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-green-500"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" /></svg>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-4">Global Reach</h3>
                      <p className="text-gray-400 leading-relaxed">
                          With servers in London, New York, and Tokyo, we ensure you are always connected to the markets with minimal latency.
                      </p>
                  </div>
              </div>
          </div>
      </section>

      {/* --- EXPLORE SECTION (NAVIGATION) --- */}
      <section className="py-20 bg-[#0A0A0A] border-t border-white/5">
         <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-12 text-center">Explore TradeCore</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* 1. About Page Link */}
                <Link href="/company/about" className="group relative overflow-hidden rounded-3xl h-80 border border-white/10 hover:border-blue-500/50 transition-all">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10"></div>
                    <div className="absolute inset-0 bg-[#111] group-hover:scale-105 transition-transform duration-700"></div>
                    <div className="absolute bottom-0 left-0 p-8 z-20">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:-translate-y-2 transition-transform duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-1">About Us</h3>
                        <p className="text-sm text-gray-400">Our history and leadership.</p>
                    </div>
                </Link>

                {/* 2. Partnership Page Link */}
                <Link href="/company/partnership" className="group relative overflow-hidden rounded-3xl h-80 border border-white/10 hover:border-purple-500/50 transition-all">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10"></div>
                    <div className="absolute inset-0 bg-[#111] group-hover:scale-105 transition-transform duration-700"></div>
                    <div className="absolute bottom-0 left-0 p-8 z-20">
                        <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center mb-4 group-hover:-translate-y-2 transition-transform duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-1">Partnership</h3>
                        <p className="text-sm text-gray-400">Become an IB or Affiliate.</p>
                    </div>
                </Link>

                {/* 3. Contact Page Link */}
                <Link href="/company/contact" className="group relative overflow-hidden rounded-3xl h-80 border border-white/10 hover:border-green-500/50 transition-all">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10"></div>
                    <div className="absolute inset-0 bg-[#111] group-hover:scale-105 transition-transform duration-700"></div>
                    <div className="absolute bottom-0 left-0 p-8 z-20">
                        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center mb-4 group-hover:-translate-y-2 transition-transform duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-1">Contact Us</h3>
                        <p className="text-sm text-gray-400">24/7 Global Support.</p>
                    </div>
                </Link>

            </div>
         </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 bg-black py-16 text-center">
         <p className="text-gray-600 text-xs">© 2026 TradeCore Technologies. All rights reserved.</p>
      </footer>
    </div>
  );
}