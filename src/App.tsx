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
  Send
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
      className="absolute top-1/2 left-1/2 min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover opacity-30"
    >
      <source src="https://www.image2url.com/r2/default/videos/1778247994938-b647f361-1d64-48f7-8fbe-5070448f99c4.mp4" type="video/mp4" />
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

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('SPLASH');
  const [onlineUsers, setOnlineUsers] = useState(1532);
  const [password, setPassword] = useState('');
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

  // Splash logic
  useEffect(() => {
    if (currentScreen === 'SPLASH') {
      const timer = setTimeout(() => setCurrentScreen('LOGIN'), 3500);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

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
          
          // Calculate the range of keys to use from the database
          // index 0 -> m1-m5, index 1 -> m6-m10, etc.
          const k = oddIndex % PREDEFINED_ODDS.length;
          const signals: ('HEALTHY' | 'ROTTEN' | 'EMPTY')[] = [];
          
          for (let j = 1; j <= 5; j++) {
            const key = `m${(k * 5) + j}`;
            // Extract the value from the nested Structure: data[key][key]
            const val = data[key] ? data[key][key] : "1";
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

    // If specific User ID is active, reset Firebase Database values
    if (userId === "1982231732") {
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

  // Views
  const renderSplash = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-black relative overflow-hidden">
      <BackgroundVideo />
      
      {/* Background Glossy Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.1)_0%,transparent_70%)]" />
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center"
      >
        <Logo className="mb-12 scale-125" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="text-center"
        >
          <div className="flex items-center justify-center space-x-4 mb-2">
            <h1 className="text-5xl font-display font-bold gold-text-gradient tracking-[0.1em] drop-shadow-[0_0_20px_rgba(255,215,0,0.4)]">
              DRAGON
            </h1>
            <h1 className="text-5xl font-display font-bold gold-text-gradient tracking-[0.1em] drop-shadow-[0_0_20px_rgba(255,215,0,0.4)]">
              VIP
            </h1>
          </div>
          <p className="text-gold/40 text-[10px] uppercase tracking-[0.5em] font-bold">Universal Premium AI</p>
        </motion.div>
      </motion.div>
      
      <div className="absolute bottom-20 w-64 space-y-4">
        <div className="flex justify-between items-center text-[10px] font-mono text-gold-muted font-bold tracking-widest px-1">
          <span>INITIALIZING</span>
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            SYSTEM_ONLINE
          </motion.span>
        </div>
        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden relative">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 3, ease: "easeInOut" }}
            className="h-full gold-gradient relative"
          >
            <div className="absolute inset-0 animate-shimmer bg-linear-to-r from-transparent via-white/40 to-transparent bg-[length:200%_100%]" />
          </motion.div>
        </div>
      </div>
    </div>
  );

  const renderLogin = () => (
    <div className="flex flex-col min-h-screen p-6 pt-12 max-w-md mx-auto relative overflow-hidden bg-black font-sans">
      <BackgroundVideo />
      
      {/* Header */}
      <div className="flex justify-between items-center mb-12 relative z-10">
        <div className="flex items-center space-x-2 glass-card py-1.5 px-4 rounded-full">
          <motion.span 
            key={onlineUsers}
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-xs font-mono text-gold-muted"
          >
            Users Online: {onlineUsers.toLocaleString()}
          </motion.span>
        </div>
        <div className="flex items-center space-x-2 glass-card py-1.5 px-4 rounded-full">
          <motion.div 
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-2 h-2 bg-green-500 rounded-full gold-glow"
          />
          <span className="text-[10px] uppercase font-bold tracking-tighter text-gray-400">Status: Active</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center relative z-10">
        <Logo className="scale-75 mb-4" />
        <h2 className="text-2xl font-display font-bold gold-text-gradient mb-12">AUTHENTICATION</h2>

        <div className="w-full space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-gold-muted px-1">Access Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-muted" />
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••••••"
                className="w-full bg-white/5 border border-gold/20 rounded-2xl py-4 pl-12 pr-4 text-gold placeholder:text-gold/20 focus:outline-none focus:border-gold/50 transition-all"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogin}
            className="w-full gold-gradient py-4 rounded-2xl font-bold text-black gold-glow-strong flex items-center justify-center space-x-2"
          >
            <span>LOGIN</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>

        <div className="mt-12 text-center space-y-2">
          <p className="text-gray-500 text-sm">Don't have a password?</p>
          <button 
            onClick={() => setCurrentScreen('CONDITION')}
            className="text-gold font-bold text-sm underline underline-offset-4 decoration-gold/30 hover:decoration-gold"
          >
            Get Password
          </button>
          
          <div className="flex justify-center space-x-6 pt-6">
            <motion.a 
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              href="https://t.me/THEAGLE2" 
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-gold/5 rounded-2xl border border-gold/20 text-gold hover:bg-gold/10 hover:border-gold/40 transition-all gold-glow-sm"
            >
              <Send className="w-5 h-5" />
            </motion.a>
            <motion.a 
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              href="https://youtube.com/@dragon-p8k6q?si=OjKe5BmJbxCnTZx7" 
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-gold/5 rounded-2xl border border-gold/20 text-gold hover:bg-gold/10 hover:border-gold/40 transition-all gold-glow-sm"
            >
              <Youtube className="w-5 h-5" />
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
          <RefreshCcw className="w-4 h-4 text-gold rotate-180" />
        </button>
        <h2 className="text-xl font-bold gold-text-gradient">Activation Flow</h2>
      </div>

      <div className="space-y-8">
      {/* Step 1 */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-gold/20 flex items-center justify-center border border-gold/30">
              <span className="text-[12px] font-bold text-gold">01</span>
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Select Platform</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {['1xbet', 'MELBET'].map(platform => (
              <button 
                key={platform} 
                onClick={() => handlePlatformSelect(platform)}
                className={cn(
                  "p-4 glass-card rounded-2xl flex items-center justify-between transition-all duration-500 relative overflow-hidden group",
                  selectedPlatform === platform ? "border-gold bg-gold/15 gold-glow" : "border-gold/10 hover:border-gold/30 bg-white/5"
                )}
              >
                <div className="flex flex-col items-start">
                  <span className={cn("font-bold text-sm tracking-tight", selectedPlatform === platform ? "text-gold" : "text-gray-300")}>
                    {platform.toUpperCase()}
                  </span>
                  <span className="text-[8px] text-gray-500 uppercase tracking-widest mt-0.5">Verified</span>
                </div>
                <div className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300", 
                  selectedPlatform === platform ? "bg-gold scale-125 gold-glow" : "bg-white/10"
                )} />
                {selectedPlatform === platform && (
                  <motion.div 
                    layoutId="platform-glow"
                    className="absolute inset-0 bg-gold/5 blur-xl pointer-events-none"
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
                  <div className="w-8 h-8 rounded-xl bg-gold/20 flex items-center justify-center border border-gold/30">
                    <span className="text-[12px] font-bold text-gold">02</span>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Join Community</span>
                </div>
                <a 
                  href="https://t.me/THEAGLE2" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-4 glass-card rounded-2xl flex items-center justify-between border-gold/10 group hover:border-gold/40 transition-all hover:bg-gold/5 active:scale-[0.98]"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2.5 bg-gold/15 rounded-xl border border-gold/20">
                      <Send className="w-4 h-4 text-gold" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-200">Subscribe on Telegram</span>
                      <span className="text-[9px] text-gold-muted font-bold tracking-widest uppercase">@THEAGLE2</span>
                    </div>
                  </div>
                  <div className="text-[10px] font-bold text-gold border border-gold/30 px-4 py-1.5 rounded-full group-hover:bg-gold group-hover:text-black transition-all shadow-lg shadow-gold/5">
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
                  <div className="w-8 h-8 rounded-xl bg-gold/20 flex items-center justify-center border border-gold/30">
                    <span className="text-[12px] font-bold text-gold">03</span>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Watch & Learn</span>
                </div>
                <div className="space-y-3">
                  <a 
                    href="https://youtube.com/@dragon-p8k6q?si=OjKe5BmJbxCnTZx7" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-4 glass-card rounded-2xl flex items-center justify-between border-gold/10 group hover:border-gold/40 transition-all hover:bg-gold/5 active:scale-[0.98]"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2.5 bg-gold/15 rounded-xl border border-gold/20">
                        <Youtube className="w-4 h-4 text-gold" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-200">Subscribe on YouTube</span>
                        <span className="text-[9px] text-gold-muted font-bold tracking-widest uppercase">@dragon-p8k6q</span>
                      </div>
                    </div>
                    <div className="text-[10px] font-bold text-gold border border-gold/30 px-4 py-1.5 rounded-full group-hover:bg-gold group-hover:text-black transition-all shadow-lg shadow-gold/5">
                      WATCH
                    </div>
                  </a>
                  
                  {/* YouTube Video Link Placeholder */}
                  <a 
                    href="https://youtu.be/aQAoaKkU0x0?si=EeulaIAis1TZkGxp" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="relative aspect-video rounded-3xl overflow-hidden border border-gold/20 shadow-2xl shadow-gold/5 block group/video transition-transform hover:scale-[1.02]"
                  >
                    <img 
                      src="https://img.youtube.com/vi/aQAoaKkU0x0/maxresdefault.jpg" 
                      alt="Video Thumbnail" 
                      className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3">
                      <div className="w-14 h-14 bg-gold rounded-full flex items-center justify-center text-black gold-glow scale-100 group-hover:scale-110 transition-transform shadow-xl">
                        <Play className="w-7 h-7 ml-1 fill-black" />
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
                  <div className="w-8 h-8 rounded-xl bg-gold/20 flex items-center justify-center border border-gold/30">
                    <span className="text-[12px] font-bold text-gold">04</span>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Install Platform</span>
                </div>
                <div className="p-5 glass-card rounded-2xl flex items-center justify-between border-gold/10 group hover:border-gold/40 transition-all hover:bg-white/5 cursor-pointer active:scale-[0.98]">
                  <div className="flex items-center space-x-4">
                    <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
                      <Download className="w-5 h-5 text-gold-muted group-hover:text-gold transition-colors" />
                    </div>
                    <span className="text-sm font-medium text-gray-300">
                      Download <span className="text-gold font-bold">{selectedPlatform}</span> Official APK
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-gold transition-colors" />
                </div>
              </motion.div>

              {/* Step 5 */}
              <motion.div 
                variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } }}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-gold/20 flex items-center justify-center border border-gold/30">
                    <span className="text-[12px] font-bold text-gold">05</span>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Security Access</span>
                </div>
                <div className="relative p-5 glass-card rounded-2xl flex items-center justify-between border-dashed border-gold/30 overflow-hidden bg-gold/[0.02]">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                    <span className="font-mono text-xl font-black text-gold tracking-tighter">
                      {selectedPlatform?.toUpperCase() === 'MELBET' ? 'TOO3' : 'A77N'}
                    </span>
                  </div>
                  <button 
                    onClick={handleCopyCode} 
                    className="flex items-center space-x-2 px-4 py-2 bg-gold/10 rounded-xl hover:bg-gold/20 active:scale-90 transition-all text-gold border border-gold/20"
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
                        className="absolute inset-0 bg-gold/95 backdrop-blur-sm flex items-center justify-center"
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
                  <div className="w-8 h-8 rounded-xl bg-gold/20 flex items-center justify-center border border-gold/30">
                    <span className="text-[12px] font-bold text-gold">06</span>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Account Requirement</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 glass-card rounded-2xl border-gold/20 bg-white/5 flex flex-col items-center">
                    <span className="text-[8px] text-gray-500 uppercase tracking-widest mb-1 font-black">Min Deposit</span>
                    <span className="font-bold text-gold text-lg">300 EGP</span>
                  </div>
                  <div className="p-4 glass-card rounded-2xl border-gold/20 bg-white/5 flex flex-col items-center">
                    <span className="text-[8px] text-gray-500 uppercase tracking-widest mb-1 font-black">International</span>
                    <span className="font-bold text-gold text-lg">$5.00 USD</span>
                  </div>
                </div>
              </motion.div>

              {/* Step 7 */}
              <motion.div 
                variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } }}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-gold/20 flex items-center justify-center border border-gold/30">
                    <span className="text-[12px] font-bold text-gold">07</span>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Identity Linking</span>
                </div>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-muted group-focus-within:text-gold transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Enter your Player ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="w-full bg-white/5 border border-gold/10 rounded-2xl py-4 pl-12 pr-6 text-gold focus:outline-none focus:border-gold/40 focus:bg-white/[0.07] transition-all placeholder:text-gray-600"
                  />
                </div>
              </motion.div>

              {/* Step 8 */}
              <motion.div 
                variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } }}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-gold/20 flex items-center justify-center border border-gold/30">
                    <span className="text-[12px] font-bold text-gold">08</span>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Proof Verification</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { type: 'deposit', label: 'DEPOSIT SCREEN' },
                    { type: 'promo', label: 'PROMO SCREEN' }
                  ].map(upload => (
                    <label key={upload.type} className="p-6 glass-card border-dashed border-gold/10 rounded-3xl flex flex-col items-center justify-center text-center space-y-3 cursor-pointer hover:bg-gold/10 hover:border-gold/30 transition-all relative overflow-hidden group">
                      <input type="file" className="hidden" onChange={(e) => handleFileUpload(upload.type as 'deposit' | 'promo', e)} />
                      {uploadedImages[upload.type as 'deposit' | 'promo'] ? (
                        <div className="absolute inset-0">
                          <img src={uploadedImages[upload.type as 'deposit' | 'promo']!} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />
                        </div>
                      ) : (
                        <div className="p-3 bg-gold/10 rounded-2xl group-hover:scale-110 transition-transform">
                          <Upload className="w-5 h-5 text-gold" />
                        </div>
                      )}
                      <div className="relative z-10 flex flex-col items-center">
                        <span className="text-[8px] font-black tracking-[0.2em] text-gray-400 uppercase">
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
                  (userId && uploadedImages.deposit && uploadedImages.promo) ? "gold-gradient text-black gold-glow-strong" : "bg-white/10 text-gray-500 cursor-not-allowed"
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
              className="bg-black/90 border border-gold/30 py-3 px-6 rounded-2xl flex items-center space-x-4 gold-glow backdrop-blur-xl"
            >
              <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center">
                <Activity className="w-5 h-5 text-gold animate-pulse" />
              </div>
              <div>
                <h3 className="text-gold font-bold uppercase tracking-wider text-[10px]">Server Connected</h3>
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
              className="text-gold font-display text-xl tracking-widest"
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
            stroke="rgba(255, 215, 0, 0.1)" 
            strokeWidth="6" fill="none" 
          />
          <motion.circle 
            cx="80" cy="80" r="72" 
            stroke="#FFD700" 
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
      <div className="p-6 flex justify-between items-center bg-black/50 backdrop-blur-xl border-b border-white/5 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <ShieldCheck className="w-8 h-8 text-gold" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-black rounded-full" />
          </div>
          <div>
            <h1 className="text-xs font-display font-bold gold-text-gradient">DRAGON VIP</h1>
            <p className="text-[8px] text-gray-500 uppercase tracking-widest">Premium Prediction</p>
          </div>
        </div>
        <div className="bg-gold/10 px-3 py-1.5 rounded-full border border-gold/20">
          <span className="text-[10px] font-mono text-gold font-bold">LIVE: {onlineUsers}</span>
        </div>
      </div>

      {/* Luminous Countdown Timer */}
      <div className="flex items-center justify-center space-x-4 py-6 bg-linear-to-b from-gold/5 to-transparent mt-2 relative z-10">
        {[
          { label: 'Hours', value: h },
          { label: 'Mins', value: m },
          { label: 'Secs', value: s }
        ].map((unit, idx) => (
          <div key={unit.label} className="flex flex-col items-center">
            <motion.div 
              animate={{ 
                boxShadow: ["0 0 10px rgba(255,215,0,0.1)", "0 0 20px rgba(255,215,0,0.3)", "0 0 10px rgba(255,215,0,0.1)"]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-14 h-14 rounded-full border-2 border-gold/40 flex items-center justify-center bg-gold/5 relative overflow-hidden"
            >
              <span className="text-xl font-mono font-bold gold-text-gradient relative z-10">{unit.value}</span>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.15)_0%,transparent_70%)]" />
            </motion.div>
            <span className="text-[8px] uppercase tracking-widest text-gold-muted mt-2 font-bold">{unit.label}</span>
          </div>
        ))}
      </div>

      <div className="flex-1 p-6 flex flex-col justify-center space-y-6 relative z-10">
        {/* Odd Display - Scaled Down */}
        <div className="text-center scale-90">
          <motion.div
            animate={isPredicting ? { scale: [1, 1.05, 1] } : {}}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="inline-block glass-card px-6 py-3 rounded-2xl border-gold/40 gold-glow"
          >
            <span className="text-gold-muted text-[10px] uppercase tracking-[0.3em] font-bold mb-1 block">Expected Odd</span>
            <h2 className="text-3xl font-display font-bold gold-text-gradient">
              {isPredicting ? '...' : predictionResult ? `x${predictionResult.toFixed(2)}` : 'x0.00'}
            </h2>
          </motion.div>
        </div>

        {/* Prediction Grid */}
        <div className="flex flex-col gap-2 scale-90 origin-center">
          <div className="grid grid-cols-5 gap-2">
            {(predictionSignals.length > 0 ? predictionSignals : Array(5).fill('EMPTY')).map((type, col) => {
              const isHealthy = type === 'HEALTHY';
              const isRotten = type === 'ROTTEN';
              const isEmpty = type === 'EMPTY';
              
              return (
                <motion.div
                  key={col}
                  initial={false}
                  animate={{
                    scale: (!isPredicting && !isEmpty) ? 1.05 : 1,
                    borderColor: isHealthy ? 'rgba(255, 215, 0, 0.8)' : (isRotten ? 'rgba(255, 0, 0, 0.2)' : 'rgba(255, 215, 0, 0.1)'),
                    backgroundColor: isHealthy ? 'rgba(255, 215, 0, 0.1)' : (isRotten ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.03)')
                  }}
                  className={cn(
                    "aspect-square rounded-xl border flex items-center justify-center relative overflow-hidden",
                    isHealthy && "gold-glow"
                  )}
                >
                  {!isPredicting && !isEmpty && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={cn(
                        "absolute inset-0 flex items-center justify-center",
                        isHealthy ? "bg-gold/10" : "bg-black/20"
                      )}
                    >
                      <Apple className={cn(
                        "w-6 h-6",
                        isHealthy ? "text-gold fill-gold" : "text-gray-800 opacity-40"
                      )} />
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={startPrediction}
            disabled={isPredicting}
            className="group relative overflow-hidden py-5 rounded-3xl gold-gradient text-black font-bold flex items-center justify-center space-x-2 gold-glow-strong"
          >
            <Play className="w-5 h-5 fill-black" />
            <span>START</span>
            <div className="absolute inset-0 animate-shimmer bg-linear-to-r from-transparent via-white/20 to-transparent bg-[length:200%_100%]" />
          </button>
          <button 
            onClick={resetPrediction}
            className="py-5 rounded-3xl border border-gold/40 text-gold font-bold flex items-center justify-center space-x-2 bg-gold/5 hover:bg-gold/10"
          >
            <RefreshCcw className="w-5 h-5" />
            <span>RESTART</span>
          </button>
        </div>
      </div>

      {/* Live Winners Feed */}
      <div className="p-6 bg-white/5 border-t border-white/5 pb-8 h-[500px] flex flex-col relative z-10 overflow-hidden">
        <div className="flex items-center justify-between mb-4 shrink-0 px-2">
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse gold-glow" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gold-muted">Global Winners Feed</h3>
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
                className="p-4 glass-card rounded-[24px] flex items-center justify-between border-gold/10 shrink-0 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gold/[0.02] group-hover:bg-gold/[0.05] transition-colors" />
                <div className="flex items-center space-x-4 relative z-10">
                  <div className="w-11 h-11 rounded-full bg-linear-to-br from-gold/20 to-black/40 border border-gold/30 flex items-center justify-center shadow-inner overflow-hidden">
                    <img 
                      src={`https://api.dicebear.com/7.x/bottts/svg?seed=${winner.userId}&backgroundColor=ffd700&fontFamily=monospace`}
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
                    <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Dragon Algorithm Result</p>
                  </div>
                </div>
                <div className="text-right relative z-10">
                  <p className="text-base font-black gold-text-gradient drop-shadow-sm">+{winner.amount} EGP</p>
                  <div className="flex items-center justify-end space-x-1.5">
                    <span className="text-[7px] text-gray-500 font-bold uppercase">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <div className="w-1 h-1 bg-gold rounded-full" />
                    <span className="text-[7px] text-gold font-black uppercase tracking-tighter">Secured</span>
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
          <Trophy className="w-3.5 h-3.5 text-gold" strokeWidth={2.5} />
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gold-muted leading-none">Elite Players Hall</h3>
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
               className="w-14 h-14 rounded-2xl bg-gold/20 border-2 border-gold/50 flex items-center justify-center mb-3 gold-glow relative shadow-2xl shadow-gold/20"
             >
                <Trophy className="w-7 h-7 text-gold" strokeWidth={2.5} />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gold rounded-full flex items-center justify-center text-[10px] font-black text-black gold-glow border-2 border-black">1</div>
             </motion.div>
             <div className="w-full h-24 bg-gradient-to-t from-gold/25 to-gold/5 border-t-4 border-gold/50 rounded-t-3xl flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-md shadow-2xl px-1">
                <div className="absolute inset-0 bg-gold/5 animate-pulse" />
                <span className="text-[8px] font-mono text-gold-muted relative z-10 font-bold">ID: {leaderboard[0].id.slice(0,3)}***{leaderboard[0].id.slice(-2)}</span>
                <span className="text-[13px] font-black text-gold relative z-10 drop-shadow-md whitespace-nowrap">{leaderboard[0].amount.toLocaleString()} <span className="text-[8px] opacity-80">EGP</span></span>
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
          {currentScreen === 'SPLASH' && renderSplash()}
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

