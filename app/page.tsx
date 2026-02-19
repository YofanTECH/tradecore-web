'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

// ============================================================================
// AI SUPPORT CHAT COMPONENT (WITH LIVE CONNECTION SIMULATION)
// ============================================================================
const AGENT_NAMES = ["Elena", "Liam", "Sofia", "Mateo", "Yuki", "Amara", "Julian", "Chloe", "Kael", "Anya"];

const AiSupportChat = () => {
    const [position, setPosition] = useState({ x: 30, y: 30 }); 
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [hasMoved, setHasMoved] = useState(false);
    
    const [isOpen, setIsOpen] = useState(false);
    const [agentName, setAgentName] = useState('Support');
    
    // NEW: Connection Simulation States
    const [isConnecting, setIsConnecting] = useState(false);
    const [hasConnected, setHasConnected] = useState(false);

    const [messages, setMessages] = useState<{role: 'ai'|'user', text: string}[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Pick a random agent name on mount (but don't set message yet)
    useEffect(() => {
        const randomName = AGENT_NAMES[Math.floor(Math.random() * AGENT_NAMES.length)];
        setAgentName(randomName);
    }, []);

    // LIVE CONNECTION SIMULATION
    useEffect(() => {
        if (isOpen && !hasConnected && !isConnecting) {
            setIsConnecting(true);
            
            // Step 1: Simulate network connection routing (2 seconds)
            setTimeout(() => {
                setIsConnecting(false);
                setHasConnected(true);
                setIsTyping(true); // Step 2: Agent starts typing
                
                // Step 3: Send initial greeting (1.2 seconds later)
                setTimeout(() => {
                    setMessages([
                        { role: 'ai', text: `Hello! My name is ${agentName}, your dedicated Gavblue Trading Specialist. How can I help you dominate the markets today?` }
                    ]);
                    setIsTyping(false);
                }, 1200);

            }, 2000);
        }
    }, [isOpen, hasConnected, isConnecting, agentName]);

    // Auto-scroll to bottom of chat
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping, hasConnected]);

    // Dragging Logic
    const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDragging(true);
        setHasMoved(false);
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        setDragStart({ x: clientX, y: clientY });
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent | TouchEvent) => {
            if (!isDragging) return;
            const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
            const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
            
            const dx = dragStart.x - clientX;
            const dy = dragStart.y - clientY;

            if (Math.abs(dx) > 5 || Math.abs(dy) > 5) setHasMoved(true);

            setPosition((prev) => ({
                x: Math.max(10, Math.min(window.innerWidth - 60, prev.x + dx)),
                y: Math.max(10, Math.min(window.innerHeight - 60, prev.y + dy)),
            }));
            setDragStart({ x: clientX, y: clientY });
        };

        const handleMouseUp = () => setIsDragging(false);

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('touchmove', handleMouseMove, { passive: false });
            window.addEventListener('mouseup', handleMouseUp);
            window.addEventListener('touchend', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchend', handleMouseUp);
        };
    }, [isDragging, dragStart]);

    const handleClick = () => {
        if (!hasMoved) setIsOpen(!isOpen);
    };

    // --- REAL AI INTEGRATION LOGIC ---
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || !hasConnected) return;

        const userMsg = inputValue.trim();
        // Add user message to UI immediately
        const newMessages = [...messages, { role: 'user' as const, text: userMsg }];
        setMessages(newMessages);
        setInputValue('');
        setIsTyping(true);

        try {
            // Call the secure backend API
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    message: userMsg,
                    history: messages, // Pass history so AI remembers the conversation
                    agentName: agentName // Send the dynamic name to the backend
                }),
            });

            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();
            
            // Add AI response to UI
            setMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { role: 'ai', text: "I'm having a slight connection issue right now, but Gavblue's trading servers are fully operational! Please try asking again in a moment." }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <>
            {/* The Draggable Button */}
            <div
                onMouseDown={handleMouseDown}
                onTouchStart={handleMouseDown}
                onClick={handleClick}
                style={{ 
                    right: `${position.x}px`, 
                    bottom: `${position.y}px`,
                    cursor: isDragging ? 'grabbing' : 'pointer',
                    touchAction: 'none'
                }}
                className="fixed z-[100] w-14 h-14 md:w-16 md:h-16 bg-[#FFE600] rounded-full shadow-[0_4px_20px_rgba(255,230,0,0.4)] flex items-center justify-center hover:scale-110 transition-transform active:scale-95 group"
            >
                 {isOpen ? (
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 text-black"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                 ) : (
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 md:w-8 md:h-8 text-black"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" /></svg>
                 )}
                 {!isOpen && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3 md:h-4 md:w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 md:h-4 md:w-4 bg-blue-500 border-2 border-black"></span>
                    </span>
                 )}
            </div>

            {/* Chat Window */}
            <div className={`fixed bottom-24 right-4 md:right-10 w-[calc(100vw-32px)] md:w-[380px] h-[500px] bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl flex flex-col z-[110] transition-all duration-300 origin-bottom-right overflow-hidden ${isOpen ? 'scale-100 opacity-100 visible' : 'scale-90 opacity-0 invisible pointer-events-none'}`}>
                {/* Header */}
                <div className="h-16 bg-[#111] border-b border-white/5 flex items-center px-4 justify-between flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                            {hasConnected ? agentName.charAt(0) : <span className="animate-pulse">...</span>}
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-sm">{hasConnected ? `${agentName} - Gavblue Support` : 'Gavblue Support'}</h3>
                            <p className="text-[10px] text-gray-400 flex items-center gap-1">
                                {hasConnected ? (
                                    <><span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span> Online</>
                                ) : (
                                    <><span className="w-1.5 h-1.5 rounded-full bg-yellow-500 inline-block animate-pulse"></span> Connecting...</>
                                )}
                            </p>
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white transition"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
                    {!hasConnected ? (
                        // Connecting Spinner Overlay
                        <div className="flex flex-col items-center justify-center h-full space-y-4 opacity-70">
                            <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                            <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest animate-pulse">Connecting to Agent...</p>
                        </div>
                    ) : (
                        // Real Messages
                        <>
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-[#1A1A1A] text-gray-200 border border-white/5 rounded-bl-none'}`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex w-full justify-start">
                                    <div className="max-w-[85%] rounded-2xl px-4 py-3 bg-[#1A1A1A] border border-white/5 rounded-bl-none flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-3 border-t border-white/5 bg-[#0A0A0A] flex-shrink-0">
                    <form onSubmit={handleSendMessage} className="relative flex items-center">
                        <input 
                            type="text" 
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            disabled={!hasConnected || isTyping}
                            placeholder={hasConnected ? `Reply to ${agentName}...` : "Please wait..."}
                            className="w-full bg-[#111] border border-white/10 text-white text-sm rounded-xl pl-4 pr-12 py-3 outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
                        />
                        <button 
                            type="submit" 
                            disabled={!inputValue.trim() || isTyping || !hasConnected}
                            className="absolute right-2 w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white hover:bg-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 translate-x-px -translate-y-px"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" /></svg>
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};
// ============================================================================


export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileAppsOpen, setMobileAppsOpen] = useState(false); // NEW STATE FOR MOBILE APPS

  // --- REAL RANDOMIZED DATA ---
  const [stats, setStats] = useState({
    volume: 0, 
    latency: 0,
    traders: 0,
  });

  useEffect(() => {
    setStats({
      volume: 4.2 + Math.random(), 
      latency: Math.floor(Math.random() * (14 - 8 + 1) + 8),
      traders: 142000 + Math.floor(Math.random() * 5000),
    });

    const interval = setInterval(() => {
      setStats(prev => ({
        volume: prev.volume + (Math.random() * 0.05 - 0.02),
        latency: Math.floor(Math.random() * (14 - 8 + 1) + 8),
        traders: prev.traders + Math.floor(Math.random() * 5),
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Handle scroll & mouse
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    const handleMouseMove = (e: MouseEvent) => setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // --- TRADINGVIEW WIDGETS ---
  const tickerTapeRef = useRef<HTMLDivElement>(null);
  const marketOverviewRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Ticker Tape Widget
    if (tickerTapeRef.current) {
      tickerTapeRef.current.innerHTML = ''; 
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
      tickerTapeRef.current.appendChild(script);
    }

    // 2. Market Overview Widget
    if (marketOverviewRef.current) {
      marketOverviewRef.current.innerHTML = ''; 
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
        "showFloatingTooltip": false,
        "width": "100%",
        "height": "600",
        "tabs": [
          { "title": "Metals", "symbols": [{ "s": "OANDA:XAUUSD", "d": "Gold Spot" }, { "s": "OANDA:XAGUSD", "d": "Silver Spot" }, { "s": "OANDA:XPTUSD", "d": "Platinum" }, { "s": "TVC:USOIL", "d": "US Oil (WTI)" }, { "s": "TVC:UKOIL", "d": "Brent Oil" }] },
          { "title": "Indices", "symbols": [{ "s": "FOREXCOM:SPXUSD", "d": "S&P 500" }, { "s": "FOREXCOM:NSXUSD", "d": "Nasdaq 100" }, { "s": "FOREXCOM:DJI", "d": "Dow 30" }, { "s": "INDEX:NKY", "d": "Nikkei 225" }, { "s": "INDEX:DEU40", "d": "DAX 40" }] },
          { "title": "Crypto", "symbols": [{ "s": "BITSTAMP:BTCUSD", "d": "Bitcoin" }, { "s": "BITSTAMP:ETHUSD", "d": "Ethereum" }, { "s": "BINANCE:SOLUSDT", "d": "Solana" }, { "s": "BINANCE:XRPUSDT", "d": "XRP" }, { "s": "BINANCE:DOGEUSDT", "d": "Dogecoin" }] },
          { "title": "Forex", "symbols": [{ "s": "FX:EURUSD", "d": "EUR/USD" }, { "s": "FX:GBPUSD", "d": "GBP/USD" }, { "s": "FX:USDJPY", "d": "USD/JPY" }, { "s": "FX:USDCHF", "d": "USD/CHF" }, { "s": "FX:AUDUSD", "d": "AUD/USD" }] }
        ]
      });
      marketOverviewRef.current.appendChild(script);
    }

    // 3. Advanced Real-Time Chart Widget
    if (chartRef.current) {
      chartRef.current.innerHTML = ''; 
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
      script.async = true;
      script.innerHTML = JSON.stringify({
        "width": "100%",
        "height": "500",
        "symbol": "BITSTAMP:BTCUSD",
        "interval": "D",
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "1",
        "locale": "en",
        "enable_publishing": false,
        "hide_top_toolbar": false,
        "hide_legend": false,
        "save_image": false,
        "calendar": false,
        "hide_volume": true,
        "support_host": "https://www.tradingview.com"
      });
      chartRef.current.appendChild(script);
    }
  }, []);

  return (
    <div className="min-h-screen w-full max-w-[100vw] bg-[#050505] text-white font-sans selection:bg-blue-600 selection:text-white overflow-hidden relative cursor-default">
      
      {/* CSS FOR SEAMLESS MARQUEE & PAUSE */}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .group:hover .animate-marquee {
          animation-play-state: paused;
        }
      `}</style>

      {/* SPOTLIGHT EFFECT */}
      <div 
        className="fixed top-0 left-0 w-[800px] h-[800px] bg-blue-500/30 rounded-full blur-[120px] pointer-events-none z-0 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 mix-blend-screen"
        style={{ left: mousePosition.x, top: mousePosition.y }}
      ></div>

      {/* --- NAVIGATION BAR --- */}
      <nav className={`fixed w-full max-w-[100vw] z-50 transition-all duration-300 ${scrolled ? 'bg-[#050505]/95 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between relative">
          
          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer group z-50">
            <Link href="/">
                <span className="text-2xl font-bold tracking-tighter text-white">
                GAV<span className="text-blue-500">BLUE</span>
                </span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1" onMouseLeave={() => setActiveDropdown(null)}>
            <Link href="/markets" className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-all duration-300 rounded-lg hover:bg-white/5">Markets</Link>
            
            {/* --- APPS DROPDOWN MENU --- */}
            <div className="relative px-4 py-2 cursor-pointer group h-full" onMouseEnter={() => setActiveDropdown('Apps')}>
                <span className={`text-sm font-medium transition-all duration-300 flex items-center gap-1 ${activeDropdown === 'Apps' ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                  Apps
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-3 h-3 transition-transform ${activeDropdown === 'Apps' ? 'rotate-180' : ''}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </span>
                
                {/* Mega Menu Box */}
                <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 transition-all duration-300 origin-top ${activeDropdown === 'Apps' ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
                  <div className="w-[900px] relative rounded-2xl shadow-2xl shadow-blue-900/20 overflow-hidden bg-[#0A0A0A]">

                      {/* Content Layer */}
                      <div className="relative z-10 p-8 grid grid-cols-5 gap-8">
                          
                          {/* --- LEFT SIDE: IMAGE FIX --- */}
                          <div className="col-span-2 relative rounded-xl overflow-hidden group/card transition-all h-full min-h-[380px] bg-gradient-to-b from-[#111] to-[#000]">
                             <div className="absolute inset-x-0 bottom-0 top-6"> 
                                 <img 
                                    src="/chart.jpg" 
                                    alt="Trading App Preview" 
                                    className="w-full h-full object-cover object-top opacity-100 select-none pointer-events-none rounded-t-xl shadow-2xl" 
                                    draggable="false"
                                 />
                             </div>
                          </div>

                          {/* --- RIGHT LINKS --- */}
                          <div className="col-span-3 flex flex-col justify-center space-y-2">
                              <h4 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-2">Integrated Platforms</h4>
                               <a href="https://ctrader.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/10 border border-transparent hover:border-blue-500/30 transition-all group/item bg-black/40 backdrop-blur-md">
                                 <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center p-1">
                                     <img src="/logo-ctrader.png" alt="cTrader" className="w-full h-full object-contain"/>
                                 </div>
                                 <div>
                                    <h5 className="text-white font-bold text-sm group-hover/item:text-blue-400 transition">cTrader</h5>
                                    <p className="text-xs text-gray-500">Premium ECN trading.</p>
                                 </div>
                              </a>
                               <a href="https://www.tradingview.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/10 border border-transparent hover:border-blue-500/30 transition-all group/item bg-black/40 backdrop-blur-md">
                                 <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center p-1">
                                    <img src="/logo-tv.png" alt="TradingView" className="w-full h-full object-contain"/>
                                 </div>
                                 <div>
                                    <h5 className="text-white font-bold text-sm group-hover/item:text-blue-400 transition">TradingView</h5>
                                    <p className="text-xs text-gray-500">Trade directly from charts.</p>
                                 </div>
                              </a>
                              <a href="https://match-trader.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/10 border border-transparent hover:border-blue-500/30 transition-all group/item bg-black/40 backdrop-blur-md">
                                 <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center p-1">
                                     <img src="/logo-match.png" alt="Match-Trader" className="w-full h-full object-contain"/>
                                 </div>
                                 <div>
                                    <h5 className="text-white font-bold text-sm group-hover/item:text-blue-400 transition">Match-Trader</h5>
                                    <p className="text-xs text-gray-500">Modern, all-in-one platform.</p>
                                 </div>
                              </a>
                              <a href="https://www.metatrader5.com/en/download" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/10 border border-transparent hover:border-blue-500/30 transition-all group/item bg-black/40 backdrop-blur-md">
                                 <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center p-1">
                                    <img src="/logo-mt5.png" alt="MT5" className="w-full h-full object-contain"/>
                                 </div>
                                 <div>
                                    <h5 className="text-white font-bold text-sm group-hover/item:text-blue-400 transition">MetaTrader 5</h5>
                                    <p className="text-xs text-gray-500">Multi-asset institutional platform.</p>
                                 </div>
                              </a>
                              <a href="https://www.metatrader4.com/en/download" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/10 border border-transparent hover:border-blue-500/30 transition-all group/item bg-black/40 backdrop-blur-md">
                                 <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center p-1">
                                    <img src="/logo-mt4.png" alt="MT4" className="w-full h-full object-contain"/>
                                 </div>
                                 <div>
                                    <h5 className="text-white font-bold text-sm group-hover/item:text-blue-400 transition">MetaTrader 4</h5>
                                    <p className="text-xs text-gray-500">The legendary forex standard.</p>
                                 </div>
                              </a>
                          </div>
                      </div>
                  </div>
                </div>
            </div>

            <Link href="/tools" className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-all duration-300 rounded-lg hover:bg-white/5">Tools</Link>
            <Link href="/company/about" className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-all duration-300 rounded-lg hover:bg-white/5">Company</Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login?view=signin" className="hidden md:block text-sm font-medium text-gray-300 hover:text-white transition">Log In</Link>
            <Link href="/login?view=signup" className="bg-white hover:bg-gray-200 text-black px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 hover:scale-105">
                Sign Up
            </Link>
          </div>

          {/* MOBILE MENU BUTTON & OVERLAY */}
          <button 
             className="md:hidden text-white p-2 z-50 relative"
             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
             {mobileMenuOpen ? (
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
             ) : (
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
             )}
          </button>

          {/* Full Screen Mobile Menu */}
          <div className={`fixed inset-0 bg-[#050505] z-40 flex flex-col pt-24 px-6 overflow-y-auto transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
             <div className="flex flex-col space-y-6 text-center w-full max-w-md mx-auto pb-10">
                 <Link href="/markets" className="text-3xl font-bold text-white hover:text-blue-500" onClick={() => setMobileMenuOpen(false)}>Markets</Link>
                 
                 {/* Apps Mobile Dropdown */}
                 <div className="flex flex-col w-full items-center">
                    <button 
                        onClick={() => setMobileAppsOpen(!mobileAppsOpen)}
                        className="text-3xl font-bold text-white hover:text-blue-500 flex items-center justify-center gap-2 w-full"
                    >
                        Apps
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-6 h-6 transition-transform duration-300 ${mobileAppsOpen ? 'rotate-180' : ''}`}>
                             <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                    </button>
                    
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out flex flex-col items-center gap-4 bg-white/5 rounded-xl w-full ${mobileAppsOpen ? 'max-h-[500px] py-6 mt-4 opacity-100' : 'max-h-0 py-0 opacity-0'}`}>
                        <a href="https://ctrader.com/" target="_blank" className="text-xl text-gray-300 hover:text-white">cTrader</a>
                        <a href="https://www.tradingview.com/" target="_blank" className="text-xl text-gray-300 hover:text-white">TradingView</a>
                        <a href="https://match-trader.com/" target="_blank" className="text-xl text-gray-300 hover:text-white">Match-Trader</a>
                        <a href="https://www.metatrader5.com/en/download" target="_blank" className="text-xl text-gray-300 hover:text-white">MetaTrader 5</a>
                        <a href="https://www.metatrader4.com/en/download" target="_blank" className="text-xl text-gray-300 hover:text-white">MetaTrader 4</a>
                    </div>
                 </div>

                 <Link href="/tools" className="text-3xl font-bold text-white hover:text-blue-500" onClick={() => setMobileMenuOpen(false)}>Tools</Link>
                 <Link href="/company/about" className="text-3xl font-bold text-white hover:text-blue-500" onClick={() => setMobileMenuOpen(false)}>Company</Link>
                 
                 <div className="w-12 h-px bg-white/10 mx-auto my-4"></div>

                 <Link href="/login?view=signin" className="text-xl text-gray-400 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Log In</Link>
                 <Link href="/login?view=signup" className="px-8 py-4 bg-blue-600 rounded-full text-white font-bold text-xl" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
             </div>
          </div>

        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-40 pb-20 md:pt-48 md:pb-32 overflow-hidden z-10 w-full">
        <div className="absolute inset-0 z-0 pointer-events-none w-full">
           <img src="/hero-bg.jpg" alt="Bull and Bear Background" className="w-full h-full object-cover opacity-60" />
           <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/80 via-transparent to-[#050505]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-blue-500/30 bg-blue-900/10 mb-8 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse mr-2"></span>
            <span className="text-blue-400 text-[10px] font-bold tracking-widest uppercase">System Operational</span>
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-6 md:mb-8 leading-[1.1] drop-shadow-2xl">
            The Future of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Global Trading</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-300 mb-10 md:mb-12 leading-relaxed font-light drop-shadow-lg">
            Trade 2,000+ instruments on institutional-grade infrastructure.
            <br className="hidden md:block"/> Forex. Crypto. Indices. Gold.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6">
            <Link href="/login?view=signup" className="px-10 py-4 md:px-12 md:py-5 bg-blue-600 text-white rounded-lg font-bold text-base md:text-lg hover:bg-blue-500 transition-all duration-300 shadow-[0_0_50px_rgba(37,99,235,0.3)] hover:-translate-y-1 text-center">
              Start Trading Now
            </Link>
            <Link href="/markets" className="flex items-center justify-center px-10 py-4 md:px-12 md:py-5 border border-white/10 text-white rounded-lg font-bold text-base md:text-lg hover:bg-white/5 transition-all duration-300 backdrop-blur-sm text-center">
              View Markets
            </Link>
          </div>
        </div>
      </section>

      {/* --- BONUS BANNER --- */}
      <section className="relative z-20 -mt-8 md:-mt-10 mb-20 w-full">
        <div className="max-w-5xl mx-auto px-6">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-yellow-600/20 via-yellow-500/10 to-transparent border border-yellow-500/30 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-md w-full">
            <div className="text-center md:text-left z-10 w-full md:w-auto">
              <span className="inline-block px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-bold uppercase tracking-wider rounded-md mb-2">Limited Offer</span>
              <h3 className="text-2xl md:text-3xl font-bold text-white">200% First Deposit Bonus</h3>
              <p className="text-gray-400 mt-1 text-sm md:text-base">Double your trading power instantly. Valid for new accounts only.</p>
            </div>
            
            <div className="flex flex-col items-center md:items-end z-10 gap-3 w-full md:w-auto flex-shrink-0">
                <Link 
                    href="/login?view=signup" 
                    className="w-full md:w-auto px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg shadow-lg shadow-yellow-500/20 transition-transform hover:scale-105 whitespace-nowrap text-center"
                >
                    Sign Up &rarr;
                </Link>
                <Link 
                    href="/login?view=signup" 
                    className="text-[10px] text-yellow-400/80 hover:text-white underline decoration-dashed underline-offset-4 transition text-center"
                >
                    Create a new account to claim
                </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- LIVE MARKET TAPE --- */}
      <div className="border-y border-white/5 bg-[#0A0A0A]/50 backdrop-blur-sm z-10 relative w-full">
        <div id="tradingview-widget" ref={tickerTapeRef} className="tradingview-widget-container"></div>
      </div>

      {/* --- NEW REAL-TIME MARKET WATCH SECTION --- */}
      <section className="py-32 bg-[#0A0A0A] border-b border-white/5 relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Live <span className="text-blue-500">Markets</span></h2>
              <p className="text-gray-400">Real-time pricing from global liquidity providers.</p>
          </div>
          <div className="tradingview-widget-container rounded-2xl overflow-hidden border border-white/5 w-full" ref={marketOverviewRef}></div>
        </div>
      </section>

      {/* --- PLATFORMS SECTION --- */}
      <section className="py-20 md:py-32 bg-[#050505] relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Level Up With Our <span className="text-blue-500">Platforms</span></h2>
            <p className="text-gray-400 max-w-xl mx-auto text-lg">
              Choose the interface that fits your trading style. From classic to next-gen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            <div className="col-span-1 md:col-span-2 p-6 md:p-10 rounded-3xl bg-[#0A0A0A] border border-white/5 hover:border-blue-500/50 transition-all group relative overflow-hidden w-full">
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[50px]"></div>
               <h3 className="text-2xl font-bold text-white mb-2">Gavblue WebTrader</h3>
               <p className="text-gray-400 mb-6">Analyze the markets with our powerful, built-in charting platform.</p>
               <div className="w-full h-[400px] md:h-[500px] bg-[#050505] rounded-xl border border-white/10 overflow-hidden relative z-10">
                  <div className="tradingview-widget-container h-full w-full" ref={chartRef}></div>
               </div>
            </div>

            <div className="p-8 md:p-10 rounded-3xl bg-[#0A0A0A] border border-white/5 hover:border-white/20 transition-all group w-full">
               <h3 className="text-2xl font-bold text-white mb-2">TradingView Integration</h3>
               <p className="text-gray-400 mb-6">Connect your account and trade directly from TradingView.com.</p>
               <div className="flex flex-wrap items-center gap-3 md:gap-4 text-gray-500">
                  <div className="px-3 md:px-4 py-2 border border-white/10 rounded-lg bg-[#151922] text-xs md:text-sm">80+ Indicators</div>
                  <div className="px-3 md:px-4 py-2 border border-white/10 rounded-lg bg-[#151922] text-xs md:text-sm">Pine Script</div>
               </div>
            </div>

            <div className="p-8 md:p-10 rounded-3xl bg-[#0A0A0A] border border-white/5 hover:border-green-500/30 transition-all group flex flex-col justify-between w-full">
               <div>
                 <h3 className="text-2xl font-bold text-white mb-4">MetaTrader 4 & 5</h3>
                 <p className="text-gray-400 text-lg mb-8">The industry standard for algorithmic trading and EAs.</p>
               </div>
               <div className="flex gap-4">
                  <a href="https://www.metatrader4.com/en/download" target="_blank" rel="noopener noreferrer" className="flex-1 px-4 py-3 bg-[#151922] border border-white/10 hover:border-white/30 rounded-xl font-bold text-sm transition text-center text-white">Download MT4</a>
                  <a href="https://www.metatrader5.com/en/download" target="_blank" rel="noopener noreferrer" className="flex-1 px-4 py-3 bg-[#151922] border border-white/10 hover:border-white/30 rounded-xl font-bold text-sm transition text-center text-white">Download MT5</a>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- LIVE STATS --- */}
      <section className="py-32 bg-[#050505] border-t border-white/5 relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center w-full">
          <div className="group cursor-default hover:bg-white/5 p-4 md:p-6 rounded-xl transition-all">
            <div className="text-3xl md:text-5xl font-bold text-white mb-2 font-mono">${stats.volume ? stats.volume.toFixed(2) : '0.00'}B+</div>
            <div className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest">24h Volume</div>
          </div>
          <div className="group cursor-default hover:bg-white/5 p-4 md:p-6 rounded-xl transition-all">
            <div className="text-3xl md:text-5xl font-bold text-white mb-2 font-mono">{stats.latency ? stats.latency : '0'}ms</div>
            <div className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest">Latency</div>
          </div>
          <div className="group cursor-default hover:bg-white/5 p-4 md:p-6 rounded-xl transition-all">
            <div className="text-3xl md:text-5xl font-bold text-white mb-2 font-mono">{stats.traders ? stats.traders.toLocaleString() : '0'}</div>
            <div className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest">Active Traders</div>
          </div>
          <div className="group cursor-default hover:bg-white/5 p-4 md:p-6 rounded-xl transition-all">
            <div className="text-3xl md:text-5xl font-bold text-white mb-2 font-mono text-yellow-500">99.99%</div>
            <div className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest">Uptime</div>
          </div>
        </div>
      </section>

      {/* --- 4. PARTNERS SECTION --- */}
      <section className="py-24 border-t border-white/5 bg-black z-10 relative overflow-hidden group w-full">
        <div className="max-w-4xl mx-auto px-6 w-full">
          <p className="text-gray-600 text-xs uppercase tracking-widest mb-12 text-center font-bold">Official Trading Partners</p>
          
          <div className="relative w-full overflow-hidden mask-gradient-x">
             <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black via-black/80 to-transparent z-20 pointer-events-none"></div>
             <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black via-black/80 to-transparent z-20 pointer-events-none"></div>

             <div className="flex gap-16 w-max animate-marquee group-hover:[animation-play-state:paused]">
                {/* PARTNERS LOOP */}
                <div className="flex items-center gap-16 shrink-0">
                   <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-all duration-300 grayscale hover:grayscale-0">
                      <span className="text-xl font-extrabold italic text-white tracking-tighter">McLaren</span>
                      <div className="w-4 h-4 bg-orange-600 rounded-tr-md rounded-bl-md skew-x-12"></div>
                   </div>
                   <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-all duration-300">
                      <div className="flex gap-0.5">
                        <div className="w-1.5 h-3 bg-blue-600 -skew-x-12"></div>
                        <div className="w-1.5 h-3 bg-blue-400 -skew-x-12"></div>
                      </div>
                      <span className="text-lg font-bold text-white">Funded<span className="text-blue-500">Next</span></span>
                   </div>
                   <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-all duration-300">
                      <span className="text-xl font-bold text-white">Bloomberg</span>
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div> 
                   </div>
                   <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-all duration-300">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M21 7a.78.78 0 0 0 0-.21.64.64 0 0 0-.05-.17 1.1 1.1 0 0 0-.09-.14.75.75 0 0 0-.14-.17l-.12-.07a.69.69 0 0 0-.19-.1h-.2A.7.7 0 0 0 20 6h-5a1 1 0 0 0 0 2h2.83l-4 4.71-4.32-2.57a1 1 0 0 0-1.28.22l-5 6a1 1 0 0 0 .13 1.41A1 1 0 0 0 4 18a1 1 0 0 0 .77-.36l4.45-5.34 4.27 2.56a1 1 0 0 0 1.27-.21L19 9.7V12a1 1 0 0 0 2 0V7z"/></svg>
                      <span className="text-lg font-bold text-white">TradingView</span>
                   </div>
                </div>
                {/* DUPLICATE SET FOR LOOPING */}
                <div className="flex items-center gap-16 shrink-0">
                   <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-all duration-300 grayscale hover:grayscale-0">
                      <span className="text-xl font-extrabold italic text-white tracking-tighter">McLaren</span>
                      <div className="w-4 h-4 bg-orange-600 rounded-tr-md rounded-bl-md skew-x-12"></div>
                   </div>
                   <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-all duration-300">
                      <div className="flex gap-0.5">
                        <div className="w-1.5 h-3 bg-blue-600 -skew-x-12"></div>
                        <div className="w-1.5 h-3 bg-blue-400 -skew-x-12"></div>
                      </div>
                      <span className="text-lg font-bold text-white">Funded<span className="text-blue-500">Next</span></span>
                   </div>
                   <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-all duration-300">
                      <span className="text-xl font-bold text-white">Bloomberg</span>
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div> 
                   </div>
                   <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-all duration-300">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M21 7a.78.78 0 0 0 0-.21.64.64 0 0 0-.05-.17 1.1 1.1 0 0 0-.09-.14.75.75 0 0 0-.14-.17l-.12-.07a.69.69 0 0 0-.19-.1h-.2A.7.7 0 0 0 20 6h-5a1 1 0 0 0 0 2h2.83l-4 4.71-4.32-2.57a1 1 0 0 0-1.28.22l-5 6a1 1 0 0 0 .13 1.41A1 1 0 0 0 4 18a1 1 0 0 0 .77-.36l4.45-5.34 4.27 2.56a1 1 0 0 0 1.27-.21L19 9.7V12a1 1 0 0 0 2 0V7z"/></svg>
                      <span className="text-lg font-bold text-white">TradingView</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER (MOBILE OPTIMIZED: SIDE-BY-SIDE LISTS) --- */}
      <footer className="border-t border-white/5 bg-black py-16 md:py-20 relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="flex flex-col md:flex-row gap-12 mb-16 w-full">
            
            {/* LOGO & DESC - Top on Mobile, Left on Desktop */}
            <div className="w-full md:w-1/4">
              <span className="text-2xl font-bold text-white">GAV<span className="text-blue-500">BLUE</span></span>
              <p className="text-gray-500 text-sm mt-4 leading-relaxed">
                The world's leading premium broker. Licensed and regulated.<br/>
                <a href="https://www.gavblue.com" className="hover:text-blue-400 transition">www.gavblue.com</a><br/>
                <a href="mailto:info@gavblue.com" className="hover:text-blue-400 transition">info@gavblue.com</a>
              </p>
            </div>

            {/* LINKS - Side-by-Side (3 Cols) on Mobile & Desktop */}
            <div className="w-full md:w-3/4 grid grid-cols-3 gap-4 md:gap-12">
                <div>
                  <h4 className="text-white font-bold mb-4 md:mb-6">Markets</h4>
                  <ul className="space-y-3 text-gray-500 text-sm">
                    <li><a href="https://www.tradingview.com/markets/currencies/" target="_blank" className="hover:text-blue-500 transition-colors">Forex</a></li>
                    <li><a href="https://www.tradingview.com/markets/indices/" target="_blank" className="hover:text-blue-500 transition-colors">Indices</a></li>
                    <li><a href="https://www.tradingview.com/markets/futures/" target="_blank" className="hover:text-blue-500 transition-colors">Commodities</a></li>
                    <li><a href="https://www.tradingview.com/markets/cryptocurrencies/" target="_blank" className="hover:text-blue-500 transition-colors">Crypto</a></li>
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
          
          <div className="border-t border-white/5 pt-10 text-center w-full">
            <p className="text-gray-800 text-[10px] leading-relaxed max-w-4xl mx-auto">
              Risk Warning: CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage. 
              74-89% of retail investor accounts lose money when trading CFDs with this provider. 
              You should consider whether you understand how CFDs work and whether you can afford to take the high risk of losing your money.
              <br /><br />
              This platform is currently in Launched.real-money trading services are offered at this time.
            </p>
            <p className="text-gray-600 text-xs mt-6">© 2026 Gavblue Technologies. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <AiSupportChat />

    </div>
  );
}