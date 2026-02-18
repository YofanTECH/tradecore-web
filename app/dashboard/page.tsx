'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/app/utils/supabase/client';

// ... (KEEP ALL TYPES AND DATA CONSTANTS FROM PREVIOUS STEPS) ...
// Ensure PAYMENT_METHODS uses the new addresses you provided earlier

// --- UPDATE CONSTANTS ---
// (Make sure to include all constants like PLATFORMS, PAYMENT_METHODS from the previous dashboard code I gave you)
// I will provide the FULL block below so you can just copy-paste.

// ... FULL CODE BLOCK BELOW ...

// --- TYPES ---
type Account = {
  id: string;
  type: string;
  subType: string;
  balance: number;
  currency: string;
  leverage: string;
  equity: number;
  margin: number;
};

type ReferralData = {
    created_at: string;
}

type ToastMessage = {
    message: string;
    type: 'success' | 'error';
};

// --- DATA CONSTANTS ---
const PLATFORMS = [
    { id: 'mt5', name: 'MetaTrader 5', desc: 'Multi-asset institutional platform.' },
    { id: 'mt4', name: 'MetaTrader 4', desc: 'The legendary forex standard.' },
    { id: 'ctrader', name: 'cTrader', desc: 'Premium ECN trading experience.' },
    { id: 'tv', name: 'TradingView', desc: 'Trade directly from charts.' },
    { id: 'match', name: 'Match-Trader', desc: 'Modern, all-in-one platform.' },
];

const BONUSES = [
    { 
        id: 'welcome200', 
        title: '$200 Cash Bonus', 
        desc: 'Get an instant $200 credit when you make a deposit of $500 or more.', 
        progress: 0, 
        target: 500, 
        status: 'available',
        color: 'text-green-500',
        bg: 'bg-green-500/10',
        btn: 'Claim Now'
    },
    { 
        id: 'referral200', 
        title: '200% Deposit Match', 
        desc: 'Unlock double trading power by referring 5 active friends.', 
        progress: 20, 
        target: 100, 
        status: 'active',
        color: 'text-yellow-500',
        bg: 'bg-yellow-500/10',
        btn: 'Continue'
    },
    { 
        id: 'vip_risk', 
        title: '3 Risk-Free Trades', 
        desc: 'Your first 3 trades are insured against loss. Requires VIP status.', 
        progress: 0, 
        target: 100, 
        status: 'locked',
        color: 'text-purple-500',
        bg: 'bg-purple-500/10',
        btn: 'Locked'
    }
];

const PAYMENT_METHODS = [
    // CRYPTO (Active)
    { id: 'btc', name: 'Bitcoin (BTC)', type: 'crypto', icon: '₿', color: 'text-orange-500', bg: 'bg-orange-500/10', time: '1 hour', limit: '10 - 200k', address: 'bc1q4kxf53tuedzqhyw2ay5ft153cv2ngg48muz0ge' },
    { id: 'usdt_trc20', name: 'Tether (USDT TRC20)', type: 'crypto', icon: 'T', color: 'text-green-500', bg: 'bg-green-500/10', time: '5 mins', limit: '10 - 200k', address: 'TJmjDXa7q4tNTZMij8hPXvghj1LrRkFf8V' },
    { id: 'trx', name: 'TRON (TRX)', type: 'crypto', icon: '♦', color: 'text-red-500', bg: 'bg-red-500/10', time: '5 mins', limit: '10 - 200k', address: 'TJmjDXa7q4tNTZMij8hPXvghj1LrRkFf8V' },
    { id: 'eth', name: 'Ethereum (ETH)', type: 'crypto', icon: 'Ξ', color: 'text-purple-500', bg: 'bg-purple-500/10', time: '15 mins', limit: '10 - 200k', address: '0x836877b56054434f5be5c97c19809fd7ad08006a' },
    { id: 'usdt_erc20', name: 'Tether (USDT ERC20)', type: 'crypto', icon: 'T', color: 'text-green-500', bg: 'bg-green-500/10', time: '15 mins', limit: '10 - 200k', address: '0x836877b56054434f5be5c97c19809fd7ad08006a' },
    { id: 'usdc_erc20', name: 'USD Coin (USDC ERC20)', type: 'crypto', icon: '$', color: 'text-blue-500', bg: 'bg-blue-500/10', time: '15 mins', limit: '10 - 200k', address: '0x836877b56054434f5be5c97c19809fd7ad08006a' },
    { id: 'usdt_bep20', name: 'Tether (USDT BEP20)', type: 'crypto', icon: 'T', color: 'text-green-500', bg: 'bg-green-500/10', time: '5 mins', limit: '10 - 200k', address: '0x836877b56054434f5be5c97c19809fd7ad08006a' },
    { id: 'usdc_bep20', name: 'USD Coin (USDC BEP20)', type: 'crypto', icon: '$', color: 'text-blue-500', bg: 'bg-blue-500/10', time: '5 mins', limit: '10 - 200k', address: '0x836877b56054434f5be5c97c19809fd7ad08006a' },
    // FIAT (Coming Soon)
    { id: 'card', name: 'MasterCard / Visa', type: 'fiat', icon: '💳', color: 'text-white', bg: 'bg-white/10', time: 'Instant', limit: '50 - 10k', status: 'soon' },
    { id: 'paypal', name: 'PayPal', type: 'fiat', icon: 'P', color: 'text-blue-400', bg: 'bg-blue-500/10', time: 'Instant', limit: '50 - 5k', status: 'soon' },
    { id: 'bank', name: 'International Bank Wire', type: 'fiat', icon: '🏦', color: 'text-gray-300', bg: 'bg-white/5', time: '3-5 Days', limit: '500 - 500k', status: 'soon' },
];

export default function Dashboard() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [resetLoading, setResetLoading] = useState(false);
  const [origin, setOrigin] = useState('');
  
  // --- UI STATES ---
  const [activePage, setActivePage] = useState('accounts');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // --- PERFORMANCE PAGE STATE ---
  const [perfTimeframe, setPerfTimeframe] = useState('All');

  // --- COLLAPSIBLE SIDEBAR SECTIONS ---
  const [openSections, setOpenSections] = useState({
      trading: true,
      growth: true,
      funds: true,
      settings: true
  });
  
  // --- MODAL STATES ---
  const [showBonusModal, setShowBonusModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  
  // --- FORM STATES ---
  const [depositAmount, setDepositAmount] = useState<string>('50');
  const [selectedPlatform, setSelectedPlatform] = useState(PLATFORMS[0]);
  const [isPlatformDropdownOpen, setIsPlatformDropdownOpen] = useState(false);
  const [graphFilter, setGraphFilter] = useState('7d');
  
  // --- DEPOSIT/WITHDRAW FLOW ---
  const [selectedDepositMethod, setSelectedDepositMethod] = useState<any>(null);
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [selectedWithdrawMethod, setSelectedWithdrawMethod] = useState<any>(null);
  const [isWithdrawDropdownOpen, setIsWithdrawDropdownOpen] = useState(false);

  // --- REAL DATA ---
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [rawReferrals, setRawReferrals] = useState<ReferralData[]>([]);

  // --- CALCULATIONS ---
  const referralCount = rawReferrals.length;
  const bonusTarget = 5;
  const bonusProgress = Math.min((referralCount / bonusTarget) * 100, 100);
  const totalEquity = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const fallbackCode = user ? user.id.substring(0, 6).toUpperCase() : '......';
  const displayCode = profile?.referral_code || fallbackCode;
  const referralLink = origin ? `${origin}/login?view=signup&ref=${displayCode}` : 'Loading...';

  // --- GRAPH LOGIC ---
  const processedGraphData = useMemo(() => {
    const now = new Date();
    let dataPoints: number[] = [];
    let labels: string[] = [];

    if (graphFilter === '7d') {
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(now.getDate() - i);
            const dateStr = d.toISOString().split('T')[0]; 
            labels.push(d.toLocaleDateString('en-US', { weekday: 'short' })); 
            const count = rawReferrals.filter(r => r.created_at.startsWith(dateStr)).length;
            dataPoints.push(count);
        }
    } else if (graphFilter === '30d') {
        for (let i = 5; i >= 0; i--) {
            const endDate = new Date();
            endDate.setDate(now.getDate() - (i * 5));
            const startDate = new Date();
            startDate.setDate(endDate.getDate() - 5);
            labels.push(`${endDate.getDate()} ${endDate.toLocaleDateString('en-US', { month: 'short' })}`);
            const count = rawReferrals.filter(r => {
                const rDate = new Date(r.created_at);
                return rDate > startDate && rDate <= endDate;
            }).length;
            dataPoints.push(count);
        }
    } else if (graphFilter === '1y') {
         for(let i = 11; i >= 0; i--) {
             const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
             const monthStr = d.toISOString().slice(0, 7); 
             labels.push(d.toLocaleDateString('en-US', { month: 'short' }));
             const count = rawReferrals.filter(r => r.created_at.startsWith(monthStr)).length;
             dataPoints.push(count);
         }
    }
    const maxVal = Math.max(...dataPoints, 5);
    return { dataPoints, labels, maxVal };

  }, [rawReferrals, graphFilter]);

  useEffect(() => {
    setOrigin(window.location.origin);
    async function getData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      setUser(user);

      const { data: userProfile } = await supabase
        .from('profiles')
        .select('referral_code')
        .eq('id', user.id)
        .single();
      
      if (userProfile) {
          setProfile(userProfile);
          const { data: referrals, error } = await supabase
            .from('profiles')
            .select('created_at')
            .eq('referred_by', userProfile.referral_code)
            .order('created_at', { ascending: true });
          
          if (!error && referrals) {
              setRawReferrals(referrals as unknown as ReferralData[]);
          }
      }
      setLoading(false);
    }
    getData();
  }, [router, supabase]);

  // --- HANDLERS ---
  const toggleSection = (section: keyof typeof openSections) => {
      setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleNavClick = (page: string) => {
      setActivePage(page);
      setIsSidebarOpen(false); // CLOSE SIDEBAR ON CLICK
      if (page === 'deposit') setSelectedDepositMethod(null);
      if (page === 'withdraw') setSelectedWithdrawMethod(null);
  };

  const triggerToast = (message: string, type: 'success' | 'error') => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 3000);
  };

  const handleLogout = async () => {
      await supabase.auth.signOut();
      router.push('/login');
  };

  const handlePasswordReset = async () => {
      if (!user?.email) return;
      setResetLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
          redirectTo: `${origin}/login?view=forgot`,
      });
      if (error) triggerToast("Error sending reset email.", "error");
      else triggerToast("Password reset email sent!", "success");
      setResetLoading(false);
  };

  const handleDepositRedirect = () => {
      const amount = parseFloat(depositAmount);
      if (isNaN(amount) || amount < 50 || amount > 500000) {
          triggerToast("Minimum deposit is $50.", "error");
          return;
      }
      setShowDepositModal(false);
      handleNavClick('deposit');
  };

  const handleWithdraw = () => {
      const amount = parseFloat(withdrawAmount);
      if(!selectedWithdrawMethod) { triggerToast("Please select a method.", "error"); return; }
      if(!walletAddress || walletAddress.length < 10) { triggerToast("Invalid wallet address.", "error"); return; }
      if (isNaN(amount) || amount <= 0) { triggerToast("Invalid amount.", "error"); return; }
      if (amount > totalEquity) { triggerToast("Insufficient balance.", "error"); return; }
      
      triggerToast("Withdrawal request submitted.", "success");
      setWithdrawAmount('');
      setWalletAddress('');
      setSelectedWithdrawMethod(null);
  };

  const handleBonusClaim = (id: string) => {
      if(id === 'welcome200') {
          setActivePage('deposit'); // Redirect to deposit
          triggerToast("Deposit $500+ to unlock this bonus.", "success");
      } else if (id === 'referral200') {
          setActivePage('referrals');
          triggerToast("Refer 5 friends to unlock.", "success");
      }
  };

  const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text);
      setCopySuccess(true);
      triggerToast("Copied to clipboard!", "success");
      setTimeout(() => setCopySuccess(false), 2000); 
  };

  if (loading) return <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">Loading Console...</div>;

  return (
    <div className="min-h-screen bg-[#F2F4F8] dark:bg-[#050505] text-[#1a1a1a] dark:text-white font-sans flex overflow-hidden">
      
      {/* TOAST */}
      {toast && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-top-5 fade-in duration-300">
              <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border ${toast.type === 'error' ? 'bg-[#1a0505] border-red-500/20 text-red-500' : 'bg-[#051a05] border-green-500/20 text-green-500'}`}>
                  <span className="text-sm font-bold text-white">{toast.message}</span>
              </div>
          </div>
      )}

      {/* OVERLAY FOR MENUS */}
      {(isNotifOpen || isSidebarOpen) && (
        <div 
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => { setIsNotifOpen(false); setIsSidebarOpen(false); }} 
        />
      )}

      {/* 1. NOTIFICATION PANEL */}
      <div className={`fixed top-0 right-0 h-full w-[350px] bg-[#111]/95 backdrop-blur-xl border-l border-white/10 shadow-2xl z-[70] transform transition-transform duration-300 ease-out ${isNotifOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-6 h-full flex flex-col">
              <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-bold text-white tracking-tight">Notifications</h2>
                  <button onClick={() => setIsNotifOpen(false)} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-4">
                  {referralCount > 0 && (
                      <div className="bg-green-500/10 p-4 rounded-xl border border-green-500/20 relative overflow-hidden group animate-in slide-in-from-right">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
                          <p className="text-sm font-bold text-white">New Referral!</p>
                          <p className="text-xs text-gray-400 mt-1 leading-relaxed">Someone just signed up using your link.</p>
                      </div>
                  )}
                  <div className="bg-gradient-to-r from-blue-900/20 to-transparent p-4 rounded-xl border border-blue-500/20 relative overflow-hidden group">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                      <p className="text-sm font-bold text-white">Welcome Aboard 🚀</p>
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed">Your account is active. Complete your first deposit to start trading live markets.</p>
                  </div>
              </div>
          </div>
      </div>

      {/* 2. SIDEBAR MENU (LEFT - COLLAPSIBLE DRAWER) */}
      <div className={`fixed top-0 left-0 h-full w-[280px] bg-[#0A0A0A] border-r border-white/5 shadow-2xl z-[70] transform transition-transform duration-300 ease-out flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
           <span className="text-xl font-bold tracking-tighter cursor-pointer select-none" onClick={() => router.push('/')}>TRADE<span className="text-blue-500">CORE</span></span>
           <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-500"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 space-y-2 scrollbar-thin scrollbar-thumb-gray-800">
           {/* TRADING */}
           <div>
               <div onClick={() => toggleSection('trading')} className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-widest cursor-pointer hover:text-white flex justify-between items-center group transition-colors">
                   Trading
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-3 h-3 transition-transform duration-300 ${openSections.trading ? 'rotate-180' : ''}`}><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
               </div>
               <div className={`space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${openSections.trading ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                   <div className="px-3">
                        <SidebarItem icon="users" label="Real Accounts" active={activePage === 'accounts'} onClick={() => handleNavClick('accounts')} />
                        <SidebarItem icon="chart" label="Performance" active={activePage === 'perf'} onClick={() => handleNavClick('perf')} />
                        <SidebarItem icon="history" label="Trade History" active={activePage === 'history'} onClick={() => handleNavClick('history')} />
                   </div>
               </div>
           </div>

           {/* GROWTH */}
           <div>
               <div onClick={() => toggleSection('growth')} className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-widest cursor-pointer hover:text-white flex justify-between items-center group transition-colors">
                   Growth
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-3 h-3 transition-transform duration-300 ${openSections.growth ? 'rotate-180' : ''}`}><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
               </div>
               <div className={`space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${openSections.growth ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                   <div className="px-3">
                        <SidebarItem icon="gift" label="Referrals" active={activePage === 'referrals'} onClick={() => handleNavClick('referrals')} />
                        <SidebarItem icon="trophy" label="Bonuses" active={activePage === 'bonuses'} onClick={() => handleNavClick('bonuses')} />
                   </div>
               </div>
           </div>

           {/* FUNDS */}
           <div>
               <div onClick={() => toggleSection('funds')} className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-widest cursor-pointer hover:text-white flex justify-between items-center group transition-colors">
                   Funds
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-3 h-3 transition-transform duration-300 ${openSections.funds ? 'rotate-180' : ''}`}><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
               </div>
               <div className={`space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${openSections.funds ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                   <div className="px-3">
                        <SidebarItem icon="download" label="Deposit" active={activePage === 'deposit'} onClick={() => { handleNavClick('deposit'); }} />
                        <SidebarItem icon="upload" label="Withdraw" active={activePage === 'withdraw'} onClick={() => { handleNavClick('withdraw'); }} />
                        <SidebarItem icon="list" label="Transactions" active={activePage === 'trans'} onClick={() => handleNavClick('trans')} />
                   </div>
               </div>
           </div>

           {/* SETTINGS */}
           <div>
               <div onClick={() => toggleSection('settings')} className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-widest cursor-pointer hover:text-white flex justify-between items-center group transition-colors">
                   Settings
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-3 h-3 transition-transform duration-300 ${openSections.settings ? 'rotate-180' : ''}`}><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
               </div>
               <div className={`space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${openSections.settings ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                   <div className="px-3">
                        <SidebarItem icon="user" label="Profile" active={activePage === 'profile'} onClick={() => handleNavClick('profile')} />
                   </div>
               </div>
           </div>
        </div>

        {/* SIDEBAR FOOTER (TIGHT GAP FIXED) */}
        <div className="p-4 border-t border-white/5 bg-[#080808]">
            <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-md flex-shrink-0">
                    {user?.email?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate leading-tight">{user?.email?.split('@')[0]}</p>
                    <p className="text-[10px] text-green-500 font-medium leading-tight mt-0.5">Verified</p>
                </div>
                <button onClick={handleLogout} className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-white/5 transition flex-shrink-0" title="Log Out">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" /></svg>
                </button>
            </div>
        </div>
      </div>

      {/* 3. MODALS (Bonus & Deposit) */}
      {showBonusModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <div className="bg-[#111] border border-yellow-500/30 rounded-2xl w-full max-w-lg p-8 relative shadow-2xl animate-in zoom-in-95">
                <button onClick={() => setShowBonusModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-500/10 text-yellow-500 mb-4 animate-pulse"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H4.5a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" /></svg></div>
                    <h2 className="text-2xl font-bold text-white">Unlock 200% Bonus</h2>
                    <p className="text-gray-400 text-sm mt-2">Complete steps to withdraw bonus funds.</p>
                </div>
                <div className="space-y-4">
                    <div className="bg-[#1A1A1A] p-4 rounded-xl flex items-start gap-4 border border-white/5 hover:border-yellow-500/30 transition">
                        <div className="text-yellow-500 font-bold text-xl font-mono">01</div>
                        <div className="flex-1"><h4 className="text-white font-bold text-sm">Refer 5 Friends</h4><p className="text-gray-500 text-xs mt-1">You must refer 5 active users. Current: <span className="text-yellow-500">{referralCount}/5</span></p><div className="w-full bg-gray-800 rounded-full h-1.5 mt-2"><div className="bg-yellow-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${bonusProgress}%` }}></div></div></div>
                    </div>
                    <div className="bg-[#1A1A1A] p-4 rounded-xl flex items-start gap-4 border border-white/5 hover:border-white/10 transition"><div className="text-gray-600 font-bold text-xl font-mono">02</div><div><h4 className="text-white font-bold text-sm">Trading Volume</h4><p className="text-gray-500 text-xs mt-1">Complete <span className="text-white font-bold">0.20 lots</span> of trading volume to unlock withdrawals.</p></div></div>
                    <div className="bg-[#1A1A1A] p-4 rounded-xl flex items-start gap-4 border border-white/5 hover:border-white/10 transition"><div className="text-gray-600 font-bold text-xl font-mono">03</div><div><h4 className="text-white font-bold text-sm">Crypto Withdrawal</h4><p className="text-gray-500 text-xs mt-1">Bonus + Profits can be withdrawn directly to your Crypto Wallet.</p></div></div>
                </div>
                <button onClick={() => { setShowBonusModal(false); setShowDepositModal(true); }} className="w-full mt-8 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3.5 rounded-lg transition shadow-lg shadow-yellow-500/20">I Understand, Deposit Now</button>
            </div>
        </div>
      )}

      {showDepositModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-md p-8 relative shadow-2xl animate-in zoom-in-95">
                <button onClick={() => setShowDepositModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
                <h2 className="text-xl font-bold text-white mb-1">Activate Real Account</h2>
                <p className="text-gray-400 text-xs mb-6">Real accounts require an initial capital deposit.</p>
                <div className="space-y-5">
                    <div className="relative">
                        <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-2 block">Trading Platform</label>
                        <button onClick={() => setIsPlatformDropdownOpen(!isPlatformDropdownOpen)} className="w-full bg-[#1A1A1A] text-white px-4 py-3.5 rounded-xl border border-white/10 flex items-center justify-between hover:bg-[#222] transition group">
                            <div className="flex flex-col items-start"><span className="font-bold text-sm">{selectedPlatform.name}</span><span className="text-[10px] text-gray-500 group-hover:text-gray-400 transition">{selectedPlatform.desc}</span></div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isPlatformDropdownOpen ? 'rotate-180' : ''}`}><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                        </button>
                        {isPlatformDropdownOpen && (
                            <div className="absolute top-full left-0 w-full mt-2 bg-[#1A1A1A] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50 max-h-60 overflow-y-auto scrollbar-hide">
                                {PLATFORMS.map(p => (
                                    <div key={p.id} onClick={() => { setSelectedPlatform(p); setIsPlatformDropdownOpen(false); }} className={`px-4 py-3 cursor-pointer transition flex items-center justify-between ${selectedPlatform.id === p.id ? 'bg-blue-600/10 border-l-2 border-blue-500' : 'hover:bg-white/5 border-l-2 border-transparent'}`}>
                                        <div className="flex flex-col"><span className={`text-sm font-bold ${selectedPlatform.id === p.id ? 'text-blue-400' : 'text-white'}`}>{p.name}</span><span className="text-[10px] text-gray-500">{p.desc}</span></div>
                                        {selectedPlatform.id === p.id && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-blue-500"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-2 block">Initial Deposit (USD)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                            <input type="number" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} min="50" className="w-full bg-[#050505] text-white pl-8 pr-4 py-3 rounded-xl border border-white/20 focus:border-blue-500 outline-none text-lg font-mono placeholder-gray-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                        </div>
                        <p className="text-[10px] text-gray-500 mt-2 text-right">Activation Min: $50.00</p>
                    </div>
                </div>
                <div className="mt-8 pt-6 border-t border-white/10">
                    <div className="flex justify-between items-center mb-4"><span className="text-sm text-gray-400">Total to Pay</span><span className="text-2xl font-bold text-white tracking-tight">${parseFloat(depositAmount || '0').toFixed(2)}</span></div>
                    <button onClick={handleDepositRedirect} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2">Deposit & Activate <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg></button>
                </div>
            </div>
        </div>
      )}

      {/* =======================
          MAIN CONTENT AREA
         ======================= */}
      <main className="flex-1 flex flex-col relative h-screen overflow-hidden">
        
        {/* HEADER */}
        <header className="h-16 border-b border-gray-200 dark:border-white/5 bg-white dark:bg-[#0A0A0A] flex items-center justify-between px-6 z-30">
            {/* MENU BUTTON */}
            <div className="flex items-center gap-4">
                <button onClick={() => setIsSidebarOpen(true)} className="text-gray-400 hover:text-white transition">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
                </button>
                {/* DYNAMIC TITLE */}
                <h1 className="text-lg font-bold capitalize hidden md:block">
                    {activePage === 'history' ? 'Trade History' : activePage === 'trans' ? 'Transactions' : activePage.replace('-', ' ')}
                </h1>
            </div>

            <div className="flex items-center gap-5">
                <button onClick={() => setShowBonusModal(true)} className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-[#FFE600] hover:bg-[#E5CE00] text-black text-xs font-bold rounded-full transition shadow-lg shadow-yellow-500/20 animate-pulse"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path fillRule="evenodd" d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" /></svg> Claim Bonus</button>
                <div className="hidden md:flex items-center gap-3 bg-gray-100 dark:bg-white/5 px-3 py-1.5 rounded-full border border-gray-200 dark:border-white/5">
                    <span className="text-[10px] text-gray-500 font-bold uppercase">Total Equity</span>
                    <span className="text-sm font-bold font-mono text-green-400">$ {totalEquity.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="w-px h-6 bg-gray-200 dark:bg-white/10 mx-1"></div>
                <button onClick={() => setIsNotifOpen(true)} className="text-gray-500 hover:text-black dark:hover:text-white transition relative"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" /></svg><span className="absolute top-0 right-0 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-white dark:border-[#0A0A0A]"></span></button>
                <div onClick={() => setIsProfileOpen(!isProfileOpen)} className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:shadow-lg hover:shadow-blue-500/30 transition select-none">{user?.email?.charAt(0).toUpperCase()}</div>
            </div>
        </header>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 relative">
            
            {/* ... [PROFILE, REFERRALS, ACCOUNTS views same as before] ... */}
            
            {/* --- 1. PROFILE VIEW --- */}
            {activePage === 'profile' && (
               <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300">
                    <div className="flex items-center gap-6 mb-8">
                        <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-3xl font-bold text-white shadow-2xl">
                            {user?.email?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">{user?.email?.split('@')[0]}</h2>
                            <p className="text-gray-400 text-sm">{user?.email}</p>
                            <div className="mt-2 flex gap-2">
                                <span className="bg-green-500/10 text-green-500 text-xs px-2 py-1 rounded border border-green-500/20">Verified Account</span>
                                <span className="bg-blue-500/10 text-blue-500 text-xs px-2 py-1 rounded border border-blue-500/20">Pro Trader</span>
                            </div>
                        </div>
                    </div>
                    {/* ... (rest of profile content) ... */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-white mb-4">Account Information</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between py-2 border-b border-white/5"><span className="text-gray-500 text-sm">User ID</span><span className="text-white text-sm font-mono">{user?.id}</span></div>
                                <div className="flex justify-between py-2 border-b border-white/5"><span className="text-gray-500 text-sm">Country</span><span className="text-white text-sm">{user?.user_metadata?.country || 'Unknown'}</span></div>
                                <div className="flex justify-between py-2 border-b border-white/5"><span className="text-gray-500 text-sm">Referral Code</span><span className="text-yellow-500 text-sm font-bold tracking-wider">{displayCode}</span></div>
                            </div>
                        </div>
                        <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-white mb-4">Security Settings</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                    <div><p className="text-white text-sm">Password</p><p className="text-gray-500 text-xs">Manage your login details</p></div>
                                    <button onClick={handlePasswordReset} disabled={resetLoading} className="text-blue-500 text-xs font-bold hover:underline disabled:opacity-50">{resetLoading ? "Sending..." : "Change Password"}</button>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                    <div><p className="text-white text-sm">2-Factor Authentication</p><p className="text-gray-500 text-xs">Secure your account</p></div>
                                    <button className="text-gray-400 text-xs font-bold hover:text-white">Enable</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- 2. REFERRALS VIEW --- */}
            {activePage === 'referrals' && (
                <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300">
                    {/* ... (referrals content same as before) ... */}
                    <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                        <div><h2 className="text-2xl font-bold text-white mb-2">Partner Program</h2><p className="text-gray-400 text-sm max-w-md">Invite friends and earn a 200% bonus when 5 referrals join and deposit.</p></div>
                        <div className="text-right"><p className="text-xs text-gray-500 font-bold uppercase mb-1">Total Referrals</p><p className="text-3xl font-mono font-bold text-white">{referralCount}</p></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-[#151515] border border-gray-200 dark:border-white/5 p-6 rounded-2xl">
                            <h3 className="text-sm font-bold text-gray-300 mb-4 flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-blue-500"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" /></svg> Your Referral Link</h3>
                            <div className="flex gap-2">
                                <input readOnly value={referralLink} className="flex-1 bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-sm text-gray-400 font-mono outline-none" />
                                <div className="relative">
                                    <button onClick={() => copyToClipboard(referralLink)} className={`px-6 py-3 rounded-lg font-bold text-xs transition min-w-[80px] ${copySuccess ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}>{copySuccess ? 'Copied' : 'Copy'}</button>
                                </div>
                            </div>
                            <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center gap-3"><div className="text-blue-400 text-xs font-bold bg-blue-500/20 px-2 py-1 rounded">{displayCode}</div><span className="text-xs text-blue-400">Share this code manually</span></div>
                        </div>
                        <div className="bg-white dark:bg-[#151515] border border-gray-200 dark:border-white/5 p-6 rounded-2xl relative overflow-hidden">
                            <h3 className="text-sm font-bold text-gray-300 mb-2">Bonus Progress</h3>
                            <div className="flex justify-between items-end mb-2"><span className="text-3xl font-bold text-white">{Math.round(bonusProgress)}%</span><span className="text-xs text-gray-500">{referralCount} / {bonusTarget} Friends</span></div>
                            <div className="w-full bg-gray-800 rounded-full h-2 mb-4"><div className="bg-yellow-500 h-2 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(234,179,8,0.5)]" style={{ width: `${bonusProgress}%` }}></div></div>
                            <p className="text-xs text-gray-500">Refer {Math.max(0, bonusTarget - referralCount)} more friends to unlock the bonus.</p>
                        </div>
                    </div>
                    {/* Graph */}
                    <div className="bg-white dark:bg-[#151515] border border-gray-200 dark:border-white/5 rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-6"><h3 className="text-lg font-bold text-white">Total Network Growth</h3><div className="flex bg-black/30 p-1 rounded-lg border border-white/10">{['7d', '30d', '1y'].map((filter) => (<button key={filter} onClick={() => setGraphFilter(filter)} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${graphFilter === filter ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>{filter === '7d' ? 'Last 7 Days' : filter === '30d' ? 'Last 30 Days' : 'Yearly'}</button>))}</div></div>
                        <div className="flex items-end gap-3 h-48 w-full border-b border-white/5 pb-2 px-2">
                            {processedGraphData.dataPoints.map((val, i) => {
                                const height = processedGraphData.maxVal > 0 ? Math.max((val / processedGraphData.maxVal) * 100, 5) : 5; 
                                const isToday = i === processedGraphData.dataPoints.length - 1 && graphFilter !== '1y';
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                                        <div className={`w-full rounded-t-sm transition-all duration-700 relative ${isToday ? 'bg-blue-500' : 'bg-blue-600/30 group-hover:bg-blue-500/80'}`} style={{ height: `${height}%` }}>
                                            <div className="opacity-0 group-hover:opacity-100 absolute -top-12 left-1/2 -translate-x-1/2 bg-[#111] border border-white/20 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-xl transition-all duration-200 pointer-events-none z-10 whitespace-nowrap flex flex-col items-center">
                                                <span className="text-[10px] text-gray-400 font-normal mb-0.5">{processedGraphData.labels[i]}</span><span>{val} Users</span><div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#111] border-r border-b border-white/20 rotate-45"></div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-500 mt-3 uppercase font-bold tracking-widest px-2">{processedGraphData.labels.map((label, i) => (<span key={i} className="flex-1 text-center truncate px-1">{label.split(' ')[0]}</span>))}</div>
                    </div>
                </div>
            )}
            
            {/* ... [BONUSES, DEPOSIT, WITHDRAW, ACCOUNTS same as before] ... */}
            {activePage === 'bonuses' && (
                <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">Active Bonuses</h2>
                        <p className="text-gray-400 text-sm">Boost your trading capital with our exclusive offers.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {BONUSES.map((bonus) => (
                            <div key={bonus.id} className="bg-[#111] border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-white/20 transition">
                                <div className={`absolute top-0 right-0 p-3 ${bonus.bg} rounded-bl-2xl`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${bonus.color}`}><path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H4.5a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" /></svg>
                                </div>
                                <h3 className="text-lg font-bold text-white mt-2">{bonus.title}</h3>
                                <p className="text-sm text-gray-400 mt-2 min-h-[40px]">{bonus.desc}</p>
                                
                                <div className="mt-6">
                                    <div className="flex justify-between text-[10px] text-gray-500 uppercase font-bold mb-2">
                                        <span>Progress</span>
                                        <span>{bonus.progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-800 rounded-full h-1.5">
                                        <div className={`h-1.5 rounded-full ${bonus.color.replace('text', 'bg')}`} style={{ width: `${bonus.progress}%` }}></div>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => handleBonusClaim(bonus.id)}
                                    disabled={bonus.status === 'locked'}
                                    className={`w-full mt-6 py-3 rounded-xl font-bold text-sm transition ${bonus.status === 'locked' ? 'bg-white/5 text-gray-500 cursor-not-allowed' : 'bg-white text-black hover:bg-gray-200'}`}
                                >
                                    {bonus.btn}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activePage === 'deposit' && (
                <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">{selectedDepositMethod ? `Deposit ${selectedDepositMethod.name}` : 'Deposit Funds'}</h2>
                        <p className="text-gray-400 text-sm">{selectedDepositMethod ? 'Scan QR Code or copy the address below.' : 'Select a secure payment method to fund your account.'}</p>
                    </div>

                    {!selectedDepositMethod ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                           {PAYMENT_METHODS.map((method) => (
                               <div 
                                    key={method.id} 
                                    onClick={() => method.status !== 'soon' && setSelectedDepositMethod(method)}
                                    className={`bg-white dark:bg-[#151515] border border-gray-200 dark:border-white/5 p-6 rounded-2xl transition group flex items-start gap-4 ${method.status === 'soon' ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-500/50 hover:bg-[#1A1A1A] cursor-pointer'}`}
                               >
                                   <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold ${method.bg} ${method.color} flex-shrink-0`}>{method.icon}</div>
                                   <div className="flex-1">
                                       <div className="flex justify-between items-center mb-1">
                                           <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-400 transition">{method.name}</h4>
                                           {method.status === 'soon' && <span className="text-[9px] bg-white/10 px-2 py-0.5 rounded text-gray-400">SOON</span>}
                                       </div>
                                       <div className="flex gap-3 text-[10px] text-gray-500">
                                           <span>Fee: <span className="text-white">0%</span></span>
                                           <span>Time: <span className="text-white">{method.time}</span></span>
                                       </div>
                                   </div>
                               </div>
                           ))}
                        </div>
                    ) : (
                        // DETAIL VIEW (UPDATED with QR and Size)
                        <div className="bg-[#111] border border-white/10 rounded-2xl p-8 max-w-2xl mx-auto">
                            <button onClick={() => setSelectedDepositMethod(null)} className="text-sm text-gray-500 hover:text-white flex items-center gap-2 mb-6"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg> Back to Methods</button>
                            
                            <div className="flex flex-col items-center text-center">
                                {/* DYNAMIC QR CODE GENERATOR */}
                                <div className="w-48 h-48 bg-white p-2 rounded-xl mb-6">
                                    <img 
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${selectedDepositMethod.address}`} 
                                        alt="Wallet QR Code" 
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <p className="text-gray-400 text-sm mb-2">Send only <span className="text-white font-bold">{selectedDepositMethod.name}</span> to this address.</p>
                                
                                <div className="w-full bg-[#050505] border border-white/20 rounded-xl px-4 py-4 flex items-center justify-between gap-4 mt-2">
                                    {/* BIGGER FONT SIZE */}
                                    <span className="text-xs md:text-sm font-mono text-white break-all text-center">{selectedDepositMethod.address}</span>
                                    <button onClick={() => copyToClipboard(selectedDepositMethod.address)} className="text-blue-500 hover:text-white flex-shrink-0 ml-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" /></svg></button>
                                </div>

                                <div className="grid grid-cols-2 gap-4 w-full mt-6">
                                    <div className="bg-white/5 rounded-lg p-3 text-left">
                                        <p className="text-[10px] text-gray-500 uppercase font-bold">Network</p>
                                        <p className="text-sm text-white">{selectedDepositMethod.name.split('(')[1]?.replace(')', '') || 'Mainnet'}</p>
                                    </div>
                                    <div className="bg-white/5 rounded-lg p-3 text-left">
                                        <p className="text-[10px] text-gray-500 uppercase font-bold">Minimum</p>
                                        <p className="text-sm text-white">$10.00</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {activePage === 'withdraw' && (
                 <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300">
                    <div><h2 className="text-2xl font-bold text-white mb-2">Withdraw Funds</h2><p className="text-gray-400 text-sm">Request a withdrawal to your external wallet.</p></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* LEFT: FORM */}
                        <div className="space-y-6">
                             {/* Crypto Selector */}
                            <div className="relative">
                                <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-2 block">Withdrawal Method</label>
                                <button 
                                    onClick={() => setIsWithdrawDropdownOpen(!isWithdrawDropdownOpen)}
                                    className="w-full bg-[#1A1A1A] text-white px-4 py-3.5 rounded-xl border border-white/10 flex items-center justify-between hover:bg-[#222] transition group"
                                >
                                    <div className="flex items-center gap-3">
                                         {selectedWithdrawMethod ? (
                                             <>
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${selectedWithdrawMethod.bg} ${selectedWithdrawMethod.color}`}>{selectedWithdrawMethod.icon}</div>
                                                <span className="font-bold text-sm">{selectedWithdrawMethod.name}</span>
                                             </>
                                         ) : <span className="text-gray-500 text-sm">Select Method</span>}
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isWithdrawDropdownOpen ? 'rotate-180' : ''}`}><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                                </button>
                                {isWithdrawDropdownOpen && (
                                    <div className="absolute top-full left-0 w-full mt-2 bg-[#1A1A1A] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50 max-h-60 overflow-y-auto scrollbar-hide">
                                        {PAYMENT_METHODS.map(m => (
                                            <div 
                                                key={m.id} 
                                                onClick={() => { 
                                                    if(m.status !== 'soon') {
                                                        setSelectedWithdrawMethod(m); 
                                                        setIsWithdrawDropdownOpen(false); 
                                                    }
                                                }}
                                                className={`px-4 py-3 transition flex items-center gap-3 ${m.status === 'soon' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-white/5'} ${selectedWithdrawMethod?.id === m.id ? 'bg-blue-600/10 border-l-2 border-blue-500' : 'border-l-2 border-transparent'}`}
                                            >
                                                 <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${m.bg} ${m.color}`}>{m.icon}</div>
                                                <span className={`text-sm font-bold ${selectedWithdrawMethod?.id === m.id ? 'text-blue-400' : 'text-white'}`}>{m.name}</span>
                                                {m.status === 'soon' && <span className="ml-auto text-[9px] bg-white/10 px-2 py-0.5 rounded text-gray-400">SOON</span>}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Wallet Address */}
                            <div>
                                <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-2 block">Wallet Address</label>
                                <input 
                                    type="text" 
                                    value={walletAddress}
                                    onChange={(e) => setWalletAddress(e.target.value)}
                                    placeholder="Enter destination address"
                                    className="w-full bg-[#050505] text-white px-4 py-3.5 rounded-xl border border-white/20 focus:border-blue-500 outline-none text-sm font-mono placeholder-gray-600 transition"
                                />
                            </div>

                            {/* Amount */}
                            <div>
                                <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-2 block">Withdrawal Amount (USD)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                                    <input 
                                        type="number" 
                                        value={withdrawAmount}
                                        onChange={(e) => setWithdrawAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full bg-[#050505] text-white pl-8 pr-4 py-3.5 rounded-xl border border-white/20 focus:border-blue-500 outline-none text-lg font-mono placeholder-gray-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    />
                                    <button onClick={() => setWithdrawAmount(totalEquity.toString())} className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-blue-500 font-bold hover:text-blue-400 uppercase">Max</button>
                                </div>
                                <p className="text-[10px] text-gray-500 mt-2 text-right">Available: <span className="text-white">${totalEquity.toLocaleString()}</span></p>
                            </div>

                            <button onClick={handleWithdraw} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2">
                                Confirm Withdrawal <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                            </button>
                        </div>

                        {/* RIGHT: SUMMARY CARD */}
                        <div className="bg-[#111] border border-white/10 rounded-2xl p-6 h-fit">
                            <h3 className="text-white font-bold text-lg mb-6">Summary</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between text-sm"><span className="text-gray-500">Method</span><span className="text-white">{selectedWithdrawMethod?.name || '-'}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-gray-500">Network Fee</span><span className="text-green-500">Free</span></div>
                                <div className="flex justify-between text-sm"><span className="text-gray-500">Processing Time</span><span className="text-white">~15 Mins</span></div>
                                <div className="h-px bg-white/10 my-4"></div>
                                <div className="flex justify-between text-base font-bold"><span className="text-gray-400">Total Receive</span><span className="text-white">${parseFloat(withdrawAmount || '0').toLocaleString()}</span></div>
                            </div>
                        </div>
                    </div>
                 </div>
            )}

            {activePage === 'accounts' && (
                <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <h2 className="text-xl font-bold text-white">Real Accounts</h2>
                        <button onClick={() => setShowDepositModal(true)} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-lg shadow-lg shadow-blue-500/20 transition flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg> Open New Account</button>
                    </div>
                    {accounts.length === 0 ? (
                        <div className="bg-[#0E0E0E] border border-white/5 rounded-2xl p-12 text-center border-dashed">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" /></svg></div>
                            <h3 className="text-white font-bold text-lg">No Active Accounts</h3>
                            <p className="text-gray-500 text-sm mt-2 max-w-xs mx-auto">Open a real account by making a minimum deposit of $50 to start trading.</p>
                            <button onClick={() => setShowDepositModal(true)} className="mt-6 text-blue-500 hover:text-blue-400 font-bold text-sm">Deposit to Start &rarr;</button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {accounts.map((acc, index) => (
                                <div key={index} className="bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/5 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all">
                                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
                                        <div className="flex items-center gap-4"><span className="px-3 py-1 text-[10px] font-bold rounded uppercase bg-green-900/30 text-green-400 border border-green-500/20">REAL</span><h3 className="text-lg font-bold text-gray-900 dark:text-white">{acc.type} <span className="font-normal text-gray-500 text-sm ml-2">{acc.subType} #{acc.id}</span></h3></div>
                                        <div className="flex gap-3 w-full lg:w-auto"><button className="flex-1 lg:flex-none px-8 py-3 bg-[#FFE600] hover:bg-[#E5CE00] text-black font-bold text-sm rounded-lg transition">Trade</button><button onClick={() => setActivePage('deposit')} className="flex-1 lg:flex-none px-6 py-3 bg-gray-100 dark:bg-[#151515] border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/30 text-gray-900 dark:text-white font-bold text-sm rounded-lg transition">Deposit</button><button className="flex-1 lg:flex-none px-6 py-3 bg-gray-100 dark:bg-[#151515] border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/30 text-gray-900 dark:text-white font-bold text-sm rounded-lg transition">Withdraw</button></div>
                                    </div>
                                    <div className="mb-8"><div className="text-5xl font-mono font-bold text-gray-900 dark:text-white tracking-tight">{acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })} <span className="text-2xl text-gray-400">{acc.currency}</span></div></div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-gray-100 dark:border-white/5 pt-6"><div><p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Leverage</p><p className="font-medium text-gray-900 dark:text-gray-200">{acc.leverage}</p></div><div><p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Free Margin</p><p className="font-medium text-gray-900 dark:text-gray-200">{acc.equity.toLocaleString()} {acc.currency}</p></div><div><p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Equity</p><p className="font-medium text-gray-900 dark:text-gray-200">{acc.equity.toLocaleString()} {acc.currency}</p></div><div><p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Total Margin</p><p className="font-medium text-gray-900 dark:text-gray-200">{acc.margin.toLocaleString()} {acc.currency}</p></div></div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* --- 7. HISTORY VIEW (Trade History ONLY) --- */}
            {activePage === 'history' && (
                <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300">
                    <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                        <h2 className="text-2xl font-bold text-white">Trade History</h2>
                    </div>

                    <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
                        <table className="w-full text-left text-sm text-gray-400">
                            <thead className="bg-[#1A1A1A] text-gray-500 font-bold uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4">ID</th><th className="px-6 py-4">Time</th><th className="px-6 py-4">Symbol</th><th className="px-6 py-4">Type</th><th className="px-6 py-4">Volume</th><th className="px-6 py-4">Open Price</th><th className="px-6 py-4">Close Price</th><th className="px-6 py-4 text-right">Profit</th>
                                </tr>
                            </thead>
                            <tbody><tr><td colSpan={8} className="px-6 py-12 text-center text-gray-600">No trades found for this period.</td></tr></tbody>
                        </table>
                    </div>
                </div>
            )}
            
            {/* --- 9. TRANSACTIONS VIEW (NEW PAGE) --- */}
            {activePage === 'trans' && (
                <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300">
                    <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                        <h2 className="text-2xl font-bold text-white">Transactions</h2>
                    </div>

                    <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
                        <table className="w-full text-left text-sm text-gray-400">
                            <thead className="bg-[#1A1A1A] text-gray-500 font-bold uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4">ID</th><th className="px-6 py-4">Time</th><th className="px-6 py-4">Type</th><th className="px-6 py-4">Amount</th><th className="px-6 py-4">Method</th><th className="px-6 py-4 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody><tr><td colSpan={6} className="px-6 py-12 text-center text-gray-600">No deposit or withdrawal history found.</td></tr></tbody>
                        </table>
                    </div>
                </div>
            )}
            
             {/* --- 8. PERFORMANCE VIEW (UPDATED) --- */}
            {activePage === 'perf' && (
               <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300">
                   <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                       <h2 className="text-2xl font-bold text-white">Performance Analytics</h2>
                       <div className="flex bg-black/30 p-1 rounded-lg border border-white/10">
                            {['1D', '1W', '1M', '1Y', 'All'].map((t) => (
                                <button key={t} onClick={() => setPerfTimeframe(t)} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${perfTimeframe === t ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>{t}</button>
                            ))}
                       </div>
                   </div>

                   {/* MAIN CHART (FLAT LINE 0) */}
                   <div className="bg-[#111] border border-white/10 rounded-2xl p-6 h-[300px] relative overflow-hidden group">
                       <div className="absolute top-6 left-6 z-10">
                           <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total Net Profit</p>
                           <p className="text-3xl font-mono font-bold text-white mt-1">$0.00 <span className="text-sm text-gray-500 font-sans font-normal">(0.00%)</span></p>
                       </div>
                       
                       <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 pointer-events-none">
                           {[...Array(24)].map((_, i) => <div key={i} className="border-r border-b border-white/5"></div>)}
                       </div>

                       <div className="absolute bottom-10 left-0 right-0 h-px bg-blue-500/50"></div>
                       <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-blue-500/10 to-transparent"></div>
                       
                       <div className="absolute inset-0 flex items-center justify-center">
                           <p className="text-sm text-gray-600 font-medium">No trade data available to display.</p>
                       </div>
                   </div>

                   {/* DETAILED STATS GRID (ALL 0) */}
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                       {[
                           { label: 'Total Trades', val: '0' },
                           { label: 'Profit Factor', val: '0.00' },
                           { label: 'Win Rate', val: '0%' },
                           { label: 'Sharpe Ratio', val: '0.00' },
                           { label: 'Best Trade', val: '$0.00' },
                           { label: 'Worst Trade', val: '$0.00' },
                           { label: 'Avg Win', val: '$0.00' },
                           { label: 'Avg Loss', val: '$0.00' },
                       ].map((stat, i) => (
                           <div key={i} className="bg-[#111] border border-white/5 rounded-xl p-5 hover:border-white/10 transition">
                               <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-2">{stat.label}</p>
                               <p className="text-xl font-mono font-bold text-white">{stat.val}</p>
                           </div>
                       ))}
                   </div>
               </div>
            )}

        </div>
      </main>
    </div>
  );
}

// --- HELPER ---
function SidebarItem({ icon, label, active, onClick, isExternal }: { icon: string, label: string, active: boolean, onClick: () => void, isExternal?: boolean }) {
    return (
        <button onClick={onClick} className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 mb-1 group ${active ? 'bg-blue-50 dark:bg-white/10 text-blue-600 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5'}`}>
            <span className={`transition-colors ${active ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`}>
                {icon === 'users' && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>}
                {icon === 'chart' && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" /></svg>}
                {icon === 'history' && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>}
                {icon === 'download' && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>}
                {icon === 'upload' && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" /></svg>}
                {icon === 'list' && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 17.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>}
                {icon === 'bitcoin' && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" /></svg>}
                {icon === 'eye' && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>}
                {icon === 'calendar' && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>}
                {icon === 'user' && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>}
                {icon === 'shield' && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" /></svg>}
                {icon === 'gift' && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H4.5a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" /></svg>}
                {icon === 'trophy' && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 12.375a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.961 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.962 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" /></svg>}
            </span>
            <span className="flex-1 truncate">{label}</span>
        </button>
    );
}