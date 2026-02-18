'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/app/utils/supabase/client'; 

// ============================================================================
// COMPONENT 1: CAPTCHA MODAL
// ============================================================================
function CaptchaModal({ isOpen, onClose, onSuccess }: { isOpen: boolean; onClose: () => void; onSuccess: () => void }) {
  const [checked, setChecked] = useState(false);
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setChecked(false);
      setSpinning(false);
    }
  }, [isOpen]);

  const handleCheck = () => {
    if (checked || spinning) return;
    setSpinning(true);
    setTimeout(() => {
      setSpinning(false);
      setChecked(true);
      setTimeout(() => onSuccess(), 800);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative bg-white text-black rounded-lg shadow-2xl w-full max-w-[400px] p-6 animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold">Security Check</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>
        <div className="bg-[#f9f9f9] border border-[#d3d3d3] rounded-md p-3 flex items-center justify-between h-[74px] w-[302px] mx-auto shadow-sm select-none hover:shadow-md transition-shadow">
           <div className="flex items-center gap-3">
              <div onClick={handleCheck} className={`w-[28px] h-[28px] border-2 rounded-[2px] flex items-center justify-center cursor-pointer transition-all bg-white ${checked ? 'border-transparent' : 'border-[#c1c1c1] hover:border-[#b2b2b2]'}`}>
                 {spinning && <svg className="animate-spin h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                 {checked && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-[#009688]"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" /></svg>}
              </div>
              <span className="text-sm font-medium text-[#222]">I'm not a robot</span>
           </div>
           <div className="flex flex-col items-center justify-center gap-1 opacity-70">
              <img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" alt="reCAPTCHA" className="w-8 h-8" />
              <div className="text-[9px] text-[#555] text-center leading-tight">reCAPTCHA<br/><span className="hover:underline cursor-pointer">Privacy</span> - <span className="hover:underline cursor-pointer">Terms</span></div>
           </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// COMPONENT 2: OTP VERIFICATION MODAL
// ============================================================================
function OtpModal({ isOpen, email, onVerify, loading }: { isOpen: boolean; email: string; onVerify: (code: string) => void; loading: boolean }) {
    const [otp, setOtp] = useState('');
    const [timeLeft, setTimeLeft] = useState(60); 
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setOtp('');
            setTimeLeft(60);
            setCanResend(false);
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen || timeLeft === 0) {
            if (timeLeft === 0) setCanResend(true);
            return;
        }
        const intervalId = setInterval(() => {
            setTimeLeft((t) => t - 1);
        }, 1000);
        return () => clearInterval(intervalId);
    }, [isOpen, timeLeft]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md"></div>
            <div className="relative bg-[#0A0A0A] border border-white/10 text-white rounded-2xl shadow-2xl w-full max-w-[400px] p-8 animate-in fade-in zoom-in duration-300">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-500"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Verify Email</h3>
                    <p className="text-gray-400 text-sm">Enter the 6-digit code sent to <br/><span className="text-white font-medium">{email}</span></p>
                </div>

                <input 
                    type="text" 
                    maxLength={6} 
                    placeholder="000000"
                    className="w-full bg-[#050505] border border-white/20 rounded-xl px-4 py-4 text-center text-2xl tracking-[0.5em] font-mono text-white outline-none focus:border-blue-500 transition-colors mb-6"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                />

                <button 
                    onClick={() => onVerify(otp)}
                    disabled={loading || otp.length !== 6}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Verifying..." : "Verify & Login"}
                </button>
                
                <p className="text-center text-xs text-gray-500 mt-6">
                    {canResend ? (
                        <span className="text-blue-400 cursor-pointer hover:underline" onClick={() => { setTimeLeft(60); setCanResend(false); }}>Resend Code</span>
                    ) : (
                        <span>Resend code in <span className="text-white font-mono">{timeLeft}s</span></span>
                    )}
                </p>
            </div>
        </div>
    );
}

// ============================================================================
// COMPONENT 3: AUTH CONTENT FORM
// ============================================================================
function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  
  // --- STATES ---
  const [view, setView] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [partnerCode, setPartnerCode] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showPartnerCode, setShowPartnerCode] = useState(false);
  const [isPromoLocked, setIsPromoLocked] = useState(false); // Locks input if valid ref found
  const [loading, setLoading] = useState(false);
  
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  // Dropdown States
  const [countryOpen, setCountryOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // --- AUTO FILL & LOCK LOGIC (THE FIX) ---
  useEffect(() => {
    const ref = searchParams.get('ref');
    const viewParam = searchParams.get('view');
    
    // Check for 'signup' view param
    if (viewParam === 'signup') {
        setView('signup');
    }

    // Check for referral code
    if (ref) {
        setPartnerCode(ref);
        setIsPromoLocked(true); // Lock it
        setShowPartnerCode(true); // Open the accordion
        setView('signup'); // Force signup view
    }
  }, [searchParams]);


  // --- PASSWORD VALIDATION HELPER ---
  const isPasswordValid = (pwd: string) => {
      const hasUpper = /[A-Z]/.test(pwd);
      const hasLower = /[a-z]/.test(pwd);
      const hasNumber = /[0-9]/.test(pwd);
      const isValidLength = pwd.length >= 6;
      return hasUpper && hasLower && hasNumber && isValidLength;
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCountryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  // --- HANDLER: Initial Form Submit ---
  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // --- STRICT VALIDATION ---
    if (view === 'signup') {
        if (!selectedCountry) { setErrorMsg("Please select your country of residence."); return; }
        if (!isPasswordValid(password)) { 
            setErrorMsg("Password weak: Must have 6+ chars, Uppercase, Lowercase & Number."); 
            return; 
        }
        if (!termsAccepted) { setErrorMsg("You must confirm you are not a US citizen."); return; }
    }
    
    // If validation passes, show Captcha
    setShowCaptcha(true);
  };

  // --- HANDLER: Captcha Success ---
  const handleCaptchaSuccess = async () => {
    setShowCaptcha(false);
    setLoading(true);

    try {
        if (view === 'signup') {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: { 
                    data: { 
                        country: selectedCountry,
                        partner_code: partnerCode || null 
                    } 
                } 
            });
            if (error) throw error;
            setLoading(false);
            setShowOtp(true); 

        } else if (view === 'signin') {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            router.push('/dashboard'); 

        } else if (view === 'forgot') {
            const { error } = await supabase.auth.resetPasswordForEmail(email);
            if (error) throw error;
            setSuccessMsg("Password reset link sent to your email.");
            setLoading(false);
            setTimeout(() => setView('signin'), 3000);
        }
    } catch (error: any) {
        setErrorMsg(error.message);
        setLoading(false);
    }
  };

  // --- HANDLER: Verify OTP ---
  const handleVerifyOtp = async (code: string) => {
      setLoading(true);
      try {
          const { data, error } = await supabase.auth.verifyOtp({
              email,
              token: code,
              type: 'signup'
          });
          if (error) throw error;
          router.push('/dashboard');
      } catch (error: any) {
          setErrorMsg(error.message);
          setShowOtp(false);
      } finally {
          setLoading(false);
      }
  };

  const countries = [ "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe" ];
  const filteredCountries = countries.filter(c => c.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-[480px]">
      
      {/* MODALS */}
      <CaptchaModal isOpen={showCaptcha} onClose={() => setShowCaptcha(false)} onSuccess={handleCaptchaSuccess} />
      <OtpModal isOpen={showOtp} email={email} onVerify={handleVerifyOtp} loading={loading} />

      {/* TOP BAR */}
      <div className="absolute top-0 w-full p-6 flex justify-between items-center z-20 max-w-7xl mx-auto left-0 right-0">
         <div className="flex items-center gap-6">
             <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white/10">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
                </div>
                <span className="text-sm font-medium hidden md:block">Back</span>
             </Link>
             <Link href="/" className="flex items-center gap-2 group cursor-pointer">
                <span className="text-2xl font-bold tracking-tighter text-white">TRADE<span className="text-blue-500">CORE</span></span>
             </Link>
         </div>
         <div className="text-sm text-gray-400">
            {view === 'signup' ? "Already have an account?" : "Don't have an account?"}
            <button type="button" onClick={() => setView(view === 'signup' ? 'signin' : 'signup')} className="ml-3 text-white font-bold hover:text-blue-400 transition-colors border border-white/10 px-4 py-2 rounded-lg hover:bg-white/5">{view === 'signup' ? "Log In" : "Sign Up"}</button>
         </div>
      </div>

      {/* MAIN CARD */}
      <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 shadow-2xl shadow-blue-900/10 transition-all duration-500 relative overflow-visible w-full mt-20">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-2">{view === 'signup' ? 'Create Trading Account' : view === 'forgot' ? 'Reset Password' : 'Welcome Back'}</h2>
            <p className="text-gray-400 text-sm">{view === 'signup' ? 'Join 140,000+ traders globally.' : view === 'forgot' ? 'Enter your email to receive a recovery link.' : 'Secure access to your institutional dashboard.'}</p>
          </div>

          {/* STATUS MESSAGES */}
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-red-500"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg></div>
                <p className="text-red-400 text-sm font-medium">{errorMsg}</p>
            </div>
          )}
          {successMsg && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-green-500"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg></div>
                <p className="text-green-400 text-sm font-medium">{successMsg}</p>
            </div>
          )}

          <form onSubmit={handleInitialSubmit} className="space-y-5">
            {view === 'signup' && (
              <div className="relative group" ref={dropdownRef}>
                 <div onClick={() => setCountryOpen(!countryOpen)} className={`w-full bg-[#050505] border ${errorMsg && !selectedCountry ? 'border-red-500/50' : countryOpen ? 'border-blue-500' : 'border-white/10'} rounded-lg px-4 h-12 flex items-center justify-between cursor-pointer transition-all hover:border-white/30`}>
                    <span className={selectedCountry ? "text-white text-sm" : "text-gray-500 text-sm"}>{selectedCountry || "Select Country of Residence"}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-4 h-4 text-gray-500 transition-transform ${countryOpen ? 'rotate-180' : ''}`}><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                 </div>
                 <div className={`absolute top-full left-0 w-full mt-2 bg-[#0A0A0A] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50 transition-all duration-200 origin-top ${countryOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
                    <div className="p-2 border-b border-white/5 sticky top-0 bg-[#0A0A0A]"><input type="text" className="w-full bg-white/5 rounded-lg px-3 py-2 text-xs text-white outline-none focus:bg-white/10 transition-colors" placeholder="Search country..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} autoFocus /></div>
                    <ul className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
                        {filteredCountries.map((country) => (<li key={country} onClick={() => { setSelectedCountry(country); setCountryOpen(false); setSearchQuery(""); }} className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-blue-600/20 hover:text-blue-400 transition-colors flex items-center justify-between ${selectedCountry === country ? 'text-blue-500 bg-blue-600/10' : 'text-gray-300'}`}>{country}</li>))}
                    </ul>
                 </div>
                 <p className={`text-[10px] mt-1 ml-1 transition-colors ${errorMsg && !selectedCountry ? 'text-red-400' : 'text-gray-500'}`}>Confirm your country for regulatory compliance.</p>
              </div>
            )}

            <div className="relative group">
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="peer w-full bg-[#050505] border border-white/10 rounded-lg px-4 pt-5 pb-2 text-white outline-none focus:border-blue-500 transition-colors placeholder-transparent text-sm" placeholder="Fill this box" />
              <label htmlFor="email" className="absolute left-4 top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-blue-500 pointer-events-none">Email Address</label>
            </div>

            {view !== 'forgot' && (
              <div className="relative group">
                <input type={showPassword ? "text" : "password"} id="password" value={password} onChange={(e) => setPassword(e.target.value)} required className={`peer w-full bg-[#050505] border ${errorMsg && view === 'signup' && !isPasswordValid(password) ? 'border-red-500/50' : 'border-white/10'} rounded-lg px-4 pt-5 pb-2 text-white outline-none focus:border-blue-500 transition-colors placeholder-transparent pr-12 text-sm`} placeholder="Fill this box" />
                <label htmlFor="password" className="absolute left-4 top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-blue-500 pointer-events-none">Password</label>
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors focus:outline-none">{showPassword ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-500"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>}</button>
              </div>
            )}

            {/* PASSWORD HINTS (Only on Signup) */}
            {view === 'signup' && (
                <div className="flex flex-wrap gap-2 mt-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded ${/[A-Z]/.test(password) ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-gray-500'}`}>Uppercase</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded ${/[a-z]/.test(password) ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-gray-500'}`}>Lowercase</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded ${/[0-9]/.test(password) ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-gray-500'}`}>Number</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded ${password.length >= 6 ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-gray-500'}`}>6+ Chars</span>
                </div>
            )}

            {view === 'signup' && (
                <div className="pt-2">
                    <div className="flex items-center gap-2 cursor-pointer text-sm text-blue-500 hover:text-blue-400 w-fit select-none" onClick={() => !isPromoLocked && setShowPartnerCode(!showPartnerCode)}>
                        <span>Partner code (optional)</span>
                        {isPromoLocked ? (
                            <span className="bg-green-500/20 text-green-500 text-[10px] px-2 py-0.5 rounded border border-green-500/30 flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                                Applied
                            </span>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-3 h-3 transition-transform ${showPartnerCode ? 'rotate-180' : ''}`}><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                        )}
                    </div>
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showPartnerCode ? 'max-h-20 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                        <div className="relative group">
                            <input 
                                type="text" 
                                value={partnerCode} 
                                onChange={(e) => !isPromoLocked && setPartnerCode(e.target.value)} 
                                readOnly={isPromoLocked}
                                className={`peer w-full bg-[#050505] border ${isPromoLocked ? 'border-green-500/50 text-green-400' : 'border-white/10 text-white'} rounded-lg px-4 pt-5 pb-2 outline-none focus:border-blue-500 transition-colors placeholder-transparent text-sm uppercase font-mono tracking-widest`} 
                                placeholder="Partner Code" 
                            />
                            <label className="absolute left-4 top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-blue-500 pointer-events-none">Partner Code</label>
                            {isPromoLocked && <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg></div>}
                        </div>
                    </div>
                </div>
            )}

            {view === 'signup' && (
                <div className="flex items-start gap-3 mt-4">
                    <div className="flex items-center h-5">
                        <input id="terms" type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className={`w-4 h-4 bg-[#050505] border rounded focus:ring-blue-500 focus:ring-1 appearance-none cursor-pointer checked:bg-blue-500 checked:border-blue-500 relative checked:after:content-['✓'] checked:after:absolute checked:after:text-white checked:after:text-[10px] checked:after:left-[2px] checked:after:top-[-1px] ${errorMsg && !termsAccepted ? 'border-red-500' : 'border-white/20'}`} />
                    </div>
                    <label htmlFor="terms" className={`text-xs cursor-pointer select-none transition-colors ${errorMsg && !termsAccepted ? 'text-red-400' : 'text-gray-400'}`}>I declare and confirm that I am not a citizen or resident of the US for tax purposes.</label>
                </div>
            )}

            <button disabled={loading} className="w-full bg-[#FFE600] hover:bg-[#E5CE00] text-black font-bold py-3.5 rounded-lg shadow-lg shadow-yellow-500/10 transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mt-6">
              {loading ? <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : (view === 'signup' ? 'Register' : view === 'forgot' ? 'Send Recovery Link' : 'Sign In')}
            </button>

            {view === 'signin' && (<div className="text-center mt-4"><button type="button" onClick={() => setView('forgot')} className="text-xs text-gray-500 hover:text-white transition">Forgot password?</button></div>)}
            {view === 'forgot' && (<div className="text-center mt-4"><button type="button" onClick={() => setView('signin')} className="text-xs text-blue-500 hover:text-blue-400 transition flex items-center justify-center gap-1 mx-auto"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg> Back to Log In</button></div>)}
          </form>
      </div>
    </div>
  );
}

// ============================================================================
// COMPONENT 4: MAIN PAGE WRAPPER
// ============================================================================
export default function LoginPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-600 selection:text-white relative overflow-x-hidden flex flex-col items-center justify-center py-20">
      <div className="fixed top-0 left-0 w-[800px] h-[800px] bg-blue-500/15 rounded-full blur-[120px] pointer-events-none z-0 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 mix-blend-screen" style={{ left: mousePosition.x, top: mousePosition.y }}></div>
      <Suspense fallback={<div className="text-white">Loading...</div>}>
        <AuthContent />
      </Suspense>
      <div className="max-w-4xl mx-auto px-6 mt-20 text-center space-y-6 opacity-60 pb-10">
          <div className="text-[10px] text-gray-500 leading-relaxed space-y-4">
              <p>TradeCore does not offer services to residents of certain jurisdictions including the USA, Iran, North Korea, the European Union, the United Kingdom and others. The content of the website including translations should not be construed as means for solicitation. Investors make their own and independent decisions.</p>
              <p>Trading in CFDs and generally leveraged products involves substantial risk of loss and you may lose all of your invested capital.</p>
              <p>TradeCore (SC) Ltd is a Securities Dealer registered in Seychelles with registration number 8423606-1 and authorised by the Financial Services Authority (FSA) with licence number SD025. The registered office of TradeCore (SC) Ltd is at 9A CT House, 2nd floor, Providence, Mahe, Seychelles.</p>
              <p>TradeCore B.V. is a Securities Intermediary registered in Curaçao with registration number 148698(0) and authorised by the Central Bank of Curaçao and Sint Maarten (CBCS) with licence number 0003LSI. The registered office of TradeCore B.V. is at Emancipatie Boulevard Dominico F. "Don" Martina 31, Curaçao.</p>
          </div>
          <div className="flex justify-center gap-6 text-[10px] text-blue-500/60 font-medium">
              <a href="#" className="hover:text-blue-400">Privacy Agreement</a>
              <a href="#" className="hover:text-blue-400">Risk Disclosure</a>
              <a href="#" className="hover:text-blue-400">Security Instructions</a>
              <a href="#" className="hover:text-blue-400">Preventing Money Laundering</a>
          </div>
          <div className="text-[10px] text-gray-600">© 2026 TradeCore Technologies. All rights reserved.</div>
      </div>
    </div>
  );
}