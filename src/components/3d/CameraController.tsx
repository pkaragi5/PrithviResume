import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ZoneConfig, ZONES } from '../../data/portfolioData';

interface CameraControllerProps {
  activeZoneId: ZoneConfig['id'];
}

export const CameraController: React.FC<CameraControllerProps> = ({ activeZoneId }) => {
  const currentLookAt = useRef(new THREE.Vector3(0, 1.2, 0));
  const targetLookAt = useRef(new THREE.Vector3(0, 1.2, 0));
  const targetPosition = useRef(new THREE.Vector3(0, 6, 12));

  // Determine target coordinates based on active zone
  const activeZone = ZONES.find((z) => z.id === activeZoneId) || ZONES[0];

  targetPosition.current.set(...activeZone.cameraPosition);
  targetLookAt.current.set(...activeZone.cameraTarget);

  useFrame(({ camera }) => {
    // Smooth lerp camera position
    camera.position.lerp(targetPosition.current, 0.045);

    // Smooth lerp camera lookAt
    currentLookAt.current.lerp(targetLookAt.current, 0.045);
    camera.lookAt(currentLookAt.current);
  });

  return null;
};
