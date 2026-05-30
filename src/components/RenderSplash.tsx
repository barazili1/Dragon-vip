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
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-transparent relative overflow-hidden font-sans select-none">

      {/* Main Core Form Block */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center max-w-sm w-full text-center space-y-8"
      >
        {/* Pulsing Shield Logo in its custom designed futuristic core ring frame */}
        <div className="relative p-6">
          <div className="absolute inset-0 bg-purple-500/10 rounded-full blur-2xl animate-pulse" />
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-2 rounded-full border border-dashed border-purple-500/20 pointer-events-none"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-4 rounded-full border border-dotted border-gold/15 pointer-events-none"
          />
          <ElegantLogo size="xl" className="relative z-20 drop-shadow-[0_0_25px_rgba(168,85,247,0.4)]" />
        </div>

        {/* Brand Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-[0.25em] text-white uppercase leading-none font-display drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            DRAGON <span className="text-purple-400 font-black">VIP</span>
          </h1>
          <div className="h-[2px] w-14 bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto mt-2.5" />
        </div>

        {/* Loading Progress Frame */}
        <div className="w-full bg-black/50 border border-white/10 rounded-2xl p-5 space-y-4.5 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between text-[10px] font-mono tracking-wider font-black text-purple-200 uppercase/arabic">
            <span>جاري تحميل النظام...</span>
            <span className="text-gold-bright tracking-normal font-bold font-sans text-xs">{progress}%</span>
          </div>

          {/* Liquid level bar with custom end points */}
          <div className="w-full h-[5px] bg-white/5 rounded-full overflow-hidden relative border border-white/5">
            <div 
              style={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-gold-bright transition-all duration-150 ease-out relative rounded-full"
            >
              {/* Animated glowing shimmer level tip */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white opacity-85 blur-xs shadow-[0_0_10px_#fff]" />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] bg-[length:150%_100%] animate-shimmer pointer-events-none" />
            </div>
          </div>
        </div>
      </motion.div>

    </div>
  );
};
