/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { SceneCanvas } from './components/3d/SceneCanvas';
import { HeaderNav } from './components/HeaderNav';
import { ZoneOverlay } from './components/ZoneOverlay';
import { IntroScreen } from './components/IntroScreen';
import { FallbackPortfolio } from './components/2d/FallbackPortfolio';
import { MobileQuickBar } from './components/MobileQuickBar';
import { ZoneConfig, ZONES } from './data/portfolioData';
import { sound } from './audio/soundEffects';

export default function App() {
  const [hasEntered, setHasEntered] = useState<boolean>(false);
  const [activeZone, setActiveZone] = useState<ZoneConfig['id']>('hub');
  const [is3DMode, setIs3DMode] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [webGlAvailable, setWebGlAvailable] = useState<boolean>(true);

  // Check WebGL availability
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGlAvailable(false);
        setIs3DMode(false);
      }
    } catch {
      setWebGlAvailable(false);
      setIs3DMode(false);
    }
  }, []);

  // Screen resize listener
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'Escape') {
        setActiveZone('hub');
      } else if (e.key === '0' || e.key === 'h' || e.key === 'H') {
        setActiveZone('hub');
      } else if (e.key === '1') {
        setActiveZone('code');
      } else if (e.key === '2') {
        setActiveZone('projects');
      } else if (e.key === '3') {
        setActiveZone('experience');
      } else if (e.key === '4') {
        setActiveZone('about');
      } else if (e.key === '5') {
        setActiveZone('contact');
      } else if (e.key === 'm' || e.key === 'M') {
        handleToggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleMute = useCallback(() => {
    const nowMuted = sound.toggleMute();
    setIsMuted(nowMuted);
  }, []);

  const handleToggle3D = useCallback(() => {
    if (!webGlAvailable) {
      return;
    }
    sound.playHover();
    setIs3DMode((prev) => !prev);
  }, [webGlAvailable]);

  const handleSelectZone = useCallback((zoneId: ZoneConfig['id']) => {
    setActiveZone(zoneId);
  }, []);

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-[#050608] text-[#E5E7EB]">
      {/* Opening Intro Sequence */}
      {!hasEntered && (
        <IntroScreen
          onEnter={() => {
            setHasEntered(true);
          }}
        />
      )}

      {/* Global Persistent Header Navigation (on mobile, zone view replaces view with dedicated header) */}
      {hasEntered && (!isMobile || activeZone === 'hub') && (
        <HeaderNav
          activeZone={activeZone}
          onSelectZone={handleSelectZone}
          is3DMode={is3DMode}
          onToggle3DMode={handleToggle3D}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      )}

      {/* Main Viewport Content: 3D Experience or 2D Editorial View */}
      {is3DMode && webGlAvailable ? (
        <main className="relative w-full h-full">
          {/* On mobile, ZoneOverlay fully replaces the 3D scene when inspecting a zone */}
          {(!isMobile || activeZone === 'hub') && (
            <SceneCanvas
              activeZone={activeZone}
              onSelectZone={handleSelectZone}
              isMobile={isMobile}
              hasEntered={hasEntered}
            />
          )}

          {hasEntered && (
            <ZoneOverlay
              activeZoneId={activeZone}
              onCloseToHub={() => handleSelectZone('hub')}
              onNavigateZone={handleSelectZone}
              isMobile={isMobile}
            />
          )}

          {/* Quick zone navigation bar on mobile view in Hub */}
          {hasEntered && isMobile && activeZone === 'hub' && (
            <MobileQuickBar
              activeZoneId={activeZone}
              onSelectZone={handleSelectZone}
            />
          )}
        </main>
      ) : (
        <main className="w-full h-full overflow-y-auto">
          {hasEntered && (
            <FallbackPortfolio
              onSwitchTo3D={() => {
                if (webGlAvailable) {
                  setIs3DMode(true);
                }
              }}
              activeZoneId={activeZone}
            />
          )}
        </main>
      )}
    </div>
  );
}
