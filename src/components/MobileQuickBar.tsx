import React from 'react';
import { ZONES, ZoneConfig } from '../data/portfolioData';
import { sound } from '../audio/soundEffects';

interface MobileQuickBarProps {
  activeZoneId: ZoneConfig['id'];
  onSelectZone: (zoneId: ZoneConfig['id']) => void;
}

export const MobileQuickBar: React.FC<MobileQuickBarProps> = ({
  activeZoneId,
  onSelectZone,
}) => {
  return (
    <div className="md:hidden fixed bottom-4 left-3 right-3 z-30 pointer-events-none select-none">
      <div className="pointer-events-auto flex items-center gap-1.5 p-1.5 rounded-full bg-[#050811]/90 backdrop-blur-xl border border-cyan-500/30 shadow-[0_8px_25px_rgba(0,0,0,0.6)] overflow-x-auto no-scrollbar">
        {ZONES.map((zone) => {
          const isActive = activeZoneId === zone.id;
          return (
            <button
              key={zone.id}
              type="button"
              onClick={() => {
                sound.playSelect();
                onSelectZone(zone.id);
              }}
              className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-mono tracking-wider transition-all whitespace-nowrap active:scale-95 ${
                isActive
                  ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-400/60 shadow-[0_0_12px_rgba(0,229,255,0.25)] font-semibold'
                  : 'text-slate-400 hover:text-white bg-slate-900/40 border border-slate-800/60'
              }`}
            >
              {zone.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
