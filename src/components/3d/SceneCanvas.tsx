import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { FloorGrid } from './FloorGrid';
import { CentralCore } from './CentralCore';
import { ZoneNode } from './ZoneNode';
import { FloatingParticles } from './FloatingParticles';
import { CameraController } from './CameraController';
import { ZONES, ZoneConfig } from '../../data/portfolioData';

interface SceneCanvasProps {
  activeZone: ZoneConfig['id'];
  onSelectZone: (zoneId: ZoneConfig['id']) => void;
  isMobile: boolean;
}

export const SceneCanvas: React.FC<SceneCanvasProps> = ({
  activeZone,
  onSelectZone,
  isMobile,
}) => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#050608] touch-pan-y">
      <Canvas
        camera={{ position: [0, 6, 12], fov: isMobile ? 55 : 45 }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: false,
        }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener('webglcontextlost', (e) => {
            e.preventDefault();
          });
        }}
      >
        <color attach="background" args={['#050608']} />
        <fog attach="fog" args={['#050608', 12, 28]} />

        {/* Studio Three-Point Lighting */}
        <ambientLight intensity={0.4} />
        {/* Key Light */}
        <directionalLight
          position={[8, 12, 6]}
          intensity={1.2}
          color="#f8fafc"
          castShadow={false}
        />
        {/* Fill Light (Cool tint) */}
        <directionalLight
          position={[-8, 6, -6]}
          intensity={0.6}
          color="#38bdf8"
        />
        {/* Rim Light */}
        <directionalLight
          position={[0, 10, -10]}
          intensity={0.8}
          color="#00e5ff"
        />

        <Suspense fallback={null}>
          <CameraController activeZoneId={activeZone} />

          <FloorGrid />
          <FloatingParticles count={isMobile ? 40 : 90} />

          {/* Central Hub Core */}
          <CentralCore
            isHubActive={activeZone === 'hub'}
            onSelectHub={() => onSelectZone('hub')}
          />

          {/* 6 Peripheral Zones */}
          {ZONES.filter((z) => z.id !== 'hub').map((zone) => (
            <ZoneNode
              key={zone.id}
              zone={zone}
              isActive={activeZone === zone.id}
              onSelect={onSelectZone}
            />
          ))}

          {/* OrbitControls enabled softly only when in Hub */}
          {activeZone === 'hub' && (
            <OrbitControls
              enablePan={false}
              enableZoom={!isMobile}
              minDistance={7}
              maxDistance={16}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 2.15}
              dampingFactor={0.05}
              rotateSpeed={0.5}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
};
