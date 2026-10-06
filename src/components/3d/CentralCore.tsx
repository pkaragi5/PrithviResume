import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { sound } from '../../audio/soundEffects';

interface CentralCoreProps {
  onSelectHub?: () => void;
  isHubActive: boolean;
}

export const CentralCore: React.FC<CentralCoreProps> = ({ onSelectHub, isHubActive }) => {
  const outerRingRef = useRef<THREE.Group>(null);
  const midRingRef = useRef<THREE.Group>(null);
  const innerPolyRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (outerRingRef.current) {
      outerRingRef.current.rotation.y += delta * 0.25;
      outerRingRef.current.rotation.z += delta * 0.12;
    }
    if (midRingRef.current) {
      midRingRef.current.rotation.y -= delta * 0.35;
      midRingRef.current.rotation.x += delta * 0.15;
    }
    if (innerPolyRef.current) {
      innerPolyRef.current.rotation.y += delta * 0.5;
      innerPolyRef.current.rotation.x += delta * 0.3;
    }
    if (wireframeRef.current) {
      wireframeRef.current.rotation.y -= delta * 0.2;
      wireframeRef.current.rotation.z += delta * 0.2;
    }
  });

  return (
    <group position={[0, 1.8, 0]}>
      {/* Outer Gyro Ring */}
      <group ref={outerRingRef}>
        <mesh>
          <torusGeometry args={[2.0, 0.02, 16, 64]} />
          <meshStandardMaterial
            color="#00e5ff"
            emissive="#00e5ff"
            emissiveIntensity={0.4}
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* Mid Gyro Ring */}
      <group ref={midRingRef}>
        <mesh>
          <torusGeometry args={[1.5, 0.02, 16, 64]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={0.3}
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
      </group>

      {/* Inner Wireframe Geo Sphere */}
      <mesh ref={wireframeRef}>
        <icosahedronGeometry args={[1.1, 1]} />
        <meshBasicMaterial
          color="#00e5ff"
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Inner Crystalline Octahedron */}
      <mesh
        ref={innerPolyRef}
        onClick={() => {
          sound.playSelect();
          onSelectHub?.();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          sound.playHover();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default';
        }}
      >
        <octahedronGeometry args={[0.7, 0]} />
        <meshStandardMaterial
          color="#164e63"
          emissive="#00e5ff"
          emissiveIntensity={isHubActive ? 0.7 : 0.4}
          roughness={0.15}
          metalness={0.9}
        />
      </mesh>

      {/* Core Point Light */}
      <pointLight color="#00e5ff" intensity={2} distance={8} decay={2} />

      {/* Subtle Vertical Core Beam */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 6, 8]} />
        <meshBasicMaterial
          color="#00e5ff"
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Pedestal Base */}
      <mesh position={[0, -1.75, 0]}>
        <cylinderGeometry args={[0.9, 1.2, 0.2, 32]} />
        <meshStandardMaterial
          color="#0c111c"
          metalness={0.9}
          roughness={0.3}
        />
      </mesh>

      {/* Center Label HUD */}
      <Html
        position={[0, -0.9, 0]}
        center
        distanceFactor={10}
        zIndexRange={[100, 0]}
      >
        <div
          onClick={() => {
            sound.playSelect();
            onSelectHub?.();
          }}
          className={`cursor-pointer select-none px-4 py-2 text-center rounded-lg backdrop-blur-md border transition-all duration-300 ${
            isHubActive
              ? 'bg-[#080d1a]/85 border-cyan-400/40 shadow-[0_0_20px_rgba(0,229,255,0.15)]'
              : 'bg-[#050811]/70 border-white/10 hover:border-cyan-400/30'
          }`}
        >
          <div className="font-mono text-sm tracking-[0.25em] font-semibold text-white">
            PRITHVI
          </div>
          <div className="font-mono text-[10px] tracking-[0.2em] text-cyan-300/80 mt-0.5">
            SOFTWARE · AI · BUILD
          </div>
        </div>
      </Html>
    </group>
  );
};
