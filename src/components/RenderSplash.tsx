/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Terminal } from 'lucide-react';
import { ElegantLogo } from './ElegantLogo';

interface RenderSplashProps {
  onComplete: () => void;
}

export const RenderSplash = ({ onComplete }: RenderSplashProps) => {
  const [progress, setProgress] = useState(0);
  const [bootStep, setBootStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const jump = Math.floor(Math.random() * 10) + 6; // slightly faster but satisfyingly detailed
        return Math.min(100, prev + jump);
      });
    }, 120);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress < 25) setBootStep(0);
    else if (progress < 55) setBootStep(1);
    else if (progress < 85) setBootStep(2);
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
    "SECURITY CHANNELS OPENING...",
    "VERIFYING LICENSE CLOUD BOUNDS...",
    "CALIBRATING ALGORITHMIC ODDS VECTORS...",
    "DRAGON ENGINE SYNCHRONIZED SUCCESSFULLY!"
  ];

  return (
    <div className="flex flex-col items-center justify-between min-h-screen p-8 bg-transparent relative overflow-hidden font-sans select-none">

      {/* Decorative tech rails */}
      <div className="w-full max-w-lg flex justify-between items-center relative z-10 select-none opacity-40">
        <span className="text-[7.5px] font-mono tracking-[0.3em] text-white/50">SYSTEM CALIBRATION</span>
        <div className="h-[1px] bg-gradient-to-r from-white/10 via-white/5 to-transparent flex-grow mx-4" />
        <span className="text-[7.5px] font-mono tracking-[0.3em] text-white/50">PORT: 3000 SSL</span>
      </div>

      {/* Main Core Form Block */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center max-w-sm w-full text-center my-auto"
      >
        {/* Pulsing Shield Logo */}
        <div className="relative mb-8">
          <ElegantLogo size="xl" className="relative z-20" />
        </div>

        {/* Brand Header */}
        <div className="space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#120422]/75 border border-white/5 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-gold-bright animate-pulse" />
            <span className="text-[8.5px] font-mono tracking-[0.3em] text-white/80 font-black uppercase">
              DRAGON COGNITIVE GRID
            </span>
          </div>

          <div className="flex flex-col items-center mt-1">
            <h1 className="text-5xl font-black tracking-[0.2em] text-white leading-none font-display text-glow">
              DRAGON
            </h1>
            <div className="flex items-center gap-4 mt-1.5">
              <span className="h-[1.5px] w-8 bg-gradient-to-r from-transparent via-gold-bright/30 to-gold-bright" />
              <span className="text-sm font-mono tracking-[0.8em] text-gold-bright font-black pl-[0.8em]">VIP</span>
              <span className="h-[1.5px] w-8 bg-gradient-to-l from-transparent via-gold-bright/30 to-gold-bright" />
            </div>
          </div>
        </div>

        {/* Loading Progress Frame */}
        <div className="w-full bg-linear-to-b from-white/[0.03] to-white/[0.01] border border-white/[0.08] rounded-[28px] p-6 backdrop-blur-xl shadow-2xl space-y-5">
          <div className="flex items-center justify-between text-[9px] font-mono tracking-widest font-black text-white/60">
            <span className="flex items-center gap-1"><Terminal className="w-3 h-3 text-gold" /> BOOT LOGS</span>
            <span className="text-gold-bright tracking-normal">{progress}% COMPLETED</span>
          </div>

          {/* Liquid level bar with custom end points */}
          <div className="w-full h-[4px] bg-white/5 rounded-full overflow-hidden relative">
            <div 
              style={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-gold-muted via-gold-bright to-white transition-all duration-150 ease-out relative rounded-full"
            >
              {/* Animated glowing shimmer level tip */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white opacity-80 blur-xs shadow-[0_0_10px_#fff]" />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] bg-[length:150%_100%] animate-shimmer" />
            </div>
          </div>

          {/* Current message */}
          <div className="text-left bg-black/45 rounded-xl p-3 border border-white/5 min-h-[46px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.span 
                key={bootStep}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="text-[9px] sm:text-[10px] font-mono text-white/50 block uppercase tracking-wider text-center font-bold"
              >
                {bootMessages[bootStep]}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Luxury Footer watermark */}
      <div className="w-full flex flex-col items-center gap-1.5 text-[8.5px] text-white/40 tracking-[0.3em] z-10 border-t border-white/5 pt-4">
        <span className="font-black">DRAGON LUXURY PLATFORM v12.5</span>
        <span className="opacity-60 text-[7px]">STRICT MILITARY-GRADE PRIVACY ENCRYPTED</span>
      </div>
    </div>
  );
};
