import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowLeft, ChevronRight, ChevronLeft } from 'lucide-react';
import { ZoneConfig, ZONES } from '../data/portfolioData';
import { CodeZoneContent } from '../sections/CodeZoneContent';
import { ProjectsContent } from '../sections/ProjectsContent';
import { ExperienceContent } from '../sections/ExperienceContent';
import { AboutContent } from '../sections/AboutContent';
import { ContactContent } from '../sections/ContactContent';
import { sound } from '../audio/soundEffects';

interface ZoneOverlayProps {
  activeZoneId: ZoneConfig['id'];
  onCloseToHub: () => void;
  onNavigateZone: (zoneId: ZoneConfig['id']) => void;
  isMobile?: boolean;
}

export const ZoneOverlay: React.FC<ZoneOverlayProps> = ({
  activeZoneId,
  onCloseToHub,
  onNavigateZone,
  isMobile = false,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset scroll to top whenever the active zone changes to prevent text overlap or lingering offsets
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [activeZoneId]);

  // When in Hub view:
  if (activeZoneId === 'hub') {
    if (isMobile) {
      // On mobile in Hub, the dedicated bottom MobileQuickBar handles navigation
      return null;
    }

    return (
      <div className="pointer-events-none fixed bottom-6 left-0 right-0 z-30 flex justify-center px-4 select-none">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="pointer-events-auto flex items-center gap-2 sm:gap-3 px-4 py-2 rounded-full bg-[#050811]/90 backdrop-blur-md border border-slate-800 text-xs font-mono text-slate-400 shadow-lg"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>SYSTEM READY</span>
          <span className="text-slate-600">·</span>
          <span>SELECT ANY ORBITAL NODE OR MENU TO TRAVEL</span>
        </motion.div>
      </div>
    );
  }

  // Get circular prev/next zones
  const nonHubZones = ZONES.filter((z) => z.id !== 'hub');
  const currentIndex = nonHubZones.findIndex((z) => z.id === activeZoneId);
  const prevZone = currentIndex > 0 ? nonHubZones[currentIndex - 1] : nonHubZones[nonHubZones.length - 1];
  const nextZone = currentIndex < nonHubZones.length - 1 ? nonHubZones[currentIndex + 1] : nonHubZones[0];

  // ==========================================
  // MOBILE FULL-PAGE REPLACEMENT VIEW
  // Fully replaces the 3D canvas with smooth backdrop-blur transition
  // ==========================================
  if (isMobile) {
    return (
      <AnimatePresence>
        <motion.div
          key={activeZoneId}
          initial={{ opacity: 0, filter: 'blur(8px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, filter: 'blur(8px)' }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-[100dvh] flex flex-col bg-[#050608]/98 backdrop-blur-xl text-[#E5E7EB] select-text"
        >
          {/* Mobile Dedicated Top Navigation Header */}
          <header className="sticky top-0 z-30 flex items-center justify-between px-3.5 py-2.5 border-b border-slate-800/90 bg-[#060a14]/95 backdrop-blur-md shrink-0 shadow-md">
            <button
              type="button"
              onClick={() => {
                sound.playSelect();
                onCloseToHub();
              }}
              className="group flex items-center gap-1.5 min-h-[42px] px-2 py-1 text-xs font-mono text-cyan-300 hover:text-white transition-colors cursor-pointer active:scale-95"
              aria-label="Return to central hub"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span className="font-semibold tracking-wider">RETURN TO HUB</span>
            </button>

            {/* Quick Circular Step Navigation */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  sound.playSelect();
                  onNavigateZone(prevZone.id);
                }}
                className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-400 hover:text-white active:bg-slate-800 transition-colors"
                title={`Previous: ${prevZone.name}`}
                aria-label={`Previous zone: ${prevZone.name}`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-mono text-slate-400 tabular-nums px-1 font-medium">
                0{currentIndex + 1} / 0{nonHubZones.length}
              </span>
              <button
                type="button"
                onClick={() => {
                  sound.playSelect();
                  onNavigateZone(nextZone.id);
                }}
                className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-400 hover:text-white active:bg-slate-800 transition-colors"
                title={`Next: ${nextZone.name}`}
                aria-label={`Next zone: ${nextZone.name}`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playSelect();
                  onCloseToHub();
                }}
                className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white active:bg-slate-800 rounded-lg transition-colors ml-1"
                aria-label="Close zone and return to hub"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Mobile Full-View Scroll Area with Calibrated Padding */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-5 pb-20 custom-scrollbar bg-[#050608] -webkit-overflow-scrolling-touch"
          >
            <div className="max-w-xl mx-auto w-full">
              {activeZoneId === 'code' && <CodeZoneContent />}
              {activeZoneId === 'projects' && <ProjectsContent />}
              {activeZoneId === 'experience' && <ExperienceContent />}
              {activeZoneId === 'about' && <AboutContent />}
              {activeZoneId === 'contact' && <ContactContent />}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // ==========================================
  // DESKTOP / TABLET OVERLAY VIEW
  // Floating architectural glass panel with backdrop-blur transition filter
  // ==========================================
  return (
    <AnimatePresence>
      {/* Subtle backdrop-blur filter & scrim during camera transitions */}
      <motion.div
        key="backdrop-scrim"
        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        animate={{ opacity: 1, backdropFilter: 'blur(6px)' }}
        exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        onClick={() => {
          sound.playSelect();
          onCloseToHub();
        }}
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md transition-all cursor-pointer"
        aria-label="Click to return to hub"
      />

      {/* Solid Opaque Floating Panel Container with smooth animated slide & backdrop-blur */}
      <motion.div
        key="panel-container"
        initial={{ opacity: 0, x: 28, filter: 'blur(4px)' }}
        animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, x: 28, filter: 'blur(4px)' }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-y-0 right-0 z-50 w-full sm:w-[92vw] md:w-[680px] lg:w-[760px] pt-16 pb-6 px-4 sm:px-8 flex flex-col justify-between pointer-events-none select-text"
      >
        <div className="pointer-events-auto h-full flex flex-col rounded-2xl bg-[#060a14]/94 backdrop-blur-xl border border-cyan-500/30 shadow-[0_16px_50px_rgba(0,0,0,0.85)] overflow-hidden transition-all duration-300">
          {/* Panel Top Control Bar */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800/80 bg-slate-950/80 shrink-0">
            <button
              type="button"
              onClick={() => {
                sound.playSelect();
                onCloseToHub();
              }}
              className="group flex items-center gap-1.5 min-h-[40px] px-2 py-1 text-xs font-mono text-cyan-300 hover:text-white transition-colors cursor-pointer active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span className="font-medium tracking-wider">RETURN TO HUB</span>
            </button>

            {/* Prev / Next fast navigation */}
            <div className="flex items-center gap-2">
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

          {/* Panel Content Scroll Area */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-6 py-6 pb-12 custom-scrollbar bg-[#060a14]"
          >
            {activeZoneId === 'code' && <CodeZoneContent />}
            {activeZoneId === 'projects' && <ProjectsContent />}
            {activeZoneId === 'experience' && <ExperienceContent />}
            {activeZoneId === 'about' && <AboutContent />}
            {activeZoneId === 'contact' && <ContactContent />}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
