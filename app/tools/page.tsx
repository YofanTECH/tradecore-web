'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

export default function ToolsPage() {
  
  // --- WIDGET REFS ---
  const calendarRef = useRef<HTMLDivElement>(null);
  const techAnalysisRef = useRef<HTMLDivElement>(null);
  const heatmapRef = useRef<HTMLDivElement>(null);
  const crossRatesRef = useRef<HTMLDivElement>(null);

  // --- CALCULATOR STATE ---
  const [lotSize, setLotSize] = useState<string>('1.0');
  const [openPrice, setOpenPrice] = useState<string>('1.08500');
  const [closePrice, setClosePrice] = useState<string>('1.09000');
  const [direction, setDirection] = useState<'buy' | 'sell'>('buy');
  const [profit, setProfit] = useState<number | null>(null);

  // --- CALCULATOR LOGIC ---
  const calculateProfit = () => {
      const lots = parseFloat(lotSize);
      const open = parseFloat(openPrice);
      const close = parseFloat(closePrice);
      
      if(isNaN(lots) || isNaN(open) || isNaN(close)) return;

      // Simple Forex Calculation: (Close - Open) * 100,000 * Lots
      let pnl = (close - open) * 100000 * lots;
      if (direction === 'sell') pnl = -pnl;
      
      setProfit(pnl);
  };

  // --- LOAD WIDGETS ---
  useEffect(() => {
    // 1. Economic Calendar
    if (calendarRef.current) {
        calendarRef.current.innerHTML = '';
        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-events.js';
        script.async = true;
        script.innerHTML = JSON.stringify({
            "width": "100%",
            "height": "600",
            "colorTheme": "dark",
            "isTransparent": true,
            "locale": "en",
            "importanceFilter": "0,1",
            "currencyFilter": "USD,EUR,GBP,JPY,AUD,CAD"
        });
        calendarRef.current.appendChild(script);
    }

    // 2. Technical Analysis
    if (techAnalysisRef.current) {
        techAnalysisRef.current.innerHTML = '';
        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js';
        script.async = true;
        script.innerHTML = JSON.stringify({
            "interval": "1m",
            "width": "100%",
            "isTransparent": true,
            "height": "450",
            "symbol": "FX:EURUSD",
            "showIntervalTabs": true,
            "displayMode": "single",
            "locale": "en",
            "colorTheme": "dark"
        });
        techAnalysisRef.current.appendChild(script);
    }

    // 3. Forex Heatmap
    if (heatmapRef.current) {
        heatmapRef.current.innerHTML = '';
        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-forex-heat-map.js';
        script.async = true;
        script.innerHTML = JSON.stringify({
            "width": "100%",
            "height": "500",
            "currencies": ["EUR", "USD", "JPY", "GBP", "CHF", "AUD", "CAD", "NZD", "CNY"],
            "isTransparent": true,
            "colorTheme": "dark",
            "locale": "en"
        });
        heatmapRef.current.appendChild(script);
    }

    // 4. Cross Rates
    if (crossRatesRef.current) {
        crossRatesRef.current.innerHTML = '';
        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-forex-cross-rates.js';
        script.async = true;
        script.innerHTML = JSON.stringify({
            "width": "100%",
            "height": "450",
            "currencies": ["EUR", "USD", "JPY", "GBP", "CHF", "AUD", "CAD", "NZD"],
            "isTransparent": true,
            "colorTheme": "dark",
            "locale": "en"
        });
        crossRatesRef.current.appendChild(script);
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
             <Link href="/markets" className="text-sm font-medium text-gray-400 hover:text-white transition hidden md:block">Markets</Link>
             <Link href="/login?view=signin" className="text-sm font-medium text-gray-400 hover:text-white transition">Log In</Link>
             <Link href="/login?view=signup" className="bg-white hover:bg-gray-200 text-black px-5 py-2 rounded-full text-sm font-bold transition shadow-lg shadow-white/5">Sign Up</Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>
         
         <div className="max-w-7xl mx-auto text-center relative z-10">
            <span className="inline-block py-1 px-3 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold tracking-widest uppercase mb-6">
                Institutional Grade
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                Analytic <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Tools</span>
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto mb-10">
              Everything you need to analyze the markets. Economic events, technical gauges, and real-time calculators in one dashboard.
            </p>
         </div>
      </section>

      {/* --- GRID LAYOUT 1: CALENDAR & CALCULATOR --- */}
      <section className="py-12 bg-[#0A0A0A] relative z-10 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* LEFT: ECONOMIC CALENDAR (2/3 Width) */}
              <div className="lg:col-span-2 bg-[#111] rounded-3xl border border-white/5 p-1 shadow-2xl">
                  <div className="p-6 border-b border-white/5">
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                          Global Economic Calendar
                      </h3>
                      <p className="text-sm text-gray-500">Real-time data releases and market-moving events.</p>
                  </div>
                  <div ref={calendarRef} className="tradingview-widget-container rounded-b-2xl overflow-hidden"></div>
              </div>

              {/* RIGHT: CUSTOM PROFIT CALCULATOR (1/3 Width) */}
              <div className="lg:col-span-1 bg-[#111] rounded-3xl border border-white/5 p-8 shadow-2xl h-fit sticky top-24">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-500"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25v-.008Zm2.25-4.5h.008v.008H10.5v-.008Zm0 2.25h.008v.008H10.5v-.008Zm0 2.25h.008v.008H10.5v-.008Zm2.25-4.5h.008v.008H12.75v-.008Zm0 2.25h.008v.008H12.75v-.008Zm0 2.25h.008v.008H12.75v-.008Zm2.25-4.5h.008v.008H15v-.008Zm0 2.25h.008v.008H15v-.008Zm0 2.25h.008v.008H15v-.008ZM7.5 10.5h6.975a2.25 2.25 0 0 1 2.25 2.25v9.375a2.25 2.25 0 0 1-2.25 2.25H7.5a2.25 2.25 0 0 1-2.25-2.25V12.75a2.25 2.25 0 0 1 2.25-2.25Z" /></svg>
                      Profit Calculator
                  </h3>
                  
                  <div className="space-y-4">
                      {/* Direction Switch */}
                      <div className="flex bg-black/50 p-1 rounded-lg border border-white/10">
                          <button onClick={() => setDirection('buy')} className={`flex-1 py-2 rounded-md text-sm font-bold transition ${direction === 'buy' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-white'}`}>Buy / Long</button>
                          <button onClick={() => setDirection('sell')} className={`flex-1 py-2 rounded-md text-sm font-bold transition ${direction === 'sell' ? 'bg-red-600 text-white' : 'text-gray-500 hover:text-white'}`}>Sell / Short</button>
                      </div>

                      {/* Inputs */}
                      <div>
                          <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Lot Size</label>
                          <input type="number" value={lotSize} onChange={(e) => setLotSize(e.target.value)} className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Open Price</label>
                              <input type="number" value={openPrice} onChange={(e) => setOpenPrice(e.target.value)} className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none" />
                          </div>
                          <div>
                              <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Close Price</label>
                              <input type="number" value={closePrice} onChange={(e) => setClosePrice(e.target.value)} className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none" />
                          </div>
                      </div>

                      {/* Calculate Button */}
                      <button onClick={calculateProfit} className="w-full py-3 bg-white hover:bg-gray-200 text-black font-bold rounded-lg transition">Calculate</button>

                      {/* Result */}
                      {profit !== null && (
                          <div className={`mt-6 p-4 rounded-xl text-center border ${profit >= 0 ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                              <p className="text-xs text-gray-400 uppercase font-bold mb-1">Estimated P&L</p>
                              <p className={`text-2xl font-mono font-bold ${profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                  {profit >= 0 ? '+' : '-'}${Math.abs(profit).toFixed(2)}
                              </p>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      </section>

      {/* --- GRID LAYOUT 2: TECHNICALS & CROSS RATES --- */}
      <section className="py-12 bg-[#050505]">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* TECHNICAL GAUGE */}
              <div className="bg-[#111] rounded-3xl border border-white/5 p-1 shadow-2xl">
                  <div className="p-6 border-b border-white/5">
                      <h3 className="text-xl font-bold text-white">Technical Analysis</h3>
                      <p className="text-sm text-gray-500">Real-time buy/sell signals based on moving averages.</p>
                  </div>
                  <div ref={techAnalysisRef} className="tradingview-widget-container rounded-b-2xl overflow-hidden p-4"></div>
              </div>

              {/* CROSS RATES */}
              <div className="bg-[#111] rounded-3xl border border-white/5 p-1 shadow-2xl">
                  <div className="p-6 border-b border-white/5">
                      <h3 className="text-xl font-bold text-white">Forex Cross Rates</h3>
                      <p className="text-sm text-gray-500">Live matrix of global currency pairs.</p>
                  </div>
                  <div ref={crossRatesRef} className="tradingview-widget-container rounded-b-2xl overflow-hidden p-4"></div>
              </div>

          </div>
      </section>

      {/* --- SECTION 3: HEATMAP --- */}
      <section className="py-12 bg-[#0A0A0A] border-t border-white/5 pb-32">
          <div className="max-w-7xl mx-auto px-6">
              <div className="mb-8 text-center">
                  <h2 className="text-3xl font-bold text-white mb-2">Currency Heatmap</h2>
                  <p className="text-gray-400">Visualize currency strength and weakness in real-time.</p>
              </div>
              <div className="bg-[#111] rounded-3xl border border-white/5 p-1 shadow-2xl overflow-hidden">
                  <div ref={heatmapRef} className="tradingview-widget-container rounded-2xl"></div>
              </div>
          </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="border-t border-white/5 bg-black py-16 text-center">
         <p className="text-gray-600 text-xs">© 2026 TradeCore Technologies. All rights reserved.</p>
      </footer>

    </div>
  );
}