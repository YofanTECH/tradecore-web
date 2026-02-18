'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function MarketsPage() {
  const [scrolled, setScrolled] = useState(false);

  // --- WIDGET REFS ---
  const tickerRef = useRef<HTMLDivElement>(null);
  const overviewRef = useRef<HTMLDivElement>(null);
  const cryptoRef = useRef<HTMLDivElement>(null);

  // --- HANDLE SCROLL FOR NAVBAR ---
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- LOAD WIDGETS ---
  useEffect(() => {
    // 1. Ticker Tape
    if (tickerRef.current) {
        tickerRef.current.innerHTML = '';
        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
        script.async = true;
        script.innerHTML = JSON.stringify({
            "symbols": [
                { "proName": "FOREXCOM:SPXUSD", "title": "S&P 500" },
                { "proName": "FOREXCOM:NSXUSD", "title": "Nasdaq 100" },
                { "proName": "FX_IDC:EURUSD", "title": "EUR/USD" },
                { "proName": "BITSTAMP:BTCUSD", "title": "Bitcoin" },
                { "proName": "BITSTAMP:ETHUSD", "title": "Ethereum" },
                { "proName": "OANDA:XAUUSD", "title": "Gold" }
            ],
            "showSymbolLogo": true,
            "colorTheme": "dark",
            "isTransparent": true,
            "displayMode": "adaptive",
            "locale": "en"
        });
        tickerRef.current.appendChild(script);
    }

    // 2. Market Overview
    if (overviewRef.current) {
        overviewRef.current.innerHTML = '';
        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js';
        script.async = true;
        script.innerHTML = JSON.stringify({
            "colorTheme": "dark",
            "dateRange": "12M",
            "showChart": true,
            "locale": "en",
            "largeChartUrl": "",
            "isTransparent": true,
            "showSymbolLogo": true,
            "width": "100%",
            "height": "600",
            "tabs": [
                {
                    "title": "Forex",
                    "symbols": [
                        { "s": "FX:EURUSD", "d": "EUR/USD" },
                        { "s": "FX:GBPUSD", "d": "GBP/USD" },
                        { "s": "FX:USDJPY", "d": "USD/JPY" },
                        { "s": "FX:USDCHF", "d": "USD/CHF" },
                        { "s": "FX:AUDUSD", "d": "AUD/USD" },
                        { "s": "FX:USDCAD", "d": "USD/CAD" }
                    ]
                },
                {
                    "title": "Commodities",
                    "symbols": [
                        { "s": "OANDA:XAUUSD", "d": "Gold" },
                        { "s": "OANDA:XAGUSD", "d": "Silver" },
                        { "s": "TVC:USOIL", "d": "US Oil" },
                        { "s": "TVC:UKOIL", "d": "Brent Oil" }
                    ]
                },
                {
                    "title": "Indices",
                    "symbols": [
                        { "s": "FOREXCOM:SPXUSD", "d": "S&P 500" },
                        { "s": "FOREXCOM:NSXUSD", "d": "Nasdaq 100" },
                        { "s": "FOREXCOM:DJI", "d": "Dow 30" },
                        { "s": "INDEX:DEU40", "d": "DAX 40" }
                    ]
                }
            ]
        });
        overviewRef.current.appendChild(script);
    }
    
    // 3. Crypto Prices
    if (cryptoRef.current) {
        cryptoRef.current.innerHTML = '';
        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-screener.js';
        script.async = true;
        script.innerHTML = JSON.stringify({
            "width": "100%",
            "height": "500",
            "defaultColumn": "overview",
            "screener_type": "crypto_mkt",
            "displayCurrency": "USD",
            "colorTheme": "dark",
            "locale": "en",
            "isTransparent": true
        });
        cryptoRef.current.appendChild(script);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden relative cursor-default">
      
      {/* --- NAVBAR --- */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#050505]/95 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tighter text-white cursor-pointer">
              TRADE<span className="text-blue-500">CORE</span>
          </Link>
          <div className="flex items-center gap-4">
             <Link href="/" className="text-sm font-medium text-gray-400 hover:text-white transition flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
                <span className="hidden md:inline">Back Home</span>
             </Link>
             <Link href="/login?view=signup" className="bg-white hover:bg-gray-200 text-black px-5 py-2 rounded-full text-sm font-bold transition shadow-lg shadow-white/5">Sign Up</Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="pt-40 pb-10 px-6 relative overflow-hidden">
         {/* Background Glow */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
         
         <div className="max-w-7xl mx-auto text-center relative z-10">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-widest uppercase mb-6">
                Live Data
            </span>
            <h1 className="text-4xl md:text-7xl font-bold mb-6 tracking-tight">
                Global Market <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Overview</span>
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto mb-10">
              Track real-time prices for Forex, Indices, and Crypto assets directly from our institutional liquidity feeds.
            </p>
         </div>
      </section>

      {/* --- LIVE TICKER TAPE --- */}
      <div className="border-y border-white/5 bg-[#0A0A0A] relative z-20">
         <div ref={tickerRef} className="tradingview-widget-container"></div>
      </div>

      {/* --- LIVE MARKET OVERVIEW (Full Table) --- */}
      <section className="py-20 bg-[#050505] border-b border-white/5">
         <div className="max-w-7xl mx-auto px-6">
             <div className="flex items-center justify-between mb-8">
                 <h2 className="text-2xl font-bold text-white">Forex & Commodities</h2>
             </div>
             <div className="bg-[#111] rounded-2xl border border-white/5 overflow-hidden p-1 h-[600px]">
                 <div ref={overviewRef} className="tradingview-widget-container h-full w-full"></div>
             </div>
         </div>
      </section>

      {/* --- CRYPTO SCREENER --- */}
      <section className="py-20 bg-[#050505]">
         <div className="max-w-7xl mx-auto px-6">
             <div className="mb-8">
                 <h2 className="text-2xl font-bold text-white">Crypto Market Cap</h2>
             </div>
             <div className="bg-[#111] rounded-2xl border border-white/5 overflow-hidden p-1 h-[500px]">
                 <div ref={cryptoRef} className="tradingview-widget-container h-full w-full"></div>
             </div>
         </div>
      </section>

      {/* --- FOOTER (MOBILE OPTIMIZED: SIDE-BY-SIDE LISTS) --- */}
      <footer className="border-t border-white/5 bg-black py-16 md:py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-12 mb-16">
            
            {/* LOGO & DESC - Top on Mobile, Left on Desktop */}
            <div className="w-full md:w-1/4">
              <span className="text-2xl font-bold text-white">TRADE<span className="text-blue-500">CORE</span></span>
              <p className="text-gray-500 text-sm mt-4 leading-relaxed">
                The world's leading premium broker. Licensed and regulated.
              </p>
            </div>

            {/* LINKS - Side-by-Side (3 Cols) on Mobile & Desktop */}
            <div className="w-full md:w-3/4 grid grid-cols-3 gap-4 md:gap-12">
                <div>
                  <h4 className="text-white font-bold mb-4 md:mb-6">Markets</h4>
                  <ul className="space-y-3 text-gray-500 text-sm">
                    <li><a href="#" className="hover:text-blue-500 transition-colors">Forex</a></li>
                    <li><a href="#" className="hover:text-blue-500 transition-colors">Indices</a></li>
                    <li><a href="#" className="hover:text-blue-500 transition-colors">Commodities</a></li>
                    <li><a href="#" className="hover:text-blue-500 transition-colors">Crypto</a></li>
                  </ul>
                </div>
                <div>
                   <h4 className="text-white font-bold mb-4 md:mb-6">Company</h4>
                   <ul className="space-y-3 text-gray-500 text-sm">
                     <li><Link href="/company/about" className="hover:text-blue-500 transition-colors">About Us</Link></li>
                     <li><Link href="/company/partnership" className="hover:text-blue-500 transition-colors">Partnership</Link></li>
                     <li><Link href="/company/contact" className="hover:text-blue-500 transition-colors">Contact</Link></li>
                   </ul>
                </div>
                 <div>
                   <h4 className="text-white font-bold mb-4 md:mb-6">Legal</h4>
                   <ul className="space-y-3 text-gray-500 text-sm">
                     <li><Link href="/legal/privacy" className="hover:text-blue-500 transition-colors">Privacy Policy</Link></li>
                     <li><Link href="/legal/risk" className="hover:text-blue-500 transition-colors">Risk Disclosure</Link></li>
                     <li><Link href="/legal/terms" className="hover:text-blue-500 transition-colors">Terms of Service</Link></li>
                   </ul>
                </div>
            </div>
          </div>
          
          <div className="border-t border-white/5 pt-10 text-center">
            <p className="text-gray-800 text-[10px] leading-relaxed max-w-4xl mx-auto">
              Risk Warning: CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage. 
              74-89% of retail investor accounts lose money when trading CFDs with this provider. 
              You should consider whether you understand how CFDs work and whether you can afford to take the high risk of losing your money.
              <br /><br />
              This platform is currently in Pre-Launch Beta. No real-money trading services are offered at this time.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}