import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { ZoneConfig, ZONES } from '../../data/portfolioData';

interface CameraControllerProps {
  activeZoneId: ZoneConfig['id'];
  isMobile?: boolean;
}

export const CameraController: React.FC<CameraControllerProps> = ({ activeZoneId, isMobile = false }) => {
  const { gl } = useThree();
  const isTransitioningRef = useRef<boolean>(true);
  const targetLookAt = useRef(new THREE.Vector3(0, 1.2, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 1.2, 0));
  const targetPosition = useRef(new THREE.Vector3(0, 6, 12));
  const transitionStartRef = useRef<number>(0);

  // Trigger smooth flight only when zone changes
  useEffect(() => {
    isTransitioningRef.current = true;
    transitionStartRef.current = performance.now();

    const activeZone = ZONES.find((z) => z.id === activeZoneId) || ZONES[0];

    if (activeZoneId === 'hub') {
      if (isMobile) {
        targetPosition.current.set(0, 7.8, 16.5);
        targetLookAt.current.set(0, 1.0, 0);
      } else {
        targetPosition.current.set(0, 6.0, 12.0);
        targetLookAt.current.set(0, 1.2, 0);
      }
    } else {
      if (isMobile) {
        targetPosition.current.set(
          activeZone.cameraPosition[0] * 1.2,
          activeZone.cameraPosition[1] + 0.4,
          activeZone.cameraPosition[2] * 1.2
        );
        targetLookAt.current.set(...activeZone.cameraTarget);
      } else {
        targetPosition.current.set(...activeZone.cameraPosition);
        targetLookAt.current.set(...activeZone.cameraTarget);
      }
    }
  }, [activeZoneId, isMobile]);

  // When user touches or drags canvas, yield 100% control immediately to OrbitControls
  useEffect(() => {
    const handleUserInteraction = () => {
      if (activeZoneId === 'hub') {
        isTransitioningRef.current = false;
      }
    };

    const canvas = gl.domElement;
    canvas.addEventListener('pointerdown', handleUserInteraction, { passive: true });
    canvas.addEventListener('touchstart', handleUserInteraction, { passive: true });

    return () => {
      canvas.removeEventListener('pointerdown', handleUserInteraction);
      canvas.removeEventListener('touchstart', handleUserInteraction);
    };
  }, [gl, activeZoneId]);

  useFrame(({ camera }) => {
    // When in Hub and not transitioning, OrbitControls has 100% unrestricted control
    if (!isTransitioningRef.current && activeZoneId === 'hub') {
      return;
    }

    // Smooth lerp to destination
    camera.position.lerp(targetPosition.current, isMobile ? 0.06 : 0.05);

    if (activeZoneId !== 'hub') {
      currentLookAt.current.lerp(targetLookAt.current, isMobile ? 0.06 : 0.05);
      camera.lookAt(currentLookAt.current);
    }

    // End transition once camera is close enough to target position
    if (camera.position.distanceTo(targetPosition.current) < 0.15) {
      isTransitioningRef.current = false;
    }
  });

  return null;
};
