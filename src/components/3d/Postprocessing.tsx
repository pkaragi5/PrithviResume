import React, { useEffect, useMemo } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

interface PostprocessingProps {
  isMobile?: boolean;
}

export const Postprocessing: React.FC<PostprocessingProps> = ({ isMobile = false }) => {
  const { gl, scene, camera, size } = useThree();

  const [composer, bloomPass] = useMemo(() => {
    // 1. Initialize EffectComposer with the WebGL renderer
    const comp = new EffectComposer(gl);
    comp.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    // 2. Add RenderPass to draw the primary 3D scene
    const renderPass = new RenderPass(scene, camera);
    comp.addPass(renderPass);

    // 3. Configure UnrealBloomPass for a subtle, restrained, cinematic glow
    // Parameters: resolution, strength, radius, threshold
    const bloom = new UnrealBloomPass(
      new THREE.Vector2(size.width, size.height),
      isMobile ? 0.32 : 0.46, // Restrained strength, avoiding neon blowout
      0.35,                   // Crisp, cinematic glow radius
      0.68                    // High luminance threshold so only emissives catch the bloom
    );

    comp.addPass(bloom);

    return [comp, bloom];
  }, [gl, scene, camera, isMobile]);

  // Handle dynamic viewport resizing
  useEffect(() => {
    composer.setSize(size.width, size.height);
    if (bloomPass) {
      bloomPass.resolution.set(size.width, size.height);
    }
  }, [composer, bloomPass, size]);

  // Clean up WebGL targets on unmount
  useEffect(() => {
    return () => {
      composer.dispose();
    };
  }, [composer]);

  // Priority 1 renders through EffectComposer rather than standard canvas pass
  useFrame((_, delta) => {
    composer.render(delta);
  }, 1);

  return null;
};

// Aliases for compatibility
export const PostProcessing = Postprocessing;
export default Postprocessing;
