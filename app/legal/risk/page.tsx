'use client';

import Link from 'next/link';

export default function RiskPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-600 selection:text-white">
      
      <nav className="fixed w-full z-50 bg-[#050505]/90 backdrop-blur-xl border-b border-white/5 py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tighter text-white">TRADE<span className="text-blue-500">CORE</span></Link>
          <Link href="/" className="text-sm text-gray-400 hover:text-white transition">Back Home</Link>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-6">
         <div className="max-w-3xl mx-auto">
            <span className="text-blue-500 text-xs font-bold tracking-widest uppercase mb-4 block">Legal</span>
            <h1 className="text-4xl font-bold mb-8">Risk Disclosure</h1>
            
            <div className="space-y-8 text-gray-400 leading-relaxed text-sm">
                <p>Last updated: January 15, 2026</p>
                <h3 className="text-xl font-bold text-white pt-4">High Risk Warning</h3>
                <p>Trading Forex and CFDs (Contract For Difference) is highly speculative, carries a high level of risk and may not be suitable for all investors. You may lose some or all of your invested capital, therefore you should not speculate with capital that you cannot afford to lose.</p>

                <h3 className="text-xl font-bold text-white pt-4">Leverage</h3>
                <p>The leverage available in CFD trading can work against you as well as for you. High leverage can lead to large losses as well as gains.</p>

                <h3 className="text-xl font-bold text-white pt-4">No Advice</h3>
                <p>TradeCore provides an execution-only service. We do not provide investment advice or recommendations regarding any financial instruments.</p>
            </div>
         </div>
      </section>

      <footer className="border-t border-white/5 bg-black py-10 text-center">
         <p className="text-gray-600 text-xs">© 2026 TradeCore Technologies. All rights reserved.</p>
      </footer>
    </div>
  );
}