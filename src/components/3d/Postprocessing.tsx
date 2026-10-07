import React, { useEffect, useMemo } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

interface PostprocessingProps {
  isMobile?: boolean;
}

/**
 * Cinematic Postprocessing pipeline utilizing Three.js EffectComposer, RenderPass,
 * and UnrealBloomPass. Applies a restrained, subtle, architectural glow to emissive
 * elements without blowing out geometry or causing neon glare.
 */
export const Postprocessing: React.FC<PostprocessingProps> = ({ isMobile = false }) => {
  const { gl, scene, camera, size } = useThree();

  const [composer, bloomPass] = useMemo(() => {
    // 1. Configure HDR RenderTarget for smooth 16-bit float bloom calculations
    const renderTarget = new THREE.WebGLRenderTarget(size.width, size.height, {
      type: THREE.HalfFloatType,
      format: THREE.RGBAFormat,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      stencilBuffer: false,
      depthBuffer: true,
    });

    // 2. Initialize EffectComposer with the HDR render target
    const comp = new EffectComposer(gl, renderTarget);
    comp.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    comp.setSize(size.width, size.height);

    // 3. Add primary scene RenderPass
    const renderPass = new RenderPass(scene, camera);
    comp.addPass(renderPass);

    // 4. Configure UnrealBloomPass with subtle, restrained cinematic parameters:
    // - resolution: dynamic viewport vector
    // - strength: 0.44 on desktop, 0.32 on mobile (restrained luminous radiance)
    // - radius: 0.38 (gentle, diffuse optical glow)
    // - threshold: 0.72 (high luminance gate so only true emissives bloom)
    const bloom = new UnrealBloomPass(
      new THREE.Vector2(size.width, size.height),
      isMobile ? 0.32 : 0.44,
      0.38,
      0.72
    );

    comp.addPass(bloom);

    return [comp, bloom];
  }, [gl, scene, camera, isMobile]);

  // Synchronize composer buffer dimensions with screen resize
  useEffect(() => {
    composer.setSize(size.width, size.height);
    if (bloomPass) {
      bloomPass.resolution.set(size.width, size.height);
    }
  }, [composer, bloomPass, size]);

  // Clean up WebGL framebuffers and passes on unmount
  useEffect(() => {
    return () => {
      composer.dispose();
    };
  }, [composer]);

  // Render via EffectComposer at priority 1 (overriding R3F's default un-composited render pass)
  useFrame((_, delta) => {
    composer.render(delta);
  }, 1);

  return null;
};

// Aliases for compatibility
export const PostProcessing = Postprocessing;
export default Postprocessing;
