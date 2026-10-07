import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowLeft, ChevronRight, ChevronLeft } from 'lucide-react';
import { ZoneConfig, ZONES } from '../data/portfolioData';
import { CodeZoneContent } from '../sections/CodeZoneContent';
import { AiLabContent } from '../sections/AiLabContent';
import { ProjectsContent } from '../sections/ProjectsContent';
import { ExperienceContent } from '../sections/ExperienceContent';
import { AboutContent } from '../sections/AboutContent';
import { ContactContent } from '../sections/ContactContent';
import { sound } from '../audio/soundEffects';

interface ZoneOverlayProps {
  activeZoneId: ZoneConfig['id'];
  onCloseToHub: () => void;
  onNavigateZone: (zoneId: ZoneConfig['id']) => void;
}

export const ZoneOverlay: React.FC<ZoneOverlayProps> = ({
  activeZoneId,
  onCloseToHub,
  onNavigateZone,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset scroll to top whenever the active zone changes to prevent text overlap/jump
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [activeZoneId]);

  if (activeZoneId === 'hub') {
    return (
      <div className="pointer-events-none fixed bottom-6 left-0 right-0 z-30 flex justify-center px-4 select-none">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="pointer-events-auto flex items-center gap-2 sm:gap-3 px-4 py-2 rounded-full bg-[#050811]/90 backdrop-blur-md border border-slate-800 text-xs font-mono text-slate-400"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>SYSTEM READY</span>
          <span className="text-slate-600">·</span>
          <span>SELECT ANY ORBITAL NODE OR MENU TO TRAVEL</span>
        </motion.div>
      </div>
    );
  }

  // Get previous and next zone IDs for clean circular navigation
  const nonHubZones = ZONES.filter((z) => z.id !== 'hub');
  const currentIndex = nonHubZones.findIndex((z) => z.id === activeZoneId);
  const prevZone = currentIndex > 0 ? nonHubZones[currentIndex - 1] : nonHubZones[nonHubZones.length - 1];
  const nextZone = currentIndex < nonHubZones.length - 1 ? nonHubZones[currentIndex + 1] : nonHubZones[0];

  return (
    <>
      {/* Dimmed backdrop scrim to separate 3D scene from text and eliminate background visual noise */}
      <div
        onClick={() => {
          sound.playSelect();
          onCloseToHub();
        }}
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px] transition-opacity cursor-pointer"
        aria-label="Click to return to hub"
      />

      {/* Solid Opaque Panel Container with z-50 to ensure zero z-index bleed */}
      <div className="fixed inset-0 sm:inset-y-0 sm:left-auto sm:right-0 z-50 w-full sm:w-[92vw] md:w-[680px] lg:w-[760px] h-[100dvh] pt-14 pb-0 px-0 sm:pt-16 sm:pb-6 sm:px-8 flex flex-col justify-between pointer-events-none select-text">
        <div className="pointer-events-auto h-full flex flex-col rounded-t-2xl sm:rounded-2xl bg-[#060a14] border-t sm:border border-cyan-500/30 shadow-[0_16px_50px_rgba(0,0,0,0.85)] overflow-hidden">
          {/* Panel Top Control Bar */}
          <div className="flex items-center justify-between px-3.5 sm:px-5 py-2.5 sm:py-3.5 border-b border-slate-800/80 bg-slate-950/80 shrink-0">
            <button
              type="button"
              onClick={() => {
                sound.playSelect();
                onCloseToHub();
              }}
              className="group flex items-center gap-1.5 min-h-[40px] px-2 py-1 text-xs font-mono text-cyan-300 hover:text-white transition-colors cursor-pointer active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span className="font-medium">RETURN TO HUB</span>
            </button>

            {/* Prev / Next Node fast travel */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                type="button"
                onClick={() => {
                  sound.playSelect();
                  onNavigateZone(prevZone.id);
                }}
                className="w-9 h-9 flex items-center justify-center rounded text-slate-400 hover:text-white active:bg-slate-800 transition-colors"
                title={`Previous: ${prevZone.name}`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-mono text-slate-400 tabular-nums px-1">
                0{currentIndex + 1} / 0{nonHubZones.length}
              </span>
              <button
                type="button"
                onClick={() => {
                  sound.playSelect();
                  onNavigateZone(nextZone.id);
                }}
                className="w-9 h-9 flex items-center justify-center rounded text-slate-400 hover:text-white active:bg-slate-800 transition-colors"
                title={`Next: ${nextZone.name}`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playSelect();
                  onCloseToHub();
                }}
                className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-white active:bg-slate-800 rounded transition-colors ml-1"
                aria-label="Close panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Panel Content Scroll Area: Solid opaque backdrop, zero bleed-through */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 sm:px-7 py-5 sm:py-6 custom-scrollbar bg-[#060a14] -webkit-overflow-scrolling-touch"
          >
            {activeZoneId === 'code' && <CodeZoneContent />}
            {activeZoneId === 'ai' && <AiLabContent />}
            {activeZoneId === 'projects' && <ProjectsContent />}
            {activeZoneId === 'experience' && <ExperienceContent />}
            {activeZoneId === 'about' && <AboutContent />}
            {activeZoneId === 'contact' && <ContactContent />}
          </div>
        </div>
      </div>
    </>
  );
};
