import React, { useState } from 'react';
import { Volume2, VolumeX, Layers, Compass, Menu, X, ArrowLeft } from 'lucide-react';
import { ZONES, ZoneConfig, PERSONAL_INFO } from '../data/portfolioData';
import { sound } from '../audio/soundEffects';

interface HeaderNavProps {
  activeZone: ZoneConfig['id'];
  onSelectZone: (zoneId: ZoneConfig['id']) => void;
  is3DMode: boolean;
  onToggle3DMode: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeZone,
  onSelectZone,
  is3DMode,
  onToggle3DMode,
  isMuted,
  onToggleMute,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (zoneId: ZoneConfig['id']) => {
    sound.playSelect();
    onSelectZone(zoneId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-6 md:px-8 py-3.5 bg-[#050608]/75 backdrop-blur-md border-b border-slate-800/60 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Zone 1: Single element brand wordmark */}
        <button
          type="button"
          onClick={() => handleNavClick('hub')}
          className="text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 rounded"
        >
          <span className="font-mono text-sm tracking-[0.2em] font-semibold text-white group-hover:text-cyan-300 transition-colors">
            {PERSONAL_INFO.name}
          </span>
        </button>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav
          aria-label="Experience zones"
          className="hidden md:flex items-center gap-1 lg:gap-2 text-xs font-mono"
        >
          {ZONES.map((zone) => {
            const isActive = activeZone === zone.id;
            return (
              <button
                key={zone.id}
                type="button"
                onClick={() => handleNavClick(zone.id)}
                className={`relative px-3 py-1.5 transition-colors whitespace-nowrap cursor-pointer rounded ${
                  isActive
                    ? 'text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 font-medium'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
                }`}
              >
                {zone.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-0.5 bg-cyan-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions (Sound toggle, 2D/3D mode switch, Mobile trigger) */}
        <div className="flex items-center gap-2">
          {/* Back to Hub shortcut if inside a zone */}
          {activeZone !== 'hub' && (
            <button
              type="button"
              onClick={() => handleNavClick('hub')}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-cyan-300 bg-cyan-950/30 hover:bg-cyan-900/50 border border-cyan-500/40 rounded transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>RETURN TO HUB</span>
            </button>
          )}

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={onToggleMute}
            aria-label={isMuted ? 'Unmute system audio' : 'Mute system audio'}
            className="p-1.5 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 bg-slate-900/50 rounded transition-colors"
            title={isMuted ? 'Sound: Muted (Click to enable)' : 'Sound: Active'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          {/* 3D / 2D Viewport switch */}
          <button
            type="button"
            onClick={onToggle3DMode}
            aria-label="Toggle 3D spatial vs 2D editorial view"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 bg-slate-900/50 rounded transition-colors"
            title="Toggle between 3D Spatial Canvas and 2D Editorial View"
          >
            {is3DMode ? (
              <>
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">3D</span>
              </>
            ) : (
              <>
                <Compass className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">2D</span>
              </>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-slate-300 hover:text-white border border-slate-800 bg-slate-900/50 rounded"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs font-mono">
          {ZONES.map((zone) => {
            const isActive = activeZone === zone.id;
            return (
              <button
                key={zone.id}
                type="button"
                onClick={() => handleNavClick(zone.id)}
                className={`px-3 py-2 text-left rounded transition-colors ${
                  isActive
                    ? 'text-cyan-300 bg-cyan-950/60 border border-cyan-500/40 font-semibold'
                    : 'text-slate-300 hover:text-white bg-slate-900/30'
                }`}
              >
                {zone.name}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
