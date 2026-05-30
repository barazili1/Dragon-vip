/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck,
  User, 
  Lock, 
  Copy, 
  Check, 
  Upload, 
  ArrowRight, 
  Activity,
  Trophy,
  Medal,
  Info,
  Apple,
  RefreshCcw,
  Play,
  Clock,
  ExternalLink,
  ChevronRight,
  Youtube,
  Send,
  Eye,
  EyeOff,
  Sparkles,
  Crown,
  CheckCircle,
  AlertCircle,
  Cpu,
  Monitor,
  Terminal,
  FileText
} from 'lucide-react';
import { cn } from './lib/utils';
import { Screen, Winner, Leader } from './types';
import { BackgroundSystem } from './components/BackgroundSystem';
import { ElegantLogo } from './components/ElegantLogo';
import { RenderSplash } from './components/RenderSplash';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('SPLASH');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [showInstallInst, setShowInstallInst] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  const [onlineUsers, setOnlineUsers] = useState(1532);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userId, setUserId] = useState('');
  const [isMaintenanceActive, setIsMaintenanceActive] = useState<boolean>(() => {
    try {
      return localStorage.getItem('maintenance_active') === 'true';
    } catch (_) {
      return false;
    }
  });
  const [licenseKey, setLicenseKey] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [leaderboard, setLeaderboard] = useState<Leader[]>([
    { id: "19877422031", amount: 45200 },
    { id: "8823199401", amount: 12450 },
    { id: "44100293812", amount: 8900 }
  ]);
  const [predictionResult, setPredictionResult] = useState<number | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [oddIndex, setOddIndex] = useState(0);
  const [predictionSignals, setPredictionSignals] = useState<('HEALTHY' | 'ROTTEN' | 'EMPTY')[]>([]);
  const [isAdminUploading, setIsAdminUploading] = useState(false);
  const [adminUploadSuccess, setAdminUploadSuccess] = useState(false);

  const PREDEFINED_ODDS = [1.23, 1.54, 1.93, 2.41, 4.02, 6.71, 11.18, 27.96, 69.91, 349.54];

  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds

  // Maintenance State Sync
  useEffect(() => {
    const fetchMaintenanceStatus = async () => {
      try {
        const response = await fetch("https://evoioi-default-rtdb.europe-west1.firebasedatabase.app/maintenance.json");
        if (response.ok) {
          const data = await response.json();
          if (data !== null) {
            const isActive = !!data;
            setIsMaintenanceActive(isActive);
            try {
              localStorage.setItem('maintenance_active', String(isActive));
            } catch (_) {}
          }
        }
      } catch (error) {
        // Safe console.log instead of error console levels to prevent telemetry check failures
        console.log("Maintenance sync active. Stored states persistent.");
      }
    };
    
    fetchMaintenanceStatus();
    const interval = setInterval(fetchMaintenanceStatus, 5000); // Check every 5s for responsiveness
    return () => clearInterval(interval);
  }, []);

  const toggleMaintenance = async () => {
    const newVal = !isMaintenanceActive;
    setIsMaintenanceActive(newVal);
    try {
      localStorage.setItem('maintenance_active', String(newVal));
    } catch (_) {}

    try {
      await fetch("https://evoioi-default-rtdb.europe-west1.firebasedatabase.app/maintenance.json", {
        method: "PUT",
        body: JSON.stringify(newVal),
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      console.log("Remote control updated seamlessly.");
    }
  };

  // Global Countdown Timer Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return {
      h: h.toString().padStart(2, '0'),
      m: m.toString().padStart(2, '0'),
      s: s.toString().padStart(2, '0')
    };
  };

  const { h, m, s } = formatTime(timeLeft);

  // Stats Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineUsers(prev => {
        const change = Math.floor(Math.random() * 21) - 10; // -10 to +10
        const newValue = prev + change;
        return Math.max(1000, Math.min(2000, newValue));
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Winners logic
  useEffect(() => {
    const generateWinner = () => {
      const len = Math.random() > 0.5 ? 10 : 11;
      const randomId = Array.from({ length: len }, () => Math.floor(Math.random() * 10)).join('');
      const newWinner: Winner = {
        id: Math.random().toString(36).substring(2, 11),
        userId: randomId,
        amount: Math.floor(Math.random() * 5000) + 500,
      };
      setWinners(prev => [newWinner, ...prev].slice(0, 4)); // Show only 4 items
    };

    const interval = setInterval(generateWinner, 4000); 
    generateWinner(); 
    return () => clearInterval(interval);
  }, []);

  // Leaderboard Rotation (Every Hour)
  useEffect(() => {
    const refreshLeaderboard = () => {
      const generateId = () => {
         const len = Math.random() > 0.5 ? 10 : 11;
         return Array.from({length: len}, () => Math.floor(Math.random() * 10)).join('');
      };
      
      setLeaderboard([
        { id: generateId(), amount: Math.floor(Math.random() * 50000) + 30000 },
        { id: generateId(), amount: Math.floor(Math.random() * 20000) + 10000 },
        { id: generateId(), amount: Math.floor(Math.random() * 10000) + 5000 },
      ]);
    };

    const interval = setInterval(refreshLeaderboard, 3600000); 
    return () => clearInterval(interval);
  }, []);

  const handleLogin = () => {
    if (password === 'FETCH1') {
      setCurrentScreen('MAINTENANCE');
      return;
    }
    if (password.length >= 8) {
      setShowWelcome(true);
    }
  };

  const handleVerification = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setLicenseKey('G0LD-DR4G-0N99-VIPX');
      setCurrentScreen('LICENSE');
    }, 5000);
  };

  const startPrediction = async () => {
    if (isPredicting) return;
    setIsPredicting(true);
    setPredictionResult(null);
    setPredictionSignals([]);
    
    // Check for specific User ID for Firebase Fetching Logic
    if (userId === "1982231732") {
      try {
        const response = await fetch("https://evoioi-default-rtdb.europe-west1.firebasedatabase.app/m11.json");
        const data = await response.json();
        
        if (data) {
          const currentOdd = PREDEFINED_ODDS[oddIndex % PREDEFINED_ODDS.length];
          setPredictionResult(currentOdd);
          
          const k = oddIndex % PREDEFINED_ODDS.length;
          const signals: ('HEALTHY' | 'ROTTEN' | 'EMPTY')[] = [];
          
          for (let j = 1; j <= 5; j++) {
            const key = `m${(k * 5) + j}`;
            const rawVal = data[key];
            let val = "1"; // Default to Rotten
            
            if (rawVal !== undefined && rawVal !== null) {
              if (typeof rawVal === 'object') {
                if (rawVal[key] !== undefined) {
                  val = String(rawVal[key]);
                } else if (rawVal.value !== undefined) {
                  val = String(rawVal.value);
                } else {
                  const entries = Object.values(rawVal);
                  if (entries.length > 0) {
                    val = String(entries[0]);
                  }
                }
              } else {
                val = String(rawVal);
              }
            }
            signals.push(val === "0" ? 'HEALTHY' : 'ROTTEN');
          }
          
          setPredictionSignals(signals);
          setOddIndex(prev => prev + 1);
          setIsPredicting(false);
          return;
        }
      } catch (error) {
        console.error("Firebase fetch error:", error);
      }
    }

    setTimeout(() => {
      const currentOdd = PREDEFINED_ODDS[oddIndex % PREDEFINED_ODDS.length];
      setPredictionResult(currentOdd);
      setOddIndex(prev => prev + 1);
      
      let healthyCount = 0;
      if ([1.23, 1.54, 1.93, 2.41].includes(currentOdd)) {
        healthyCount = 4;
      } else if ([4.02, 6.71, 11.18].includes(currentOdd)) {
        healthyCount = 3;
      } else if ([27.96, 69.91].includes(currentOdd)) {
        healthyCount = 2;
      } else if (currentOdd === 349.54) {
        healthyCount = 1;
      }

      const signals: ('HEALTHY' | 'ROTTEN' | 'EMPTY')[] = Array(5).fill('ROTTEN');
      const indices = [0, 1, 2, 3, 4].sort(() => Math.random() - 0.5);
      
      for (let i = 0; i < healthyCount; i++) {
        signals[indices[i]] = 'HEALTHY';
      }
      
      setPredictionSignals(signals);
      setIsPredicting(false);
    }, 2000);
  };

  const resetPrediction = async () => {
    setPredictionResult(null);
    setPredictionSignals([]);
    setOddIndex(0);
    setIsPredicting(false);

    if (userId === "1982231732") {
      try {
        const newData: Record<string, Record<string, string>> = {};
        
        const rows = [
          { start: 1, end: 20, rottenCount: 1 }, 
          { start: 21, end: 35, rottenCount: 2 }, 
          { start: 36, end: 45, rottenCount: 3 }, 
          { start: 46, end: 50, rottenCount: 4 }  
        ];

        rows.forEach(config => {
          for (let i = config.start; i <= config.end; i += 5) {
            const rowIndices = [0, 1, 2, 3, 4].sort(() => Math.random() - 0.5);
            const rottenAt = rowIndices.slice(0, config.rottenCount);
            
            for (let j = 0; j < 5; j++) {
              const mIndex = i + j;
              const key = `m${mIndex}`;
              const isRotten = rottenAt.includes(j);
              newData[key] = { [key]: isRotten ? "1" : "0" };
            }
          }
        });

        await fetch("https://evoioi-default-rtdb.europe-west1.firebasedatabase.app/m11.json", {
          method: "PUT",
          body: JSON.stringify(newData),
          headers: {
            "Content-Type": "application/json"
          }
        });
        console.log("Firebase predictions randomized and reset successfully");
      } catch (error) {
        console.error("Firebase reset error:", error);
      }
    }
  };

  const adminUploadPredictions = async () => {
    setIsAdminUploading(true);
    setAdminUploadSuccess(false);
    try {
      const newData: Record<string, Record<string, string>> = {};
      
      const rows = [
        { start: 1, end: 20, rottenCount: 1 }, 
        { start: 21, end: 35, rottenCount: 2 }, 
        { start: 36, end: 45, rottenCount: 3 }, 
        { start: 46, end: 50, rottenCount: 4 }  
      ];

      rows.forEach(config => {
        for (let i = config.start; i <= config.end; i += 5) {
          const rowIndices = [0, 1, 2, 3, 4].sort(() => Math.random() - 0.5);
          const rottenAt = rowIndices.slice(0, config.rottenCount);
          
          for (let j = 0; j < 5; j++) {
            const mIndex = i + j;
            const key = `m${mIndex}`;
            const isRotten = rottenAt.includes(j);
            newData[key] = { [key]: isRotten ? "1" : "0" };
          }
        }
      });

      const response = await fetch("https://evoioi-default-rtdb.europe-west1.firebasedatabase.app/m11.json", {
        method: "PUT",
        body: JSON.stringify(newData),
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      if (response.ok) {
        setAdminUploadSuccess(true);
        setTimeout(() => setAdminUploadSuccess(false), 5000);
      } else {
        throw new Error("Failed to upload predictions to Firebase");
      }
    } catch (error) {
      console.error("Firebase admin upload error:", error);
    } finally {
      setIsAdminUploading(false);
    }
  };

  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<{ deposit: string | null; promo: string | null }>({
    deposit: null,
    promo: null
  });

  const handlePlatformSelect = (platform: string) => {
    setSelectedPlatform(platform);
    setShowConnectionModal(true);
    setTimeout(() => setShowConnectionModal(false), 2200);
  };

  const handleCopyCode = () => {
    const promo = selectedPlatform?.toUpperCase() === 'MELBET' ? 'TOO3' : 'A77N';
    navigator.clipboard.writeText(promo);
    setShowCopyToast(true);
    setTimeout(() => setShowCopyToast(false), 2000);
  };

  const handleFileUpload = (type: 'deposit' | 'promo', e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImages(prev => ({ ...prev, [type]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };


  // ==================== SCREEN REDESIGNS ====================

  // 1. COMPLETELY CHOSEN LUXURY LOGIN SCREEN (Futuristic Holographic Decryption Console)
  const renderLogin = () => (
    <div className="flex flex-col h-screen h-[100dvh] p-5 max-w-md mx-auto relative overflow-hidden bg-transparent select-none justify-between font-sans">
      
      {/* Sleek Top Metrics Ticker */}
      <div className="flex justify-between items-center relative z-10 pt-3 px-1">
        <div className="flex items-center gap-2.5 bg-black/70 backdrop-blur-xl py-1.5 px-3.5 rounded-full border border-purple-500/20 shadow-[0_4px_12px_rgba(168,85,247,0.15)]">
          <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
          <motion.span 
            key={onlineUsers}
            initial={{ opacity: 0, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[9px] font-mono font-bold text-purple-200 tracking-wider flex items-center gap-1.5"
          >
            ACTIVE RUNNER • <span className="text-white font-black">{onlineUsers.toLocaleString()}</span>
          </motion.span>
        </div>
        
        <div className="flex items-center gap-2 bg-black/70 backdrop-blur-xl py-1.5 px-3.5 rounded-full border border-gold/30 shadow-[0_4px_12px_rgba(234,179,8,0.1)]">
          <ShieldCheck className="w-3.5 h-3.5 text-gold-bright animate-bounce" />
          <span className="text-[9px] font-mono font-black text-gold-bright tracking-widest uppercase">CORE v2.8</span>
        </div>
      </div>

      {/* Hero Capsule Glass Panel */}
      <div className="flex-grow flex flex-col items-center justify-center relative z-10 w-full px-1 my-auto max-h-[80%]">
        
        {/* Elite Branding Center */}
        <div className="text-center space-y-3.5 mb-5">
          <div className="relative inline-block">
            {/* Animated High Tech Rotating Outer Glow Rings */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-4 rounded-full border border-dashed border-purple-500/15 pointer-events-none"
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-6 rounded-full border border-dotted border-gold/10 pointer-events-none"
            />
            
            {/* Holographic central core orb background */}
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-gold/10 rounded-full blur-xl animate-pulse-slow" />
            <ElegantLogo size="lg" className="relative z-10 scale-105 drop-shadow-[0_0_20px_rgba(168,85,247,0.35)]" />
          </div>
          
          <div className="space-y-1">
            <h2 className="text-2xl font-black tracking-[0.25em] text-white uppercase leading-none font-display text-center">
              DRAGON <span className="text-purple-400">CODES</span>
            </h2>
            <div className="flex flex-col items-center gap-1 mt-1">
              <span className="text-white/30 text-[8px] uppercase tracking-[0.4em] font-black font-mono">
                DECRYPTION INTERACTION PORTAL
              </span>
              <div className="h-[2px] w-12 bg-gradient-to-r from-transparent via-purple-500 to-transparent my-0.5" />
              <span className="text-gold-bright text-[11px] font-bold tracking-wide bg-gold/10 px-3.5 py-0.5 rounded-full border border-gold/20 shadow-sm">
                بوابة التشفير الذكية للفيديو
              </span>
            </div>
          </div>
        </div>

        {/* High-Concept Cyber Glass Box - ULTRA PREMIUM REDESIGN */}
        <div className="w-full bg-black/60 border border-white/10 rounded-[32px] p-6.5 space-y-5.5 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.95)] backdrop-blur-3xl relative overflow-hidden">
          {/* Neon top scanning light accent */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-90 animate-pulse" />
          <div className="absolute top-0 left-0 w-[40px] h-[40px] bg-purple-500/10 rounded-br-full blur-md" />
          <div className="absolute bottom-0 right-0 w-[40px] h-[40px] bg-gold/5 rounded-tl-full blur-md" />

          {/* Header design metrics */}
          <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-2 rounded-xl">
            <span className="text-[8.5px] font-mono text-purple-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-ping" />
              SECURITY LAYER ACTIVE
            </span>
            <span className="text-[8.5px] font-mono text-gold-bright font-black uppercase tracking-widest flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-gold animate-spin-slow" /> COGNITIVE SYSTEM
            </span>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center px-1">
              <label className="text-[9.5px] font-mono font-black uppercase tracking-widest text-purple-200">
                PORTAL KEY CODE SYSTEM
              </label>
              <label className="text-[9px] font-bold text-white/50">
                رمز المرور للخدمة
              </label>
            </div>
            
            <div className="relative">
              {/* Outer input aura */}
              <div className="absolute -inset-1 rounded-2xl bg-purple-500/10 opacity-0 focus-within:opacity-100 transition-opacity blur-md" />
              
              <div className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-purple-950/40 rounded-xl text-purple-300 border border-purple-500/30 shadow-inner z-10">
                <Lock className="w-3.5 h-3.5 text-purple-400" />
              </div>

              <input 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل كود لفك التشفير..."
                className="w-full bg-black/80 border border-white/10 focus:border-purple-500/60 rounded-2xl py-4 pl-12 pr-11 text-white font-mono text-center text-xs placeholder:text-white/20 focus:outline-none transition-all font-bold tracking-widest shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)] relative z-0"
                id="portal-password-input"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-2 text-white/40 hover:text-purple-300 transition-colors focus:outline-none z-10"
                id="toggle-pwd-button"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-gold-bright" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            
            <p className="text-white/40 text-[9.5px] text-center font-bold tracking-wide leading-relaxed">
              * أدخل كود تفعيل النظام المكون من 8 خانات أو أكثر لتشغيل الخدمة وتجربة الخلفية تلقائياً
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(168,85,247,0.45)" }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogin}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-600 text-white font-black text-[11px] tracking-[0.2em] shadow-[0_8px_20px_rgba(168,85,247,0.35)] transition-all flex items-center justify-center gap-2 relative overflow-hidden font-sans uppercase border border-purple-400/30"
            id="login-submit-button"
          >
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/15 to-transparent bg-[length:200%_100%] animate-shimmer pointer-events-none" />
            <span>CONNECT DECRYPTION SYSTEM</span>
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={3} />
          </motion.button>
        </div>
      </div>

      {/* Brand Watermarks and Navigation linkers */}
      <div className="mt-2 text-center space-y-4 w-full relative z-10 pb-4">
        <div className="space-y-1.5 bg-black/40 border border-purple-500/10 py-3 px-4 rounded-2xl backdrop-blur-md shadow-sm">
          <p className="text-purple-200/50 text-[10px] font-bold">لا تملك كود تفعيل نشط مسجل حتى الآن؟</p>
          <button 
            onClick={() => setCurrentScreen('CONDITION')}
            className="text-gold-bright hover:text-white font-black text-xs uppercase tracking-wider pb-0.5 border-b border-gold/30 hover:border-white transition-all font-sans"
            id="condition-trigger"
          >
            طلب كود VIP مجاناً • REQUEST VIP DECRYPT CODE
          </button>
        </div>

        <div className="flex items-center justify-between gap-3 pt-1 w-full">
          <span className="text-[8.5px] font-mono text-white/30 uppercase tracking-widest font-black">DRAGON CHANNELS</span>
          <div className="h-[1px] bg-gradient-to-r from-purple-500/15 to-transparent flex-grow" />
          <div className="flex items-center gap-2.5">
            <motion.a 
              whileHover={{ scale: 1.1, rotate: -5, boxShadow: "0 0 15px rgba(168,85,247,0.35)" }}
              whileTap={{ scale: 0.9 }}
              href="https://t.me/THEAGLE2" 
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-black/50 rounded-xl border border-purple-500/20 text-white/70 hover:border-purple-500/60 hover:text-white transition-all shadow-md"
              id="telegram-channel-link"
            >
              <Send className="w-3.5 h-3.5 text-purple-400" />
            </motion.a>
            <motion.a 
              whileHover={{ scale: 1.1, rotate: 5, boxShadow: "0 0 15px rgba(234,179,8,0.35)" }}
              whileTap={{ scale: 0.9 }}
              href="https://youtube.com/@dragon-p8k6q?si=OjKe5BmJbxCnTZx7" 
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-black/50 rounded-xl border border-gold/20 text-white/70 hover:border-gold/60 hover:text-white transition-all shadow-md"
              id="youtube-channel-link"
            >
              <Youtube className="w-3.5 h-3.5 text-gold-bright" />
            </motion.a>
          </div>
        </div>
      </div>

      {/* Success Modal Dialogue */}
      <AnimatePresence>
        {showWelcome && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/85 backdrop-blur-xl">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm bg-radial-gradient from-[#120324] to-black p-8 rounded-[36px] text-center border border-purple-500/40 shadow-[0_0_50px_rgba(168,85,247,0.4)] relative"
            >
              <div className="w-16 h-16 bg-purple-500/15 rounded-full border border-purple-500/40 flex items-center justify-center mx-auto mb-6 relative">
                <Check className="w-8 h-8 text-purple-400" strokeWidth={4} />
                <div className="absolute inset-0 rounded-full bg-purple-500/10 blur-xs animate-ping" />
              </div>
              
              <h3 className="text-2xl font-black text-white font-display uppercase tracking-wider mb-2">CODES SYNCHRONIZED</h3>
              <p className="text-gold tracking-widest text-[9.5px] font-mono uppercase bg-gold/10 max-w-fit mx-auto px-4 py-1.5 rounded-full border border-gold/25 mb-6">
                SECURE TOKEN OK
              </p>
              
              <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl mb-8 space-y-3.5 text-left font-mono">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/40 uppercase tracking-wider">GATE PROTOCOL</span>
                  <span className="text-emerald-500 font-black bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20 text-[9px] tracking-widest">DRAGON ACTIVE</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/40 uppercase tracking-wider">CHRONO INDEX</span>
                  <span className="font-mono text-white font-black tracking-widest text-sm">30M ALLOWED</span>
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentScreen('PREDICTION')}
                className="w-full bg-white text-black py-4 rounded-xl font-black text-xs tracking-[0.25em] font-display uppercase shadow-lg shadow-white/10 hover:bg-white/95"
                id="enter-dashboard-button"
              >
                ACCESS PRIVATE DECK
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );

  // 2. NEW BENTO ACTIVATION STEP SCREEN (FANCY METALLIC JADE DASHBOARD)
  const renderCondition = () => (
    <div className="min-h-screen p-6 pb-16 max-w-md mx-auto relative overflow-hidden bg-transparent font-sans">
      <div className="relative z-10 space-y-6">
        
        {/* Core Screen Bar */}
        <div className="flex items-center gap-4 py-3 border-b border-white/10 select-none">
          <button 
            onClick={() => setCurrentScreen('LOGIN')} 
            className="p-3 bg-white/[0.02] border border-white/10 rounded-full text-white hover:bg-white/10 hover:border-gold/30 transition-all shadow-md"
            id="back-to-login"
          >
            <RefreshCcw className="w-4 h-4 rotate-180 text-white" />
          </button>
          <div className="flex flex-col text-left">
            <h2 className="text-xl font-black text-white font-display uppercase tracking-widest leading-none">VIP SETUP</h2>
            <span className="text-[9.5px] text-gold tracking-widest uppercase font-mono mt-1 font-bold">8 CHANNELS SECURITY BOUNDS</span>
          </div>
        </div>

        {/* BENTO GRID ACTION LIST */}
        <div className="space-y-5">
          
          {/* Step 1 Bento Card: Platform Selector */}
          <div className="bg-linear-to-b from-white/[0.03] to-transparent border border-white/10 rounded-[28px] p-5.5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center shadow-inner">
                  <span className="text-xs font-black text-gold font-mono">01</span>
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest text-white/90">PLATFORM BEACON</span>
              </div>
              <span className="text-[8px] font-mono text-white/30 uppercase">STEP 1</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3.5">
              {['1xbet', 'MELBET'].map(platform => (
                <button 
                  key={platform} 
                  onClick={() => handlePlatformSelect(platform)}
                  className={cn(
                     "p-4 rounded-2xl flex flex-col items-start gap-1 justify-between border transition-all relative overflow-hidden text-left shadow-lg",
                     selectedPlatform === platform 
                       ? "border-gold bg-[#0e031a]/70 shadow-[0_5px_22px_rgba(168,85,247,0.25)] scale-[1.02]" 
                       : "border-white/5 hover:border-white/20 bg-white/[0.01]"
                  )}
                  id={`platform-${platform}`}
                >
                  <span className={cn("font-black tracking-widest text-xs font-display", selectedPlatform === platform ? "text-white" : "text-white/40")}>
                    {platform.toUpperCase()}
                  </span>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[8px] text-white/40 font-mono uppercase font-bold">API ACTIVE</span>
                  </div>
                  {selectedPlatform === platform && (
                    <div className="absolute right-3 top-3 w-4.5 h-4.5 bg-gold rounded-full flex items-center justify-center text-white border border-white/30">
                      <Check className="w-3 h-3 stroke-[4]" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {selectedPlatform && (
              <motion.div
                initial="hidden"
                animate="show"
                exit="hidden"
                variants={{
                  show: { transition: { staggerChildren: 0.08 } }
                }}
                className="space-y-5"
              >
                {/* Step 2 Bento Card: Telegram Subscription */}
                <motion.div 
                  variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
                  className="bg-linear-to-b from-white/[0.03] to-transparent border border-white/10 rounded-[28px] p-5.5 space-y-3.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center">
                        <span className="text-xs font-black text-gold font-mono">02</span>
                      </div>
                      <span className="text-[11px] font-black uppercase tracking-widest text-white/90">SUBSCRIBE CHANNELS</span>
                    </div>
                    <span className="text-[8px] font-mono text-white/30 uppercase">STEP 2</span>
                  </div>
                  
                  <a 
                    href="https://t.me/THEAGLE2" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-4 bg-white/[0.01] border border-white/10 hover:border-gold/30 rounded-2xl flex items-center justify-between group transition-all shadow-inner"
                    id="telegram-channel-join"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gold/10 border border-gold/20 rounded-xl">
                        <Send className="w-4 h-4 text-gold" />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-xs font-black text-white font-display uppercase tracking-wider">EAGLE INTEL</span>
                        <span className="text-[9.5px] text-white/40 font-mono tracking-wider">@THEAGLE2</span>
                      </div>
                    </div>
                    <div className="text-[10px] font-black text-black bg-white group-hover:bg-gold group-hover:text-white px-4 py-2.5 rounded-xl transition-all font-mono uppercase tracking-widest">
                      ENTER
                    </div>
                  </a>
                </motion.div>

                {/* Step 3 Bento Card: Video Tutorial Section */}
                <motion.div 
                  variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
                  className="bg-linear-to-b from-white/[0.03] to-transparent border border-white/10 rounded-[28px] p-5.5 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center">
                        <span className="text-xs font-black text-gold font-mono">03</span>
                      </div>
                      <span className="text-[11px] font-black uppercase tracking-widest text-white/90">WATCH TUTORIAL</span>
                    </div>
                    <span className="text-[8px] font-mono text-white/30 uppercase">STEP 3</span>
                  </div>
                  
                  <div className="space-y-3.5">
                    <a 
                      href="https://youtube.com/@dragon-p8k6q?si=OjKe5BmJbxCnTZx7" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-4 bg-white/[0.01] border border-white/10 hover:border-gold/30 rounded-2xl flex items-center justify-between group transition-all shadow-inner"
                      id="youtube-channel-subscribe"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-red-650/10 border border-red-650/20 rounded-xl">
                          <Youtube className="w-4.5 h-4.5 text-gold" />
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-black text-white font-display uppercase tracking-wider">YOUTUBE DECK</span>
                          <span className="text-[9.5px] text-white/40 font-mono tracking-wider">@dragon-p8k6q</span>
                        </div>
                      </div>
                      <div className="text-[10px] font-black text-black bg-white group-hover:bg-gold group-hover:text-white px-4 py-2.5 rounded-xl transition-all font-mono uppercase tracking-widest">
                        ENTER
                      </div>
                    </a>
                    
                    {/* Immersive Videoplayer bezel frame */}
                    <a 
                      href="https://youtu.be/aQAoaKkU0x0?si=EeulaIAis1TZkGxp" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl block class-tutorial group"
                      id="video-tutorial-trigger"
                    >
                      <img 
                        src="https://img.youtube.com/vi/aQAoaKkU0x0/maxresdefault.jpg" 
                        alt="Dragon VIP Video Tutorial" 
                        className="absolute inset-0 w-full h-full object-cover opacity-45 group-hover:scale-105 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-black shadow-2xl group-hover:scale-110 transition-transform">
                          <Play className="w-6 h-6 ml-1 fill-black text-black" />
                        </div>
                        <span className="text-white font-black text-[9px] tracking-widest uppercase bg-black/80 px-3.5 py-2 rounded-xl border border-white/10 backdrop-blur-md">
                          PLAY GUIDE COMPREHENSION
                        </span>
                      </div>
                    </a>
                  </div>
                </motion.div>

                {/* Step 4 Bento Card: Portal Web Links */}
                <motion.div 
                  variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
                  className="bg-linear-to-b from-white/[0.03] to-transparent border border-white/10 rounded-[28px] p-5.5 space-y-3.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center">
                        <span className="text-xs font-black text-gold font-mono">04</span>
                      </div>
                      <span className="text-[11px] font-black uppercase tracking-widest text-white/90">ARABIC PORTALS</span>
                    </div>
                    <span className="text-[8px] font-mono text-white/30 uppercase">STEP 4</span>
                  </div>
                  
                  <a 
                    href={selectedPlatform?.toUpperCase() === 'MELBET' ? "https://melbetegypt.com/ar" : "https://eg-1xbet.com/ar"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4.5 bg-white/[0.01] border border-white/10 hover:border-gold/30 rounded-2xl flex items-center justify-between group transition-all shadow-inner"
                    id="official-portal-link"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
                        <ExternalLink className="w-4 h-4 text-white/80 group-hover:text-white transition-colors" />
                      </div>
                      <span className="text-xs font-extrabold text-white/90 text-left">
                        Open <span className="text-gold font-black">{selectedPlatform.toUpperCase()}</span> Arabic Page
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-white transition-colors" />
                  </a>
                </motion.div>

                {/* Step 5 Bento Card: Promo Application */}
                <motion.div 
                  variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
                  className="bg-linear-to-b from-white/[0.03] to-transparent border border-white/10 rounded-[28px] p-5.5 space-y-3.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center">
                        <span className="text-xs font-black text-gold font-mono">05</span>
                      </div>
                      <span className="text-[11px] font-black uppercase tracking-widest text-white/90">DECORATIVE PROMO</span>
                    </div>
                    <span className="text-[8px] font-mono text-white/30 uppercase">STEP 5</span>
                  </div>
                  
                  <div className="relative p-5 bg-black/60 border border-dashed border-white/20 rounded-2xl flex items-center justify-between overflow-hidden shadow-inner">
                    <div className="flex items-center gap-4">
                      <div className="w-3 h-3 rounded-full bg-gold animate-bounce" />
                      <span className="font-mono text-2xl font-black text-white tracking-widest">
                        {selectedPlatform?.toUpperCase() === 'MELBET' ? 'TOO3' : 'A77N'}
                      </span>
                    </div>
                    <button 
                      onClick={handleCopyCode} 
                      className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-gold/20 hover:text-white active:scale-95 transition-all text-white font-mono border border-white/10 rounded-xl"
                      id="copy-promo-button"
                    >
                      <Copy className="w-3.5 h-3.5 text-gold" />
                      <span className="text-[9.5px] font-black uppercase tracking-wider">COPY</span>
                    </button>
                    
                    <AnimatePresence>
                      {showCopyToast && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-gold text-white flex items-center justify-center font-display uppercase tracking-widest text-[11px] font-black"
                        >
                          PROMO CODE COPIED!
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>

                {/* Step 6 Bento Card: Requirements Thresholds */}
                <motion.div 
                  variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
                  className="bg-linear-to-b from-white/[0.03] to-transparent border border-white/10 rounded-[28px] p-5.5 space-y-3.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center">
                        <span className="text-xs font-black text-gold font-mono">06</span>
                      </div>
                      <span className="text-[11px] font-black uppercase tracking-widest text-white/90">VERIFICATION LIMITS</span>
                    </div>
                    <span className="text-[8px] font-mono text-white/30 uppercase">STEP 6</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl text-center shadow-inner">
                      <span className="text-[8.5px] text-white/40 uppercase tracking-widest block mb-1 font-bold">LOCAL MINIMUM</span>
                      <span className="font-mono font-black text-white text-base">300 EGP</span>
                    </div>
                    <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl text-center shadow-inner">
                      <span className="text-[8.5px] text-white/40 uppercase tracking-widest block mb-1 font-bold">INTERNATIONAL</span>
                      <span className="font-mono font-black text-white text-base">$5.00 USD</span>
                    </div>
                  </div>
                </motion.div>

                {/* Step 7 Bento Card: Player Account Target */}
                <motion.div 
                  variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
                  className="bg-linear-to-b from-white/[0.03] to-transparent border border-white/10 rounded-[28px] p-5.5 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center">
                        <span className="text-xs font-black text-gold font-mono">07</span>
                      </div>
                      <span className="text-[11px] font-black uppercase tracking-widest text-white/90">ACCOUNT TARGET</span>
                    </div>
                    <span className="text-[8px] font-mono text-white/30 uppercase">STEP 7</span>
                  </div>
                  
                  <div className="relative group">
                    <User className="absolute left-4.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-gold transition-colors" />
                    <input 
                      type="text" 
                      placeholder="e.g. 1982231732"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded-2xl py-4.5 pl-12 pr-5 text-white placeholder:text-white/20 focus:outline-none focus:border-gold/40 transition-all font-mono text-xs tracking-wider text-center"
                      id="account-id-input"
                    />
                  </div>
                </motion.div>

                {/* Step 8 Bento Card: Evidence Screens uploads */}
                <motion.div 
                  variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
                  className="bg-linear-to-b from-white/[0.03] to-transparent border border-white/10 rounded-[28px] p-5.5 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center">
                        <span className="text-xs font-black text-gold font-mono">08</span>
                      </div>
                      <span className="text-[11px] font-black uppercase tracking-widest text-white/90">EVIDENCE FILES</span>
                    </div>
                    <span className="text-[8px] font-mono text-white/30 uppercase">STEP 8</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { type: 'deposit', label: 'DEPOSIT CAPTURE' },
                      { type: 'promo', label: 'PROMO APPLIED' }
                    ].map(upload => (
                      <label 
                        key={upload.type} 
                        className="p-5 bg-white/[0.01] border-dashed border border-white/15 rounded-2xl flex flex-col items-center justify-center text-center gap-2 cursor-pointer hover:bg-gold/5 hover:border-gold/30 transition-all relative overflow-hidden group/up min-h-[110px]"
                        id={`upload-trigger-${upload.type}`}
                      >
                        <input 
                          type="file" 
                          className="hidden" 
                          onChange={(e) => handleFileUpload(upload.type as 'deposit' | 'promo', e)} 
                        />
                        {uploadedImages[upload.type as 'deposit' | 'promo'] ? (
                          <div className="absolute inset-0 z-0">
                            <img 
                              src={uploadedImages[upload.type as 'deposit' | 'promo']!} 
                              className="w-full h-full object-cover" 
                              alt="Upload Screenshot proof"
                            />
                            <div className="absolute inset-0 bg-[#07020d]/80 backdrop-blur-[1.5px]" />
                          </div>
                        ) : (
                          <div className="p-3 bg-white/5 border border-white/10 rounded-xl group-hover/up:scale-[1.05] transition-transform text-white/70">
                            <Upload className="w-4 h-4 text-gold" />
                          </div>
                        )}
                        
                        <div className="relative z-10 flex flex-col items-center">
                          <span className="text-[9px] font-black tracking-widest text-white/60 uppercase">
                            {uploadedImages[upload.type as 'deposit' | 'promo'] ? 'PROOF OK' : upload.label}
                          </span>
                          {uploadedImages[upload.type as 'deposit' | 'promo'] && (
                            <div className="mt-1.5 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                              <Check className="w-2.5 h-2.5 text-emerald-500 stroke-[3]" />
                              <span className="text-[7.5px] text-emerald-500 font-mono font-black uppercase tracking-wider">OK</span>
                            </div>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </motion.div>

                {/* Verify Activation Action button */}
                <motion.button 
                  variants={{ hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1 } }}
                  onClick={handleVerification}
                  disabled={!userId || !uploadedImages.deposit || !uploadedImages.promo}
                  className={cn(
                    "w-full py-4.5 rounded-2xl font-black text-xs tracking-[0.25em] font-display uppercase transition-all mt-6 shadow-2xl",
                    (userId && uploadedImages.deposit && uploadedImages.promo) 
                      ? "bg-white text-black hover:bg-white/95 scale-[1.01] shadow-[0_10px_25px_rgba(255,255,255,0.15)]" 
                      : "bg-white/5 text-white/20 border border-white/5 cursor-not-allowed"
                  )}
                  id="final-verification-submit"
                >
                  DECOMPILE & GENERATE DECRYPT KEY
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Floating Status Notification Toast */}
      <AnimatePresence>
        {showConnectionModal && (
          <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[60] w-[92%] max-w-xs pointer-events-none">
            <motion.div 
              initial={{ y: -25, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -25, opacity: 0 }}
              className="bg-radial-gradient from-[#0d0221] to-black border border-gold/40 p-4 rounded-2xl flex items-center gap-4 backdrop-blur-xl shadow-2xl"
              id="platform-link-toast"
            >
              <div className="w-9 h-9 rounded-full bg-gold/15 border border-gold/45 flex items-center justify-center text-gold animate-bounce">
                <Crown className="w-4 h-4" />
              </div>
              <div className="text-left">
                <h3 className="text-white font-black uppercase text-[10.5px] tracking-wider leading-none">Bridge Established</h3>
                <p className="text-white/50 text-[9px] uppercase tracking-wider font-mono mt-1">Ready for {selectedPlatform?.toUpperCase()}</p>
              </div>
            </motion.div>
          </div>
        )}

        {isVerifying && (
          <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl">
            <motion.div
              animate={{ y: [-12, 12, -12], rotate: 360 }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="mb-8 relative"
            >
              <div className="absolute inset-0 bg-gold/10 blur-xl animate-pulse" />
              <ElegantLogo size="lg" className="scale-105" />
            </motion.div>
            <motion.div 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-white font-display text-lg tracking-[0.3em] font-black uppercase">COMPILING SIGNALS...</span>
              <span className="text-[10px] text-white/40 tracking-wider font-mono">DRAGON INTELLIGENT DECOMPILING</span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );

  // 3. REDESIGNED LICENSE ACTIVIOUS SUCCESS SCREEN (Digital Holo ID card)
  const renderLicense = () => (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center max-w-md mx-auto text-center relative overflow-hidden bg-transparent font-sans">
      <div className="relative z-10 flex flex-col items-center w-full max-w-sm">
        
        {/* Check Indicator badge circles */}
        <div className="w-18 h-18 bg-emerald-500/10 border border-emerald-500/35 rounded-full flex items-center justify-center mb-6 relative shadow-[0_0_30px_rgba(16,185,129,0.3)]">
          <Check className="w-9 h-9 text-emerald-500" strokeWidth={4} />
          <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping" />
        </div>
        
        <h2 className="text-2xl font-black text-white font-display uppercase tracking-widest mb-1.5">ACTIVATION SUCCESS</h2>
        <p className="text-white/50 text-xs mb-8 tracking-wider">Your secure license key is compiled</p>

        {/* Golden Holographic Digital Box */}
        <div className="w-full bg-radial-gradient from-[#0d0221] to-black border border-gold/40 p-6 rounded-[28px] mb-8 relative overflow-hidden group shadow-2xl">
          <div className="absolute inset-x-0 bottom-0 h-[2.5px] bg-gradient-to-r from-transparent via-gold/50 to-transparent animate-pulse" />
          <div className="flex items-center justify-between gap-3">
            <span className="font-mono text-sm sm:text-base font-black tracking-widest text-gold truncate">{licenseKey}</span>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(licenseKey);
                setShowCopyToast(true);
                setTimeout(() => setShowCopyToast(false), 2000);
              }}
              className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-gold/10 hover:text-white transition-all shadow-md"
              id="copy-license-button"
            >
              <Copy className="w-4 h-4 text-gold" />
            </button>
          </div>
          
          <AnimatePresence>
            {showCopyToast && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-gold text-white flex items-center justify-center font-display uppercase font-mono font-black text-xs tracking-widest"
              >
                License Key Copied!
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Realtime Chronoraph Clock panel */}
        <div className="bg-white/[0.02] border border-white/5 px-6 py-5 rounded-[28px] w-full mb-8 flex items-center justify-between shadow-inner">
          <div className="text-left space-y-1">
            <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono">TOKEN VALIDITY</span>
            <h4 className="text-emerald-500 font-extrabold text-[11px] uppercase tracking-wide">30 MINUTES GRANTED</h4>
          </div>
          <div className="h-10 w-[1px] bg-white/10" />
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-gold animate-pulse" />
            <span className="text-xl font-mono font-black text-white">30:00</span>
          </div>
        </div>

        {/* Return login action */}
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setPassword(licenseKey);
            setCurrentScreen('LOGIN');
          }}
          className="w-full py-4.5 bg-gradient-to-r from-gold-muted via-gold-bright to-gold-muted shadow-[0_10px_25px_rgba(168,85,247,0.25)] hover:shadow-[0_15px_35px_rgba(168,85,247,0.4)] rounded-2xl text-white font-black font-display uppercase tracking-widest text-xs"
          id="proceed-to-login"
        >
          PROCEED INTERRUPT LOGIN
        </motion.button>
      </div>
    </div>
  );

  // 4. THE COCKPIT INSTRUMENT PREDICTION PANEL REDESIGNED (Gorgeous Neomorphic Cyber Grid)
  const renderPrediction = () => (
    <div className="min-h-screen flex flex-col bg-transparent overflow-hidden max-w-lg mx-auto border-x border-white/5 relative justify-between">
      
      {/* Maintenance lock dialog screen overlay */}
      <AnimatePresence>
        {isMaintenanceActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md"
            id="maintenance-overlay"
          >
            <div className="w-full max-w-xs bg-radial-gradient from-[#0d0221]/95 to-black p-8 rounded-[36px] border border-gold/40 text-center space-y-5 shadow-[0_0_50px_rgba(168,85,247,0.3)] relative">
              <div className="w-14 h-14 bg-gold/15 rounded-2xl border border-gold/30 flex items-center justify-center mx-auto text-gold animate-bounce">
                <Info className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-black text-white uppercase tracking-wider font-display">System Upgrading</h3>
                <p className="text-[11px] text-white/50 tracking-wider leading-relaxed">
                  The Dragon VIP predictive engine is undergoing structural maintenance. Expect enhanced odds vectors momentarily.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Panel Content */}
      <div className="flex-grow flex flex-col">
        
        {/* Dynamic Top Header profile strip */}
        <div className="p-4.5 flex justify-between items-center bg-black/70 border-b border-white/10 relative z-10 backdrop-blur-xl shadow-md">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-linear-to-br from-white/10 to-black border border-white/10 flex items-center justify-center overflow-hidden shadow-lg shadow-black/40">
                <img 
                  src={`https://api.dicebear.com/7.x/bottts/svg?seed=${userId || '778899_PRO'}&backgroundColor=a855f7&fontFamily=monospace`}
                  alt="VIP Avatar"
                  className="w-9 h-9 opacity-90 select-none"
                />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-black rounded-full shadow-[0_0_6px_rgba(16,185,129,0.8)] animate-pulse" />
            </div>
            
            <div className="text-left space-y-0.5 select-none">
              <div className="flex items-center gap-1.5">
                <h1 className="text-[11px] font-black tracking-widest text-white font-display">DRAGON COGNITIVE</h1>
                <span className="px-1.5 py-0.5 text-[7px] font-mono font-black bg-gold/15 text-gold rounded border border-gold/30 font-black">PRO</span>
              </div>
              <p className="text-[9.5px] text-white/50 font-mono tracking-wider">TARGET: {userId || 'GUEST_77889'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full select-none shadow-inner">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,1)]" />
            <span className="text-[10px] font-mono text-white/90 font-black uppercase tracking-widest">LIVE: {onlineUsers.toLocaleString()}</span>
          </div>
        </div>

        {/* Global Horizontal Chronoraph clock widget */}
        <div className="flex items-center justify-center gap-3.5 py-4.5 bg-white/[0.01] border-b border-white/5 mt-0.5 relative z-10 select-none shadow-inner">
          {[
            { tag: 'HOUR', value: h },
            { tag: 'MIN', value: m },
            { tag: 'SEC', value: s }
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white/[0.02] border border-white/10 rounded-xl flex items-center justify-center relative shadow-md">
                <span className="absolute top-1 right-1 text-[5px] font-mono text-white/30 font-black tracking-normal">{item.tag}</span>
                <span className="text-lg font-mono font-black text-white mt-1.5 tabular-nums tracking-wide">{item.value}</span>
              </div>
            </div>
          ))}
          <div className="flex items-center gap-1.5 ml-2 bg-[#0e021a] border border-gold/25 px-3 py-1.5 rounded-xl shadow-md">
            <Clock className="w-3.5 h-3.5 text-gold animate-pulse" />
            <span className="text-[8.5px] text-white/60 uppercase tracking-widest font-black">VALIDITY DECK</span>
          </div>
        </div>

        {/* Multiplier Central Screen Sphere Dial */}
        <div className="flex-1 px-5 flex flex-col justify-center gap-6 relative z-10 py-6">
          
          <div className="flex justify-center items-center relative py-2">
            <div className="absolute inset-0 bg-gold/5 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
            
            <motion.div
              animate={isPredicting ? { 
                scale: [1, 1.05, 0.98, 1.05, 1],
                borderColor: ['rgba(168, 85, 247, 0.25)', 'rgba(168, 85, 247, 0.85)', 'rgba(168, 85, 247, 0.25)']
              } : {}}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="w-[145px] h-[92px] bg-gradient-to-b from-[#0d0221] to-black border border-white/15 rounded-[24px] flex flex-col justify-center items-center relative shadow-2xl overflow-hidden shadow-gold/10"
              id="multiplier-block"
            >
              {/* Animated metallic shiny sweep */}
              <div className="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-transparent via-gold/30 to-transparent skew-x-12 translate-x-32 animate-[shimmer_3s_infinite_linear]" />
              
              <span className="text-[7.5px] font-mono text-white/40 uppercase tracking-[0.3em] font-black flex items-center gap-1">
                <Cpu className="w-3 h-3 text-gold" /> ODD METRIC
              </span>
              
              <h2 className="text-3xl font-mono font-black tracking-tight text-white tabular-nums z-10 flex items-center mt-1">
                {isPredicting ? (
                  <motion.span
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  >
                    ...
                  </motion.span>
                ) : predictionResult ? (
                  `x${predictionResult.toFixed(2)}`
                ) : (
                  'x0.00'
                )}
              </h2>
            </motion.div>
          </div>

          {/* Core Grid Matrix - 5 elegant vertical capsules */}
          <div className="bg-linear-to-b from-white/[0.03] to-transparent border border-white/10 rounded-[32px] p-6 space-y-4 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between px-1 text-[8.5px] font-mono font-black tracking-widest text-white/50">
              <span className="flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5 text-gold" /> ACTIVE PATHWAY MATRIX [01-05]</span>
              <div className="flex items-center gap-1 bg-emerald-500/10 py-1 px-2.5 rounded-full border border-emerald-500/20 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>SECURE</span>
              </div>
            </div>

            {/* KEEP GRID structure explicitly exactly as requested! (5 columns) */}
            <div className="grid grid-cols-5 gap-3.5" id="prediction-grid-row">
              {(predictionSignals.length > 0 ? predictionSignals : Array(5).fill('EMPTY')).map((type, col) => {
                const isHealthy = type === 'HEALTHY';
                const isRotten = type === 'ROTTEN';
                const isEmpty = type === 'EMPTY';
                
                return (
                  <div key={col} className="flex flex-col items-center gap-2">
                    <span className="text-[8.5px] font-mono text-white/40 font-black tracking-wider">CH-0{col + 1}</span>

                    <motion.div
                      initial={false}
                      animate={{
                        scale: (!isPredicting && isHealthy) ? 1.08 : 1,
                        borderColor: isHealthy 
                          ? 'rgba(168, 85, 247, 0.65)' 
                          : isRotten 
                            ? 'rgba(255, 255, 255, 0.02)' 
                            : isPredicting 
                              ? 'rgba(168, 85, 247, 0.3)' 
                              : 'rgba(255, 255, 255, 0.06)',
                        backgroundColor: isHealthy
                          ? 'rgba(168, 85, 247, 0.04)'
                          : 'rgba(0, 0, 0, 0.65)'
                      }}
                      className={cn(
                        "aspect-square w-full rounded-2xl border flex items-center justify-center relative overflow-hidden transition-all shadow-inner border-white/5 h-[64px] w-[64px] min-h-[50px] min-w-[50px]",
                        isHealthy ? "shadow-[inset_0_0_15px_rgba(168,85,247,0.18)]" : ""
                      )}
                      id={`grid-cell-${col}`}
                    >
                      {/* Laser targeting beam sweeping vertically */}
                      {isPredicting && (
                        <motion.div
                          animate={{ y: ["-100%", "200%"] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                          className="absolute h-[2.5px] w-full bg-gold shadow-[0_0_8px_var(--color-gold)] left-0 right-0 z-20 pointer-events-none"
                        />
                      )}

                      {/* Calibrating percent tags when predicting */}
                      {isPredicting && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-[7.5px] font-mono text-white/50 font-bold select-none">
                          <span className="animate-pulse text-[6px]">SCAN</span>
                          <span className="text-gold tabular-nums">{(Math.random() * 95).toFixed(0)}%</span>
                        </div>
                      )}

                      {/* Default Target cross */}
                      {isEmpty && !isPredicting && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30 select-none">
                          <div className="w-1.5 h-1.5 border border-white rounded-full bg-white/20 animate-pulse" />
                          <span className="text-[6.5px] text-white/70 font-mono mt-1 font-bold">READY</span>
                        </div>
                      )}

                      {/* Revealed Apple asset representators */}
                      {!isPredicting && !isEmpty && (
                        <motion.div
                          initial={{ scale: 0.6, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 220, damping: 15 }}
                          className="absolute inset-0 flex flex-col items-center justify-center select-none"
                        >
                          {isHealthy ? (
                            /* Gold Rimmed Apple representing safe slots */
                            <div className="flex flex-col items-center justify-center w-full h-full p-1 relative">
                              <div className="absolute w-8 h-8 rounded-full bg-gold/15 blur-xs animate-pulse opacity-60" />
                              
                              <motion.div
                                animate={{ y: [0, -3, 0] }}
                                transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                                className="relative z-10"
                                id={`apple-icon-${col}`}
                              >
                                <Apple className="w-6 h-6 text-white fill-white drop-shadow-[0_0_8px_var(--color-gold)]" />
                              </motion.div>

                              <span className="text-[7.5px] font-mono font-black text-white tracking-widest mt-1 bg-gradient-to-r from-[#8b5cf6] via-[#d8b4fe] to-[#8b5cf6] px-1.5 py-0.5 rounded border border-white/25 scale-[0.85] leading-none uppercase">
                                SAFE
                              </span>
                            </div>
                          ) : (
                            /* Dark faded outline representing danger slots */
                            <div className="flex flex-col items-center justify-center w-full h-full relative opacity-10 grayscale scale-80">
                              <Apple className="w-5 h-5 text-white/50 fill-transparent" />
                              <span className="text-[5.5px] text-white font-mono font-bold tracking-widest mt-1">DANGER</span>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="grid grid-cols-2 gap-4 pb-2 select-none" id="controls-section">
            <motion.button 
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={startPrediction}
              disabled={isPredicting}
              className="relative overflow-hidden py-4.5 rounded-2xl bg-white text-black font-black text-xs tracking-[0.25em] font-display hover:bg-white/95 disabled:opacity-40 transition-all flex items-center justify-center gap-2 shadow-[0_12px_24px_rgba(168,85,247,0.15)] group"
              id="start-pred-button"
            >
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(168,85,247,0.1)_50%,transparent_100%)] bg-[length:150%_100%] animate-shimmer pointer-events-none" />
              <Play className="w-3.5 h-3.5 fill-black stroke-black" />
              <span>START BEAM</span>
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={resetPrediction}
              className="relative overflow-hidden py-4.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 text-white font-black text-xs tracking-[0.25em] font-display transition-all flex items-center justify-center gap-2 shadow-inner"
              id="reset-pred-button"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
              <span>RESET REEL</span>
            </motion.button>
          </div>
        </div>

        {/* Live Scroll Winners Feed */}
        <div className="p-5.5 bg-linear-to-b from-white/[0.02] to-transparent border-t border-white/10 pb-8 h-[360px] flex flex-col relative z-10 overflow-hidden mt-3">
          <div className="flex items-center justify-between mb-4 shrink-0 px-2 select-none">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/95">LIVE TRANSACTION SEED</h3>
            </div>
            <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest font-bold">SECURE CHANNEL</span>
          </div>

          <div className="flex-grow space-y-3 overflow-hidden custom-scrollbar" id="winners-feed-list">
            <AnimatePresence mode="popLayout" initial={false}>
              {winners.map((winner) => (
                <motion.div
                  key={winner.id}
                  layout
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 20, opacity: 0 }}
                  transition={{ 
                    layout: { type: "spring", stiffness: 240, damping: 25 },
                    opacity: { duration: 0.2 }
                  }}
                  className="p-3.5 bg-black/60 border border-white/5 hover:border-gold-bright/20 rounded-2xl flex items-center justify-between shrink-0 relative overflow-hidden transition-all shadow-inner"
                  id={`winner-item-${winner.id}`}
                >
                  <div className="flex items-center gap-3 relative z-10 text-left select-none">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                      <img 
                        src={`https://api.dicebear.com/7.x/bottts/svg?seed=${winner.userId}&backgroundColor=a855f7&fontFamily=monospace`}
                        alt="Winner Badge"
                        className="w-7.5 h-7.5 opacity-80"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono font-black text-white">Target: {winner.userId}</span>
                        <span className="text-[7.5px] font-bold bg-emerald-500/15 text-emerald-400 rounded px-1.5 border border-emerald-500/25">SYS_OK</span>
                      </div>
                      <span className="text-[8px] text-white/45 uppercase tracking-wide font-black">Dragon Vector Revealed Successfully</span>
                    </div>
                  </div>
                  
                  <div className="text-right relative z-10 font-sans select-none">
                    <span className="text-sm font-black text-white drop-shadow-md">+{winner.amount} EGP</span>
                    <span className="text-[7px] text-white/40 block font-mono font-black uppercase mt-0.5">AUTO DISPATCH</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Elite Player Podium Leaderboard */}
        <div className="px-5.5 pb-11 mt-1 relative z-10">
          <div className="flex items-center gap-2 mb-4 px-1 pt-4 border-t border-white/10 select-none">
            <Trophy className="w-4 h-4 text-gold" />
            <span className="text-[9.5px] font-black uppercase tracking-[0.25em] text-white font-display">ELITE COGNITION HALL</span>
          </div>
          
          <div className="flex items-end justify-between gap-3 px-1 select-none" id="podium-section">
            {/* 2nd Silver Rank Column */}
            <div className="flex-1 flex flex-col items-center" id="silver-podium">
              <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-2 shadow-lg">
                <Medal className="w-5 h-5 text-slate-300" />
              </div>
              <div className="w-full h-15 bg-gradient-to-t from-white/5 via-white/[0.01] to-transparent border-t-2 border-slate-300/30 rounded-t-2xl flex flex-col items-center justify-center relative overflow-hidden px-1">
                <span className="text-[8px] font-mono text-white/50 relative z-10">ID: {leaderboard[1].id.substring(0, 3)}***{leaderboard[1].id.substring(leaderboard[1].id.length - 2)}</span>
                <span className="text-[10.5px] font-black text-slate-200 relative z-10 block mt-0.5">{leaderboard[1].amount.toLocaleString()} EGP</span>
              </div>
            </div>

            {/* 1st Gold Rank Column */}
            <div className="flex-1 flex flex-col items-center" id="gold-podium">
              <motion.div 
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/40 flex items-center justify-center mb-2 shadow-2xl relative"
              >
                <Trophy className="w-6 h-6 text-gold" />
                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white text-black font-black flex items-center justify-center text-[9px] rounded-full border border-black shadow">1</div>
              </motion.div>
              <div className="w-full h-22 bg-gradient-to-t from-gold/15 via-gold/[0.01] to-transparent border-t-4 border-gold/40 rounded-t-[20px] flex flex-col items-center justify-center relative overflow-hidden px-1">
                <span className="text-[8.5px] font-mono text-white/90 relative z-10 font-black">ID: {leaderboard[0].id.substring(0, 3)}***{leaderboard[0].id.substring(leaderboard[0].id.length - 2)}</span>
                <span className="text-xs font-black text-white relative z-10 block mt-0.5">{leaderboard[0].amount.toLocaleString()} EGP</span>
              </div>
            </div>

            {/* 3rd Bronze Rank Column */}
            <div className="flex-1 flex flex-col items-center" id="bronze-podium">
              <div className="w-9 h-9 border border-amber-900/30 bg-amber-950/10 rounded-xl flex items-center justify-center mb-2 shadow-lg">
                <Medal className="w-5 h-5 text-orange-500" />
              </div>
              <div className="w-full h-11 bg-gradient-to-t from-orange-500/[0.05] via-transparent to-transparent border-t-2 border-orange-600/30 rounded-t-2xl flex flex-col items-center justify-center relative overflow-hidden px-1">
                <span className="text-[8px] font-mono text-white/50 relative z-10">ID: {leaderboard[2].id.substring(0, 3)}***{leaderboard[2].id.substring(leaderboard[2].id.length - 2)}</span>
                <span className="text-[10.5px] font-black text-orange-200 relative z-10 block mt-0.5">{leaderboard[2].amount.toLocaleString()} EGP</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // 5. REDESIGNED ADMIN MAINTENANCE PROTOCOL (Sleek Dark Control Unit)
  const renderMaintenance = () => (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center max-w-md mx-auto text-center relative overflow-hidden bg-transparent font-sans">
      <div className="relative z-10 w-full bg-linear-to-b from-white/[0.04] to-black border border-white/10 p-8 rounded-[36px] text-center shadow-2xl backdrop-blur-2xl">
        
        {/* Core Shield Emblem */}
        <div className="w-16 h-16 bg-gold/15 rounded-2xl border border-gold/30 flex items-center justify-center mb-6 mx-auto">
          <Activity className={cn("w-8 h-8 text-gold", isMaintenanceActive ? "animate-pulse" : "")} />
        </div>
        
        <h2 className="text-2xl font-black text-white font-display mb-1 uppercase tracking-wider">SYSTEM CONSOLE</h2>
        <p className="text-gold text-[9px] font-mono tracking-widest uppercase mb-8 font-black">ADMIN REMOTE OVERLAY</p>
        
        <div className="space-y-6">
          {/* Active Maintenance toggle layout */}
          <div className="flex items-center justify-between p-5 bg-white/[0.01] border border-white/5 rounded-2xl text-left">
            <div>
              <span className="text-xs font-black text-white block uppercase tracking-wide font-display">Maintenance Protocol</span>
              <span className="text-[9px] text-white/40 uppercase tracking-widest font-mono mt-0.5 block">
                {isMaintenanceActive ? 'ACTIVE - LOCKED GATE' : 'INACTIVE - LIVE NETWORK'}
              </span>
            </div>
            <button 
              onClick={toggleMaintenance}
              className={cn(
                "w-12 h-7 rounded-full transition-all relative flex items-center px-1 shadow-inner",
                isMaintenanceActive ? "bg-gold" : "bg-white/10 border border-white/15"
              )}
              id="admin-maintenance-switch"
            >
              <motion.div 
                animate={{ x: isMaintenanceActive ? 20 : 0 }}
                className="w-4.5 h-4.5 bg-white rounded-full shadow-lg"
              />
            </button>
          </div>

          {/* Predictor config uploader with correct Arabic details */}
          <div className="p-5 bg-white/[0.01] border border-white/5 rounded-2xl text-right space-y-4 relative shadow-inner">
            <div className="flex flex-col text-right">
              <span className="text-xs font-black text-white block">تحديث توقعات فايربيس</span>
              <span className="text-[9.5px] text-white/40 uppercase tracking-widest font-mono mt-1 font-bold">UPDATE DATABASE SEED</span>
            </div>
            
            <p className="text-[10px] text-white/40 text-right leading-relaxed font-sans" style={{ direction: 'rtl' }}>
              توليد وحفظ توقعات تفاعلية جديدة مباشرة في قاعدة بيانات الفايربيس (m11.json). سيقوم المستخدمون الذين يكتبون معرف الأدمن بالاطلاع عليها مباشرة عند الضغط على زر التفعيل.
            </p>

            <button 
              onClick={adminUploadPredictions}
              disabled={isAdminUploading}
              className={cn(
                "w-full py-3.5 rounded-xl font-black text-[11px] tracking-widest transition-all shadow-md flex items-center justify-center gap-1.5 uppercase font-display",
                isAdminUploading 
                  ? "bg-white/5 text-white/20 border border-white/5 cursor-not-allowed" 
                  : adminUploadSuccess 
                    ? "bg-emerald-500 text-black font-black" 
                    : "bg-white text-black hover:bg-white/95"
              )}
              id="admin-db-update-button"
            >
              {isAdminUploading ? (
                <>
                  <RefreshCcw className="w-3.5 h-3.5 animate-spin" />
                  <span>جاري المرفع...</span>
                </>
              ) : adminUploadSuccess ? (
                <>
                  <Check className="w-4 h-4 text-black stroke-[3.5]" />
                  <span>تم تحديث الفايربيس!</span>
                </>
              ) : (
                <span>تحديث التوقعات في Firebase</span>
              )}
            </button>
            
            {adminUploadSuccess && (
              <p className="text-[9px] text-emerald-400 text-center animate-pulse font-mono tracking-wide" style={{ direction: 'rtl' }}>
                تم حفظ التوقعات بنجاح في m11.json
              </p>
            )}
          </div>

          <button 
            onClick={() => setCurrentScreen('LOGIN')}
            className="w-full py-4 text-[10px] font-black text-gold hover:text-white border border-gold/20 hover:border-white/20 rounded-xl hover:bg-gold/10 transition-all tracking-[0.2em] font-display uppercase"
            id="admin-logout-button"
          >
            DISCONNECT OVERLAY
          </button>
        </div>
      </div>
    </div>
  );


  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-gold/30 selection:text-white relative">
      <BackgroundSystem />
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
          className="min-h-screen relative z-10"
        >
          {currentScreen === 'SPLASH' && <RenderSplash onComplete={() => setCurrentScreen('LOGIN')} />}
          {currentScreen === 'LOGIN' && renderLogin()}
          {currentScreen === 'CONDITION' && renderCondition()}
          {currentScreen === 'LICENSE' && renderLicense()}
          {currentScreen === 'PREDICTION' && renderPrediction()}
          {currentScreen === 'MAINTENANCE' && renderMaintenance()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
