import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { sound } from '../../audio/soundEffects';
import { createCoreLabelTexture, createInteractPromptTexture } from './labelTexture';

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
  const promptBillboardRef = useRef<THREE.Mesh>(null);
  const [hudTexture, setHudTexture] = useState<THREE.CanvasTexture | null>(null);
  const [promptTexture, setPromptTexture] = useState<THREE.CanvasTexture | null>(null);

  // Materials & Light refs for dynamic smooth color morphing
  const crystalMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const outerRingMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const midRingMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const wireMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const beamMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);

  // Smooth color interpolation vectors
  const targetColor = useRef(new THREE.Color('#00e5ff'));
  const currentColor = useRef(new THREE.Color('#00e5ff'));

  // Generate crisp WebGL core HUD texture whenever hover or hub state changes
  useEffect(() => {
    const tex = createCoreLabelTexture(isHubActive, hovered);
    setHudTexture(tex);
    return () => {
      tex.dispose();
    };
  }, [isHubActive, hovered]);

  // Generate floating 'click to interact' UI prompt texture
  useEffect(() => {
    const tex = createInteractPromptTexture(
      isHubActive ? 'CLICK TO INTERACT ↵' : 'CLICK TO RETURN HUB ↵',
      isHubActive ? '#00e5ff' : '#ff1744'
    );
    setPromptTexture(tex);
    return () => {
      tex.dispose();
    };
  }, [isHubActive]);

  useFrame(({ clock, camera }, delta) => {
    const t = clock.getElapsedTime();

    // Gyro ring rotations
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
    if (promptBillboardRef.current) {
      promptBillboardRef.current.quaternion.copy(camera.quaternion);
      promptBillboardRef.current.position.y = 2.8 + Math.sin(t * 3.5) * 0.06;
    }

    // Dynamic Color Morphing:
    // When an orbit is selected (!isHubActive) -> Crystal turns RED
    // When exited back to Hub (isHubActive) -> Crystal morphs back to normal living cyan
    const isRed = !isHubActive;

    if (isRed) {
      targetColor.current.set('#ff1744');
    } else {
      // Normal state: Living pulsing cyan/teal core
      const pulse = Math.sin(t * 1.6) * 0.04;
      targetColor.current.setHSL(0.51 + pulse, 1.0, 0.5);
    }

    // Fluid smooth color transition
    currentColor.current.lerp(targetColor.current, Math.min(1, delta * 4.5));

    if (crystalMatRef.current) {
      crystalMatRef.current.emissive.copy(currentColor.current);
      crystalMatRef.current.emissiveIntensity = isRed ? 0.95 : (hovered ? 0.8 : 0.55);
      crystalMatRef.current.color.copy(currentColor.current).multiplyScalar(0.35);
    }

    if (pointLightRef.current) {
      pointLightRef.current.color.copy(currentColor.current);
      pointLightRef.current.intensity = isRed ? 3.8 : (hovered ? 2.8 : 2.0);
    }

    if (beamMatRef.current) {
      beamMatRef.current.color.copy(currentColor.current);
      beamMatRef.current.opacity = isRed ? 0.7 : (hovered ? 0.6 : 0.35);
    }

    if (wireMatRef.current) {
      wireMatRef.current.color.copy(currentColor.current);
    }

    if (outerRingMatRef.current) {
      outerRingMatRef.current.color.copy(currentColor.current);
      outerRingMatRef.current.emissive.copy(currentColor.current);
      outerRingMatRef.current.emissiveIntensity = isRed ? 0.6 : 0.4;
    }

    if (midRingMatRef.current) {
      midRingMatRef.current.color.copy(currentColor.current);
      midRingMatRef.current.emissive.copy(currentColor.current);
      midRingMatRef.current.emissiveIntensity = isRed ? 0.55 : 0.3;
    }
  });

  return (
    <group position={[0, 1.8, 0]}>
      {/* Outer Gyro Ring */}
      <group ref={outerRingRef}>
        <mesh>
          <torusGeometry args={[2.0, 0.02, 16, 64]} />
          <meshStandardMaterial
            ref={outerRingMatRef}
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
            ref={midRingMatRef}
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
          ref={wireMatRef}
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
          ref={crystalMatRef}
          color="#164e63"
          emissive="#00e5ff"
          emissiveIntensity={isHubActive || hovered ? 0.75 : 0.4}
          roughness={0.15}
          metalness={0.9}
        />
      </mesh>

      {/* Core Point Light */}
      <pointLight ref={pointLightRef} color="#00e5ff" intensity={hovered ? 2.8 : 2} distance={8} decay={2} />

      {/* Subtle Vertical Core Beam */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 6, 8]} />
        <meshBasicMaterial
          ref={beamMatRef}
          color="#00e5ff"
          transparent
          opacity={hovered ? 0.6 : 0.35}
        />
      </mesh>

      {/* Pedestal Base */}
      <mesh
        position={[0, -1.75, 0]}
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
        <cylinderGeometry args={[0.9, 1.2, 0.2, 32]} />
        <meshStandardMaterial
          color="#0c111c"
          metalness={0.9}
          roughness={0.3}
        />
      </mesh>

      {/* Floating 'click to interact' UI indicator on hover */}
      {hovered && promptTexture && (
        <mesh
          ref={promptBillboardRef}
          position={[0, 2.8, 0]}
          onClick={() => {
            sound.playSelect();
            onSelectHub?.();
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
          }}
          onPointerOut={() => {
            setHovered(false);
          }}
        >
          <planeGeometry args={[1.8, 0.45]} />
          <meshBasicMaterial
            map={promptTexture}
            transparent
            depthTest={false}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* 3D Billboard HUD */}
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
