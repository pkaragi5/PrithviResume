import React, { useMemo } from 'react';
import * as THREE from 'three';

export const FloorGrid: React.FC = () => {
  // Create circular zone orbit line geometry
  const orbitRadii = [3.5, 7.5, 11];

  const orbitCircles = useMemo(() => {
    return orbitRadii.map((radius) => {
      const points: THREE.Vector3[] = [];
      const segments = 64;
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
      }
      return new THREE.BufferGeometry().setFromPoints(points);
    });
  }, []);

  return (
    <group position={[0, -0.05, 0]}>
      {/* Dark architectural reflective floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.01, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial
          color="#07090e"
          roughness={0.7}
          metalness={0.8}
        />
      </mesh>

      {/* Subtle coordinate grid lines */}
      <gridHelper
        args={[50, 50, '#162232', '#0d1520']}
        position={[0, 0.005, 0]}
      />

      {/* Orbital coordinate rings on the floor */}
      {orbitCircles.map((geo, index) => (
        <primitive
          key={index}
          object={new THREE.Line(
            geo,
            new THREE.LineBasicMaterial({
              color: index === 1 ? '#00e5ff' : '#223244',
              transparent: true,
              opacity: index === 1 ? 0.35 : 0.18,
            })
          )}
          position={[0, 0.01, 0]}
        />
      ))}
    </group>
  );
};
