import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, FastForward } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { sound } from '../audio/soundEffects';

interface IntroScreenProps {
  onEnter: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onEnter }) => {
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setProgress(100);
      setIsReady(true);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsReady(true);
          return 100;
        }
        const step = Math.floor(Math.random() * 18) + 12;
        const next = Math.min(100, prev + step);
        if (next === 100) {
          setIsReady(true);
        }
        return next;
      });
    }, 120);

    return () => clearInterval(interval);
  }, []);

  const handleEnter = () => {
    sound.playTransition();
    onEnter();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-[100] h-[100dvh] flex flex-col justify-between p-4 sm:p-6 md:p-12 bg-[#050608] text-[#f1f5f9] select-none"
      >
        {/* Top bar with quick Skip */}
        <div className="flex items-center justify-between w-full">
          <div className="font-mono text-[10px] sm:text-xs tracking-widest text-slate-500 uppercase">
            3D Spatial Experience
          </div>
          <button
            type="button"
            onClick={handleEnter}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono text-slate-400 hover:text-white border border-slate-800 hover:border-slate-600 rounded transition-colors active:scale-95"
          >
            <FastForward className="w-3.5 h-3.5 text-cyan-400" />
            <span>Skip intro</span>
          </button>
        </div>

        {/* Center Minimal Typography */}
        <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto my-auto py-6 sm:py-12 px-2">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-3 sm:space-y-4"
          >
            <h1 className="text-2xl sm:text-4xl md:text-6xl font-light tracking-[0.18em] sm:tracking-[0.25em] text-white">
              {PERSONAL_INFO.name}
            </h1>
            <p className="font-mono text-[11px] sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] text-cyan-400/90 uppercase px-2">
              {PERSONAL_INFO.positioning}
            </p>
          </motion.div>

          {/* Progress / Enter Action */}
          <div className="mt-8 sm:mt-16 w-full max-w-xs flex flex-col items-center">
            {!isReady ? (
              <div className="w-full space-y-2">
                <div className="flex justify-between items-center text-[10px] sm:text-[11px] font-mono text-slate-400">
                  <span>INITIALIZING EXPERIENCE...</span>
                  <span className="text-cyan-400">{progress}%</span>
                </div>
                <div className="w-full h-0.5 bg-slate-900 rounded overflow-hidden">
                  <div
                    className="h-full bg-cyan-400 transition-all duration-150 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ) : (
              <motion.button
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleEnter}
                className="group w-full min-h-[48px] flex items-center justify-center gap-3 px-6 py-3.5 bg-slate-900 hover:bg-[#081b29] active:bg-[#0b2538] border border-cyan-500/40 hover:border-cyan-400 text-white rounded text-xs font-mono tracking-[0.2em] transition-all duration-200 shadow-[0_0_25px_rgba(0,229,255,0.15)] cursor-pointer"
              >
                <span>ENTER THE SYSTEM</span>
                <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            )}
          </div>
        </div>

        {/* Bottom Coordinates & Subtle Metadata */}
        <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-slate-500 pt-2">
          <div>{PERSONAL_INFO.location}</div>
          <div className="hidden sm:block">INTERACTIVE 3D ENVIRONMENT</div>
          <div>EST. 2026</div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
