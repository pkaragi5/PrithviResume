import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { ZoneConfig } from '../../data/portfolioData';
import { sound } from '../../audio/soundEffects';

interface ZoneNodeProps {
  zone: ZoneConfig;
  isActive: boolean;
  onSelect: (zoneId: ZoneConfig['id']) => void;
}

export const ZoneNode: React.FC<ZoneNodeProps> = ({ zone, isActive, onSelect }) => {
  const [hovered, setHovered] = useState(false);
  const meshGroupRef = useRef<THREE.Group>(null);
  const floatRef = useRef<THREE.Group>(null);

  // Floating animation
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (floatRef.current) {
      floatRef.current.position.y = 1.0 + Math.sin(t * 1.5 + zone.position[0]) * 0.08;
    }
    if (meshGroupRef.current) {
      meshGroupRef.current.rotation.y += (hovered || isActive ? 0.015 : 0.005);
    }
  });

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    sound.playSelect();
    onSelect(zone.id);
  };

  const handlePointerOver = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    setHovered(true);
    sound.playHover();
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    setHovered(false);
    document.body.style.cursor = 'default';
  };

  const accentColor = isActive ? '#00e5ff' : hovered ? '#38bdf8' : '#64748b';
  const emissiveColor = isActive ? '#00e5ff' : hovered ? '#0284c7' : '#0f172a';
  const emissiveIntensity = isActive ? 0.8 : hovered ? 0.5 : 0.15;

  return (
    <group position={zone.position}>
      {/* Ground Pedestal Marker */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[1.4, 1.6, 0.05, 32]} />
        <meshStandardMaterial
          color="#0b1019"
          roughness={0.6}
          metalness={0.8}
        />
      </mesh>

      {/* Pedestal Ring Indicator */}
      <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 1.25, 32]} />
        <meshBasicMaterial
          color={accentColor}
          transparent
          opacity={isActive ? 0.9 : hovered ? 0.6 : 0.25}
        />
      </mesh>

      {/* Floating Zone Geometry Node */}
      <group ref={floatRef}>
        <group
          ref={meshGroupRef}
          onClick={handleClick}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          scale={hovered || isActive ? 1.08 : 1.0}
        >
          {zone.id === 'code' && (
            // Code Terminal Architecture: Stacked computational plates
            <group>
              <mesh position={[0, 0, 0]}>
                <boxGeometry args={[0.9, 0.08, 0.9]} />
                <meshStandardMaterial color="#0f172a" emissive={emissiveColor} emissiveIntensity={emissiveIntensity} metalness={0.8} />
              </mesh>
              <mesh position={[0, 0.22, 0]}>
                <boxGeometry args={[0.75, 0.08, 0.75]} />
                <meshStandardMaterial color="#0f172a" emissive={emissiveColor} emissiveIntensity={emissiveIntensity} metalness={0.8} />
              </mesh>
              <mesh position={[0, 0.44, 0]}>
                <boxGeometry args={[0.6, 0.08, 0.6]} />
                <meshStandardMaterial color="#0f172a" emissive={emissiveColor} emissiveIntensity={emissiveIntensity} metalness={0.8} />
              </mesh>
              <mesh position={[0, 0.22, 0]}>
                <boxGeometry args={[0.08, 0.7, 0.08]} />
                <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={0.6} />
              </mesh>
            </group>
          )}

          {zone.id === 'ai' && (
            // AI Lab: Neural Cluster / Geodesic Orb
            <group>
              <mesh>
                <dodecahedronGeometry args={[0.55, 0]} />
                <meshStandardMaterial
                  color="#082f49"
                  emissive={emissiveColor}
                  emissiveIntensity={emissiveIntensity}
                  roughness={0.2}
                  metalness={0.9}
                  wireframe={!isActive && !hovered}
                />
              </mesh>
              <mesh scale={0.75}>
                <octahedronGeometry args={[0.4, 0]} />
                <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={0.8} />
              </mesh>
            </group>
          )}

          {zone.id === 'projects' && (
            // Projects: Floating Showcase Monolith / Hologram Screens
            <group>
              <mesh rotation={[0, Math.PI / 4, 0]}>
                <boxGeometry args={[0.7, 0.9, 0.1]} />
                <meshStandardMaterial
                  color="#03253a"
                  emissive={emissiveColor}
                  emissiveIntensity={emissiveIntensity}
                  roughness={0.3}
                  metalness={0.8}
                />
              </mesh>
              <mesh rotation={[0, -Math.PI / 4, 0]}>
                <boxGeometry args={[0.7, 0.9, 0.1]} />
                <meshStandardMaterial
                  color="#03253a"
                  emissive={emissiveColor}
                  emissiveIntensity={emissiveIntensity * 0.8}
                  roughness={0.3}
                  metalness={0.8}
                />
              </mesh>
            </group>
          )}

          {zone.id === 'experience' && (
            // Experience: Stepped Career Pillars
            <group>
              <mesh position={[-0.25, -0.1, 0]}>
                <boxGeometry args={[0.22, 0.5, 0.22]} />
                <meshStandardMaterial color="#0f172a" emissive={emissiveColor} emissiveIntensity={emissiveIntensity * 0.7} metalness={0.8} />
              </mesh>
              <mesh position={[0, 0.05, 0]}>
                <boxGeometry args={[0.22, 0.8, 0.22]} />
                <meshStandardMaterial color="#0f172a" emissive={emissiveColor} emissiveIntensity={emissiveIntensity * 0.85} metalness={0.8} />
              </mesh>
              <mesh position={[0.25, 0.2, 0]}>
                <boxGeometry args={[0.22, 1.1, 0.22]} />
                <meshStandardMaterial color="#0f172a" emissive={emissiveColor} emissiveIntensity={emissiveIntensity} metalness={0.8} />
              </mesh>
            </group>
          )}

          {zone.id === 'about' && (
            // About: Clean Geometric Cylinder Monolith
            <group>
              <mesh>
                <cylinderGeometry args={[0.35, 0.45, 0.9, 16]} />
                <meshStandardMaterial
                  color="#081826"
                  emissive={emissiveColor}
                  emissiveIntensity={emissiveIntensity}
                  roughness={0.3}
                  metalness={0.8}
                />
              </mesh>
              <mesh position={[0, 0, 0]}>
                <torusGeometry args={[0.55, 0.015, 12, 32]} />
                <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={0.6} />
              </mesh>
            </group>
          )}

          {zone.id === 'contact' && (
            // Contact: Broadcast array / Beacon
            <group>
              <mesh position={[0, -0.15, 0]}>
                <coneGeometry args={[0.45, 0.7, 16]} />
                <meshStandardMaterial
                  color="#0c1e30"
                  emissive={emissiveColor}
                  emissiveIntensity={emissiveIntensity}
                  roughness={0.3}
                  metalness={0.8}
                />
              </mesh>
              <mesh position={[0, 0.35, 0]}>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={0.9} />
              </mesh>
            </group>
          )}
        </group>

        {/* Vertical Light Ribbon / Ray */}
        <mesh position={[0, 1.2, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 2.0, 8]} />
          <meshBasicMaterial
            color={accentColor}
            transparent
            opacity={isActive ? 0.6 : hovered ? 0.4 : 0.15}
          />
        </mesh>
      </group>

      {/* Floating 2.5D Label Overlay */}
      <Html
        position={[0, 0.35, 0]}
        center
        distanceFactor={9}
        zIndexRange={[80, 0]}
      >
        <button
          type="button"
          onClick={handleClick}
          onMouseEnter={handlePointerOver}
          onMouseLeave={handlePointerOut}
          className={`group flex flex-col items-center cursor-pointer transition-all duration-200 outline-none select-none ${
            isActive ? 'scale-105' : 'hover:scale-105'
          }`}
          aria-label={`Enter ${zone.name}`}
        >
          <div
            className={`px-3 py-1.5 rounded border text-center transition-all duration-200 whitespace-nowrap backdrop-blur-md ${
              isActive
                ? 'bg-[#031525]/90 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,229,255,0.25)]'
                : hovered
                ? 'bg-[#091524]/85 border-cyan-500/50 text-white'
                : 'bg-[#060b14]/75 border-slate-800 text-slate-300 group-hover:border-slate-600'
            }`}
          >
            <span className="block font-mono text-[10px] tracking-[0.2em] font-semibold">
              {zone.name}
            </span>
          </div>
          <span className="mt-1 h-3 w-px bg-cyan-400/40" />
        </button>
      </Html>
    </group>
  );
};
