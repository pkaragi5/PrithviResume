import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { sound } from '../../audio/soundEffects';
import { createCoreLabelTexture } from './labelTexture';

interface CentralCoreProps {
  onSelectHub?: () => void;
  isHubActive: boolean;
  showHud?: boolean;
}

export const CentralCore: React.FC<CentralCoreProps> = ({ onSelectHub, isHubActive, showHud = true }) => {
  const [hovered, setHovered] = useState(false);
  const outerRingRef = useRef<THREE.Group>(null);
  const midRingRef = useRef<THREE.Group>(null);
  const innerPolyRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.Mesh>(null);
  const hudBillboardRef = useRef<THREE.Mesh>(null);
  const [hudTexture, setHudTexture] = useState<THREE.CanvasTexture | null>(null);

  // Generate crisp WebGL core HUD texture whenever hover or hub state changes
  useEffect(() => {
    const tex = createCoreLabelTexture(isHubActive, hovered);
    setHudTexture(tex);
    return () => {
      tex.dispose();
    };
  }, [isHubActive, hovered]);

  useFrame(({ camera }, delta) => {
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
    // Billboard HUD to smoothly face camera in 3D
    if (hudBillboardRef.current) {
      hudBillboardRef.current.quaternion.copy(camera.quaternion);
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
          setHovered(true);
          sound.playHover();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
      >
        <octahedronGeometry args={[0.7, 0]} />
        <meshStandardMaterial
          color="#164e63"
          emissive="#00e5ff"
          emissiveIntensity={isHubActive || hovered ? 0.75 : 0.4}
          roughness={0.15}
          metalness={0.9}
        />
      </mesh>

      {/* Core Point Light */}
      <pointLight color="#00e5ff" intensity={hovered ? 2.8 : 2} distance={8} decay={2} />

      {/* Subtle Vertical Core Beam */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 6, 8]} />
        <meshBasicMaterial
          color="#00e5ff"
          transparent
          opacity={hovered ? 0.6 : 0.35}
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

      {/* 3D Billboard HUD - Pure WebGL, 0 React roots, 0 unmount race conditions */}
      {showHud && hudTexture && (
        <mesh
          ref={hudBillboardRef}
          position={[0, -0.9, 0]}
          onClick={() => {
            sound.playSelect();
            onSelectHub?.();
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
            sound.playHover();
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            setHovered(false);
            document.body.style.cursor = 'default';
          }}
        >
          <planeGeometry args={[2.0, 1.0]} />
          <meshBasicMaterial
            map={hudTexture}
            transparent
            depthTest={false}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
};
