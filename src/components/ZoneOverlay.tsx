import React from 'react';
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
  if (activeZoneId === 'hub') {
    return (
      <div className="pointer-events-none fixed bottom-6 left-0 right-0 z-30 flex justify-center px-4 select-none">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="pointer-events-auto flex items-center gap-2 sm:gap-3 px-4 py-2 rounded-full bg-[#050811]/75 backdrop-blur-md border border-slate-800 text-xs font-mono text-slate-400"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>SYSTEM READY</span>
          <span className="text-slate-600">·</span>
          <span>SELECT ANY ORBITAL NODE OR MENU TO TRAVEL</span>
        </motion.div>
      </div>
    );
  }

  // Get previous and next zone IDs
  const nonHubZones = ZONES.filter((z) => z.id !== 'hub');
  const currentIndex = nonHubZones.findIndex((z) => z.id === activeZoneId);
  const prevZone = currentIndex > 0 ? nonHubZones[currentIndex - 1] : nonHubZones[nonHubZones.length - 1];
  const nextZone = currentIndex < nonHubZones.length - 1 ? nonHubZones[currentIndex + 1] : nonHubZones[0];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeZoneId}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-y-0 right-0 z-30 w-full sm:w-[92vw] md:w-[680px] lg:w-[760px] pt-16 pb-6 px-4 sm:px-8 flex flex-col justify-between pointer-events-none select-text"
      >
        {/* Floating Glass Panel */}
        <div className="pointer-events-auto h-full flex flex-col rounded-2xl bg-[#050812]/85 backdrop-blur-xl border border-cyan-500/20 shadow-[0_8px_32px_rgba(0,0,0,0.6)] overflow-hidden">
          {/* Panel Top Control Bar */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800/80 bg-slate-950/40">
            <button
              type="button"
              onClick={() => {
                sound.playSelect();
                onCloseToHub();
              }}
              className="group flex items-center gap-1.5 text-xs font-mono text-cyan-300 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>RETURN TO HUB</span>
            </button>

            {/* Prev / Next Node fast travel */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  sound.playSelect();
                  onNavigateZone(prevZone.id);
                }}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title={`Previous: ${prevZone.name}`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-mono text-slate-500 tabular-nums">
                0{currentIndex + 1} / 0{nonHubZones.length}
              </span>
              <button
                type="button"
                onClick={() => {
                  sound.playSelect();
                  onNavigateZone(nextZone.id);
                }}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
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
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors ml-2"
                aria-label="Close panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Panel Content Scroll Area */}
          <div className="flex-1 overflow-y-auto px-5 sm:px-7 py-6 custom-scrollbar">
            {activeZoneId === 'code' && <CodeZoneContent />}
            {activeZoneId === 'ai' && <AiLabContent />}
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
