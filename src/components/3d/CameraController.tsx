import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ZoneConfig, ZONES } from '../../data/portfolioData';

interface CameraControllerProps {
  activeZoneId: ZoneConfig['id'];
  isMobile?: boolean;
}

export const CameraController: React.FC<CameraControllerProps> = ({ activeZoneId, isMobile = false }) => {
  const currentLookAt = useRef(new THREE.Vector3(0, 1.2, 0));
  const targetLookAt = useRef(new THREE.Vector3(0, 1.2, 0));
  const targetPosition = useRef(new THREE.Vector3(0, 6, 12));

  // Determine target coordinates based on active zone
  const activeZone = ZONES.find((z) => z.id === activeZoneId) || ZONES[0];

  if (activeZoneId === 'hub') {
    if (isMobile) {
      // Pull back and lift camera slightly on mobile portrait to fit entire orbital array
      targetPosition.current.set(0, 7.8, 16.5);
      targetLookAt.current.set(0, 1.0, 0);
    } else {
      targetPosition.current.set(0, 6.0, 12.0);
      targetLookAt.current.set(0, 1.2, 0);
    }
  } else {
    if (isMobile) {
      // Generous distance on mobile portrait view
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

  useFrame(({ camera }) => {
    // Smooth lerp camera position
    camera.position.lerp(targetPosition.current, isMobile ? 0.055 : 0.045);

    // Smooth lerp camera lookAt
    currentLookAt.current.lerp(targetLookAt.current, isMobile ? 0.055 : 0.045);
    camera.lookAt(currentLookAt.current);
  });

  return null;
};
