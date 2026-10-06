import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const FloatingParticles: React.FC<{ count?: number }> = ({ count = 90 }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Generate deterministic particle locations
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const radius = 2 + Math.random() * 15;
      const angle = Math.random() * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = 0.2 + Math.random() * 5.0;
      const speed = 0.2 + Math.random() * 0.4;
      const scale = 0.02 + Math.random() * 0.035;
      temp.push({ x, y, z, originalY: y, speed, scale });
    }
    return temp;
  }, [count]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const time = clock.getElapsedTime();

    particles.forEach((p, i) => {
      // Gentle floating up and wrapping
      const currentY = ((p.originalY + time * p.speed) % 5.5) + 0.2;
      dummy.position.set(p.x, currentY, p.z);
      dummy.scale.set(p.scale, p.scale, p.scale);
      dummy.updateMatrix();
      meshRef.current?.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <octahedronGeometry args={[1, 0]} />
      <meshBasicMaterial color="#00e5ff" transparent opacity={0.35} />
    </instancedMesh>
  );
};
