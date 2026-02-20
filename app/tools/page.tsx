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
    
    // Connection Simulation States
    const [isConnecting, setIsConnecting] = useState(false);
    const [hasConnected, setHasConnected] = useState(false);

    const [messages, setMessages] = useState<{role: 'ai'|'user', text: string}[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Pick a random agent name on mount
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
        const newMessages = [...messages, { role: 'user' as const, text: userMsg }];
        setMessages(newMessages);
        setInputValue('');
        setIsTyping(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    message: userMsg,
                    history: messages,
                    agentName: agentName
                }),
            });

            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();
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

export default function ToolsPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileAppsOpen, setMobileAppsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

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

  // --- HANDLE SCROLL ---
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden relative cursor-default">

      {/* --- NAVBAR (UPDATED FOR MOBILE) --- */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#050505]/95 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between relative">
          
          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer group z-50">
            <Link href="/">
                <span className="text-2xl font-bold tracking-tighter text-white uppercase">
                gav<span className="text-blue-500">blue</span>
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
                      <div className="relative z-10 p-8 grid grid-cols-5 gap-8">
                          <div className="col-span-2 relative rounded-xl overflow-hidden group/card transition-all h-full min-h-[380px] bg-gradient-to-b from-[#111] to-[#000]">
                             <div className="absolute inset-x-0 bottom-0 top-6"> 
                                 <img src="/chart.jpg" alt="Trading App Preview" className="w-full h-full object-cover object-top opacity-100 select-none pointer-events-none rounded-t-xl shadow-2xl" draggable="false" />
                             </div>
                          </div>
                          <div className="col-span-3 flex flex-col justify-center space-y-2">
                              <h4 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-2">Integrated Platforms</h4>
                              <a href="https://ctrader.com/" target="_blank" className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/10 border border-transparent hover:border-blue-500/30 transition-all group/item bg-black/40 backdrop-blur-md">
                                 <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center p-1"><img src="/logo-ctrader.png" alt="cTrader" className="w-full h-full object-contain"/></div>
                                 <div><h5 className="text-white font-bold text-sm group-hover/item:text-blue-400 transition">cTrader</h5><p className="text-xs text-gray-500">Premium ECN trading.</p></div>
                              </a>
                              <a href="https://www.tradingview.com/" target="_blank" className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/10 border border-transparent hover:border-blue-500/30 transition-all group/item bg-black/40 backdrop-blur-md">
                                 <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center p-1"><img src="/logo-tv.png" alt="TradingView" className="w-full h-full object-contain"/></div>
                                 <div><h5 className="text-white font-bold text-sm group-hover/item:text-blue-400 transition">TradingView</h5><p className="text-xs text-gray-500">Trade directly from charts.</p></div>
                              </a>
                              {/* Add more links as needed */}
                          </div>
                      </div>
                  </div>
                </div>
            </div>

            <Link href="/tools" className="px-4 py-2 text-sm font-medium text-white transition-all duration-300 rounded-lg bg-white/5">Tools</Link>
            <Link href="/company/about" className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-all duration-300 rounded-lg hover:bg-white/5">Company</Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login?view=signin" className="hidden md:block text-sm font-medium text-gray-300 hover:text-white transition">Log In</Link>
            <Link href="/login?view=signup" className="bg-white hover:bg-gray-200 text-black px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 hover:scale-105">Sign Up</Link>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button className="md:hidden text-white p-2 z-50 relative" onClick={() => { setMobileMenuOpen(!mobileMenuOpen); setMobileAppsOpen(false); }}>
             {mobileMenuOpen ? (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>) : (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>)}
          </button>

          {/* Full Screen Mobile Menu */}
          <div className={`fixed inset-0 bg-[#050505] z-40 flex flex-col pt-24 px-6 overflow-y-auto transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
             <div className="flex flex-col space-y-6 text-center w-full max-w-md mx-auto pb-10">
                 <Link href="/markets" className="text-3xl font-bold text-white hover:text-blue-500" onClick={() => setMobileMenuOpen(false)}>Markets</Link>
                 
                 <div className="flex flex-col w-full items-center">
                    <button onClick={() => setMobileAppsOpen(!mobileAppsOpen)} className="text-3xl font-bold text-white hover:text-blue-500 flex items-center justify-center gap-2 w-full">
                        Apps
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-6 h-6 transition-transform duration-300 ${mobileAppsOpen ? 'rotate-180' : ''}`}><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out flex flex-col items-center gap-4 bg-white/5 rounded-xl w-full ${mobileAppsOpen ? 'max-h-[500px] py-6 mt-4 opacity-100' : 'max-h-0 py-0 opacity-0'}`}>
                        <a href="https://ctrader.com/" target="_blank" className="text-xl text-gray-300 hover:text-white">cTrader</a>
                        <a href="https://www.tradingview.com/" target="_blank" className="text-xl text-gray-300 hover:text-white">TradingView</a>
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
         <div className="max-w-4xl mx-auto px-6 flex flex-col items-center">
             <span className="text-3xl font-bold text-white uppercase mb-8">gav<span className="text-blue-500">blue</span></span>
             <h3 className="text-2xl font-bold text-white mb-4">Ready to trade?</h3>
             <p className="text-gray-400 mb-8">Create an account in minutes and access these markets.</p>
             <Link href="/login?view=signup" className="px-10 py-4 bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition">Start Trading</Link>
             
             <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-4 text-sm text-gray-400">
                <a href="mailto:info@gavblue.com" className="hover:text-blue-500 transition-colors">info@gavblue.com</a>
                <span className="hidden md:inline text-gray-600">|</span>
                <a href="https://www.gavblue.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">www.gavblue.com</a>
             </div>
             
             <p className="text-gray-600 text-xs mt-6">© 2026 gavblue. All rights reserved.</p>
         </div>
      </footer>

      {/* ADDED AI SUPPORT COMPONENT HERE */}
      <AiSupportChat />

    </div>
  );
}