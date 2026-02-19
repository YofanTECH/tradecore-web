'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/app/utils/supabase/client';

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

type Notification = {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning';
  time: string;
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
    progress: 0, 
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
  { id: 'btc', name: 'Bitcoin (BTC)', type: 'crypto', icon: '₿', color: 'text-orange-500', bg: 'bg-orange-500/10', time: 'Instant', limit: '50 - 200k', address: 'bc1qshcgsytuknsa6snremp80azdn6vjrudtsv6pg2' },
  { id: 'usdt_trc20', name: 'Tether (USDT TRC20)', type: 'crypto', icon: 'T', color: 'text-green-500', bg: 'bg-green-500/10', time: '5 mins', limit: '50 - 200k', address: 'TJmjDXa7q4tNTZMij8hPXvghj1LrRkFf8V' },
  { id: 'trx', name: 'TRON (TRX)', type: 'crypto', icon: '♦', color: 'text-red-500', bg: 'bg-red-500/10', time: '5 mins', limit: '50 - 200k', address: 'TJmjDXa7q4tNTZMij8hPXvghj1LrRkFf8V' },
  { id: 'eth', name: 'Ethereum (ETH)', type: 'crypto', icon: 'Ξ', color: 'text-purple-500', bg: 'bg-purple-500/10', time: '15 mins', limit: '50 - 200k', address: '0x836877b56054434f5be5c97c19809fd7ad08006a' },
  { id: 'usdt_erc20', name: 'Tether (USDT ERC20)', type: 'crypto', icon: 'T', color: 'text-green-500', bg: 'bg-green-500/10', time: '15 mins', limit: '50 - 200k', address: '0x836877b56054434f5be5c97c19809fd7ad08006a' },
  { id: 'usdc_erc20', name: 'USD Coin (USDC ERC20)', type: 'crypto', icon: '$', color: 'text-blue-500', bg: 'bg-blue-500/10', time: '15 mins', limit: '50 - 200k', address: '0x836877b56054434f5be5c97c19809fd7ad08006a' },
  { id: 'usdt_bep20', name: 'Tether (USDT BEP20)', type: 'crypto', icon: 'T', color: 'text-green-500', bg: 'bg-green-500/10', time: '5 mins', limit: '50 - 200k', address: '0x836877b56054434f5be5c97c19809fd7ad08006a' },
  { id: 'usdc_bep20', name: 'USD Coin (USDC BEP20)', type: 'crypto', icon: '$', color: 'text-blue-500', bg: 'bg-blue-500/10', time: '5 mins', limit: '50 - 200k', address: '0x836877b56054434f5be5c97c19809fd7ad08006a' },
  { id: 'card', name: 'MasterCard / Visa', type: 'fiat', icon: '💳', color: 'text-white', bg: 'bg-white/10', time: 'Instant', limit: '50 - 10k', status: 'soon' },
  { id: 'paypal', name: 'PayPal', type: 'fiat', icon: 'P', color: 'text-blue-400', bg: 'bg-blue-500/10', time: 'Instant', limit: '50 - 5k', status: 'soon' },
  { id: 'bank', name: 'International Bank Wire', type: 'fiat', icon: '🏦', color: 'text-gray-300', bg: 'bg-white/5', time: '3-5 Days', limit: '500 - 500k', status: 'soon' },
];

const FAQS = [
  "Learn more about crypto",
  "How do I buy crypto from exchanges?",
  "How do I verify my crypto address?",
  "How do I deposit with Bitcoin?"
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

  // --- KYC STATES ---
  const [kycStatus, setKycStatus] = useState<'unverified' | 'pending' | 'verified'>('unverified');
  const [kycStep, setKycStep] = useState(1);
  const [kycProcessing, setKycProcessing] = useState(false);
  const [livenessInstruction, setLivenessInstruction] = useState('Position your face in the circle');
  
  // NEW: KYC Step 1 Form States
  const [kycFirstName, setKycFirstName] = useState('');
  const [kycLastName, setKycLastName] = useState('');
  const [kycDob, setKycDob] = useState('');
  const [kycAddress, setKycAddress] = useState('');

  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const frontFileRef = useRef<HTMLInputElement>(null);
  const backFileRef = useRef<HTMLInputElement>(null);
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);

  // --- NOTIFICATIONS ---
  const [notifications, setNotifications] = useState<Notification[]>([
      { id: '1', title: 'Welcome Aboard 🚀', message: 'Your account is active. Complete your first deposit to start trading.', type: 'info', time: '2 hours ago' }
  ]);

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
  const [selectedDepositMethod, setSelectedDepositMethod] = useState<any>(PAYMENT_METHODS[0]);
  const [isPaymentDropdownOpen, setIsPaymentDropdownOpen] = useState(false);
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

  // --- DATA LOADING & PERSISTENCE ---
  useEffect(() => {
    setOrigin(window.location.origin);
    async function getData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      setUser(user);

      // Check Local Storage for KYC linked SPECIFICALLY to this user to prevent asking again
      const savedKyc = localStorage.getItem(`kycStatus_${user.id}`);
      if (savedKyc === 'verified' || savedKyc === 'pending') {
          setKycStatus(savedKyc as any);
      }

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
              if (referrals.length > 0) {
                  setNotifications(prev => [
                      { id: 'ref1', title: 'New Referral!', message: 'Someone just signed up using your link.', type: 'success', time: 'Just now' },
                      ...prev
                  ]);
              }
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
      if (page === 'deposit') setSelectedDepositMethod(PAYMENT_METHODS[0]);
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
      // Min Deposit Check: $50
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
          setActivePage('deposit'); 
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

  // --- KYC FUNCTIONS ---
  const handleKycStep1 = () => {
      if (!kycFirstName.trim() || !kycLastName.trim() || !kycDob.trim() || !kycAddress.trim()) {
          triggerToast("Please fill out all personal details.", "error");
          return;
      }
      
      // Enforce age and valid year
      const dobYear = parseInt(kycDob.split('-')[0]);
      const currentYear = new Date().getFullYear();
      if (dobYear < 1920 || dobYear > currentYear - 18) {
          triggerToast("Invalid Date of Birth. You must be at least 18 years old.", "error");
          return;
      }
      
      setKycStep(2);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'front' | 'back') => {
      if (e.target.files && e.target.files[0]) {
          if (type === 'front') setFrontFile(e.target.files[0]);
          else setBackFile(e.target.files[0]);
      }
  };

  const startCamera = async () => {
      try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          setVideoStream(stream);
          if (videoRef.current) {
              videoRef.current.srcObject = stream;
          }
      } catch (err) {
          triggerToast("Camera access denied or unavailable. Please check permissions.", "error");
      }
  };

  const stopCamera = () => {
      if (videoStream) {
          videoStream.getTracks().forEach(track => track.stop());
          setVideoStream(null);
      }
  };

  const handleKYCSubmit = () => {
      setKycProcessing(true);
      stopCamera();
      
      // Simulate Processing (Made longer to look real)
      setTimeout(() => {
          setKycProcessing(false);
          setKycStatus('pending'); 
          if(user) localStorage.setItem(`kycStatus_${user.id}`, 'pending'); // SAVE PER USER
          setKycStep(4); 
          
          triggerToast("Documents submitted successfully!", "success");
          
          // Simulate verification complete (Made longer 8s)
          setTimeout(() => {
              setKycStatus('verified'); 
              if(user) localStorage.setItem(`kycStatus_${user.id}`, 'verified'); // UPDATE PER USER
              triggerToast("Account Verified!", "success");
          }, 8000);
      }, 5000); // 5s Processing Time
  };

  // Face Check Sequence Trigger for Step 3 - Slow and Realistic
  useEffect(() => {
      let isCancelled = false; // cleanup flag

      if (kycStep === 3 && activePage === 'kyc' && videoStream) {
          const runSequence = async () => {
              if (isCancelled) return;
              setLivenessInstruction("Position your face in the circle...");
              await new Promise(r => setTimeout(r, 4000));
              
              if (isCancelled) return;
              setLivenessInstruction("Slowly turn your head to the Left ⬅️");
              await new Promise(r => setTimeout(r, 4000));
              
              if (isCancelled) return;
              setLivenessInstruction("Now, slowly turn to the Right ➡️");
              await new Promise(r => setTimeout(r, 4000));
              
              if (isCancelled) return;
              setLivenessInstruction("Look straight and Smile! 😊");
              await new Promise(r => setTimeout(r, 4000));
              
              if (isCancelled) return;
              setLivenessInstruction("Perfect! Capturing... 📸");
              await new Promise(r => setTimeout(r, 2000));
              
              if (!isCancelled) handleKYCSubmit();
          };
          runSequence();
      }

      return () => {
          isCancelled = true;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kycStep, activePage, videoStream]);

  // Cleanup camera on unmount or step change
  useEffect(() => {
      return () => stopCamera();
  }, []);

  // --- NEW LOADING SCREEN ---
  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
        <div className="relative w-20 h-20 mb-6">
           <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse"></div>
           <div className="absolute inset-0 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
           <div className="absolute inset-4 border-2 border-white/10 rounded-full"></div>
           <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
           </div>
        </div>
        <div className="flex flex-col items-center space-y-2">
            <span className="text-white text-xl font-bold tracking-widest uppercase">gav<span className="text-blue-500">blue</span></span>
            <span className="text-blue-500 text-[10px] font-mono animate-pulse">INITIALIZING CONSOLE...</span>
        </div>
      </div>
    );
  }

  // Calculate max date for 18 years old
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 18);
  const maxDateString = maxDate.toISOString().split('T')[0];

  return (
    // STRICT DARK MODE ENABLED & PROPORTIONAL LAYOUT FIX: Used h-screen and w-full
    <div className="h-screen w-full bg-[#050505] text-white font-sans flex overflow-hidden">
      
      {/* Custom styles for cool calendar icon */}
      <style dangerouslySetInnerHTML={{__html: `
        input[type="date"]::-webkit-calendar-picker-indicator {
            filter: invert(1) sepia(100%) saturate(10000%) hue-rotate(210deg);
            cursor: pointer;
            opacity: 0.8;
            transition: 0.2s;
        }
        input[type="date"]::-webkit-calendar-picker-indicator:hover {
            opacity: 1;
        }
      `}} />

      {/* TOAST */}
      {toast && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-top-5 fade-in duration-300 w-[90%] md:w-auto">
              <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border ${toast.type === 'error' ? 'bg-[#1a0505] border-red-500/20 text-red-500' : 'bg-[#051a05] border-green-500/20 text-green-500'}`}>
                  <span className="text-sm font-bold text-white text-center md:text-left">{toast.message}</span>
              </div>
          </div>
      )}

      {/* OVERLAY FOR MENUS */}
      {(isNotifOpen || isSidebarOpen) && (
        <div 
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden"
            onClick={() => { setIsNotifOpen(false); setIsSidebarOpen(false); }} 
        />
      )}

      {/* 1. NOTIFICATION PANEL */}
      <div className={`fixed top-0 right-0 h-full w-[85%] max-w-[350px] bg-[#111]/95 backdrop-blur-xl border-l border-white/10 shadow-2xl z-[70] transform transition-transform duration-300 ease-out ${isNotifOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-6 h-full flex flex-col">
              <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-bold text-white tracking-tight">Notifications</h2>
                  <button onClick={() => setIsNotifOpen(false)} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-4">
                  {notifications.map((notif) => (
                      <div key={notif.id} className={`p-4 rounded-xl border relative overflow-hidden group animate-in slide-in-from-right ${notif.type === 'success' ? 'bg-green-500/10 border-green-500/20' : notif.type === 'info' ? 'bg-blue-500/10 border-blue-500/20' : 'bg-yellow-500/10 border-yellow-500/20'}`}>
                          <div className={`absolute left-0 top-0 bottom-0 w-1 ${notif.type === 'success' ? 'bg-green-500' : notif.type === 'info' ? 'bg-blue-500' : 'bg-yellow-500'}`}></div>
                          <div className="flex justify-between items-start">
                              <p className="text-sm font-bold text-white">{notif.title}</p>
                              <span className="text-[10px] text-gray-500 font-mono">{notif.time}</span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1 leading-relaxed">{notif.message}</p>
                      </div>
                  ))}
              </div>
          </div>
      </div>

      {/* 2. SIDEBAR MENU - Added flex-shrink-0 and h-full for proportional alignment */}
      <div className={`fixed top-0 left-0 h-full w-[280px] flex-shrink-0 bg-[#0A0A0A] border-r border-white/5 shadow-2xl z-[70] transform transition-transform duration-300 ease-out flex flex-col md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/5 flex-shrink-0">
           <span className="text-xl font-bold tracking-tighter cursor-pointer select-none uppercase text-white" onClick={() => router.push('/')}>gav<span className="text-blue-500">blue</span></span>
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
                       <SidebarItem icon="shield" label="KYC Verification" active={activePage === 'kyc'} onClick={() => handleNavClick('kyc')} />
                   </div>
               </div>
           </div>
        </div>

        {/* SIDEBAR FOOTER */}
        <div className="p-4 border-t border-white/5 bg-[#080808] flex-shrink-0">
            <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-md flex-shrink-0">
                    {user?.email?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate leading-tight">{user?.email?.split('@')[0]}</p>
                    <p className={`text-[10px] font-bold leading-tight mt-0.5 ${kycStatus === 'verified' ? 'text-green-500' : kycStatus === 'pending' ? 'text-yellow-500' : 'text-red-500'}`}>
                        {kycStatus === 'verified' ? 'Verified' : kycStatus === 'pending' ? 'Pending' : 'Unverified'}
                    </p>
                </div>
                <button onClick={handleLogout} className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-white/5 transition flex-shrink-0" title="Log Out">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" /></svg>
                </button>
            </div>
        </div>
      </div>

      {/* 3. MODALS (Bonus & Deposit) */}
      {showBonusModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
             <div className="bg-[#111] border border-yellow-500/30 rounded-2xl w-full max-w-lg p-6 md:p-8 relative shadow-2xl animate-in zoom-in-95">
                <button onClick={() => setShowBonusModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
                <div className="text-center mb-6 md:mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-yellow-500/10 text-yellow-500 mb-4 animate-pulse"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 md:w-8 md:h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H4.5a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" /></svg></div>
                    <h2 className="text-xl md:text-2xl font-bold text-white">Unlock 200% Bonus</h2>
                    <p className="text-gray-400 text-xs md:text-sm mt-2">Complete steps to withdraw bonus funds.</p>
                </div>
                <div className="space-y-4">
                    <div className="bg-[#1A1A1A] p-4 rounded-xl flex items-start gap-4 border border-white/5 hover:border-yellow-500/30 transition">
                        <div className="text-yellow-500 font-bold text-lg md:text-xl font-mono mt-1">01</div>
                        <div className="flex-1"><h4 className="text-white font-bold text-sm">Refer 5 Friends</h4><p className="text-gray-500 text-[11px] md:text-xs mt-1">You must refer 5 active users. Current: <span className="text-yellow-500">{referralCount}/5</span></p><div className="w-full bg-gray-800 rounded-full h-1.5 mt-2"><div className="bg-yellow-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${bonusProgress}%` }}></div></div></div>
                    </div>
                    <div className="bg-[#1A1A1A] p-4 rounded-xl flex items-start gap-4 border border-white/5 hover:border-white/10 transition"><div className="text-gray-600 font-bold text-lg md:text-xl font-mono mt-1">02</div><div><h4 className="text-white font-bold text-sm">Trading Volume</h4><p className="text-gray-500 text-[11px] md:text-xs mt-1">Complete <span className="text-white font-bold">0.20 lots</span> of trading volume to unlock withdrawals.</p></div></div>
                    <div className="bg-[#1A1A1A] p-4 rounded-xl flex items-start gap-4 border border-white/5 hover:border-white/10 transition"><div className="text-gray-600 font-bold text-lg md:text-xl font-mono mt-1">03</div><div><h4 className="text-white font-bold text-sm">Crypto Withdrawal</h4><p className="text-gray-500 text-[11px] md:text-xs mt-1">Bonus + Profits can be withdrawn directly to your Crypto Wallet.</p></div></div>
                </div>
                <button onClick={() => { setShowBonusModal(false); setShowDepositModal(true); }} className="w-full mt-8 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3.5 rounded-lg transition shadow-lg shadow-yellow-500/20 text-sm md:text-base">I Understand, Deposit Now</button>
            </div>
        </div>
      )}

      {showDepositModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
             <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-md p-6 md:p-8 relative shadow-2xl animate-in zoom-in-95">
                <button onClick={() => setShowDepositModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
                <h2 className="text-xl md:text-2xl font-bold text-white mb-1">Activate Real Account</h2>
                <p className="text-gray-400 text-[11px] md:text-xs mb-6">Real accounts require an initial capital deposit.</p>
                
                <div className="space-y-5">
                    {/* TRADING PLATFORM SELECTOR */}
                    <div className="relative">
                        <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-2 block">Trading Platform</label>
                        <button onClick={() => setIsPlatformDropdownOpen(!isPlatformDropdownOpen)} className="w-full bg-[#1A1A1A] text-white px-4 py-3.5 rounded-xl border border-white/10 flex items-center justify-between hover:bg-[#222] transition group">
                            <div className="flex flex-col items-start"><span className="font-bold text-sm">{selectedPlatform.name}</span><span className="text-[10px] text-gray-500 group-hover:text-gray-400 transition">{selectedPlatform.desc}</span></div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isPlatformDropdownOpen ? 'rotate-180' : ''}`}><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                        </button>
                        {isPlatformDropdownOpen && (
                            <div className="absolute top-full left-0 w-full mt-2 bg-[#1A1A1A] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50 max-h-48 md:max-h-60 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                                {PLATFORMS.map(p => (
                                    <div key={p.id} onClick={() => { setSelectedPlatform(p); setIsPlatformDropdownOpen(false); }} className={`px-4 py-3 cursor-pointer transition flex items-center justify-between ${selectedPlatform.id === p.id ? 'bg-blue-600/10 border-l-2 border-blue-500' : 'hover:bg-white/5 border-l-2 border-transparent'}`}>
                                            <div className="flex flex-col"><span className={`text-sm font-bold ${selectedPlatform.id === p.id ? 'text-blue-400' : 'text-white'}`}>{p.name}</span><span className="text-[10px] text-gray-500">{p.desc}</span></div>
                                            {selectedPlatform.id === p.id && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-blue-500"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* NEW: PAYMENT/CRYPTO METHOD SELECTOR */}
                    <div className="relative">
                        <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-2 block">Deposit Method (Crypto)</label>
                        <button onClick={() => setIsPaymentDropdownOpen(!isPaymentDropdownOpen)} className="w-full bg-[#1A1A1A] text-white px-4 py-3.5 rounded-xl border border-white/10 flex items-center justify-between hover:bg-[#222] transition group">
                            <div className="flex items-center gap-3">
                                <span className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs ${selectedDepositMethod.bg} ${selectedDepositMethod.color}`}>{selectedDepositMethod.icon}</span>
                                <span className="font-bold text-sm">{selectedDepositMethod.name}</span>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isPaymentDropdownOpen ? 'rotate-180' : ''}`}><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                        </button>
                        {isPaymentDropdownOpen && (
                            <div className="absolute top-full left-0 w-full mt-2 bg-[#1A1A1A] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50 max-h-48 md:max-h-60 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                                {PAYMENT_METHODS.filter(m => m.type === 'crypto').map(m => (
                                    <div key={m.id} onClick={() => { setSelectedDepositMethod(m); setIsPaymentDropdownOpen(false); }} className={`px-4 py-3 cursor-pointer transition flex items-center justify-between ${selectedDepositMethod?.id === m.id ? 'bg-blue-600/10 border-l-2 border-blue-500' : 'hover:bg-white/5 border-l-2 border-transparent'}`}>
                                         <div className="flex items-center gap-3">
                                             <span className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs ${m.bg} ${m.color}`}>{m.icon}</span>
                                             <span className={`text-sm font-bold ${selectedDepositMethod?.id === m.id ? 'text-blue-400' : 'text-white'}`}>{m.name}</span>
                                         </div>
                                         {selectedDepositMethod?.id === m.id && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-blue-500"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* AMOUNT INPUT */}
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
                    <div className="flex justify-between items-center mb-4"><span className="text-sm text-gray-400">Total to Pay</span><span className="text-xl md:text-2xl font-bold text-white tracking-tight">${parseFloat(depositAmount || '0').toFixed(2)}</span></div>
                    <button onClick={handleDepositRedirect} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 text-sm md:text-base">Deposit & Activate <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg></button>
                </div>
            </div>
        </div>
      )}

      {/* =======================
          MAIN CONTENT AREA - Added h-full and min-w-0 for precise screen fitting 
         ======================= */}
      <main className="flex-1 flex flex-col relative h-full overflow-hidden min-w-0 bg-[#050505]">
        
        {/* HEADER */}
        <header className="h-16 border-b border-white/5 bg-[#0A0A0A] w-full flex items-center justify-between px-4 md:px-6 z-30 flex-shrink-0">
            {/* MENU BUTTON */}
            <div className="flex items-center gap-3 md:gap-4">
                <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-gray-400 hover:text-white transition">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
                </button>
                {/* DYNAMIC TITLE */}
                <h1 className="text-base md:text-lg font-bold capitalize text-white truncate">
                    {activePage === 'history' ? 'Trade History' : activePage === 'trans' ? 'Transactions' : activePage === 'kyc' ? 'Verification' : activePage.replace('-', ' ')}
                </h1>
            </div>

            <div className="flex items-center gap-3 md:gap-5">
                <button onClick={() => setShowBonusModal(true)} className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-[#FFE600] hover:bg-[#E5CE00] text-black text-xs font-bold rounded-full transition shadow-lg shadow-yellow-500/20 animate-pulse"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path fillRule="evenodd" d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" /></svg> Claim Bonus</button>
                <div className="hidden sm:flex items-center gap-3 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                    <span className="text-[10px] text-gray-500 font-bold uppercase hidden md:inline-block">Total Equity</span>
                    <span className="text-xs md:text-sm font-bold font-mono text-green-400">$ {totalEquity.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="w-px h-6 bg-white/10 hidden sm:block"></div>
                <button onClick={() => setIsNotifOpen(true)} className="text-gray-500 hover:text-white transition relative"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" /></svg><span className="absolute top-0 right-0 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-[#0A0A0A]"></span></button>
                <div onClick={() => setIsProfileOpen(!isProfileOpen)} className="h-8 w-8 md:h-9 md:w-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:shadow-lg hover:shadow-blue-500/30 transition select-none">{user?.email?.charAt(0).toUpperCase()}</div>
            </div>
        </header>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10 relative w-full">
            
            {/* --- 1. PROFILE VIEW --- */}
            {activePage === 'profile' && (
               <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 animate-in fade-in zoom-in-95 duration-300">
                    <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-4 md:gap-6 mb-6 md:mb-8">
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-blue-600 flex items-center justify-center text-3xl font-bold text-white shadow-2xl flex-shrink-0">
                            {user?.email?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-white">{user?.email?.split('@')[0]}</h2>
                            <p className="text-gray-400 text-xs md:text-sm">{user?.email}</p>
                            <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-2">
                                <span className={`text-[11px] md:text-xs px-3 py-1 rounded border ${kycStatus === 'verified' ? 'bg-green-500/10 text-green-500 border-green-500/20' : kycStatus === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                                    {kycStatus === 'verified' ? 'Verified Account' : kycStatus === 'pending' ? 'Verification Pending' : 'Not Verified'}
                                </span>
                                {kycStatus === 'unverified' && (
                                    <button onClick={() => handleNavClick('kyc')} className="text-[11px] md:text-xs px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold transition">Verify Now &rarr;</button>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div className="bg-[#111] border border-white/5 rounded-2xl p-5 md:p-6">
                            <h3 className="text-base md:text-lg font-bold text-white mb-4">Account Information</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between py-2 border-b border-white/5"><span className="text-gray-500 text-xs md:text-sm">User ID</span><span className="text-white text-xs md:text-sm font-mono truncate max-w-[120px] md:max-w-none ml-2">{user?.id}</span></div>
                                <div className="flex justify-between py-2 border-b border-white/5"><span className="text-gray-500 text-xs md:text-sm">Country</span><span className="text-white text-xs md:text-sm">{user?.user_metadata?.country || 'Unknown'}</span></div>
                                <div className="flex justify-between py-2 border-b border-white/5"><span className="text-gray-500 text-xs md:text-sm">Referral Code</span><span className="text-yellow-500 text-xs md:text-sm font-bold tracking-wider">{displayCode}</span></div>
                            </div>
                        </div>
                        <div className="bg-[#111] border border-white/5 rounded-2xl p-5 md:p-6">
                            <h3 className="text-base md:text-lg font-bold text-white mb-4">Security Settings</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                    <div><p className="text-white text-xs md:text-sm">Password</p><p className="text-gray-500 text-[10px] md:text-xs">Manage your login details</p></div>
                                    <button onClick={handlePasswordReset} disabled={resetLoading} className="text-blue-500 text-[11px] md:text-xs font-bold hover:underline disabled:opacity-50">{resetLoading ? "Sending..." : "Change Password"}</button>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                    <div><p className="text-white text-xs md:text-sm">2-Factor Authentication</p><p className="text-gray-500 text-[10px] md:text-xs">Secure your account</p></div>
                                    <button className="text-gray-400 text-[11px] md:text-xs font-bold hover:text-white">Enable</button>
                                </div>
                            </div>
                        </div>
                    </div>
               </div>
            )}

            {/* --- KYC PAGE (UPDATED WITH REALISTIC TIMING & CIRCLE CAMERA) --- */}
            {activePage === 'kyc' && (
                <div className="max-w-3xl mx-auto animate-in fade-in zoom-in-95 duration-300">
                    <div className="mb-6 md:mb-8 text-center md:text-left">
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2">Identity Verification</h2>
                        <p className="text-gray-400 text-xs md:text-sm">Complete KYC to unlock full trading limits and withdrawals.</p>
                    </div>

                    {/* ONLY show steps if they are unverified. If verified/pending, lock it here. */}
                    {kycStatus === 'verified' || kycStatus === 'pending' ? (
                        <div className="bg-[#111] border border-white/10 rounded-2xl p-8 text-center shadow-2xl">
                            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${kycStatus === 'verified' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">{kycStatus === 'verified' ? 'Verification Complete' : 'Verification Under Review'}</h3>
                            <p className="text-gray-400">{kycStatus === 'verified' ? 'Thank you. Your account is fully verified and you can now access all features.' : 'Your documents are currently being reviewed by our team. You will receive an email once complete.'}</p>
                        </div>
                    ) : (
                        <>
                            {/* Steps Indicator */}
                            <div className="flex items-center justify-between mb-8 md:mb-10 px-2 md:px-4">
                                {[1, 2, 3].map((step) => (
                                    <div key={step} className="flex flex-col items-center gap-2 relative z-10">
                                        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-xs md:text-sm border-2 transition-all duration-500 ${kycStep >= step ? 'bg-blue-600 border-blue-600 text-white' : 'bg-[#111] border-white/10 text-gray-500'}`}>
                                            {kycStep > step ? '✓' : step}
                                        </div>
                                        <span className={`text-[10px] md:text-xs font-bold mt-1 md:mt-0 ${kycStep >= step ? 'text-blue-500' : 'text-gray-600'}`}>{step === 1 ? 'Personal Info' : step === 2 ? 'ID Upload' : 'Face Check'}</span>
                                    </div>
                                ))}
                                {/* Connecting Line */}
                                <div className="absolute top-[165px] left-0 right-0 h-0.5 bg-white/5 -z-0 max-w-2xl mx-auto hidden md:block"></div>
                                <div className="absolute top-[165px] left-0 h-0.5 bg-blue-600/50 -z-0 max-w-2xl mx-auto transition-all duration-500 hidden md:block" style={{ width: `${((kycStep - 1) / 2) * 100}%` }}></div>
                            </div>

                            <div className="bg-[#111] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden min-h-[400px]">
                                {kycProcessing && (
                                    <div className="absolute inset-0 bg-black/90 backdrop-blur-md z-50 flex flex-col items-center justify-center animate-in fade-in duration-300 p-4 text-center">
                                         <div className="relative w-20 h-20 md:w-24 md:h-24 mb-6">
                                            <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full"></div>
                                            <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
                                            <div className="absolute inset-0 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 md:w-10 md:h-10 text-blue-500 animate-pulse"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg></div>
                                         </div>
                                         <h3 className="text-lg md:text-xl text-white font-bold mb-2">Processing Documents</h3>
                                         <p className="text-gray-500 text-xs md:text-sm animate-pulse">Verifying your identity...</p>
                                    </div>
                                )}

                                {/* Step 1: Personal Info */}
                                {kycStep === 1 && (
                                    <div className="space-y-4 md:space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                            <div>
                                                <label className="block text-[10px] md:text-xs text-gray-500 font-bold uppercase mb-2">First Name</label>
                                                <input type="text" value={kycFirstName} onChange={(e) => setKycFirstName(e.target.value)} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm focus:border-blue-500 outline-none transition" placeholder="John" />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] md:text-xs text-gray-500 font-bold uppercase mb-2">Last Name</label>
                                                <input type="text" value={kycLastName} onChange={(e) => setKycLastName(e.target.value)} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm focus:border-blue-500 outline-none transition" placeholder="Doe" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] md:text-xs text-gray-500 font-bold uppercase mb-2">Date of Birth</label>
                                            {/* Applied strict minimum and maximum dates here */}
                                            <input type="date" value={kycDob} min="1920-01-01" max={maxDateString} onChange={(e) => setKycDob(e.target.value)} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm focus:border-blue-500 outline-none transition [color-scheme:dark]" />
                                            <p className="text-[10px] text-gray-500 mt-1 text-right">Must be at least 18 years old.</p>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] md:text-xs text-gray-500 font-bold uppercase mb-2">Full Address</label>
                                            <input type="text" value={kycAddress} onChange={(e) => setKycAddress(e.target.value)} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm focus:border-blue-500 outline-none transition" placeholder="123 Trading St, New York, NY" />
                                        </div>
                                        <button onClick={handleKycStep1} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl mt-2 md:mt-4 transition shadow-lg shadow-blue-500/20 text-sm md:text-base">Continue &rarr;</button>
                                    </div>
                                )}

                                {/* Step 2: Documents */}
                                {kycStep === 2 && (
                                    <div className="space-y-6">
                                        <p className="text-xs md:text-sm text-gray-400 mb-4 text-center md:text-left">Please upload a clear photo of your Government ID (Passport, Driver's License, or ID Card).</p>
                                        {/* Hidden Inputs */}
                                        <input type="file" ref={frontFileRef} onChange={(e) => handleFileSelect(e, 'front')} className="hidden" accept="image/*" />
                                        <input type="file" ref={backFileRef} onChange={(e) => handleFileSelect(e, 'back')} className="hidden" accept="image/*" />

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                            <div onClick={() => frontFileRef.current?.click()} className={`border-2 border-dashed ${frontFile ? 'border-green-500/50 bg-green-500/5' : 'border-white/10 hover:border-blue-500/50 hover:bg-white/5'} rounded-xl p-6 flex flex-col items-center justify-center text-center transition cursor-pointer h-32 md:h-40 group`}>
                                                {frontFile ? (
                                                     <>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 md:w-8 md:h-8 text-green-500 mb-2"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                                                        <span className="text-[10px] md:text-xs font-bold text-green-500 break-all px-2 line-clamp-2">{frontFile.name}</span>
                                                     </>
                                                ) : (
                                                    <>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 md:w-8 md:h-8 text-gray-500 group-hover:text-blue-500 mb-2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" /></svg>
                                                        <span className="text-[10px] md:text-xs font-bold text-gray-400 group-hover:text-white">Upload Front ID</span>
                                                    </>
                                                )}
                                            </div>
                                            <div onClick={() => backFileRef.current?.click()} className={`border-2 border-dashed ${backFile ? 'border-green-500/50 bg-green-500/5' : 'border-white/10 hover:border-blue-500/50 hover:bg-white/5'} rounded-xl p-6 flex flex-col items-center justify-center text-center transition cursor-pointer h-32 md:h-40 group`}>
                                                {backFile ? (
                                                     <>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 md:w-8 md:h-8 text-green-500 mb-2"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                                                        <span className="text-[10px] md:text-xs font-bold text-green-500 break-all px-2 line-clamp-2">{backFile.name}</span>
                                                     </>
                                                ) : (
                                                    <>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 md:w-8 md:h-8 text-gray-500 group-hover:text-blue-500 mb-2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" /></svg>
                                                        <span className="text-[10px] md:text-xs font-bold text-gray-400 group-hover:text-white">Upload Back ID</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <button onClick={() => setKycStep(3)} disabled={!frontFile || !backFile} className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl mt-4 transition text-sm md:text-base">Next Step &rarr;</button>
                                    </div>
                                )}

                                {/* Step 3: Face Check (Circular Scan Effect) */}
                                {kycStep === 3 && (
                                    <div className="flex flex-col items-center justify-center py-4">
                                        <h3 className="text-lg md:text-xl text-white font-bold mb-6 text-center animate-pulse">{livenessInstruction}</h3>
                                        
                                        {/* Circular Camera Frame with Scanning effect */}
                                        <div className="relative w-56 h-56 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.5)] mb-6 bg-black flex items-center justify-center group">
                                            {videoStream ? (
                                                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1]" />
                                            ) : (
                                                <div className="flex flex-col items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 md:w-20 md:h-20 text-gray-600 mb-2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
                                                    <p className="text-gray-500 text-[10px] md:text-xs">Camera is off</p>
                                                </div>
                                            )}
                                            {/* Inner frame mask to make it look even more like a circular scanner */}
                                            <div className="absolute inset-0 border-[15px] border-black/40 rounded-full pointer-events-none"></div>
                                            {videoStream && <div className="absolute inset-0 border-t-4 border-white/50 rounded-full animate-spin pointer-events-none"></div>}
                                            {videoStream && <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/20 to-transparent opacity-50 animate-pulse pointer-events-none"></div>}
                                        </div>
                                        
                                        <p className="text-gray-400 text-xs text-center max-w-sm">Please ensure your face is well-lit and clearly visible within the circle.</p>
                                        
                                        {!videoStream && (
                                            <button onClick={startCamera} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl mt-4 transition flex items-center justify-center gap-2 text-sm md:text-base">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 md:w-5 md:h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" /></svg>
                                                Enable Camera
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* --- 2. REFERRALS VIEW --- */}
            {activePage === 'referrals' && (
                <div className="max-w-5xl mx-auto space-y-6 md:space-y-8 animate-in fade-in zoom-in-95 duration-300">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                        <div><h2 className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2">Partner Program</h2><p className="text-gray-400 text-xs md:text-sm max-w-md">Invite friends and earn a 200% bonus when 5 referrals join and deposit.</p></div>
                        <div className="text-left md:text-right w-full md:w-auto mt-2 md:mt-0"><p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase mb-1">Total Referrals</p><p className="text-2xl md:text-3xl font-mono font-bold text-white">{referralCount}</p></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div className="bg-[#111] border border-white/5 p-5 md:p-6 rounded-2xl">
                            <h3 className="text-xs md:text-sm font-bold text-gray-300 mb-4 flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-blue-500"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" /></svg> Your Referral Link</h3>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <input readOnly value={referralLink} className="w-full flex-1 bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-xs md:text-sm text-gray-400 font-mono outline-none truncate" />
                                <div className="relative w-full sm:w-auto">
                                    <button onClick={() => copyToClipboard(referralLink)} className={`w-full sm:w-auto px-6 py-3 rounded-lg font-bold text-xs transition min-w-[80px] ${copySuccess ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}>{copySuccess ? 'Copied' : 'Copy'}</button>
                                </div>
                            </div>
                            <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center gap-3"><div className="text-blue-400 text-xs font-bold bg-blue-500/20 px-2 py-1 rounded">{displayCode}</div><span className="text-[10px] md:text-xs text-blue-400">Share this code manually</span></div>
                        </div>
                        <div className="bg-[#111] border border-white/5 p-5 md:p-6 rounded-2xl relative overflow-hidden">
                            <h3 className="text-xs md:text-sm font-bold text-gray-300 mb-2">Bonus Progress</h3>
                            <div className="flex justify-between items-end mb-2"><span className="text-2xl md:text-3xl font-bold text-white">{Math.round(bonusProgress)}%</span><span className="text-[10px] md:text-xs text-gray-500">{referralCount} / {bonusTarget} Friends</span></div>
                            <div className="w-full bg-gray-800 rounded-full h-2 mb-3 md:mb-4"><div className="bg-yellow-500 h-2 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(234,179,8,0.5)]" style={{ width: `${bonusProgress}%` }}></div></div>
                            <p className="text-[10px] md:text-xs text-gray-500">Refer {Math.max(0, bonusTarget - referralCount)} more friends to unlock the bonus.</p>
                        </div>
                    </div>
                    {/* Graph */}
                    <div className="bg-[#111] border border-white/5 rounded-2xl p-4 md:p-6 overflow-hidden">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                            <h3 className="text-base md:text-lg font-bold text-white">Total Network Growth</h3>
                            <div className="flex bg-black/30 p-1 rounded-lg border border-white/10 w-full sm:w-auto overflow-x-auto scrollbar-hide">
                                {['7d', '30d', '1y'].map((filter) => (
                                    <button key={filter} onClick={() => setGraphFilter(filter)} className={`flex-1 sm:flex-none px-3 md:px-4 py-1.5 text-[10px] md:text-xs font-bold rounded-md transition-all whitespace-nowrap ${graphFilter === filter ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>{filter === '7d' ? 'Last 7 Days' : filter === '30d' ? 'Last 30 Days' : 'Yearly'}</button>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-end gap-1 md:gap-3 h-40 md:h-48 w-full border-b border-white/5 pb-2 px-1 md:px-2">
                            {processedGraphData.dataPoints.map((val, i) => {
                                const height = processedGraphData.maxVal > 0 ? Math.max((val / processedGraphData.maxVal) * 100, 5) : 5; 
                                const isToday = i === processedGraphData.dataPoints.length - 1 && graphFilter !== '1y';
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                                            <div className={`w-full rounded-t-sm transition-all duration-700 relative ${isToday ? 'bg-blue-500' : 'bg-blue-600/30 group-hover:bg-blue-500/80'}`} style={{ height: `${height}%` }}>
                                                <div className="opacity-0 group-hover:opacity-100 absolute -top-10 md:-top-12 left-1/2 -translate-x-1/2 bg-[#1A1A1A] border border-white/20 text-white text-[10px] md:text-xs font-bold px-2 py-1.5 md:px-3 md:py-2 rounded-lg shadow-xl transition-all duration-200 pointer-events-none z-10 whitespace-nowrap flex flex-col items-center">
                                                    <span className="text-[9px] md:text-[10px] text-gray-400 font-normal mb-0.5">{processedGraphData.labels[i]}</span><span>{val} Users</span><div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#1A1A1A] border-r border-b border-white/20 rotate-45"></div>
                                                </div>
                                            </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex justify-between text-[8px] md:text-[10px] text-gray-500 mt-3 uppercase font-bold tracking-widest px-1 md:px-2">
                            {processedGraphData.labels.map((label, i) => (<span key={i} className="flex-1 text-center truncate px-0.5 md:px-1">{label.split(' ')[0]}</span>))}
                        </div>
                    </div>
                </div>
            )}
            
            {/* --- 3. BONUSES VIEW --- */}
            {activePage === 'bonuses' && (
                <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 animate-in fade-in zoom-in-95 duration-300">
                    <div className="text-center md:text-left">
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2">Active Bonuses</h2>
                        <p className="text-gray-400 text-xs md:text-sm">Boost your trading capital with our exclusive offers.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {BONUSES.map((bonus) => (
                            <div key={bonus.id} className="bg-[#111] border border-white/10 rounded-2xl p-5 md:p-6 relative overflow-hidden group hover:border-white/20 transition flex flex-col h-full">
                                <div className={`absolute top-0 right-0 p-2 md:p-3 ${bonus.bg} rounded-bl-2xl`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 md:w-6 md:h-6 ${bonus.color}`}><path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H4.5a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" /></svg>
                                </div>
                                <h3 className="text-base md:text-lg font-bold text-white mt-2 pr-8">{bonus.title}</h3>
                                <p className="text-xs md:text-sm text-gray-400 mt-2 min-h-[40px] flex-grow">{bonus.desc}</p>
                                
                                <div className="mt-4 md:mt-6">
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
                                    className={`w-full mt-4 md:mt-6 py-3 rounded-xl font-bold text-xs md:text-sm transition ${bonus.status === 'locked' ? 'bg-white/5 text-gray-500 cursor-not-allowed' : 'bg-white text-black hover:bg-gray-200'}`}
                                >
                                    {bonus.btn}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* --- 4. DEPOSIT VIEW --- */}
            {activePage === 'deposit' && (
                <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 animate-in fade-in zoom-in-95 duration-300">
                    {!selectedDepositMethod ? (
                        <>
                            <div className="text-center md:text-left">
                                <h2 className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2">Deposit Funds</h2>
                                <p className="text-gray-400 text-xs md:text-sm">Select a secure payment method to fund your account.</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                               {PAYMENT_METHODS.map((method) => (
                                   <div 
                                       key={method.id} 
                                       onClick={() => method.status !== 'soon' && setSelectedDepositMethod(method)}
                                       className={`bg-[#111] border border-white/5 p-4 md:p-6 rounded-2xl transition group flex items-start gap-4 ${method.status === 'soon' ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-500/50 hover:bg-[#1A1A1A] cursor-pointer'}`}
                                   >
                                       <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-lg md:text-xl font-bold ${method.bg} ${method.color} flex-shrink-0`}>{method.icon}</div>
                                       <div className="flex-1">
                                            <div className="flex justify-between items-center mb-1">
                                                 <h4 className="text-xs md:text-sm font-bold text-white group-hover:text-blue-400 transition">{method.name}</h4>
                                                 {method.status === 'soon' && <span className="text-[8px] md:text-[9px] bg-white/10 px-1.5 md:px-2 py-0.5 rounded text-gray-400 ml-2">SOON</span>}
                                            </div>
                                            <div className="flex gap-2 md:gap-3 text-[9px] md:text-[10px] text-gray-500 flex-wrap mt-1">
                                                 <span>Fee: <span className="text-white">0%</span></span>
                                                 <span>Time: <span className="text-white">{method.time}</span></span>
                                            </div>
                                       </div>
                                   </div>
                               ))}
                            </div>
                        </>
                    ) : (
                        // DETAIL VIEW
                        <div className="max-w-6xl mx-auto">
                            {/* TOP BAR */}
                            <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
                                <button onClick={() => setSelectedDepositMethod(null)} className="text-blue-500 hover:text-white flex items-center gap-1 text-xs md:text-sm font-bold transition">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg> 
                                    Back
                                </button>
                                <h2 className="text-xl md:text-2xl font-bold text-white">Deposit</h2>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                                {/* LEFT: MAIN DEPOSIT AREA */}
                                <div className="lg:col-span-2 space-y-6 md:space-y-8">
                                    
                                    <div className="relative">
                                        <p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase mb-2">Payment method</p>
                                        <button onClick={() => setIsPaymentDropdownOpen(!isPaymentDropdownOpen)} className="w-full bg-[#1A1A1A] text-white px-4 py-3.5 rounded-xl border border-white/10 flex items-center justify-between hover:bg-[#222] transition group">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${selectedDepositMethod.bg} ${selectedDepositMethod.color}`}>{selectedDepositMethod.icon}</div>
                                                <span className="text-white font-bold text-sm">{selectedDepositMethod.name}</span>
                                            </div>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isPaymentDropdownOpen ? 'rotate-180' : ''}`}><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                                        </button>
                                        {isPaymentDropdownOpen && (
                                            <div className="absolute top-full left-0 w-full mt-2 bg-[#1A1A1A] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50 max-h-48 md:max-h-60 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                                                {PAYMENT_METHODS.filter(m => m.type === 'crypto').map(m => (
                                                    <div key={m.id} onClick={() => { setSelectedDepositMethod(m); setIsPaymentDropdownOpen(false); }} className={`px-4 py-3 cursor-pointer transition flex items-center justify-between ${selectedDepositMethod?.id === m.id ? 'bg-blue-600/10 border-l-2 border-blue-500' : 'hover:bg-white/5 border-l-2 border-transparent'}`}>
                                                         <div className="flex items-center gap-3">
                                                             <span className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs ${m.bg} ${m.color}`}>{m.icon}</span>
                                                             <span className={`text-sm font-bold ${selectedDepositMethod?.id === m.id ? 'text-blue-400' : 'text-white'}`}>{m.name}</span>
                                                         </div>
                                                         {selectedDepositMethod?.id === m.id && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-blue-500"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <p className="text-gray-400 text-xs md:text-sm mb-4 leading-relaxed">
                                            To deposit funds, make a transfer to the wallet shown below. Copy the wallet address or scan the QR code with your camera.
                                        </p>
                                        
                                        <p className="text-[10px] md:text-xs text-gray-500 mb-1">Your unique deposit address</p>
                                        <p className="text-xs md:text-sm font-bold text-white break-all mb-6 p-3 md:p-4 bg-[#111] rounded-lg border border-white/5">{selectedDepositMethod.address}</p>
                                        
                                        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-8">
                                            <button 
                                                onClick={() => copyToClipboard(selectedDepositMethod.address)}
                                                className="bg-[#FFE600] hover:bg-[#E5CE00] text-black font-bold px-6 py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 transition w-full sm:w-auto"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" /></svg>
                                                Copy address
                                            </button>
                                            <button 
                                                onClick={() => setActivePage('accounts')}
                                                className="bg-[#111] hover:bg-white/5 border border-white/10 text-white font-bold px-6 py-3.5 rounded-xl text-sm transition w-full sm:w-auto text-center"
                                            >
                                                Go to My Accounts
                                            </button>
                                        </div>

                                        {/* QR CODE */}
                                        <div className="w-40 h-40 md:w-48 md:h-48 bg-white p-2 md:p-3 rounded-xl border border-gray-200 mx-auto sm:mx-0">
                                             <img 
                                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${selectedDepositMethod.address}`} 
                                                alt="Wallet QR Code" 
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="pt-6 md:pt-8 mt-6 md:mt-8 border-t border-white/5">
                                        <p className="text-[10px] md:text-xs text-gray-500 text-center sm:text-left">All crypto wallet services are provided by gavblue Ltd, a company incorporated in Seychelles.</p>
                                    </div>
                                </div>

                                {/* RIGHT: SIDEBAR INFO */}
                                <div className="lg:col-span-1 space-y-6 md:space-y-8 mt-6 lg:mt-0">
                                    <div className="bg-[#111] border border-white/5 rounded-2xl p-5 md:p-6">
                                        <h3 className="font-bold text-white text-base md:text-lg mb-4">Terms</h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-500 text-xs md:text-sm">Average payment time</span>
                                                <span className="text-white text-xs md:text-sm font-medium">{selectedDepositMethod.time}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-500 text-xs md:text-sm">Fee</span>
                                                <span className="text-white text-xs md:text-sm font-medium font-mono bg-white/10 px-2 py-0.5 rounded">0%</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-[#111] border border-white/5 rounded-2xl p-5 md:p-6">
                                        <h3 className="font-bold text-white text-base md:text-lg mb-4">FAQ</h3>
                                        <ul className="space-y-3 md:space-y-2">
                                            {FAQS.map((q, i) => (
                                                <li key={i}>
                                                    <a href="#" className="text-gray-400 hover:text-blue-500 text-xs md:text-sm transition block py-1 md:py-0">{q}</a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* --- 5. WITHDRAW VIEW --- */}
            {activePage === 'withdraw' && (
                 <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 animate-in fade-in zoom-in-95 duration-300">
                    <div className="text-center md:text-left">
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2">Withdraw Funds</h2>
                        <p className="text-gray-400 text-xs md:text-sm">Request a withdrawal to your external wallet.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        {/* LEFT: FORM */}
                        <div className="space-y-5 md:space-y-6">
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
                                    <div className="absolute top-full left-0 w-full mt-2 bg-[#1A1A1A] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50 max-h-48 md:max-h-60 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
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
                                                    {m.status === 'soon' && <span className="ml-auto text-[8px] md:text-[9px] bg-white/10 px-1.5 md:px-2 py-0.5 rounded text-gray-400">SOON</span>}
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
                                        className="w-full bg-[#050505] text-white pl-8 pr-16 py-3.5 rounded-xl border border-white/20 focus:border-blue-500 outline-none text-base md:text-lg font-mono placeholder-gray-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    />
                                    <button onClick={() => setWithdrawAmount(totalEquity.toString())} className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-blue-500 font-bold hover:text-blue-400 uppercase bg-blue-500/10 px-2 py-1 rounded">Max</button>
                                </div>
                                <p className="text-[10px] text-gray-500 mt-2 text-right">Available: <span className="text-white">${totalEquity.toLocaleString()}</span></p>
                            </div>

                            <button onClick={handleWithdraw} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 text-sm md:text-base">
                                Confirm Withdrawal <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                            </button>
                        </div>

                        {/* RIGHT: SUMMARY CARD */}
                        <div className="bg-[#111] border border-white/10 rounded-2xl p-5 md:p-6 h-fit mt-2 md:mt-0">
                            <h3 className="text-white font-bold text-base md:text-lg mb-4 md:mb-6">Summary</h3>
                            <div className="space-y-3 md:space-y-4">
                                <div className="flex justify-between items-center text-xs md:text-sm"><span className="text-gray-500">Method</span><span className="text-white font-medium">{selectedWithdrawMethod?.name || '-'}</span></div>
                                <div className="flex justify-between items-center text-xs md:text-sm"><span className="text-gray-500">Network Fee</span><span className="text-green-500 font-bold">Free</span></div>
                                <div className="flex justify-between items-center text-xs md:text-sm"><span className="text-gray-500">Processing Time</span><span className="text-white font-medium">~15 Mins</span></div>
                                <div className="h-px bg-white/10 my-3 md:my-4"></div>
                                <div className="flex justify-between items-center text-sm md:text-base font-bold"><span className="text-gray-400">Total Receive</span><span className="text-white">${parseFloat(withdrawAmount || '0').toLocaleString()}</span></div>
                            </div>
                        </div>
                    </div>
                 </div>
            )}

            {/* --- 6. ACCOUNTS VIEW --- */}
            {activePage === 'accounts' && (
                <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 animate-in fade-in zoom-in-95 duration-300">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <h2 className="text-xl md:text-2xl font-bold text-white">Real Accounts</h2>
                        <button onClick={() => setShowDepositModal(true)} className="w-full sm:w-auto px-6 py-3 md:py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-lg shadow-lg shadow-blue-500/20 transition flex items-center justify-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg> Open New Account</button>
                    </div>
                    {accounts.length === 0 ? (
                        <div className="bg-[#111] border border-white/5 rounded-2xl p-6 md:p-12 h-[280px] md:h-[350px] flex flex-col items-center justify-center text-center px-4">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 md:mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 md:w-8 md:h-8 text-gray-500"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" /></svg>
                            </div>
                            <h3 className="text-white font-bold text-lg md:text-xl mb-2">No Active Accounts</h3>
                            <p className="text-gray-400 text-xs md:text-sm max-w-xs md:max-w-sm mb-6 leading-relaxed">Open a real account by making a minimum deposit of $50 to start trading.</p>
                            <button onClick={() => setActivePage('deposit')} className="text-blue-500 hover:text-blue-400 font-bold text-xs md:text-sm flex items-center gap-1 transition">Deposit to Start <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg></button>
                        </div>
                    ) : (
                        <div className="space-y-4 md:space-y-6">
                            {accounts.map((acc, index) => (
                                <div key={index} className="bg-[#111] border border-white/5 rounded-2xl p-5 md:p-8 shadow-sm hover:border-white/10 transition-all">
                                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 md:gap-6 mb-6 md:mb-8">
                                        <div className="flex flex-wrap items-center gap-3 md:gap-4"><span className="px-2 md:px-3 py-1 text-[9px] md:text-[10px] font-bold rounded uppercase bg-green-900/30 text-green-400 border border-green-500/20">REAL</span><h3 className="text-base md:text-lg font-bold text-white">{acc.type} <span className="font-normal text-gray-500 text-xs md:text-sm ml-1 md:ml-2">{acc.subType} #{acc.id}</span></h3></div>
                                        <div className="flex flex-col sm:flex-row gap-2 md:gap-3 w-full lg:w-auto"><button className="w-full sm:w-auto px-6 md:px-8 py-2.5 md:py-3 bg-[#FFE600] hover:bg-[#E5CE00] text-black font-bold text-xs md:text-sm rounded-lg transition">Trade</button><button onClick={() => setActivePage('deposit')} className="w-full sm:w-auto px-6 py-2.5 md:py-3 bg-[#1A1A1A] border border-white/10 hover:border-white/30 text-white font-bold text-xs md:text-sm rounded-lg transition">Deposit</button><button className="w-full sm:w-auto px-6 py-2.5 md:py-3 bg-[#1A1A1A] border border-white/10 hover:border-white/30 text-white font-bold text-xs md:text-sm rounded-lg transition">Withdraw</button></div>
                                    </div>
                                    <div className="mb-6 md:mb-8"><div className="text-3xl md:text-5xl font-mono font-bold text-white tracking-tight">{acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })} <span className="text-xl md:text-2xl text-gray-500">{acc.currency}</span></div></div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 border-t border-white/5 pt-5 md:pt-6"><div><p className="text-[10px] md:text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Leverage</p><p className="font-medium text-gray-200 text-sm">{acc.leverage}</p></div><div><p className="text-[10px] md:text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Free Margin</p><p className="font-medium text-gray-200 text-sm">{acc.equity.toLocaleString()} {acc.currency}</p></div><div><p className="text-[10px] md:text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Equity</p><p className="font-medium text-gray-200 text-sm">{acc.equity.toLocaleString()} {acc.currency}</p></div><div><p className="text-[10px] md:text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Total Margin</p><p className="font-medium text-gray-200 text-sm">{acc.margin.toLocaleString()} {acc.currency}</p></div></div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* --- 7. HISTORY VIEW (Trade History ONLY) --- */}
            {activePage === 'history' && (
                <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 animate-in fade-in zoom-in-95 duration-300">
                    <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                        <h2 className="text-xl md:text-2xl font-bold text-white">Trade History</h2>
                    </div>

                    <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden overflow-x-auto w-full">
                        <table className="w-full text-left text-xs md:text-sm text-gray-400 min-w-[700px]">
                            <thead className="bg-[#1A1A1A] text-gray-500 font-bold uppercase text-[10px] md:text-xs whitespace-nowrap">
                                <tr>
                                    <th className="px-4 md:px-6 py-3 md:py-4">ID</th><th className="px-4 md:px-6 py-3 md:py-4">Time</th><th className="px-4 md:px-6 py-3 md:py-4">Symbol</th><th className="px-4 md:px-6 py-3 md:py-4">Type</th><th className="px-4 md:px-6 py-3 md:py-4">Volume</th><th className="px-4 md:px-6 py-3 md:py-4">Open Price</th><th className="px-4 md:px-6 py-3 md:py-4">Close Price</th><th className="px-4 md:px-6 py-3 md:py-4 text-right">Profit</th>
                                </tr>
                            </thead>
                            <tbody><tr><td colSpan={8} className="px-4 md:px-6 py-10 md:py-12 text-center text-gray-600 text-xs md:text-sm">No trades found for this period.</td></tr></tbody>
                        </table>
                    </div>
                </div>
            )}
            
            {/* --- 9. TRANSACTIONS VIEW --- */}
            {activePage === 'trans' && (
                <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 animate-in fade-in zoom-in-95 duration-300">
                    <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                        <h2 className="text-xl md:text-2xl font-bold text-white">Transactions</h2>
                    </div>

                    <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden overflow-x-auto w-full">
                        <table className="w-full text-left text-xs md:text-sm text-gray-400 min-w-[600px]">
                            <thead className="bg-[#1A1A1A] text-gray-500 font-bold uppercase text-[10px] md:text-xs whitespace-nowrap">
                                <tr>
                                    <th className="px-4 md:px-6 py-3 md:py-4">ID</th><th className="px-4 md:px-6 py-3 md:py-4">Time</th><th className="px-4 md:px-6 py-3 md:py-4">Type</th><th className="px-4 md:px-6 py-3 md:py-4">Amount</th><th className="px-4 md:px-6 py-3 md:py-4">Method</th><th className="px-4 md:px-6 py-3 md:py-4 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody><tr><td colSpan={6} className="px-4 md:px-6 py-10 md:py-12 text-center text-gray-600 text-xs md:text-sm">No deposit or withdrawal history found.</td></tr></tbody>
                        </table>
                    </div>
                </div>
            )}
            
             {/* --- 8. PERFORMANCE VIEW --- */}
            {activePage === 'perf' && (
               <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 animate-in fade-in zoom-in-95 duration-300">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <h2 className="text-xl md:text-2xl font-bold text-white">Performance Analytics</h2>
                        <div className="flex bg-black/30 p-1 rounded-lg border border-white/10 w-full sm:w-auto overflow-x-auto scrollbar-hide">
                            {['1D', '1W', '1M', '1Y', 'All'].map((t) => (
                                <button key={t} onClick={() => setPerfTimeframe(t)} className={`flex-1 sm:flex-none px-3 md:px-4 py-1.5 text-[10px] md:text-xs font-bold rounded-md transition-all ${perfTimeframe === t ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>{t}</button>
                            ))}
                        </div>
                    </div>

                    {/* MAIN CHART (FLAT LINE 0) */}
                    <div className="bg-[#111] border border-white/10 rounded-2xl p-4 md:p-6 h-[250px] md:h-[300px] relative overflow-hidden group">
                        <div className="absolute top-4 md:top-6 left-4 md:left-6 z-10">
                            <p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-wider">Total Net Profit</p>
                            <p className="text-2xl md:text-3xl font-mono font-bold text-white mt-1">$0.00 <span className="text-xs md:text-sm text-gray-500 font-sans font-normal">(0.00%)</span></p>
                        </div>
                        
                        <div className="absolute inset-0 grid grid-cols-4 md:grid-cols-6 grid-rows-4 pointer-events-none">
                            {[...Array(24)].map((_, i) => <div key={i} className="border-r border-b border-white/5"></div>)}
                        </div>

                        <div className="absolute bottom-10 left-0 right-0 h-px bg-blue-500/50"></div>
                        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-blue-500/10 to-transparent"></div>
                        
                        <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-xs md:text-sm text-gray-600 font-medium px-4 text-center">No trade data available to display.</p>
                        </div>
                    </div>

                    {/* DETAILED STATS GRID (ALL 0) */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
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
                            <div key={i} className="bg-[#111] border border-white/5 rounded-xl p-4 md:p-5 hover:border-white/10 transition">
                                <p className="text-[9px] md:text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1 md:mb-2">{stat.label}</p>
                                <p className="text-lg md:text-xl font-mono font-bold text-white">{stat.val}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
      </main>
      
      {/* Draggable Support Button remains perfectly intact below */}
      <DraggableSupportButton />
    </div>
  );
}

// --- HELPER COMPONENTS ---

function SidebarItem({ icon, label, active, onClick, isExternal }: { icon: string, label: string, active: boolean, onClick: () => void, isExternal?: boolean }) {
    return (
        <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 mb-1 group ${active ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
            <span className={`transition-colors flex-shrink-0 ${active ? 'text-blue-400' : 'text-gray-500 group-hover:text-gray-300'}`}>
                {icon === 'users' && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>}
                {icon === 'chart' && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" /></svg>}
                {icon === 'history' && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>}
                {icon === 'download' && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>}
                {icon === 'upload' && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" /></svg>}
                {icon === 'list' && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 17.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>}
                {icon === 'user' && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>}
                {icon === 'shield' && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" /></svg>}
                {icon === 'gift' && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H4.5a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" /></svg>}
                {icon === 'trophy' && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 12.375a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.961 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.962 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" /></svg>}
            </span>
            <span className="flex-1 truncate">{label}</span>
        </button>
    );
}

const DraggableSupportButton = () => {
    const [position, setPosition] = useState({ x: 30, y: 30 }); // Bottom-Right offset
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [hasMoved, setHasMoved] = useState(false); // Track if it was a click or a drag

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

            // If moved more than 5px, consider it a drag
            if (Math.abs(dx) > 5 || Math.abs(dy) > 5) setHasMoved(true);

            setPosition((prev) => ({
                x: Math.max(10, Math.min(window.innerWidth - 60, prev.x + dx)),
                y: Math.max(10, Math.min(window.innerHeight - 60, prev.y + dy)),
            }));
            setDragStart({ x: clientX, y: clientY });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

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
        if (!hasMoved) {
            window.open('https://t.me/SharkOperator_Group', '_blank');
        }
    };

    return (
        <div
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
            onClick={handleClick}
            style={{ 
                right: `${position.x}px`, 
                bottom: `${position.y}px`,
                cursor: isDragging ? 'grabbing' : 'pointer',
                touchAction: 'none' // Prevent pull-to-refresh while dragging
            }}
            className="fixed z-[100] w-12 h-12 md:w-14 md:h-14 bg-[#FFE600] rounded-full shadow-[0_4px_20px_rgba(255,230,0,0.4)] flex items-center justify-center hover:scale-110 transition-transform active:scale-95 group"
        >
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 md:w-7 md:h-7 text-black"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" /></svg>
             <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 md:h-3 md:w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 md:h-3 md:w-3 bg-red-500"></span>
            </span>
        </div>
    );
};