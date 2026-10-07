import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ZoneConfig } from '../../data/portfolioData';
import { sound } from '../../audio/soundEffects';
import { createZoneLabelTexture, createInteractPromptTexture } from './labelTexture';

interface ZoneNodeProps {
  zone: ZoneConfig;
  isActive: boolean;
  showLabel?: boolean;
  isMobile?: boolean;
  onSelect: (zoneId: ZoneConfig['id']) => void;
}

export const ZoneNode: React.FC<ZoneNodeProps> = ({
  zone,
  isActive,
  showLabel = true,
  isMobile = false,
  onSelect,
}) => {
  const [hovered, setHovered] = useState(false);
  const meshGroupRef = useRef<THREE.Group>(null);
  const floatRef = useRef<THREE.Group>(null);
  const labelBillboardRef = useRef<THREE.Mesh>(null);
  const promptBillboardRef = useRef<THREE.Mesh>(null);
  const [labelTexture, setLabelTexture] = useState<THREE.CanvasTexture | null>(null);
  const [promptTexture, setPromptTexture] = useState<THREE.CanvasTexture | null>(null);

  // Generate crisp WebGL label texture whenever hover or active state changes
  useEffect(() => {
    const tex = createZoneLabelTexture(zone.name, isActive, hovered);
    setLabelTexture(tex);
    return () => {
      tex.dispose();
    };
  }, [zone.name, isActive, hovered]);

  // Generate floating 'click to interact' UI prompt texture
  useEffect(() => {
    const tex = createInteractPromptTexture('CLICK TO INTERACT ↵', isActive ? '#ff1744' : '#00e5ff');
    setPromptTexture(tex);
    return () => {
      tex.dispose();
    };
  }, [isActive]);

  // Floating & Billboard animation
  useFrame(({ clock, camera }) => {
    const t = clock.getElapsedTime();
    if (floatRef.current) {
      floatRef.current.position.y = 1.0 + Math.sin(t * 1.5 + zone.position[0]) * 0.08;
    }
    if (meshGroupRef.current) {
      meshGroupRef.current.rotation.y += (hovered || isActive ? 0.015 : 0.005);
    }
    // Billboard label to smoothly face camera in 3D
    if (labelBillboardRef.current) {
      labelBillboardRef.current.quaternion.copy(camera.quaternion);
    }
    // Billboard prompt indicator with gentle hover bobbing
    if (promptBillboardRef.current) {
      promptBillboardRef.current.quaternion.copy(camera.quaternion);
      promptBillboardRef.current.position.y = 2.3 + Math.sin(t * 3.5) * 0.06;
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

  const accentColor = isActive ? '#ff1744' : hovered ? '#38bdf8' : '#64748b';
  const emissiveColor = isActive ? '#ff1744' : hovered ? '#0284c7' : '#0f172a';
  const emissiveIntensity = isActive ? 0.95 : hovered ? 0.5 : 0.15;

  return (
    <group position={zone.position}>
      {/* Ground Pedestal Marker */}
      <mesh
        position={[0, 0.02, 0]}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <cylinderGeometry args={[1.4, 1.6, 0.05, 32]} />
        <meshStandardMaterial
          color="#04060c"
          roughness={0.5}
          metalness={0.9}
        />
      </mesh>

      {/* Pedestal Ring Indicator */}
      <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 1.25, 32]} />
        <meshBasicMaterial
          color={accentColor}
          transparent
          opacity={isActive ? 0.95 : hovered ? 0.6 : 0.25}
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
            // Code Terminal Architecture: Stacked computational plates (deep obsidian dark)
            <group>
              <mesh position={[0, 0, 0]}>
                <boxGeometry args={[0.9, 0.08, 0.9]} />
                <meshStandardMaterial color="#050811" emissive={emissiveColor} emissiveIntensity={emissiveIntensity} metalness={0.9} roughness={0.25} />
              </mesh>
              <mesh position={[0, 0.22, 0]}>
                <boxGeometry args={[0.75, 0.08, 0.75]} />
                <meshStandardMaterial color="#050811" emissive={emissiveColor} emissiveIntensity={emissiveIntensity} metalness={0.9} roughness={0.25} />
              </mesh>
              <mesh position={[0, 0.44, 0]}>
                <boxGeometry args={[0.6, 0.08, 0.6]} />
                <meshStandardMaterial color="#050811" emissive={emissiveColor} emissiveIntensity={emissiveIntensity} metalness={0.9} roughness={0.25} />
              </mesh>
              <mesh position={[0, 0.22, 0]}>
                <boxGeometry args={[0.08, 0.7, 0.08]} />
                <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={isActive ? 0.95 : 0.6} />
              </mesh>
            </group>
          )}

          {zone.id === 'projects' && (
            // Projects: Floating Showcase Monolith / Hologram Screens (deep dark carbon)
            <group>
              <mesh rotation={[0, Math.PI / 4, 0]}>
                <boxGeometry args={[0.7, 0.9, 0.1]} />
                <meshStandardMaterial
                  color="#050812"
                  emissive={emissiveColor}
                  emissiveIntensity={emissiveIntensity}
                  roughness={0.25}
                  metalness={0.9}
                />
              </mesh>
              <mesh rotation={[0, -Math.PI / 4, 0]}>
                <boxGeometry args={[0.7, 0.9, 0.1]} />
                <meshStandardMaterial
                  color="#050812"
                  emissive={emissiveColor}
                  emissiveIntensity={emissiveIntensity * 0.8}
                  roughness={0.25}
                  metalness={0.9}
                />
              </mesh>
            </group>
          )}

          {zone.id === 'experience' && (
            // Experience: Stepped Career Pillars (deep obsidian carbon)
            <group>
              <mesh position={[-0.25, -0.1, 0]}>
                <boxGeometry args={[0.22, 0.5, 0.22]} />
                <meshStandardMaterial color="#050811" emissive={emissiveColor} emissiveIntensity={emissiveIntensity * 0.7} metalness={0.9} roughness={0.25} />
              </mesh>
              <mesh position={[0, 0.05, 0]}>
                <boxGeometry args={[0.22, 0.8, 0.22]} />
                <meshStandardMaterial color="#050811" emissive={emissiveColor} emissiveIntensity={emissiveIntensity * 0.85} metalness={0.9} roughness={0.25} />
              </mesh>
              <mesh position={[0.25, 0.2, 0]}>
                <boxGeometry args={[0.22, 1.1, 0.22]} />
                <meshStandardMaterial color="#050811" emissive={emissiveColor} emissiveIntensity={emissiveIntensity} metalness={0.9} roughness={0.25} />
              </mesh>
            </group>
          )}

          {zone.id === 'about' && (
            // About: Clean Geometric Cylinder Monolith (deep dark obsidian)
            <group>
              <mesh>
                <cylinderGeometry args={[0.35, 0.45, 0.9, 16]} />
                <meshStandardMaterial
                  color="#050812"
                  emissive={emissiveColor}
                  emissiveIntensity={emissiveIntensity}
                  roughness={0.25}
                  metalness={0.9}
                />
              </mesh>
              <mesh position={[0, 0, 0]}>
                <torusGeometry args={[0.55, 0.015, 12, 32]} />
                <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={isActive ? 0.95 : 0.6} />
              </mesh>
            </group>
          )}

          {zone.id === 'contact' && (
            // Contact: Broadcast array / Beacon (deep dark obsidian)
            <group>
              <mesh position={[0, -0.15, 0]}>
                <coneGeometry args={[0.45, 0.7, 16]} />
                <meshStandardMaterial
                  color="#050812"
                  emissive={emissiveColor}
                  emissiveIntensity={emissiveIntensity}
                  roughness={0.25}
                  metalness={0.9}
                />
              </mesh>
              <mesh position={[0, 0.35, 0]}>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={isActive ? 1.0 : 0.9} />
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
            opacity={isActive ? 0.7 : hovered ? 0.4 : 0.15}
          />
        </mesh>
      </group>

      {/* Floating 'click to interact' UI indicator on hover */}
      {hovered && promptTexture && (
        <mesh
          ref={promptBillboardRef}
          position={[0, 2.3, 0]}
          onClick={handleClick}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          <planeGeometry args={[1.7, 0.42]} />
          <meshBasicMaterial
            map={promptTexture}
            transparent
            depthTest={false}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* 3D Billboard Zone Label */}
      {showLabel && labelTexture && (
        <mesh
          ref={labelBillboardRef}
          position={[0, isMobile ? 0.45 : 0.4, 0]}
          onClick={handleClick}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          <planeGeometry args={isMobile ? [2.1, 0.78] : [1.7, 0.64]} />
          <meshBasicMaterial
            map={labelTexture}
            transparent
            depthTest={false}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
};
