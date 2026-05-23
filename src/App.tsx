/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useMemo, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck,
  User, 
  Lock, 
  Copy, 
  Check, 
  Download, 
  Upload, 
  ArrowRight, 
  Activity,
  History,
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
  Smartphone
} from 'lucide-react';
import { cn } from './lib/utils';

// Types
type Screen = 'SPLASH' | 'LOGIN' | 'CONDITION' | 'LICENSE' | 'PREDICTION' | 'MAINTENANCE';

interface Winner {
  id: string;
  userId: string;
  amount: number;
}

// Constant Data
const LOGO_DRAGON_PATH = "M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z"; 

// Components
const BackgroundVideo = () => (
  <div className="absolute inset-0 z-0 overflow-hidden">
    <video
      autoPlay
      loop
      muted
      playsInline
      className="absolute top-1/2 left-1/2 min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover opacity-90"
    >
      <source src="https://www.image2url.com/r2/default/videos/1779363577381-857ef662-4831-4d01-9710-4a13a1473c16.mp4" type="video/mp4" />
    </video>
    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
    <div className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-black" />
  </div>
);

const Logo = ({ className }: { className?: string }) => (
  <div className={cn("relative flex items-center justify-center", className)}>
    <motion.div
      animate={{ 
        scale: [1, 1.05, 1],
        rotate: [0, 2, -2, 0]
      }}
      transition={{ 
        duration: 4, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
      className="relative z-10"
    >
      <div className="relative w-20 h-20 rounded-3xl overflow-hidden border-2 border-gold/40 shadow-2xl shadow-gold/20">
        <img 
          src="https://i.postimg.cc/L5fyQV5y/IMG-3526.jpg" 
          alt="Dragon VIP Logo" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
    </motion.div>
    {/* Glow effect */}
    <div className="absolute -inset-4 bg-gold/15 blur-2xl rounded-full opacity-50" />
  </div>
);

interface RenderSplashProps {
  onComplete: () => void;
}

const RenderSplash = ({ onComplete }: RenderSplashProps) => {
  const [progress, setProgress] = useState(0);
  const [bootStep, setBootStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const jump = Math.floor(Math.random() * 8) + 4; // realistic ticks
        return Math.min(100, prev + jump);
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress < 30) setBootStep(0);
    else if (progress < 60) setBootStep(1);
    else if (progress < 90) setBootStep(2);
    else setBootStep(3);
  }, [progress]);

  useEffect(() => {
    if (progress >= 100) {
      const delay = setTimeout(() => {
        onComplete();
      }, 600);
      return () => clearTimeout(delay);
    }
  }, [progress, onComplete]);

  const bootMessages = [
    "ESTABLISHING SECURE COGNITIVE BRIDGE...",
    "TUNING NEURAL NETWORKS...",
    "INJECTING CHRONO-ODDS PREDICTION LAYERS...",
    "FIREWALL ENGAGED. SYSTEM FULLY OPERATIONAL."
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-black relative overflow-hidden font-sans select-none">
      {/* Cinematic Video Background Layer */}
      <BackgroundVideo />

      {/* Ambient Pulsing Gold Light Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.12)_0%,transparent_70%)] animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.08)_0%,transparent_70%)] pointer-events-none" />

      {/* Cyberpunk Decorative Corner Frame Accents */}
      <div className="absolute inset-8 border border-white/[0.02] pointer-events-none rounded-[2rem]">
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-gold/30 rounded-tl-xl" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-gold/30 rounded-tr-xl" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-gold/30 rounded-bl-xl" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-gold/30 rounded-br-xl" />
      </div>

      {/* Core Loading Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center max-w-sm w-full"
      >
        {/* Futuristic Double Concentric Rings + Logo Frame */}
        <div className="relative mb-12">
          {/* Outer Slow Rotating Dotted Ring */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            className="absolute -inset-8 rounded-full border border-dashed border-gold/20"
          />
          {/* Inner Fast Rotating Segment Ring */}
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            className="absolute -inset-4 rounded-full border-2 border-t-gold/40 border-r-transparent border-b-gold/10 border-l-transparent"
          />
          {/* Main Logo Container */}
          <Logo className="scale-110 relative z-20" />
          
          {/* Mini Premium Identity Seal top-right of the logo */}
          <div className="absolute -top-3 -right-3 z-30 bg-black/80 border border-gold/40 rounded-full py-0.5 px-2 flex items-center gap-1 shadow-lg shadow-black/80">
            <ShieldCheck className="w-2.5 h-2.5 text-gold" strokeWidth={3} />
            <span className="text-[7px] font-mono tracking-widest text-gold font-black">SECURE</span>
          </div>
        </div>

        {/* Premium Branding Interface */}
        <div className="text-center space-y-3 mb-10">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-gray-600 font-mono text-[9px] tracking-widest">[</span>
            <motion.span 
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-gold font-mono text-[8.5px] tracking-[0.45em] font-black uppercase"
            >
              ALGORITHM ENGINE ACTIVE
            </motion.span>
            <span className="text-gray-600 font-mono text-[9px] tracking-widest">]</span>
          </div>

          <div className="flex flex-col select-none">
            <h1 className="text-5xl font-display font-black tracking-[0.16em] gold-text-gradient drop-shadow-[0_0_35px_rgba(255,215,0,0.45)] leading-tight">
              DRAGON
            </h1>
            <div className="flex items-center justify-center gap-2 mt-px">
              <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-gold/40" />
              <span className="text-sm font-mono tracking-[0.6em] text-white/90 font-black pl-[0.6em]">VIP</span>
              <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-gold/40" />
            </div>
          </div>
        </div>

        {/* Boot telemetry checklist display (Fades items in as bootStep rises) */}
        <div className="w-full bg-white/[0.02] border border-white/5 rounded-2xl p-4 mb-8 space-y-2.5 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between text-[8px] font-mono tracking-wider font-bold">
            <span className="text-gray-500">BOOT SEQUENCE COMPLIANCE</span>
            <span className="text-gold-muted uppercase">{progress}% INTEGRATED</span>
          </div>
          
          <div className="h-[1px] bg-white/5 w-full" />

          <div className="space-y-1.5 text-left font-mono">
            <div className="flex items-center justify-between">
              <span className="text-[9px] text-gray-400 flex items-center gap-1.5">
                <span className={`w-1 h-1 rounded-full ${progress >= 30 ? 'bg-gold animate-ping' : 'bg-white/10'}`} />
                SHIELD PROTOCOL VERIFICATION
              </span>
              <span className={`text-[8px] font-black ${progress >= 30 ? 'text-gold' : 'text-white/20'}`}>
                {progress >= 30 ? "PASSED" : "PENDING"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[9px] text-gray-400 flex items-center gap-1.5">
                <span className={`w-1 h-1 rounded-full ${progress >= 60 ? 'bg-gold animate-ping' : 'bg-white/10'}`} />
                NEURAL OPTIMIZER ENGINE
              </span>
              <span className={`text-[8px] font-black ${progress >= 60 ? 'text-gold' : 'text-white/20'}`}>
                {progress >= 60 ? "ENABLED" : "PENDING"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[9px] text-gray-400 flex items-center gap-1.5">
                <span className={`w-1 h-1 rounded-full ${progress >= 90 ? 'bg-gold animate-ping' : 'bg-white/10'}`} />
                CHRONO-ODDS ALGORITHMS
              </span>
              <span className={`text-[8px] font-black ${progress >= 90 ? 'text-gold' : 'text-white/20'}`}>
                {progress >= 90 ? "CALIBRATED" : "PENDING"}
              </span>
            </div>
          </div>
        </div>

        {/* Luxury Floating Loading Bar Container */}
        <div className="w-full space-y-3">
          <div className="flex justify-between items-center text-[10px] font-mono tracking-widest px-1 font-bold">
            <motion.span 
              key={bootStep}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-gold-muted text-[8px] text-left max-w-[80%] whitespace-nowrap overflow-hidden text-ellipsis uppercase"
            >
              {bootMessages[bootStep]}
            </motion.span>
            <span className="text-gold font-black tabular-nums transition-all text-sm">{progress}%</span>
          </div>

          {/* Custom Glowing Loading Bar */}
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden relative border border-white/5">
            <div 
              style={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-gold/50 via-gold to-gold-bright transition-all duration-100 ease-out relative rounded-full"
            >
              {/* Visual light shine effect inside the progress */}
              <div className="absolute inset-0 animate-shimmer bg-linear-to-r from-transparent via-white/50 to-transparent bg-[length:200%_100%]" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gold-bright blur-sm" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Global Infrastructure Telemetry Signature on Footer */}
      <div className="absolute bottom-6 flex flex-col items-center text-[8px] text-gray-600 font-mono tracking-widest gap-1">
        <span>DRAGON VIP CLOUD TERMINAL v12.4</span>
        <span className="opacity-45">ENHANCED DECRYPTION PROTOCOL ACTIVE</span>
      </div>
    </div>
  );
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('SPLASH');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

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
  const [isMaintenanceActive, setIsMaintenanceActive] = useState(false);
  const [licenseKey, setLicenseKey] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [leaderboard, setLeaderboard] = useState<{id: string, amount: number}[]>([
    { id: "19877422031", amount: 45200 },
    { id: "8823199401", amount: 12450 },
    { id: "44100293812", amount: 8900 }
  ]);
  const [predictionResult, setPredictionResult] = useState<number | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [oddIndex, setOddIndex] = useState(0);
  const [predictionSignals, setPredictionSignals] = useState<('HEALTHY' | 'ROTTEN' | 'EMPTY')[]>([]);

  const PREDEFINED_ODDS = [1.23, 1.54, 1.93, 2.41, 4.02, 6.71, 11.18, 27.96, 69.91, 349.54];

  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds

  // Maintenance State Sync
  useEffect(() => {
    const fetchMaintenanceStatus = async () => {
      try {
        const response = await fetch("https://evoioi-default-rtdb.europe-west1.firebasedatabase.app/maintenance.json");
        const data = await response.json();
        if (data !== null) {
          setIsMaintenanceActive(!!data);
        }
      } catch (error) {
        console.error("Error fetching maintenance status:", error);
      }
    };
    
    fetchMaintenanceStatus();
    const interval = setInterval(fetchMaintenanceStatus, 5000); // Check every 5s for responsiveness
    return () => clearInterval(interval);
  }, []);

  const toggleMaintenance = async () => {
    const newVal = !isMaintenanceActive;
    try {
      await fetch("https://evoioi-default-rtdb.europe-west1.firebasedatabase.app/maintenance.json", {
        method: "PUT",
        body: JSON.stringify(newVal),
        headers: { "Content-Type": "application/json" }
      });
      setIsMaintenanceActive(newVal);
    } catch (error) {
      console.error("Error updating maintenance:", error);
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
        id: Math.random().toString(36).substr(2, 9),
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
    
    // Fetch predictions from Firebase for all active logged-in sessions
    if (userId) {
      try {
        const response = await fetch("https://evoioi-default-rtdb.europe-west1.firebasedatabase.app/m11.json");
        const data = await response.json();
        
        if (data) {
          const currentOdd = PREDEFINED_ODDS[oddIndex % PREDEFINED_ODDS.length];
          setPredictionResult(currentOdd);
          
          // Calculate the range of keys to use from the database
          // index 0 -> m1-m5, index 1 -> m6-m10, etc.
          const k = oddIndex % PREDEFINED_ODDS.length;
          const signals: ('HEALTHY' | 'ROTTEN' | 'EMPTY')[] = [];
          
          for (let j = 1; j <= 5; j++) {
            const key = `m${(k * 5) + j}`;
            const rawVal = data[key];
            let val = "1";
            
            if (rawVal !== undefined && rawVal !== null) {
              if (typeof rawVal === 'object' && rawVal[key] !== undefined) {
                val = String(rawVal[key]);
              } else {
                val = String(rawVal);
              }
            }
            
            // "0" represents HEALTHY (SAFE), "1" represents ROTTEN (DANGER)
            signals.push(val === "0" ? 'HEALTHY' : 'ROTTEN');
          }
          
          setPredictionSignals(signals);
          setOddIndex(prev => prev + 1);
          setIsPredicting(false);
          return;
        }
      } catch (error) {
        console.error("Firebase fetch error:", error);
        // Fallback to random logic on error
      }
    }

    setTimeout(() => {
      // Use the odd at the current index, loop back if we exceed the length
      const currentOdd = PREDEFINED_ODDS[oddIndex % PREDEFINED_ODDS.length];
      setPredictionResult(currentOdd);
      setOddIndex(prev => prev + 1);
      
      // Determine healthy count based on odd
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

      // Generate signal array (5 cells total)
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

    // Reset Firebase Database values for active testing session
    if (userId) {
      try {
        const newData: Record<string, Record<string, string>> = {};
        
        // Define rows and their rotten counts
        const rows = [
          { start: 1, end: 20, rottenCount: 1 }, // Rows 1-4 (m1-m20)
          { start: 21, end: 35, rottenCount: 2 }, // Rows 5-7 (m21-m35)
          { start: 36, end: 45, rottenCount: 3 }, // Rows 8-9 (m36-m40, m41-m45)
          { start: 46, end: 50, rottenCount: 4 }  // Row 10 (m46-m50)
        ];

        rows.forEach(config => {
          for (let i = config.start; i <= config.end; i += 5) {
            // Each row has 5 items
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
        
        console.log("Firebase data reset successfully");
      } catch (error) {
        console.error("Firebase reset error:", error);
      }
    }
  };




  const renderLogin = () => (
    <div className="flex flex-col h-screen h-[100dvh] p-5 max-w-md mx-auto relative overflow-hidden bg-black font-sans select-none justify-between">
      <BackgroundVideo />
      
      {/* Absolute Ambient Soft Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      {/* Luxury Minimal Header */}
      <div className="flex justify-between items-center relative z-10 px-1 mt-1">
        <div className="flex items-center space-x-2 bg-black/40 backdrop-blur-md py-1 px-3 rounded-full border border-white/[0.04]">
          <span className="w-1.5 h-1.5 rounded-full bg-gold/85 animate-pulse" />
          <motion.span 
            key={onlineUsers}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[9px] font-mono font-bold text-gold-muted uppercase tracking-wider"
          >
            LIVE_ROOM: {onlineUsers.toLocaleString()}
          </motion.span>
        </div>
        
        <div className="flex items-center space-x-2 bg-black/40 backdrop-blur-md py-1 px-3 rounded-full border border-white/[0.04]">
          <ShieldCheck className="w-3 h-3 text-gold-muted" />
          <span className="text-[8px] font-mono font-black text-gray-400 uppercase tracking-widest">SECURE PORTAL</span>
        </div>
      </div>

      {/* Center Body - containing logo, branding, and glass card */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full px-1 my-auto max-h-[62%] sm:max-h-[68%]">
        {/* Logo and Premium Branding Column */}
        <div className="text-center space-y-2.5 mb-5 sm:mb-6">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gold/10 rounded-full blur-xl scale-125 animate-pulse" />
            <Logo className="scale-75 sm:scale-85 relative z-10" />
          </div>
          
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-display font-black tracking-[0.2em] gold-text-gradient uppercase leading-none">
              DRAGON ACCESS
            </h2>
            <p className="text-gray-500 text-[8px] sm:text-[9px] uppercase tracking-[0.3em] font-medium max-w-xs mx-auto">
              ENTER PRIVATE SECURITY DECRYPT KEY
            </p>
          </div>
        </div>

        {/* Quiet Luxury Glass Input Card */}
        <div className="w-full bg-white/[0.02] border border-white/10 rounded-[2rem] p-5 sm:p-7 space-y-5 sm:space-y-6 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.8)] backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
          
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-[8px] sm:text-[9px] font-mono uppercase tracking-[0.2em] text-gold-muted font-bold">
                ACCESS PASSWORD
              </label>
              <span className="text-[7px] sm:text-[8px] font-mono text-gray-500 uppercase tracking-wider">REQUIRED</span>
            </div>
            
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 p-1 bg-black/40 border border-white/5 rounded-lg text-gold-muted">
                <Lock className="w-3 h-3" />
              </div>
              <input 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="PRO-DECRYPT-KEY"
                className="w-full bg-black/60 border border-white/10 rounded-xl py-3 pl-11 pr-10 text-gold font-mono text-xs placeholder:text-gray-700 focus:outline-none focus:border-gold/40 focus:bg-black/80 transition-all font-bold tracking-widest text-[11px]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-gold transition-colors focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="w-3.5 h-3.5" />
                ) : (
                  <Eye className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleLogin}
            className="w-full py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-gold/90 via-gold to-gold-bright text-black font-black text-xs tracking-[0.15em] shadow-lg shadow-gold/10 hover:shadow-gold/25 transition-all flex items-center justify-center space-x-2 animate-shimmer bg-[length:200%_100%]"
          >
            <span>DECRYPT AND ENTER</span>
            <ArrowRight className="w-3 h-3" strokeWidth={2.5} />
          </motion.button>
        </div>
      </div>

      {/* Minimal Quiet Luxury Social and Password Access Links */}
      <div className="mt-4 sm:mt-6 text-center space-y-4 sm:space-y-5 w-full relative z-10 pb-2">
        <div className="space-y-1">
          <p className="text-gray-650 text-[10px] font-medium text-gray-500">Do not possess an active authorization key?</p>
          <button 
            onClick={() => setCurrentScreen('CONDITION')}
            className="text-gold font-bold text-[10px] sm:text-xs uppercase tracking-widest hover:text-gold-bright transition-colors border-b border-gold/20 pb-0.5 hover:border-gold/60 transition-all font-mono"
          >
            Request Password Access
          </button>
        </div>

        {/* Dynamic Android PWA Installer Section */}
        <div className="pt-2">
          {isInstallable ? (
            <div className="bg-white/[0.02] border border-white/10 p-3 sm:p-4 rounded-2xl flex items-center justify-between gap-3 text-left">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-white tracking-widest">تحميل تطبيق الاندرويد</span>
                  <span className="text-[8px] text-gray-500 font-mono font-medium">DRAGON VIP FOR ANDROID</span>
                </div>
              </div>
              <button 
                onClick={installApp}
                className="px-4 py-2 bg-emerald-500 text-black font-black text-[9px] uppercase tracking-widest rounded-xl hover:bg-emerald-400 active:scale-95 transition-all shadow-[0_4px_12px_rgba(16,185,129,0.3)]"
              >
                تثبيت
              </button>
            </div>
          ) : (
            <div className="bg-white/[0.01] border border-white/5 p-3 rounded-2xl flex items-center justify-between gap-3 text-left">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/50">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-medium text-white/95">تثبيت التطبيق على هاتفك</span>
                  <span className="text-[8px] text-gray-500 font-mono font-medium">انقر على خيارات المتصفح ثم تثبيت</span>
                </div>
              </div>
              <button 
                onClick={() => {
                  alert("لتثبيت تطبيق Dragon VIP على الأندرويد:\n1. من داخل متصفح كروم، اضغط على زر الخيارات (3 نقاط بالزاوية)\n2. اختر 'إضافة للشاشة الرئيسية' أو 'تثبيت التطبيق'.\nسيظهر التطبيق كأيقونة مستقلة سريعة على هاتفك!");
                }}
                className="px-3 py-1.5 bg-white/10 text-white font-black text-[8px] uppercase tracking-widest rounded-xl hover:bg-white/15 active:scale-95 transition-all border border-white/10"
              >
                تعليمات
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-4 pt-4 border-t border-white/[0.04] w-full">
          <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest">Connect Channels</span>
          <div className="h-[1px] bg-gradient-to-r from-white/[0.05] to-transparent flex-1" />
          <div className="flex items-center gap-2">
            <motion.a 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://t.me/THEAGLE2" 
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-white/[0.02] rounded-xl border border-white/5 text-gold-muted hover:border-gold/30 hover:bg-gold/5 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
            </motion.a>
            <motion.a 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://youtube.com/@dragon-p8k6q?si=OjKe5BmJbxCnTZx7" 
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-white/[0.02] rounded-xl border border-white/5 text-gold-muted hover:border-gold/30 hover:bg-gold/5 transition-all"
            >
              <Youtube className="w-3.5 h-3.5" />
            </motion.a>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showWelcome && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full glass-card p-8 rounded-[32px] text-center border-gold/40"
            >
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-gold" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Welcome Back</h3>
              <p className="text-gold-muted mb-4 uppercase tracking-tighter font-mono">User ID: {userId || '778899'}</p>
              
              <div className="bg-white/5 p-4 rounded-2xl mb-8 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Access Type</span>
                  <span className="text-gold font-bold">PREMIUM VIP</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Remaining Time</span>
                  <span className="text-lg font-mono text-gold-bright">00:29:59</span>
                </div>
              </div>

              <button 
                onClick={() => setCurrentScreen('PREDICTION')}
                className="w-full bg-gold py-4 rounded-2xl font-bold text-black"
              >
                PROCEED TO PANEL
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );

  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<{ deposit: string | null; promo: string | null }>({
    deposit: null,
    promo: null
  });

  // Action Helpers
  const handlePlatformSelect = (platform: string) => {
    setSelectedPlatform(platform);
    setShowConnectionModal(true);
    setTimeout(() => setShowConnectionModal(false), 2000);
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

  const renderCondition = () => (
    <div className="min-h-screen p-6 pb-12 max-w-md mx-auto relative overflow-hidden bg-black">
      <BackgroundVideo />
      <div className="relative z-10">
        <div className="flex items-center space-x-4 mb-8">
        <button onClick={() => setCurrentScreen('LOGIN')} className="p-2 glass-card rounded-full">
          <RefreshCcw className="w-4 h-4 text-white rotate-180" />
        </button>
        <h2 className="text-xl font-bold text-white">Activation Flow</h2>
      </div>

      <div className="space-y-8">
      {/* Step 1 */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <span className="text-[12px] font-bold text-white">01</span>
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-white/80">Select Platform</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {['1xbet', 'MELBET'].map(platform => (
              <button 
                key={platform} 
                onClick={() => handlePlatformSelect(platform)}
                className={cn(
                  "p-4 glass-card rounded-2xl flex items-center justify-between transition-all duration-500 relative overflow-hidden group",
                  selectedPlatform === platform ? "border-white bg-white/15 shadow-[0_0_15px_rgba(255,255,255,0.15)]" : "border-white/10 hover:border-white/30 bg-white/5"
                )}
              >
                <div className="flex flex-col items-start">
                  <span className={cn("font-bold text-sm tracking-tight", selectedPlatform === platform ? "text-white" : "text-white/60")}>
                    {platform.toUpperCase()}
                  </span>
                  <span className="text-[8px] text-white/50 uppercase tracking-widest mt-0.5">Verified</span>
                </div>
                <div className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300", 
                  selectedPlatform === platform ? "bg-white scale-125 shadow-[0_0_10px_rgba(255,255,255,0.8)]" : "bg-white/10"
                )} />
                {selectedPlatform === platform && (
                  <motion.div 
                    layoutId="platform-glow"
                    className="absolute inset-0 bg-white/5 blur-xl pointer-events-none"
                  />
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
                show: {
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
              className="space-y-6"
            >
              {/* Step 2: Telegram */}
              <motion.div 
                variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } }}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                    <span className="text-[12px] font-bold text-white">02</span>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-white/80">Join Community</span>
                </div>
                <a 
                  href="https://t.me/THEAGLE2" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-4 glass-card rounded-2xl flex items-center justify-between border-white/10 group hover:border-white/40 transition-all hover:bg-white/5 active:scale-[0.98]"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2.5 bg-white/10 rounded-xl border border-white/20">
                      <Send className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-white">Subscribe on Telegram</span>
                      <span className="text-[9px] text-white/70 font-bold tracking-widest uppercase">@THEAGLE2</span>
                    </div>
                  </div>
                  <div className="text-[10px] font-bold text-white border border-white/30 px-4 py-1.5 rounded-full group-hover:bg-white group-hover:text-black transition-all shadow-lg shadow-white/5">
                    JOIN
                  </div>
                </a>
              </motion.div>

              {/* Step 3: YouTube */}
              <motion.div 
                variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } }}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                    <span className="text-[12px] font-bold text-white">03</span>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-white/80">Watch & Learn</span>
                </div>
                <div className="space-y-3">
                  <a 
                    href="https://youtube.com/@dragon-p8k6q?si=OjKe5BmJbxCnTZx7" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-4 glass-card rounded-2xl flex items-center justify-between border-white/10 group hover:border-white/40 transition-all hover:bg-white/5 active:scale-[0.98]"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2.5 bg-white/10 rounded-xl border border-white/20">
                        <Youtube className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-white">Subscribe on YouTube</span>
                        <span className="text-[9px] text-white/70 font-bold tracking-widest uppercase">@dragon-p8k6q</span>
                      </div>
                    </div>
                    <div className="text-[10px] font-bold text-white border border-white/30 px-4 py-1.5 rounded-full group-hover:bg-white group-hover:text-black transition-all shadow-lg shadow-white/5">
                      WATCH
                    </div>
                  </a>
                  
                  {/* YouTube Video Link Placeholder */}
                  <a 
                    href="https://youtu.be/aQAoaKkU0x0?si=EeulaIAis1TZkGxp" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="relative aspect-video rounded-3xl overflow-hidden border border-white/20 shadow-2xl shadow-white/5 block group/video transition-transform hover:scale-[1.02]"
                  >
                    <img 
                      src="https://img.youtube.com/vi/aQAoaKkU0x0/maxresdefault.jpg" 
                      alt="Video Thumbnail" 
                      className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3">
                      <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-black scale-100 group-hover:scale-110 transition-transform shadow-xl">
                        <Play className="w-7 h-7 ml-1 fill-black text-black" />
                      </div>
                      <span className="text-white font-bold text-[10px] tracking-[0.2em] uppercase bg-black/60 px-5 py-2.5 rounded-xl border border-white/10 backdrop-blur-md">
                        Open Tutorial Video
                      </span>
                    </div>
                  </a>
                </div>
              </motion.div>

              {/* Step 4 */}
              <motion.div 
                variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } }}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                    <span className="text-[12px] font-bold text-white">04</span>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-white/80">Install Platform</span>
                </div>
                <a 
                  href={selectedPlatform?.toUpperCase() === 'MELBET' ? "https://melbetegypt.com/ar/mobile#ios" : "https://eg-1xbet.com/ar/mobile"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-5 glass-card rounded-2xl flex items-center justify-between border-white/10 group hover:border-white/40 transition-all hover:bg-white/5 cursor-pointer active:scale-[0.98] block"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
                      <Download className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-sm font-medium text-white/90">
                      Download <span className="text-white font-bold">{selectedPlatform}</span> Official APK
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />
                </a>
              </motion.div>

              {/* Step 5 */}
              <motion.div 
                variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } }}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                    <span className="text-[12px] font-bold text-white">05</span>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-white/80">Security Access</span>
                </div>
                <div className="relative p-5 glass-card rounded-2xl flex items-center justify-between border-dashed border-white/30 overflow-hidden bg-white/[0.02]">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    <span className="font-mono text-xl font-black text-white tracking-tighter">
                      {selectedPlatform?.toUpperCase() === 'MELBET' ? 'TOO3' : 'A77N'}
                    </span>
                  </div>
                  <button 
                    onClick={handleCopyCode} 
                    className="flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-xl hover:bg-white/20 active:scale-90 transition-all text-white border border-white/20"
                  >
                    <Copy className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Copy</span>
                  </button>
                  <AnimatePresence>
                    {showCopyToast && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-white backdrop-blur-sm flex items-center justify-center"
                      >
                        <span className="text-black font-black text-xs uppercase tracking-[0.2em]">Promo Copied!</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Step 6 */}
              <motion.div 
                variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } }}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                    <span className="text-[12px] font-bold text-white">06</span>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-white/80">Account Requirement</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 glass-card rounded-2xl border-white/20 bg-white/5 flex flex-col items-center">
                    <span className="text-[8px] text-white/50 uppercase tracking-widest mb-1 font-black">Min Deposit</span>
                    <span className="font-bold text-white text-lg">300 EGP</span>
                  </div>
                  <div className="p-4 glass-card rounded-2xl border-white/20 bg-white/5 flex flex-col items-center">
                    <span className="text-[8px] text-white/50 uppercase tracking-widest mb-1 font-black">International</span>
                    <span className="font-bold text-white text-lg">$5.00 USD</span>
                  </div>
                </div>
              </motion.div>

              {/* Step 7 */}
              <motion.div 
                variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } }}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                    <span className="text-[12px] font-bold text-white">07</span>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-white/80">Identity Linking</span>
                </div>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 group-focus-within:text-white transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Enter your Player ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:border-white/40 focus:bg-white/[0.07] transition-all placeholder:text-gray-605"
                  />
                </div>
              </motion.div>

              {/* Step 8 */}
              <motion.div 
                variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } }}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                    <span className="text-[12px] font-bold text-white">08</span>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-white/80">Proof Verification</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { type: 'deposit', label: 'DEPOSIT SCREEN' },
                    { type: 'promo', label: 'PROMO SCREEN' }
                  ].map(upload => (
                    <label key={upload.type} className="p-6 glass-card border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-center space-y-3 cursor-pointer hover:bg-white/10 hover:border-white/30 transition-all relative overflow-hidden group">
                      <input type="file" className="hidden" onChange={(e) => handleFileUpload(upload.type as 'deposit' | 'promo', e)} />
                      {uploadedImages[upload.type as 'deposit' | 'promo'] ? (
                        <div className="absolute inset-0">
                          <img src={uploadedImages[upload.type as 'deposit' | 'promo']!} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />
                        </div>
                      ) : (
                        <div className="p-3 bg-white/10 rounded-2xl group-hover:scale-110 transition-transform">
                          <Upload className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <div className="relative z-10 flex flex-col items-center">
                        <span className="text-[8px] font-black tracking-[0.2em] text-white/70 uppercase">
                          {uploadedImages[upload.type as 'deposit' | 'promo'] ? 'CHANGE FILE' : upload.label}
                        </span>
                        {uploadedImages[upload.type as 'deposit' | 'promo'] && (
                          <div className="mt-1 flex items-center space-x-1">
                            <Check className="w-3 h-3 text-green-500" />
                            <span className="text-[8px] text-green-500 font-bold uppercase">Ready</span>
                          </div>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </motion.div>


              <motion.button 
                variants={{ hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1 } }}
                onClick={handleVerification}
                disabled={!userId || !uploadedImages.deposit || !uploadedImages.promo}
                className={cn(
                  "w-full py-5 rounded-3xl font-bold transition-all mt-8",
                  (userId && uploadedImages.deposit && uploadedImages.promo) ? "bg-white text-black hover:bg-white/90 shadow-[0_4px_25px_rgba(255,255,255,0.25)]" : "bg-white/10 text-white/30 cursor-not-allowed"
                )}
              >
                SUBMIT VERIFICATION
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Popups & Modals */}
      <AnimatePresence>
        {showConnectionModal && (
          <div className="fixed top-12 left-0 right-0 z-[60] flex justify-center px-6 pointer-events-none">
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="bg-black/90 border border-white/30 py-3 px-6 rounded-2xl flex items-center space-x-4 backdrop-blur-xl shadow-lg"
            >
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                <Activity className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div>
                <h3 className="text-white font-bold uppercase tracking-wider text-[10px]">Server Connected</h3>
                <p className="text-white/60 text-[9px] uppercase tracking-tighter font-mono">LINKED TO {selectedPlatform?.toUpperCase()}</p>
              </div>
            </motion.div>
          </div>
        )}

        {isVerifying && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="mb-8"
            >
              <Logo className="scale-125" />
            </motion.div>
            <motion.p 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-white font-display text-xl tracking-widest"
            >
              VERIFYING...
            </motion.p>
          </div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );

  const renderLicense = () => (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center max-w-md mx-auto text-center scale-95 origin-center relative overflow-hidden bg-black">
      <BackgroundVideo />
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-14 h-14 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
        <Check className="w-7 h-7 text-green-500" />
      </div>
      <h2 className="text-xl font-bold text-white mb-1">Activation Success</h2>
      <p className="text-gray-400 text-xs mb-8">Your personal license key has been generated</p>

      <div className="w-full glass-card p-4 rounded-2xl border-gold/40 mb-8 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gold/5 blur-xl group-hover:bg-gold/10 transition-colors" />
        <div className="relative flex items-center justify-between">
          <span className="font-mono text-base font-bold tracking-wider gold-text-gradient">{licenseKey}</span>
          <button className="p-2 bg-gold/10 rounded-xl hover:bg-gold/20">
            <Copy className="w-4 h-4 text-gold" />
          </button>
        </div>
      </div>

      {/* Countdown Timer */}
      <div className="mb-8 relative scale-75">
        <svg className="w-40 h-40 -rotate-90">
          <circle 
            cx="80" cy="80" r="72" 
            stroke="rgba(255, 52, 52, 0.1)" 
            strokeWidth="6" fill="none" 
          />
          <motion.circle 
            cx="80" cy="80" r="72" 
            stroke="#FF3434" 
            strokeWidth="6" fill="none"
            strokeDasharray="452"
            initial={{ strokeDashoffset: 452 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 1800, ease: "linear" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-mono font-bold text-white">30:00</span>
          <span className="text-[8px] text-gold-muted uppercase tracking-widest font-bold">Time Left</span>
        </div>
      </div>

      <button 
        onClick={() => {
          setPassword(licenseKey);
          setCurrentScreen('LOGIN');
        }}
        className="w-full py-4 gold-gradient rounded-2xl text-black font-bold gold-glow-strong text-sm"
      >
        PROCEED TO LOGIN
      </button>
      </div>
    </div>
  );

  const renderPrediction = () => (
    <div className="min-h-screen flex flex-col bg-black overflow-hidden max-w-lg mx-auto border-x border-white/5 relative">
      <BackgroundVideo />
      
      <AnimatePresence>
        {isMaintenanceActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl"
          >
            <div className="w-full max-w-xs glass-card p-10 rounded-[3rem] border-gold/40 text-center gold-glow space-y-6">
              <div className="w-16 h-16 bg-gold/20 rounded-2xl flex items-center justify-center mx-auto border border-gold/30">
                <Info className="w-8 h-8 text-gold animate-bounce" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-white tracking-tighter uppercase">Under Maintenance</h3>
                <p className="text-xs text-gray-400 tracking-wide leading-relaxed">
                  The Dragon algorithm is being updated. We'll be back shortly with improved odds precision.
                </p>
              </div>
              <div className="pt-4">
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ x: [-100, 300] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-1/2 h-full bg-gold gold-glow"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Bar */}
      <div className="p-5 flex justify-between items-center bg-black/70 backdrop-blur-2xl border-b border-white/[0.06] relative z-10 shadow-[0_5px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center space-x-3">
          <div className="relative group">
            <div className="absolute inset-0 bg-white/20 rounded-xl blur-md group-hover:scale-110 transition-transform" />
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/30 via-black to-black border border-white/40 flex items-center justify-center overflow-hidden relative z-10 shadow-lg">
              <img 
                src={`https://api.dicebear.com/7.x/bottts/svg?seed=${userId || '778899_PRO'}&backgroundColor=ff3434&fontFamily=monospace`}
                alt="VIP Badge"
                className="w-8 h-8 opacity-95 transition-transform group-hover:rotate-12 duration-300"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-black rounded-full flex items-center justify-center z-20">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h1 className="text-[11px] font-display font-black tracking-widest text-white uppercase leading-none">DRAGON VIP</h1>
              <span className="px-1 py-0.2 text-[6px] font-mono font-bold bg-white/10 text-white rounded-xs border border-white/20">PRO</span>
            </div>
            <p className="text-[9px] text-gray-300 font-mono tracking-wider mt-1">ID: {userId || 'GUEST_77889'}</p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
          <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/5 shadow-inner">
            <span className="text-[9px] font-mono text-white font-bold uppercase tracking-wider">LIVE: {onlineUsers.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Luminous Countdown Timer */}
      <div className="flex items-center justify-center space-x-5 py-5 bg-gradient-to-b from-white/[0.04] to-transparent mt-1 relative z-10">
        {[
          { label: 'Hours', value: h, desc: 'HR' },
          { label: 'Mins', value: m, desc: 'MIN' },
          { label: 'Secs', value: s, desc: 'SEC' }
        ].map((unit, idx) => (
          <div key={unit.label} className="flex flex-col items-center">
            <motion.div 
              animate={{ 
                boxShadow: ["0 0 12px rgba(255,255,255,0.05)", "0 0 25px rgba(255,255,255,0.15)", "0 0 12px rgba(255,255,255,0.05)"]
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-15 h-15 rounded-2xl border border-white/30 flex items-center justify-center bg-radial from-white/10 via-black to-black relative overflow-hidden group shadow-[0_4px_20px_rgba(0,0,0,0.6)]"
            >
              <div className="absolute top-0.5 right-1 text-[6px] font-mono text-white/50">{unit.desc}</div>
              <div className="absolute bottom-1 w-full flex justify-center space-x-0.5 opacity-30">
                <span className="w-1 h-0.5 bg-white rounded-full" />
                <span className="w-2 h-0.5 bg-white rounded-full" />
                <span className="w-1 h-0.5 bg-white rounded-full" />
              </div>

              <span className="text-2xl font-mono font-black text-white relative z-10 tracking-tighter duration-300 group-hover:scale-105">{unit.value}</span>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)]" />
            </motion.div>
            <span className="text-[7.5px] uppercase tracking-[0.2em] text-white/80 mt-2.5 font-black">{unit.label}</span>
          </div>
        ))}
      </div>

      <div className="flex-1 p-5 flex flex-col justify-center space-y-5 relative z-10">
        {/* Elite Cyberpunk Instrumentation Panel */}
        <div className="text-center relative flex justify-center items-center py-2">
          <div className="absolute inset-0 bg-white/5 rounded-[2.5rem] blur-3xl pointer-events-none" />
          <motion.div
            animate={isPredicting ? { 
              scale: [1, 1.05, 1],
              boxShadow: [
                "0 0 15px rgba(255, 255, 255, 0.2)",
                "0 0 35px rgba(255, 255, 255, 0.45)",
                "0 0 15px rgba(255, 255, 255, 0.2)"
              ]
            } : {}}
            transition={{ repeat: Infinity, duration: 1.4 }}
            className="w-[150px] h-[80px] bg-black/60 border border-white rounded-[1.2rem] flex flex-col justify-center items-center backdrop-blur-2xl relative overflow-hidden shadow-2xl"
          >
            {/* Ambient scanning light bar */}
            <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse" />
            
            <h2 className="text-3xl font-mono font-black tracking-tight text-white tabular-nums z-10">
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

        {/* Prediction Grid Container Frame */}
        <div className="flex flex-col bg-white/[0.01] border border-white/5 rounded-[2.5rem] p-4 space-y-4 shadow-[inset_0_4px_30px_rgba(0,0,0,0.8)] backdrop-blur-md relative overflow-hidden">
          {/* Grid header labels */}
          <div className="flex items-center justify-between px-2 text-[8px] font-mono tracking-[0.25em] text-white">
            <span>POSITION RADAR [01 - 05]</span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white/25" />
              <span>SCAN ROW</span>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2.5">
            {(predictionSignals.length > 0 ? predictionSignals : Array(5).fill('EMPTY')).map((type, col) => {
              const isHealthy = type === 'HEALTHY';
              const isRotten = type === 'ROTTEN';
              const isEmpty = type === 'EMPTY';
              
              return (
                <div key={col} className="flex flex-col items-center space-y-2">
                  {/* Small tactical column indexes */}
                  <span className="text-[8px] font-mono font-bold text-white/80">SLOT-0{col + 1}</span>

                  <motion.div
                    initial={false}
                    animate={{
                      scale: (!isPredicting && isHealthy) ? 1.05 : 1,
                      borderColor: isHealthy 
                        ? 'rgba(255, 255, 255, 0.85)' 
                        : isRotten 
                          ? 'rgba(255, 255, 255, 0.08)' 
                          : isPredicting 
                            ? 'rgba(255, 255, 255, 0.4)' 
                            : 'rgba(255, 255, 255, 0.04)',
                      boxShadow: (!isPredicting && isHealthy) 
                        ? '0 0 20px rgba(255, 255, 255, 0.3)' 
                        : 'none'
                    }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className={cn(
                      "aspect-square w-full rounded-2xl border flex items-center justify-center relative overflow-hidden transition-all",
                      isHealthy ? "bg-gradient-to-b from-white/10 to-white/5" : "bg-black/40"
                    )}
                  >
                    {/* Laser scanning vertical bar - visible when predicting */}
                    {isPredicting && (
                      <motion.div
                        animate={{ y: ["-100%", "200%"] }}
                        transition={{ 
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="absolute h-1 w-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)] left-0 right-0 z-20 pointer-events-none"
                      />
                    )}

                    {/* Scanning background text */}
                    {isPredicting && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-[7px] font-mono text-white/40 font-bold tracking-tighter select-none">
                        <span className="animate-pulse">LOCKING</span>
                        <span className="text-[6px] tabular-nums">{(Math.random() * 99).toFixed(0)}%</span>
                      </div>
                    )}

                    {/* Empty inactive grid crosshairs */}
                    {isEmpty && !isPredicting && (
                      <div className="absolute inset-0 p-1 flex flex-col items-center justify-center opacity-30">
                        {/* Central targeting crosshair marker */}
                        <div className="w-1.5 h-1.5 border border-white/30 rounded-full" />
                        <span className="text-[6px] text-gray-650 font-mono mt-1">N/A</span>
                      </div>
                    )}

                    {/* Result Content (Safe vs Rotten) */}
                    {!isPredicting && !isEmpty && (
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="absolute inset-0 flex flex-col items-center justify-center"
                      >
                        {isHealthy ? (
                          /* Ultra Premium Healthy Glowing Apple Slot */
                          <div className="flex flex-col items-center justify-center w-full h-full relative p-1">
                            {/* Inner ambient pulsing light disk */}
                            <div className="absolute w-7 h-7 bg-white/15 rounded-full blur-xs animate-ping opacity-45" />
                            
                            {/* Premium Floating Apple Icon */}
                            <motion.div
                              animate={{ y: [0, -2.5, 0] }}
                              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                              className="relative z-10"
                            >
                              <Apple className="w-6 h-6 text-white fill-white drop-shadow-[0_0_8px_rgba(255,255,255,0.85)]" />
                            </motion.div>

                            {/* Neon Target Badging */}
                            <span className="text-[7px] font-black font-mono text-white leading-none tracking-widest mt-1 bg-black/90 py-0.5 px-1 rounded-sm border border-white/30">
                              SAFE
                            </span>
                          </div>
                        ) : (
                          /* Rotten / Unsafe muted pattern */
                          <div className="flex flex-col items-center justify-center w-full h-full relative opacity-25 grayscale">
                            <Apple className="w-5 h-5 text-gray-500 fill-transparent" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              {/* Diagonal Warning Cross */}
                              <div className="absolute w-full h-px bg-red-650 rotate-45" />
                              <div className="absolute w-full h-px bg-red-650 -rotate-45" />
                            </div>
                            <span className="text-[5px] font-mono text-red-500 tracking-tighter mt-1">DANGER</span>
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

        {/* Tactically Configured Premium Controllers */}
        <div className="grid grid-cols-2 gap-4 pt-3.5">
          <motion.button 
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={startPrediction}
            disabled={isPredicting}
            className="group relative overflow-hidden py-4 sm:py-5 rounded-tr-[2.5rem] rounded-bl-[2.5rem] rounded-tl-[0.6rem] rounded-br-[0.6rem] bg-gradient-to-r from-white via-white/95 to-white/80 text-black font-black text-xs tracking-[0.25em] shadow-lg shadow-white/10 hover:shadow-white/20 transition-all flex items-center justify-center space-x-2.5 animate-shimmer bg-[length:200%_100%] disabled:opacity-40"
          >
            <Play className="w-4 h-4 fill-black" strokeWidth={2.5} />
            <span className="font-display font-black">START ACTIVATE</span>
            <div className="absolute inset-x-0 bottom-0 h-[3px] bg-white/40" />
            <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:200%_100%]" />
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={resetPrediction}
            className="group relative overflow-hidden py-4 sm:py-5 rounded-tl-[2.5rem] rounded-br-[2.5rem] rounded-tr-[0.6rem] rounded-bl-[0.6rem] border border-white/30 text-white font-bold text-xs tracking-[0.25em] flex items-center justify-center space-x-2 bg-white/5 hover:bg-white/10 hover:border-white/55 transition-all shadow-md"
          >
            <RefreshCcw className="w-4 h-4" strokeWidth={2.5} />
            <span className="font-display font-black">RESET BEAM</span>
            <div className="absolute inset-x-0 bottom-0 h-[2px] bg-white/25" />
          </motion.button>
        </div>
      </div>

      {/* Live Winners Feed */}
      <div className="p-6 bg-white/5 border-t border-white/5 pb-8 h-[500px] flex flex-col relative z-10 overflow-hidden">
        <div className="flex items-center justify-between mb-4 shrink-0 px-2">
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Global Winners Feed</h3>
          </div>
          <motion.span 
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-[8px] font-mono text-gray-500"
          >
            LIVE_SYNC_ENABLED
          </motion.span>
        </div>
        <div className="flex-1 space-y-3 mask-fade-out-bottom overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            {winners.map((winner) => (
              <motion.div
                key={winner.id}
                layout
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                transition={{ 
                  layout: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.3 }
                }}
                className="p-4 glass-card rounded-[24px] flex items-center justify-between border-white/[0.08] shrink-0 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/[0.02] group-hover:bg-white/[0.05] transition-colors" />
                <div className="flex items-center space-x-4 relative z-10">
                  <div className="w-11 h-11 rounded-full bg-linear-to-br from-white/10 to-black/40 border border-white/20 flex items-center justify-center shadow-inner overflow-hidden">
                    <img 
                      src={`https://api.dicebear.com/7.x/bottts/svg?seed=${winner.userId}&backgroundColor=ff3434&fontFamily=monospace`}
                      alt="User Logo"
                      className="w-8 h-8 opacity-80"
                    />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="text-[11px] font-mono font-black text-gray-100 tracking-tight">ID: {winner.userId}</p>
                      <div className="px-1.5 py-0.5 rounded-md bg-green-500/10 border border-green-500/20">
                        <span className="text-[7px] font-bold text-green-500 uppercase">Verified</span>
                      </div>
                    </div>
                    <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Dragon Algorithm Result</p>
                  </div>
                </div>
                <div className="text-right relative z-10">
                  <p className="text-base font-black text-white drop-shadow-sm">+{winner.amount} EGP</p>
                  <div className="flex items-center justify-end space-x-1.5">
                    <span className="text-[7px] text-gray-400 font-bold uppercase">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <div className="w-1 h-1 bg-white rounded-full" />
                    <span className="text-[7px] text-white font-black uppercase tracking-tighter">Secured</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div className="h-10 shrink-0" /> {/* Bottom spacer for fade effect */}
        </div>
      </div>

      {/* Elite Leaderboard Stages */}
      <div className="px-6 pb-12 relative z-10 -mt-2">
        <div className="flex items-center space-x-2 mb-6 px-2 pt-4 border-t border-white/5">
          <Trophy className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white leading-none">Elite Players Hall</h3>
        </div>
        
        <div className="flex items-end justify-between gap-3 px-2">
          {/* Silver - 2nd */}
          <div className="flex-1 flex flex-col items-center">
             <div className="w-10 h-10 rounded-xl bg-slate-400/10 border border-slate-400/30 flex items-center justify-center mb-2 shadow-lg shadow-black/50">
                <Medal className="w-5 h-5 text-slate-300" />
             </div>
             <div className="w-full h-16 bg-gradient-to-t from-slate-400/20 to-slate-400/5 border-t-2 border-slate-400/40 rounded-t-2xl flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-sm shadow-xl px-1">
                <div className="absolute inset-0 bg-slate-400/5" />
                <span className="text-[7px] font-mono text-slate-400 relative z-10">ID: {leaderboard[1].id.slice(0,3)}***{leaderboard[1].id.slice(-2)}</span>
                <span className="text-[10px] font-black text-slate-100 relative z-10 whitespace-nowrap">{leaderboard[1].amount.toLocaleString()} <span className="text-[7px] opacity-60">EGP</span></span>
             </div>
          </div>

          {/* Gold - 1st */}
          <div className="flex-1 flex flex-col items-center">
             <motion.div 
               animate={{ y: [0, -4, 0] }}
               transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
               className="w-14 h-14 rounded-2xl bg-white/20 border-2 border-white/50 flex items-center justify-center mb-3 relative shadow-2xl shadow-white/10"
             >
                <Trophy className="w-7 h-7 text-white" strokeWidth={2.5} />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center text-[10px] font-black text-black border-2 border-black">1</div>
             </motion.div>
             <div className="w-full h-24 bg-gradient-to-t from-white/25 to-white/5 border-t-4 border-white/50 rounded-t-3xl flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-md shadow-2xl px-1">
                <div className="absolute inset-0 bg-white/5 animate-pulse" />
                <span className="text-[8px] font-mono text-white/75 relative z-10 font-bold">ID: {leaderboard[0].id.slice(0,3)}***{leaderboard[0].id.slice(-2)}</span>
                <span className="text-[13px] font-black text-white relative z-10 drop-shadow-md whitespace-nowrap">{leaderboard[0].amount.toLocaleString()} <span className="text-[8px] opacity-80">EGP</span></span>
             </div>
          </div>

          {/* Bronze - 3rd */}
          <div className="flex-1 flex flex-col items-center">
             <div className="w-10 h-10 rounded-xl bg-orange-900/20 border border-orange-900/40 flex items-center justify-center mb-2 shadow-lg shadow-black/50">
                <Medal className="w-5 h-5 text-orange-400" />
             </div>
             <div className="w-full h-12 bg-gradient-to-t from-orange-900/20 to-orange-900/5 border-t-2 border-orange-900/40 rounded-t-2xl flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-sm shadow-xl px-1">
                <div className="absolute inset-0 bg-orange-900/5" />
                <span className="text-[7px] font-mono text-orange-400 relative z-10">ID: {leaderboard[2].id.slice(0,3)}***{leaderboard[2].id.slice(-2)}</span>
                <span className="text-[10px] font-black text-orange-100 relative z-10 whitespace-nowrap">{leaderboard[2].amount.toLocaleString()} <span className="text-[7px] opacity-60">EGP</span></span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMaintenance = () => (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center max-w-md mx-auto text-center relative overflow-hidden bg-black">
      <BackgroundVideo />
      <div className="relative z-10 w-full glass-card p-8 rounded-[2.5rem] border-gold/30 gold-glow text-center">
        <div className="w-20 h-20 bg-gold/10 rounded-3xl flex items-center justify-center mb-6 mx-auto border border-gold/30">
          <Activity className={cn("w-10 h-10 text-gold", isMaintenanceActive && "animate-pulse")} />
        </div>
        <h2 className="text-2xl font-black text-white mb-2 tracking-tighter uppercase gold-text-gradient">System Control</h2>
        <p className="text-gray-400 text-xs mb-10 tracking-widest uppercase">Maintenance Dashboard</p>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/10">
            <div className="text-left">
              <span className="text-sm font-bold text-gray-200 block">Maintenance Mode</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest">{isMaintenanceActive ? 'Active - Users blocked' : 'Inactive - System live'}</span>
            </div>
            <button 
              onClick={toggleMaintenance}
              className={cn(
                "w-14 h-8 rounded-full transition-all relative",
                isMaintenanceActive ? "bg-gold" : "bg-white/10"
              )}
            >
              <motion.div 
                animate={{ x: isMaintenanceActive ? 24 : 4 }}
                className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
              />
            </button>
          </div>

          <button 
            onClick={() => setCurrentScreen('LOGIN')}
            className="w-full py-4 text-[10px] font-black text-gold border border-gold/20 rounded-2xl hover:bg-gold/5 transition-all tracking-[0.2em]"
          >
            RETURN TO TERMINAL
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-gold/30">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="min-h-screen"
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

