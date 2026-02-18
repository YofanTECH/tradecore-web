'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

export default function MarketsPage() {
  
  // --- WIDGET REFS ---
  const tickerRef = useRef<HTMLDivElement>(null);
  const overviewRef = useRef<HTMLDivElement>(null);
  const cryptoRef = useRef<HTMLDivElement>(null);

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

    // 2. Market Overview (Forex & Indices)
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
            "height": "500",
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
            "height": "400",
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
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed w-full z-50 bg-[#050505]/90 backdrop-blur-xl border-b border-white/5 py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tighter text-white cursor-pointer">
              TRADE<span className="text-blue-500">CORE</span>
          </Link>
          <div className="flex items-center gap-6">
             <Link href="/" className="text-sm font-medium text-gray-400 hover:text-white transition hidden md:block">Home</Link>
             <Link href="/login?view=signin" className="text-sm font-medium text-gray-400 hover:text-white transition">Log In</Link>
             <Link href="/login?view=signup" className="bg-white hover:bg-gray-200 text-black px-5 py-2 rounded-full text-sm font-bold transition shadow-lg shadow-white/5">Sign Up</Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
         {/* Background Glow */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
         
         <div className="max-w-7xl mx-auto text-center relative z-10">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-widest uppercase mb-6">
                Global Access
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                One Account. <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">2,000+ Markets.</span>
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto mb-10">
              Trade CFDs on Forex, Indices, Commodities, and Cryptocurrencies with raw spreads and institutional-grade execution.
            </p>
            <div className="flex justify-center gap-4">
                <Link href="/login?view=signup" className="px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 transition shadow-lg shadow-blue-500/20">
                    Start Trading
                </Link>
            </div>
         </div>
      </section>

      {/* --- LIVE TICKER TAPE --- */}
      <div className="border-y border-white/5 bg-[#0A0A0A] relative z-20">
         <div ref={tickerRef} className="tradingview-widget-container"></div>
      </div>

      {/* --- ASSET CLASSES GRID --- */}
      <section className="py-24 bg-[#0A0A0A] relative z-10">
          <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Forex Card */}
                  <div className="p-8 rounded-2xl bg-[#111] border border-white/5 hover:border-blue-500/30 transition group">
                      <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.769 3.07.769 4.242 0 1.172-.769 1.172-2.033 0-2.817-.117-.077-.32-.207-.606-.386M7 21a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3ZM17 21a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3Z" /></svg>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Forex</h3>
                      <p className="text-sm text-gray-500 mb-4">50+ Pairs including Majors, Minors & Exotics.</p>
                      <ul className="text-xs text-gray-400 space-y-2">
                          <li className="flex items-center gap-2"><span className="w-1 h-1 bg-green-500 rounded-full"></span> Spreads from 0.0 pips</li>
                          <li className="flex items-center gap-2"><span className="w-1 h-1 bg-green-500 rounded-full"></span> Leverage up to 500:1</li>
                      </ul>
                  </div>

                  {/* Crypto Card */}
                  <div className="p-8 rounded-2xl bg-[#111] border border-white/5 hover:border-orange-500/30 transition group">
                      <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-6 group-hover:scale-110 transition-transform">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" /></svg>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Crypto</h3>
                      <p className="text-sm text-gray-500 mb-4">Trade Bitcoin, Ethereum & Altcoins 24/7.</p>
                      <ul className="text-xs text-gray-400 space-y-2">
                          <li className="flex items-center gap-2"><span className="w-1 h-1 bg-green-500 rounded-full"></span> Deep Liquidity</li>
                          <li className="flex items-center gap-2"><span className="w-1 h-1 bg-green-500 rounded-full"></span> Long & Short Trading</li>
                      </ul>
                  </div>

                   {/* Indices Card */}
                   <div className="p-8 rounded-2xl bg-[#111] border border-white/5 hover:border-purple-500/30 transition group">
                      <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-6 group-hover:scale-110 transition-transform">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Indices</h3>
                      <p className="text-sm text-gray-500 mb-4">S&P 500, NASDAQ, DAX 40 & more.</p>
                      <ul className="text-xs text-gray-400 space-y-2">
                          <li className="flex items-center gap-2"><span className="w-1 h-1 bg-green-500 rounded-full"></span> No Commission</li>
                          <li className="flex items-center gap-2"><span className="w-1 h-1 bg-green-500 rounded-full"></span> Dividend Adjustments</li>
                      </ul>
                  </div>

                  {/* Commodities Card */}
                  <div className="p-8 rounded-2xl bg-[#111] border border-white/5 hover:border-yellow-500/30 transition group">
                      <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 mb-6 group-hover:scale-110 transition-transform">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m0 0l-2.25-1.313m0 0l2.25-1.313M9 14.25V19.5m-2.25-1.313L9 16.5v-2.25" /></svg>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Commodities</h3>
                      <p className="text-sm text-gray-500 mb-4">Gold, Silver, Oil & Natural Gas.</p>
                      <ul className="text-xs text-gray-400 space-y-2">
                          <li className="flex items-center gap-2"><span className="w-1 h-1 bg-green-500 rounded-full"></span> Ultra-Fast Execution</li>
                          <li className="flex items-center gap-2"><span className="w-1 h-1 bg-green-500 rounded-full"></span> Low Margins</li>
                      </ul>
                  </div>
              </div>
          </div>
      </section>

      {/* --- LIVE MARKET OVERVIEW (Full Table) --- */}
      <section className="py-20 bg-[#050505] border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6">
              <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-white">Live Market Rates</h2>
                  <div className="flex gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      <span className="text-xs text-gray-400 uppercase tracking-widest">Streaming</span>
                  </div>
              </div>
              <div className="bg-[#111] rounded-2xl border border-white/5 overflow-hidden p-1">
                  <div ref={overviewRef} className="tradingview-widget-container"></div>
              </div>
          </div>
      </section>

      {/* --- CRYPTO SCREENER --- */}
      <section className="py-20 bg-[#050505] border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6">
              <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white">Top Crypto Movers</h2>
                  <p className="text-sm text-gray-500">Real-time data for the top performing digital assets.</p>
              </div>
              <div className="bg-[#111] rounded-2xl border border-white/5 overflow-hidden p-1">
                  <div ref={cryptoRef} className="tradingview-widget-container"></div>
              </div>
          </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="border-t border-white/5 bg-black py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-12 md:mb-16">
            <div className="col-span-1">
              <span className="text-2xl font-bold text-white">TRADE<span className="text-blue-500">CORE</span></span>
              <p className="text-gray-500 text-sm mt-4 leading-relaxed">
                The world's leading premium broker. Licensed and regulated.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 md:mb-6">Markets</h4>
              <ul className="space-y-2 md:space-y-3 text-gray-500 text-sm">
                <li><a href="https://www.tradingview.com/markets/currencies/" target="_blank" className="hover:text-blue-500 transition-colors">Forex</a></li>
                <li><a href="https://www.tradingview.com/markets/indices/" target="_blank" className="hover:text-blue-500 transition-colors">Indices</a></li>
                <li><a href="https://www.tradingview.com/markets/futures/" target="_blank" className="hover:text-blue-500 transition-colors">Commodities</a></li>
                <li><a href="https://www.tradingview.com/markets/cryptocurrencies/" target="_blank" className="hover:text-blue-500 transition-colors">Crypto</a></li>
              </ul>
            </div>
            <div>
               <h4 className="text-white font-bold mb-4 md:mb-6">Company</h4>
               <ul className="space-y-2 md:space-y-3 text-gray-500 text-sm">
                 <li><Link href="/company/about" className="hover:text-blue-500 transition-colors">About Us</Link></li>
                 <li><Link href="/company/partnership" className="hover:text-blue-500 transition-colors">Partnership</Link></li>
                 <li><Link href="/company/contact" className="hover:text-blue-500 transition-colors">Contact</Link></li>
               </ul>
            </div>
             <div>
               <h4 className="text-white font-bold mb-4 md:mb-6">Legal</h4>
               <ul className="space-y-2 md:space-y-3 text-gray-500 text-sm">
                 <li><Link href="/legal/privacy" className="hover:text-blue-500 transition-colors">Privacy Policy</Link></li>
                 <li><Link href="/legal/risk" className="hover:text-blue-500 transition-colors">Risk Disclosure</Link></li>
                 <li><Link href="/legal/terms" className="hover:text-blue-500 transition-colors">Terms of Service</Link></li>
               </ul>
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