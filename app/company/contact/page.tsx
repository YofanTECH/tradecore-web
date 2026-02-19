'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ContactPage() {
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
              GAV<span className="text-blue-500">BLUE</span>
          </Link>
          <div className="flex items-center gap-6">
             <Link href="/company/about" className="text-sm font-medium text-gray-400 hover:text-white transition flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
                Back to Company
             </Link>
             <Link href="/login?view=signin" className="hidden md:block bg-white hover:bg-gray-200 text-black px-5 py-2 rounded-full text-sm font-bold transition shadow-lg shadow-white/5">Client Portal</Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-48 pb-20 px-6">
         {/* Background Glow */}
         <div className="absolute top-0 right-1/2 translate-x-1/2 w-[1000px] h-[600px] bg-green-900/10 rounded-full blur-[120px] pointer-events-none"></div>

         <div className="max-w-4xl mx-auto text-center relative z-10">
            <span className="text-green-500 text-xs font-bold tracking-widest uppercase mb-6 block">24/7 Global Support</span>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight leading-tight">
                How can we <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">help you today?</span>
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
              Our team of trading specialists is available around the clock to assist with technical issues, account inquiries, or partnership opportunities.
            </p>
         </div>
      </section>

      {/* --- CONTACT GRID --- */}
      <section className="py-20 border-t border-white/5 bg-[#080808] relative z-10">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
              
              {/* LEFT: INFO CARDS */}
              <div className="space-y-8">
                  {/* Email Card */}
                  <div className="p-8 rounded-3xl bg-[#111] border border-white/10 hover:border-green-500/30 transition group">
                      <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-6 text-green-500">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">General Support</h3>
                      <p className="text-gray-400 text-sm mb-4">For account queries and technical assistance.</p>
                      <a href="mailto:info@gavblue.com" className="text-white font-mono hover:text-green-500 transition">info@gavblue.com &rarr;</a>
                  </div>

                  {/* Partnership Card */}
                  <div className="p-8 rounded-3xl bg-[#111] border border-white/10 hover:border-purple-500/30 transition group">
                      <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 text-purple-500">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" /></svg>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Partnerships</h3>
                      <p className="text-gray-400 text-sm mb-4">For IBs, Affiliates, and Institutional services.</p>
                      <a href="mailto:partners@gavblue.com" className="text-white font-mono hover:text-purple-500 transition">partners@gavblue.com &rarr;</a>
                  </div>

                  {/* HQ Card */}
                  <div className="p-8 rounded-3xl bg-[#111] border border-white/10 hover:border-blue-500/30 transition group">
                      <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 text-blue-500">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Headquarters</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                          9A CT House, 2nd floor,<br/>
                          Providence, Mahe,<br/>
                          Seychelles
                      </p>
                  </div>
              </div>

              {/* RIGHT: CONTACT FORM */}
              <div className="bg-[#111] p-10 rounded-3xl border border-white/10 shadow-2xl h-fit">
                  <h2 className="text-2xl font-bold text-white mb-6">Send us a message</h2>
                  <form className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                          <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">First Name</label>
                              <input type="text" className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition" />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Last Name</label>
                              <input type="text" className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition" />
                          </div>
                      </div>
                      
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email Address</label>
                          <input type="email" className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition" />
                      </div>

                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Department</label>
                          <select className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition appearance-none">
                              <option>General Support</option>
                              <option>Technical Issue</option>
                              <option>Partnership Inquiry</option>
                              <option>Compliance</option>
                          </select>
                      </div>

                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Message</label>
                          <textarea rows={5} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition" placeholder="How can we help?"></textarea>
                      </div>

                      <button className="w-full bg-white hover:bg-gray-200 text-black font-bold py-4 rounded-xl transition shadow-lg shadow-white/10">
                          Submit Request
                      </button>
                  </form>
              </div>

          </div>
      </section>

      {/* --- REGIONAL OFFICES --- */}
      <section className="py-20 bg-[#050505] border-t border-white/5">
          <div className="max-w-6xl mx-auto px-6">
              <h2 className="text-2xl font-bold text-white mb-10 text-center">Regional Presence</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  <div className="text-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mx-auto mb-4 animate-pulse"></div>
                      <h4 className="font-bold text-white">London</h4>
                      <p className="text-xs text-gray-500 mt-1">Tech & Liquidity</p>
                  </div>
                  <div className="text-center">
                      <div className="w-3 h-3 bg-white/20 rounded-full mx-auto mb-4"></div>
                      <h4 className="font-bold text-white">Dubai</h4>
                      <p className="text-xs text-gray-500 mt-1">Sales & Marketing</p>
                  </div>
                  <div className="text-center">
                      <div className="w-3 h-3 bg-white/20 rounded-full mx-auto mb-4"></div>
                      <h4 className="font-bold text-white">Singapore</h4>
                      <p className="text-xs text-gray-500 mt-1">APAC Support</p>
                  </div>
                  <div className="text-center">
                      <div className="w-3 h-3 bg-white/20 rounded-full mx-auto mb-4"></div>
                      <h4 className="font-bold text-white">Tokyo</h4>
                      <p className="text-xs text-gray-500 mt-1">Infrastructure</p>
                  </div>
              </div>
          </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="border-t border-white/5 bg-black py-12 text-center">
         <div className="max-w-4xl mx-auto px-6">
             <p className="text-gray-600 text-xs">© 2026 Gavblue Technologies. All rights reserved.</p>
         </div>
      </footer>

    </div>
  );
}